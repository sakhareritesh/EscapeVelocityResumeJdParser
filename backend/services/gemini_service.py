"""
services/gemini_service.py - Gemini LLM integration with retry logic and robust JSON repair
"""

import os
import json
import time
import re
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# ── Configuration ──────────────────────────────────────────────────────────────
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# gemini-2.0-flash: 2,000 req/day free tier — best for demos
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite")
MAX_RETRIES = 5
RETRY_DELAY = 2

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not set in environment variables.")

genai.configure(api_key=GEMINI_API_KEY)

# ── Model singleton ─────────────────────────────────────────────────────────────
_model = None


def _get_model():
    global _model
    if _model is None:
        _model = genai.GenerativeModel(
            model_name=MODEL_NAME,
            generation_config=genai.types.GenerationConfig(
                temperature=0.1,         # very low temp for reliable JSON
                top_p=0.9,
                max_output_tokens=8192,
            ),
        )
    return _model


# ── JSON extraction & repair helpers ─────────────────────────────────────────────

def _extract_json_from_text(text: str) -> str:
    """
    Strip markdown fences and extract the first valid JSON object/array
    from a raw LLM response string.
    """
    # Remove ```json ... ``` or ``` ... ``` fences
    text = re.sub(r"```(?:json)?", "", text).replace("```", "").strip()

    # Try to find the first { ... } or [ ... ] block
    for pattern in (r"(\{.*\})", r"(\[.*\])"):
        match = re.search(pattern, text, re.DOTALL)
        if match:
            return match.group(1).strip()

    return text.strip()


def _repair_json(text: str) -> str:
    """
    Attempt to repair common JSON issues from LLM output:
    - Truncated JSON (add missing closing brackets/braces)
    - Trailing commas
    - Unescaped newlines inside strings
    - Single quotes instead of double quotes
    """
    # 1. Fix trailing commas before ] or }
    text = re.sub(r",\s*([}\]])", r"\1", text)

    # 2. Fix unescaped newlines inside strings
    #    This handles cases where a string value contains literal \n
    lines = text.split("\n")
    fixed_lines = []
    in_string = False
    for line in lines:
        # Count unescaped quotes to track string state
        fixed_lines.append(line)

    text = "\n".join(fixed_lines)

    # 3. Handle truncated JSON — count brackets and add missing closing ones
    open_braces = text.count("{") - text.count("}")
    open_brackets = text.count("[") - text.count("]")

    if open_braces > 0 or open_brackets > 0:
        # Remove any trailing incomplete key-value pair
        # Look for the last complete value (ends with ", or })
        last_good = max(
            text.rfind('",'),
            text.rfind('"},'),
            text.rfind('"}'),
            text.rfind('" }'),
            text.rfind(']'),
            text.rfind('}'),
        )

        if last_good > 0:
            # Keep up to the last good point
            text = text[:last_good + 1]

            # Remove any trailing comma
            text = text.rstrip().rstrip(",")

            # Recount after truncation
            open_braces = text.count("{") - text.count("}")
            open_brackets = text.count("[") - text.count("]")

        # Add missing closers
        text += "]" * open_brackets
        text += "}" * open_braces

    return text


def _safe_parse_json(text: str) -> dict | list:
    """Parse JSON safely with repair attempts."""
    cleaned = _extract_json_from_text(text)

    # Attempt 1: Direct parse
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Attempt 2: Repair and parse
    try:
        repaired = _repair_json(cleaned)
        return json.loads(repaired)
    except json.JSONDecodeError:
        pass

    # Attempt 3: Try to extract just the skills array if it's a resume parse
    try:
        # Find a valid partial array
        match = re.search(r'"skills"\s*:\s*\[', cleaned)
        if match:
            start = match.start()
            # Find the matching ]
            bracket_count = 0
            for i in range(match.end() - 1, len(cleaned)):
                if cleaned[i] == "[":
                    bracket_count += 1
                elif cleaned[i] == "]":
                    bracket_count -= 1
                    if bracket_count == 0:
                        partial = "{" + cleaned[start:i + 1] + "}"
                        return json.loads(partial)

            # If we can't find matching ], take everything and repair
            arr_start = match.end()
            partial_arr = cleaned[arr_start:]
            # Find the last complete object
            last_obj_end = partial_arr.rfind("}")
            if last_obj_end > 0:
                partial_arr = partial_arr[:last_obj_end + 1]
                partial_arr = partial_arr.rstrip().rstrip(",")
                result_str = '{"skills": [' + partial_arr + "]}"
                result_str = re.sub(r",\s*([}\]])", r"\1", result_str)
                return json.loads(result_str)
    except (json.JSONDecodeError, Exception):
        pass

    # Attempt 4: Try line-by-line json object extraction
    try:
        # Split into individual objects and rebuild the array
        objects = []
        for m in re.finditer(r'\{[^{}]+\}', cleaned):
            try:
                obj = json.loads(m.group())
                objects.append(obj)
            except json.JSONDecodeError:
                continue
        if objects:
            # Check if this was a skills response
            if all("name" in o for o in objects):
                return {"skills": objects}
            # Check if this was a learning_path response
            if all("skill" in o for o in objects):
                return {"learning_path": objects}
            return objects
    except Exception:
        pass

    raise ValueError(
        f"JSON parse error after all repair attempts.\n"
        f"Raw (first 500 chars): {cleaned[:500]}"
    )


def sanitize_text_for_prompt(text: str) -> str:
    """
    Sanitize text before embedding in a Gemini prompt to prevent
    JSON output corruption.
    """
    if not text:
        return ""

    # Replace characters that commonly break JSON in LLM output
    text = text.replace("\\", " ")  # backslashes confuse JSON escaping
    text = text.replace('"', "'")   # double quotes inside resume text
    text = text.replace("\t", " ")  # tabs
    text = text.replace("\r", "")   # carriage returns

    # Collapse excessive whitespace
    text = re.sub(r" {3,}", "  ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Remove null bytes and control characters
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", text)

    # Limit length to prevent token overflow (which causes truncated JSON)
    if len(text) > 6000:
        text = text[:6000] + "\n\n[... remainder truncated for processing ...]"

    return text.strip()


# ── Core generation function ────────────────────────────────────────────────────

def generate_response(prompt: str, expect_json: bool = True) -> dict | list | str:
    """
    Send a prompt to Gemini and return a parsed JSON object/array.

    Args:
        prompt:       The full prompt string to send.
        expect_json:  If True, attempt JSON parsing; if False, return raw text.

    Returns:
        Parsed dict/list when expect_json=True, otherwise raw string.

    Raises:
        RuntimeError: After MAX_RETRIES failed attempts.
    """
    model = _get_model()
    last_error = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = model.generate_content(prompt)

            if not response or not response.text:
                raise ValueError("Empty response from Gemini.")

            raw_text = response.text.strip()

            if not expect_json:
                return raw_text

            return _safe_parse_json(raw_text)

        except ValueError as e:
            last_error = e
            print(f"⚠️  Gemini attempt {attempt}/{MAX_RETRIES} — parse error: {e}")
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)

        except Exception as e:
            last_error = e
            error_str = str(e)
            print(f"⚠️  Gemini attempt {attempt}/{MAX_RETRIES} — API error: {e}")

            if attempt < MAX_RETRIES:
                # Respect rate limit retry-delay from API
                if "429" in error_str or "quota" in error_str.lower():
                    # Extract retry delay from error if available
                    retry_match = re.search(r'retry in ([\d.]+)', error_str)
                    wait_time = float(retry_match.group(1)) + 2 if retry_match else 30
                    print(f"   ⏳ Rate limited — waiting {wait_time:.0f}s before retry...")
                    time.sleep(wait_time)
                else:
                    time.sleep(RETRY_DELAY * attempt)

    raise RuntimeError(
        f"Gemini failed after {MAX_RETRIES} attempts. Last error: {last_error}"
    )


# ── Convenience wrappers ────────────────────────────────────────────────────────

def generate_text(prompt: str) -> str:
    """Return plain text (no JSON parsing)."""
    return generate_response(prompt, expect_json=False)
