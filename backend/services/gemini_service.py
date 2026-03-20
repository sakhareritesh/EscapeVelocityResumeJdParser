"""
services/gemini_service.py - Gemini LLM integration with retry logic and safe JSON parsing
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
MODEL_NAME = "gemini-2.5-flash"          # latest stable flash model
MAX_RETRIES = 3
RETRY_DELAY = 2                          # seconds between retries

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
                temperature=0.2,         # low temp for deterministic JSON
                top_p=0.9,
                max_output_tokens=8192,
            ),
        )
    return _model


# ── JSON extraction helpers ─────────────────────────────────────────────────────

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


def _safe_parse_json(text: str) -> dict | list:
    """Parse JSON safely, raising ValueError with context on failure."""
    cleaned = _extract_json_from_text(text)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"JSON parse error: {e}\nRaw (first 500 chars): {cleaned[:500]}"
        )


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
            print(f"⚠️  Gemini attempt {attempt}/{MAX_RETRIES} — API error: {e}")
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY * attempt)  # exponential back-off

    raise RuntimeError(
        f"Gemini failed after {MAX_RETRIES} attempts. Last error: {last_error}"
    )


# ── Convenience wrappers ────────────────────────────────────────────────────────

def generate_text(prompt: str) -> str:
    """Return plain text (no JSON parsing)."""
    return generate_response(prompt, expect_json=False)
