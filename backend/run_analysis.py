"""
run_analysis.py — Local file-based analysis runner
====================================================
Reads resume and JD files from:
  src/resume/   — PDF, DOCX, or TXT resume files
  src/jd/       — PDF, DOCX, or TXT job description files

Sends them to the running API at http://localhost:5000/analyze
and prints the full analysis output in a clean, readable format.

Usage:
  python run_analysis.py                         # auto-picks first file found in each folder
  python run_analysis.py -r resume.pdf -j jd.txt  # specific files
  python run_analysis.py --list                  # list available files
  python run_analysis.py --save output.json      # also save result to JSON

Run the Flask server first: python app.py
"""

import os
import sys
import json
import argparse
import requests

# ── Config ───────────────────────────────────────────────────────────────────────

BASE_URL      = "http://localhost:5000"
RESUME_DIR    = os.path.join(os.path.dirname(__file__), "src", "resume")
JD_DIR        = os.path.join(os.path.dirname(__file__), "src", "jd")
ALLOWED_EXTS  = {".pdf", ".docx", ".doc", ".txt"}


# ── Terminal Colors ───────────────────────────────────────────────────────────────

class C:
    RESET   = "\033[0m"
    BOLD    = "\033[1m"
    DIM     = "\033[2m"
    RED     = "\033[91m"
    GREEN   = "\033[92m"
    YELLOW  = "\033[93m"
    BLUE    = "\033[94m"
    MAGENTA = "\033[95m"
    CYAN    = "\033[96m"
    WHITE   = "\033[97m"
    BG_DARK = "\033[40m"


def header(text: str):
    w = 72
    print(f"\n{C.BOLD}{C.CYAN}{'═' * w}{C.RESET}")
    print(f"{C.BOLD}{C.CYAN}  {text}{C.RESET}")
    print(f"{C.BOLD}{C.CYAN}{'═' * w}{C.RESET}")


def section(text: str):
    print(f"\n{C.BOLD}{C.BLUE}  ── {text} {'─' * (60 - len(text))}{C.RESET}")


def info(text: str):
    print(f"  {C.DIM}{text}{C.RESET}")


def success(text: str):
    print(f"  {C.GREEN}✅ {text}{C.RESET}")


def warn(text: str):
    print(f"  {C.YELLOW}⚠️  {text}{C.RESET}")


def error(text: str):
    print(f"  {C.RED}❌ {text}{C.RESET}")


def bullet(symbol: str, color: str, text: str):
    print(f"     {color}{symbol}{C.RESET} {text}")


# ── File Discovery ────────────────────────────────────────────────────────────────

def get_files_in(directory: str) -> list[str]:
    """Return sorted list of allowed-extension files in a directory."""
    if not os.path.isdir(directory):
        return []
    return sorted([
        f for f in os.listdir(directory)
        if os.path.splitext(f)[1].lower() in ALLOWED_EXTS
    ])


def list_available_files():
    """Print all files available in src/resume and src/jd."""
    header("📂 Available Files")

    resumes = get_files_in(RESUME_DIR)
    jds     = get_files_in(JD_DIR)

    section(f"Resumes  →  src/resume/  ({len(resumes)} file(s))")
    if resumes:
        for f in resumes:
            size = os.path.getsize(os.path.join(RESUME_DIR, f)) / 1024
            print(f"     {C.CYAN}📄 {f}{C.RESET}  {C.DIM}({size:.1f} KB){C.RESET}")
    else:
        warn("No resume files found. Place PDF/DOCX/TXT files in src/resume/")

    section(f"Job Descriptions  →  src/jd/  ({len(jds)} file(s))")
    if jds:
        for f in jds:
            size = os.path.getsize(os.path.join(JD_DIR, f)) / 1024
            print(f"     {C.CYAN}📋 {f}{C.RESET}  {C.DIM}({size:.1f} KB){C.RESET}")
    else:
        warn("No JD files found. Place PDF/DOCX/TXT files in src/jd/")


def pick_file(directory: str, filename: str | None, label: str) -> str:
    """
    Resolve the full path for a file.
    If filename is given, find it in directory.
    Otherwise, auto-pick the first file found.
    Raises SystemExit on failure.
    """
    files = get_files_in(directory)

    if not files:
        error(f"No files found in {directory}")
        warn(f"Place your {label} file (PDF/DOCX/TXT) in that folder.")
        sys.exit(1)

    if filename:
        # Match provided filename (with or without extension)
        matches = [f for f in files if f == filename or os.path.splitext(f)[0] == filename]
        if not matches:
            error(f"File '{filename}' not found in {directory}")
            info(f"Available: {', '.join(files)}")
            sys.exit(1)
        chosen = matches[0]
    else:
        chosen = files[0]
        if len(files) > 1:
            warn(f"Multiple {label} files found — using: {C.CYAN}{chosen}{C.RESET}")
            info(f"Others: {', '.join(files[1:])}  (use -r / -j to specify)")

    return os.path.join(directory, chosen)


# ── API Interaction ───────────────────────────────────────────────────────────────

def check_server():
    """Verify the Flask server is reachable."""
    try:
        r = requests.get(f"{BASE_URL}/health", timeout=5)
        data = r.json()
        db = data.get("database", "unknown")
        db_color = C.GREEN if db == "connected" else C.YELLOW
        print(f"  {C.GREEN}🟢 Server OK{C.RESET}  MongoDB: {db_color}{db}{C.RESET}")
        return True
    except requests.exceptions.ConnectionError:
        error(f"Cannot connect to {BASE_URL}")
        warn("Make sure the Flask server is running:  python app.py")
        return False


def send_to_api(resume_path: str, jd_path: str, timeout: int = 180) -> dict:
    """
    Send resume and JD files to /analyze and return parsed JSON response.
    Files are sent as multipart/form-data uploads.
    """
    resume_name = os.path.basename(resume_path)
    jd_name     = os.path.basename(jd_path)

    # Determine MIME types
    def mime(path: str) -> str:
        ext = os.path.splitext(path)[1].lower()
        return {
            ".pdf":  "application/pdf",
            ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".doc":  "application/msword",
            ".txt":  "text/plain",
        }.get(ext, "application/octet-stream")

    with open(resume_path, "rb") as rf, open(jd_path, "rb") as jf:
        files = {
            "resume_file": (resume_name, rf, mime(resume_path)),
            "jd_file":     (jd_name,     jf, mime(jd_path)),
        }
        print(f"\n  {C.DIM}Sending to {BASE_URL}/analyze ...{C.RESET}")
        response = requests.post(f"{BASE_URL}/analyze", files=files, timeout=timeout)

    if response.status_code != 200:
        error(f"API returned HTTP {response.status_code}")
        try:
            print(f"  {response.json().get('error', response.text)}")
        except Exception:
            print(f"  {response.text}")
        sys.exit(1)

    return response.json()


# ── Output Formatting ─────────────────────────────────────────────────────────────

LEVEL_ICON = {
    "Expert":       ("🟣", C.MAGENTA),
    "Advanced":     ("🔵", C.BLUE),
    "Intermediate": ("🟢", C.GREEN),
    "Beginner":     ("🟡", C.YELLOW),
}

DIFF_ICON = {
    "Easy":   ("🟢", C.GREEN),
    "Medium": ("🟡", C.YELLOW),
    "Hard":   ("🔴", C.RED),
}


def print_results(data: dict):
    """Print the full analysis result in a rich, readable format."""

    meta      = data.get("meta", {})
    role_info = data.get("role_info", {})

    # ── Header ──────────────────────────────────────────────────────────────────
    header("🧠  AI Adaptive Onboarding Engine — Analysis Report")

    # ── Role Summary ─────────────────────────────────────────────────────────────
    section("Target Role")
    print(f"     {C.BOLD}Role       :{C.RESET}  {role_info.get('title', 'N/A')}")
    print(f"     {C.BOLD}Seniority  :{C.RESET}  {role_info.get('seniority', 'N/A')}")
    print(f"     {C.BOLD}Domain     :{C.RESET}  {role_info.get('domain', 'N/A')}")
    print(f"     {C.BOLD}Session ID :{C.RESET}  {C.DIM}{data.get('session_id', 'N/A')}{C.RESET}")

    # ── Match Score ───────────────────────────────────────────────────────────────
    section("Candidate Match Score")
    match_pct  = meta.get("match_percentage", 0)
    hours      = meta.get("total_learning_hours", 0)
    weeks      = meta.get("total_learning_weeks", 0)

    bar_filled = int(match_pct / 5)
    bar = C.GREEN + "█" * bar_filled + C.DIM + "░" * (20 - bar_filled) + C.RESET
    match_color = C.GREEN if match_pct >= 70 else C.YELLOW if match_pct >= 40 else C.RED
    print(f"\n     [{bar}]  {match_color}{C.BOLD}{match_pct}%{C.RESET} skill match")
    print(f"\n     {C.BOLD}Resume Skills :{C.RESET}  {meta.get('total_resume_skills', 0)}")
    print(f"     {C.BOLD}Required by JD:{C.RESET}  {meta.get('total_required_skills', 0)}")
    print(f"     {C.BOLD}Skill Gaps    :{C.RESET}  {meta.get('total_gaps', 0)}")
    print(f"     {C.BOLD}Learning Steps:{C.RESET}  {meta.get('total_learning_steps', 0)}")
    print(f"     {C.BOLD}Est. Time     :{C.RESET}  {hours}h  (~{weeks} weeks at 20h/week)")

    # ── Resume Skills ────────────────────────────────────────────────────────────
    resume_skills = data.get("resume_skills", [])
    section(f"Resume Skills  ({len(resume_skills)} found)")

    # Group by category
    by_cat: dict[str, list] = {}
    for s in resume_skills:
        cat = s.get("category", "other").replace("_", " ").title()
        by_cat.setdefault(cat, []).append(s)

    for cat, skills in sorted(by_cat.items()):
        print(f"\n     {C.BOLD}{C.DIM}{cat}{C.RESET}")
        for s in skills:
            icon, color = LEVEL_ICON.get(s.get("level", ""), ("⚪", C.WHITE))
            yrs = s.get("years_experience", 0)
            ctx = s.get("context", "")
            yrs_str = f"{C.DIM}({yrs}y){C.RESET} " if yrs else ""
            ctx_str = f"{C.DIM}— {ctx[:60]}{C.RESET}" if ctx else ""
            print(f"       {icon} {color}{s.get('name','?')}{C.RESET} "
                  f"{s.get('level','?')} {yrs_str}{ctx_str}")

    # ── Skill Gap ────────────────────────────────────────────────────────────────
    skill_gap = data.get("skill_gap", [])
    section(f"Skill Gaps  ({len(skill_gap)} missing required skills)")

    for g in skill_gap:
        if isinstance(g, dict):
            skill   = g.get("skill", "?")
            cat     = g.get("category", "other").replace("_", " ").title()
            related = g.get("candidate_has_related", [])
            related_str = f"  {C.DIM}(you know: {', '.join(related)}){C.RESET}" if related else ""
            print(f"     {C.RED}✗{C.RESET}  {C.BOLD}{skill}{C.RESET}  "
                  f"{C.DIM}[{cat}]{C.RESET}{related_str}")
        else:
            print(f"     {C.RED}✗{C.RESET}  {C.BOLD}{g}{C.RESET}")

    # ── Dependency Graph ─────────────────────────────────────────────────────────
    dep_graph = data.get("dependency_graph", {})
    stats     = dep_graph.get("stats", {})
    edges     = dep_graph.get("edges", [])

    section("Skill Dependency Graph (DAG)")
    print(f"     Nodes : {stats.get('total_nodes', 0)}   "
          f"Edges : {stats.get('total_edges', 0)}   "
          f"Total: {stats.get('total_hours', 0)}h")

    if edges:
        print(f"\n     Prerequisite relationships:")
        for e in edges:
            print(f"       {C.DIM}{e.get('source','?')}{C.RESET} "
                  f"{C.YELLOW}──→{C.RESET} "
                  f"{C.CYAN}{e.get('target','?')}{C.RESET}")
    else:
        print(f"     {C.DIM}(No interdependencies detected between gap skills){C.RESET}")

    # ── Learning Path ────────────────────────────────────────────────────────────
    learning_path = data.get("learning_path", [])
    section(f"Personalised Learning Roadmap  ({len(learning_path)} steps)")

    cumulative = 0
    for step in learning_path:
        skill    = step.get("skill", "?")
        reason   = step.get("reason", "")
        hours_s  = step.get("estimated_hours", 0)
        diff     = step.get("difficulty", "Medium")
        prereqs  = step.get("prerequisites_met", [])
        implicit = step.get("is_implicit_prereq", False)
        resources= step.get("resources", [])
        miles    = step.get("milestones", [])
        project  = step.get("project_idea", "")
        cumulative += hours_s

        diff_icon, diff_color = DIFF_ICON.get(diff, ("⚪", C.WHITE))
        implicit_tag = f"  {C.DIM}[auto-added prereq]{C.RESET}" if implicit else ""
        prereq_str   = (f"  {C.DIM}builds on: {', '.join(prereqs)}{C.RESET}"
                        if prereqs else "")

        print(f"\n     {C.BOLD}{C.CYAN}Step {step.get('step','?'):>2}{C.RESET}  "
              f"{C.BOLD}{skill}{C.RESET}  "
              f"{diff_icon} {diff_color}{diff}{C.RESET}  "
              f"{C.DIM}{hours_s}h  (total so far: {cumulative}h){C.RESET}"
              f"{implicit_tag}{prereq_str}")

        if reason:
            # Word-wrap at ~70 chars
            words, line = reason.split(), ""
            wrapped = []
            for w in words:
                if len(line) + len(w) + 1 > 65:
                    wrapped.append(line)
                    line = w
                else:
                    line = (line + " " + w).strip()
            if line:
                wrapped.append(line)
            for l in wrapped:
                print(f"            {C.DIM}{l}{C.RESET}")

        if resources:
            print(f"            {C.BOLD}Resources:{C.RESET}")
            for res in resources[:3]:
                if isinstance(res, dict):
                    print(f"              {C.BLUE}📚{C.RESET} {res.get('name','?')}")
                    print(f"                 {C.DIM}{res.get('url','')}{C.RESET}")

        if miles:
            print(f"            {C.BOLD}Milestones:{C.RESET}")
            for m in miles[:3]:
                print(f"              {C.GREEN}🎯{C.RESET} {m}")

        if project:
            print(f"            {C.MAGENTA}🔨 Project:{C.RESET} {project[:100]}")

    # ── AI Explanation ────────────────────────────────────────────────────────────
    section("AI Coaching Explanation")
    explanation = data.get("explanation", "")
    if explanation:
        for para in explanation.split("\n"):
            if para.strip():
                # Word-wrap paragraphs at 70 chars
                words, line = para.split(), ""
                for w in words:
                    if len(line) + len(w) + 1 > 68:
                        print(f"     {line}")
                        line = w
                    else:
                        line = (line + " " + w).strip()
                if line:
                    print(f"     {line}")
                print()

    print(f"\n{C.BOLD}{C.GREEN}{'═' * 72}{C.RESET}")
    print(f"{C.BOLD}{C.GREEN}  ✅  Analysis complete.{C.RESET}")
    print(f"{C.BOLD}{C.GREEN}{'═' * 72}{C.RESET}\n")


# ── Entry Point ───────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Run adaptive onboarding analysis from local PDF/DOCX/TXT files.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python run_analysis.py                          # auto-pick first file in each folder
  python run_analysis.py -r john_doe.pdf          # specific resume file
  python run_analysis.py -r resume.pdf -j jd.txt  # specific resume + JD
  python run_analysis.py --list                   # list available files
  python run_analysis.py --save result.json       # save full JSON output
        """
    )
    parser.add_argument("-r", "--resume", metavar="FILE",
                        help="Resume filename inside src/resume/ (e.g. resume.pdf)")
    parser.add_argument("-j", "--jd", metavar="FILE",
                        help="JD filename inside src/jd/ (e.g. jd.pdf)")
    parser.add_argument("--list", action="store_true",
                        help="List available files and exit")
    parser.add_argument("--save", metavar="OUTPUT.json",
                        help="Save full JSON response to a file")
    parser.add_argument("--url", default=BASE_URL,
                        help=f"API base URL (default: {BASE_URL})")
    parser.add_argument("--timeout", type=int, default=180,
                        help="Request timeout in seconds (default: 180)")

    args = parser.parse_args()

    print(f"\n{C.BOLD}{'═' * 72}{C.RESET}")
    print(f"{C.BOLD}  🚀  AI Adaptive Onboarding Engine — File Runner{C.RESET}")
    print(f"{C.DIM}       API: {args.url}{C.RESET}")
    print(f"{C.BOLD}{'═' * 72}{C.RESET}")

    # Ensure src dirs exist
    os.makedirs(RESUME_DIR, exist_ok=True)
    os.makedirs(JD_DIR, exist_ok=True)

    # ── --list mode ──────────────────────────────────────────────────────────────
    if args.list:
        list_available_files()
        sys.exit(0)

    # ── Check server ─────────────────────────────────────────────────────────────
    print(f"\n  Checking API server...")
    if not check_server():
        sys.exit(1)

    # ── Resolve files ─────────────────────────────────────────────────────────────
    resume_path = pick_file(RESUME_DIR, args.resume, "resume")
    jd_path     = pick_file(JD_DIR,     args.jd,     "job description")

    resume_name = os.path.basename(resume_path)
    jd_name     = os.path.basename(jd_path)

    section("Input Files Selected")
    print(f"     {C.CYAN}📄 Resume :{C.RESET} {resume_name}  "
          f"{C.DIM}({os.path.getsize(resume_path)/1024:.1f} KB){C.RESET}")
    print(f"     {C.CYAN}📋 JD     :{C.RESET} {jd_name}  "
          f"{C.DIM}({os.path.getsize(jd_path)/1024:.1f} KB){C.RESET}")

    print(f"\n  {C.YELLOW}⏳ Analysing — this takes 30–90 seconds "
          f"(Gemini is thinking)...{C.RESET}")

    # ── Send to API ───────────────────────────────────────────────────────────────
    try:
        data = send_to_api(resume_path, jd_path, timeout=args.timeout)
    except requests.exceptions.Timeout:
        error(f"Request timed out after {args.timeout}s.")
        warn("Try increasing --timeout or check Gemini API quota.")
        sys.exit(1)
    except Exception as e:
        error(f"Request failed: {e}")
        sys.exit(1)

    # ── Print results ─────────────────────────────────────────────────────────────
    print_results(data)

    # ── Save to file ──────────────────────────────────────────────────────────────
    if args.save:
        save_path = args.save
        with open(save_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)
        success(f"Full JSON response saved to: {save_path}")


if __name__ == "__main__":
    main()
