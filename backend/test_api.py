"""
test_api.py - Comprehensive integration tests for the AI Adaptive Onboarding Engine
Run with: python test_api.py
Requires the Flask server to be running on localhost:5000
"""

import json
import sys
import os
import requests

BASE_URL = "http://localhost:5000"

SAMPLE_RESUME = """
John Doe
Senior Software Engineer | john@example.com | github.com/johndoe

EXPERIENCE

Backend Engineer — TechCorp (2020–2024)
• Built and maintained REST APIs using Python (Flask, FastAPI)
• Designed PostgreSQL schemas and wrote complex SQL queries
• Implemented Redis caching, reducing response times by 40%
• Wrote unit and integration tests with pytest (85% coverage)
• Deployed services on Linux servers using Bash scripts

Junior Developer — StartupXYZ (2018–2020)
• Developed internal tools in Python
• Worked with Git, GitHub, and basic CI/CD pipelines
• Used Pandas and NumPy for data processing scripts

EDUCATION
B.S. Computer Science — State University (2018)

SKILLS
Python (Advanced), Flask (Intermediate), FastAPI (Intermediate),
PostgreSQL (Intermediate), Redis (Beginner), Git (Advanced),
Linux/Bash (Intermediate), Pandas (Intermediate), pytest (Intermediate)
"""

SAMPLE_JD = """
Full Stack Engineer — GrowthStartup

We are building the next generation of SaaS tooling and need a passionate
Full Stack Engineer to join our team.

REQUIRED SKILLS
• React (3+ years) — building complex SPAs
• Node.js — backend services and REST APIs
• TypeScript — strict typing across the stack
• Python — data pipelines and ML integrations
• PostgreSQL — schema design and query optimization
• Docker — containerizing services
• AWS (EC2, S3, Lambda) — cloud deployment

NICE TO HAVE
• GraphQL
• Kubernetes
• Redis
• CI/CD experience (GitHub Actions or Jenkins)
"""


# ── Helpers ─────────────────────────────────────────────────────────────────────

passed = 0
failed = 0


def print_section(title: str):
    print(f"\n{'='*70}")
    print(f"  {title}")
    print('='*70)


def print_subsection(title: str):
    print(f"\n  ── {title} {'─'*(60 - len(title))}")


def pretty(data: dict) -> str:
    return json.dumps(data, indent=2)


def assert_eq(label, actual, expected):
    global passed, failed
    if actual != expected:
        print(f"  ❌ FAIL [{label}]: expected {expected!r}, got {actual!r}")
        failed += 1
        return False
    print(f"  ✅ PASS [{label}]")
    passed += 1
    return True


def assert_true(label, condition):
    global passed, failed
    if not condition:
        print(f"  ❌ FAIL [{label}]: condition was False")
        failed += 1
        return False
    print(f"  ✅ PASS [{label}]")
    passed += 1
    return True


def assert_type(label, value, expected_type):
    global passed, failed
    if not isinstance(value, expected_type):
        print(f"  ❌ FAIL [{label}]: expected type {expected_type.__name__}, got {type(value).__name__}")
        failed += 1
        return False
    print(f"  ✅ PASS [{label}]")
    passed += 1
    return True


# ── Tests ────────────────────────────────────────────────────────────────────────

def test_health():
    print_section("1. GET /health")
    r = requests.get(f"{BASE_URL}/health", timeout=10)
    data = r.json()
    print(f"  Status: {r.status_code}")
    print(f"  Response: {pretty(data)}")
    assert_eq("status code", r.status_code, 200)
    assert_eq("status field", data.get("status"), "ok")
    return data.get("database") == "connected"


def test_root():
    print_section("2. GET /")
    r = requests.get(f"{BASE_URL}/", timeout=10)
    data = r.json()
    print(f"  Status: {r.status_code}")
    assert_eq("status code", r.status_code, 200)
    assert_true("has endpoints", "endpoints" in data)


def test_missing_input():
    print_section("3. POST /analyze — missing input error")
    r = requests.post(f"{BASE_URL}/analyze", data={}, timeout=15)
    data = r.json()
    print(f"  Status: {r.status_code}")
    assert_eq("status code", r.status_code, 400)
    assert_eq("success=false", data.get("success"), False)
    assert_true("has error message", bool(data.get("error")))
    print(f"  Error: {data.get('error')}")


def test_invalid_session():
    print_section("4. GET /session/invalid-id — error handling")
    r = requests.get(f"{BASE_URL}/session/invalid123", timeout=10)
    data = r.json()
    print(f"  Status: {r.status_code}")
    assert_eq("status code", r.status_code, 400)
    assert_eq("success=false", data.get("success"), False)


def test_analyze_text_input():
    print_section("5. POST /analyze — full text analysis")
    payload = {
        "resume_text": SAMPLE_RESUME,
        "jd_text": SAMPLE_JD,
    }
    print("  ⏳ Sending request (may take 30-60s for Gemini calls)...")
    r = requests.post(f"{BASE_URL}/analyze", data=payload, timeout=180)
    data = r.json()

    print(f"  Status: {r.status_code}")

    if r.status_code != 200:
        print(f"  ❌ Error: {data.get('error')}")
        return None

    # ── 5a. Basic response structure ─────────────────────────────────────────
    print_subsection("5a. Response Structure")
    assert_eq("success flag", data.get("success"), True)
    assert_true("has session_id", bool(data.get("session_id")))
    assert_true("has resume_skills", "resume_skills" in data)
    assert_true("has jd_skills", "jd_skills" in data)
    assert_true("has skill_gap", "skill_gap" in data)
    assert_true("has learning_path", "learning_path" in data)
    assert_true("has dependency_graph", "dependency_graph" in data)
    assert_true("has explanation", "explanation" in data)
    assert_true("has meta", "meta" in data)
    assert_true("has role_info", "role_info" in data)

    # ── 5b. Role Info ────────────────────────────────────────────────────────
    print_subsection("5b. Role Info (from JD parsing)")
    role_info = data.get("role_info", {})
    assert_type("role_info is dict", role_info, dict)
    assert_true("has role title", bool(role_info.get("title")))
    assert_true("has seniority", bool(role_info.get("seniority")))
    assert_true("has domain", bool(role_info.get("domain")))
    print(f"  📋 Role: {role_info.get('title')} | {role_info.get('seniority')} | {role_info.get('domain')}")

    # ── 5c. Resume Skills (enhanced) ────────────────────────────────────────
    print_subsection("5c. Resume Skills (enhanced extraction)")
    resume_skills = data.get("resume_skills", [])
    assert_type("resume_skills is list", resume_skills, list)
    assert_true("resume_skills non-empty", len(resume_skills) > 0)
    assert_true("resume_skills >= 10", len(resume_skills) >= 10)
    print(f"  📝 Found {len(resume_skills)} skills:")

    # Validate each skill has the enhanced structure
    for s in resume_skills:
        has_name = "name" in s
        has_level = "level" in s
        has_category = "category" in s
        has_years = "years_experience" in s
        has_context = "context" in s

        level_color = {"Expert": "🟣", "Advanced": "🔵", "Intermediate": "🟢", "Beginner": "🟡"}.get(s.get("level", ""), "⚪")
        print(f"     {level_color} {s.get('name', '?')} — {s.get('level', '?')} "
              f"({s.get('years_experience', '?')}y) [{s.get('category', '?')}]")

        if not all([has_name, has_level, has_category, has_years, has_context]):
            missing = [k for k, v in {"name": has_name, "level": has_level,
                       "category": has_category, "years_experience": has_years,
                       "context": has_context}.items() if not v]
            print(f"     ⚠️  Missing fields: {missing}")

    # Check at least one skill has each field
    assert_true("skills have 'category' field",
                any("category" in s for s in resume_skills))
    assert_true("skills have 'years_experience' field",
                any("years_experience" in s for s in resume_skills))
    assert_true("skills have 'context' field",
                any("context" in s for s in resume_skills))

    # ── 5d. JD Skills ────────────────────────────────────────────────────────
    print_subsection("5d. JD Skills")
    jd_skills = data.get("jd_skills", [])
    assert_type("jd_skills is list", jd_skills, list)
    assert_true("jd_skills non-empty", len(jd_skills) > 0)

    required = [s for s in jd_skills if s.get("level") == "Required"]
    optional = [s for s in jd_skills if s.get("level") == "Optional"]
    print(f"  📄 Required: {len(required)} | Optional: {len(optional)}")
    for s in required:
        print(f"     🔴 {s['name']} — Required")
    for s in optional:
        print(f"     🟠 {s['name']} — Optional")

    # ── 5e. Skill Gap (enhanced) ─────────────────────────────────────────────
    print_subsection("5e. Skill Gap Analysis (enhanced)")
    skill_gap = data.get("skill_gap", [])
    assert_type("skill_gap is list", skill_gap, list)
    print(f"  🔍 {len(skill_gap)} gaps identified:")

    for g in skill_gap:
        if isinstance(g, dict):
            assert_true(f"gap '{g.get('skill', '?')}' has 'skill' field", "skill" in g)
            assert_true(f"gap '{g.get('skill', '?')}' has 'category' field", "category" in g)
            assert_true(f"gap '{g.get('skill', '?')}' has 'priority' field", "priority" in g)

            related = g.get("candidate_has_related", [])
            related_str = f" (related: {', '.join(related)})" if related else ""
            print(f"     ⚠️  {g.get('skill', '?')} [{g.get('category', '?')}]{related_str}")
        else:
            # Old format (string) — shouldn't happen with new code
            print(f"     ⚠️  {g} (old format)")

    # ── 5f. Learning Path (graph-based) ──────────────────────────────────────
    print_subsection("5f. Learning Path (graph-based adaptive pathing)")
    learning_path = data.get("learning_path", [])
    assert_type("learning_path is list", learning_path, list)
    assert_true("learning_path non-empty", len(learning_path) > 0)
    print(f"  🗺  {len(learning_path)} learning steps:")

    for step in learning_path:
        assert_true(f"step {step.get('step', '?')} has 'skill'", "skill" in step)
        assert_true(f"step {step.get('step', '?')} has 'reason'", "reason" in step)
        assert_true(f"step {step.get('step', '?')} has 'estimated_hours'", "estimated_hours" in step)
        assert_true(f"step {step.get('step', '?')} has 'difficulty'", "difficulty" in step)

        hours = step.get("estimated_hours", "?")
        diff = step.get("difficulty", "?")
        prereqs_met = step.get("prerequisites_met", [])
        is_implicit = step.get("is_implicit_prereq", False)
        resources = step.get("resources", [])
        milestones = step.get("milestones", [])
        project = step.get("project_idea", "")

        implicit_tag = " [implicit prereq]" if is_implicit else ""
        prereq_str = f" (builds on: {', '.join(prereqs_met)})" if prereqs_met else ""

        print(f"\n     Step {step.get('step', '?')}: {step.get('skill', '?')}"
              f" — {hours}h, {diff}{implicit_tag}{prereq_str}")
        print(f"       Reason: {step.get('reason', 'N/A')[:120]}...")

        if resources:
            print(f"       Resources ({len(resources)}):")
            for res in resources[:3]:
                if isinstance(res, dict):
                    print(f"         📚 {res.get('name', '?')}: {res.get('url', '?')}")
                else:
                    print(f"         📚 {res}")

        if milestones:
            print(f"       Milestones ({len(milestones)}):")
            for ms in milestones[:3]:
                print(f"         🎯 {ms}")

        if project:
            print(f"       Project: 🔨 {project[:100]}")

    # Validate learning path has resources and milestones
    has_resources = any(len(s.get("resources", [])) > 0 for s in learning_path)
    has_milestones = any(len(s.get("milestones", [])) > 0 for s in learning_path)
    has_projects = any(bool(s.get("project_idea")) for s in learning_path)
    assert_true("at least one step has resources", has_resources)
    assert_true("at least one step has milestones", has_milestones)
    assert_true("at least one step has project_idea", has_projects)

    # ── 5g. Dependency Graph ─────────────────────────────────────────────────
    print_subsection("5g. Dependency Graph (for visualization)")
    dep_graph = data.get("dependency_graph", {})
    assert_type("dependency_graph is dict", dep_graph, dict)
    assert_true("has nodes", "nodes" in dep_graph)
    assert_true("has edges", "edges" in dep_graph)
    assert_true("has stats", "stats" in dep_graph)

    nodes = dep_graph.get("nodes", [])
    edges = dep_graph.get("edges", [])
    stats = dep_graph.get("stats", {})

    assert_true("nodes non-empty", len(nodes) > 0)
    print(f"\n  📊 Graph: {len(nodes)} nodes, {len(edges)} edges")
    print(f"  📊 Stats: {pretty(stats)}")

    print(f"\n  Nodes:")
    for node in nodes:
        implicit = " [implicit]" if node.get("is_implicit") else ""
        print(f"     • {node.get('id', '?')} ({node.get('group', '?')}, "
              f"{node.get('estimated_hours', '?')}h){implicit}")

    print(f"\n  Edges (prerequisites):")
    for edge in edges:
        print(f"     {edge.get('source', '?')} ──→ {edge.get('target', '?')}")

    # Validate node structure
    if nodes:
        sample_node = nodes[0]
        assert_true("node has 'id'", "id" in sample_node)
        assert_true("node has 'group'", "group" in sample_node)
        assert_true("node has 'estimated_hours'", "estimated_hours" in sample_node)

    # ── 5h. Explanation ──────────────────────────────────────────────────────
    print_subsection("5h. Explanation")
    explanation = data.get("explanation", "")
    assert_true("explanation non-empty", bool(explanation.strip()))
    assert_true("explanation is substantial (>200 chars)", len(explanation) > 200)
    # Print first 400 chars
    print(f"\n  💬 Explanation preview:")
    for line in explanation[:500].split('\n'):
        print(f"     {line}")
    print(f"     ... ({len(explanation)} total chars)")

    # ── 5i. Meta / Statistics ────────────────────────────────────────────────
    print_subsection("5i. Meta / Statistics")
    meta = data.get("meta", {})
    assert_type("meta is dict", meta, dict)
    assert_true("has match_percentage", "match_percentage" in meta)
    assert_true("has total_learning_hours", "total_learning_hours" in meta)
    assert_true("has total_learning_weeks", "total_learning_weeks" in meta)
    assert_true("has total_resume_skills", "total_resume_skills" in meta)
    assert_true("has total_required_skills", "total_required_skills" in meta)
    assert_true("has total_gaps", "total_gaps" in meta)
    assert_true("has total_learning_steps", "total_learning_steps" in meta)

    print(f"\n  📊 Full Meta:")
    print(f"     Match:    {meta.get('match_percentage', '?')}%")
    print(f"     Skills:   {meta.get('total_resume_skills', '?')} found in resume")
    print(f"     Required: {meta.get('total_required_skills', '?')} by JD")
    print(f"     Optional: {meta.get('total_optional_skills', '?')} by JD")
    print(f"     Gaps:     {meta.get('total_gaps', '?')}")
    print(f"     Steps:    {meta.get('total_learning_steps', '?')}")
    print(f"     Hours:    {meta.get('total_learning_hours', '?')}h")
    print(f"     Weeks:    ~{meta.get('total_learning_weeks', '?')} weeks (at 20h/week)")

    return data.get("session_id")


def test_get_session(session_id: str):
    print_section(f"6. GET /session/{session_id}")
    r = requests.get(f"{BASE_URL}/session/{session_id}", timeout=15)
    data = r.json()
    print(f"  Status: {r.status_code}")
    assert_eq("status code", r.status_code, 200)
    assert_eq("success flag", data.get("success"), True)
    assert_true("session present", "session" in data)
    assert_eq("session id matches", data["session"].get("_id"), session_id)

    session = data["session"]
    assert_true("session has role_title", "role_title" in session)
    assert_true("session has dependency_graph", "dependency_graph" in session)
    assert_true("session has stats", "stats" in session)
    assert_true("session has created_at", "created_at" in session)

    print(f"  📦 Session retrieved — role: {session.get('role_title', '?')}")
    print(f"  📦 Created: {session.get('created_at', '?')}")
    if "stats" in session:
        print(f"  📦 Match: {session['stats'].get('match_percentage', '?')}%")


def test_list_sessions():
    print_section("7. GET /sessions")
    r = requests.get(f"{BASE_URL}/sessions", timeout=15)
    data = r.json()
    print(f"  Status: {r.status_code}")
    assert_eq("status code", r.status_code, 200)
    assert_true("has sessions list", isinstance(data.get("sessions"), list))
    assert_true("has count", "count" in data)

    sessions = data.get("sessions", [])
    print(f"  📦 Total sessions in DB: {data.get('count', 0)}")
    for s in sessions[:5]:
        role = s.get("role_title", "N/A")
        created = s.get("created_at", "N/A")
        skills_count = len(s.get("resume_skills", []))
        print(f"     • [{s.get('_id', '?')[:8]}...] {role} — {skills_count} skills — {created}")

    # Verify heavy fields are excluded
    if sessions:
        sample = sessions[0]
        assert_true("resume_text excluded from list", "resume_text" not in sample)
        assert_true("jd_text excluded from list", "jd_text" not in sample)
        assert_true("explanation excluded from list", "explanation" not in sample)
        assert_true("dependency_graph excluded from list", "dependency_graph" not in sample)


def test_analyze_file_upload():
    """Test file upload with a sample TXT file."""
    print_section("8. POST /analyze — file upload (TXT)")

    # Create temporary test files
    resume_content = SAMPLE_RESUME.encode("utf-8")
    jd_content = SAMPLE_JD.encode("utf-8")

    files = {
        "resume_file": ("resume.txt", resume_content, "text/plain"),
        "jd_file": ("jd.txt", jd_content, "text/plain"),
    }

    print("  ⏳ Uploading files (may take 30-60s for Gemini calls)...")
    r = requests.post(f"{BASE_URL}/analyze", files=files, timeout=180)
    data = r.json()
    print(f"  Status: {r.status_code}")

    assert_eq("status code", r.status_code, 200)
    assert_eq("success flag", data.get("success"), True)
    assert_true("has resume_skills", len(data.get("resume_skills", [])) > 0)
    assert_true("has learning_path", len(data.get("learning_path", [])) > 0)
    assert_true("has dependency_graph nodes", len(data.get("dependency_graph", {}).get("nodes", [])) > 0)

    print(f"  ✅ File upload test passed — {len(data.get('resume_skills', []))} skills, "
          f"{len(data.get('learning_path', []))} steps")

    return data.get("session_id")


# ── Runner ───────────────────────────────────────────────────────────────────────

def main():
    global passed, failed

    print("\n" + "═"*70)
    print("  🚀 AI Adaptive Onboarding Engine — Comprehensive Test Suite")
    print(f"     Target: {BASE_URL}")
    print("═"*70)

    # Check server is reachable
    try:
        requests.get(f"{BASE_URL}/health", timeout=5)
    except requests.exceptions.ConnectionError:
        print(f"\n  ❌ Cannot connect to {BASE_URL}")
        print("     Make sure the Flask server is running: python app.py")
        sys.exit(1)

    # Run all tests
    db_connected = test_health()
    if not db_connected:
        print("\n  ⚠️  MongoDB is not connected. /analyze will fail to save sessions.")

    test_root()
    test_missing_input()
    test_invalid_session()

    # Main analysis test (text input)
    session_id = test_analyze_text_input()

    if session_id:
        test_get_session(session_id)
        test_list_sessions()

    # File upload test (uses same text as TXT files)
    # Uncomment below if you want to run the full file upload test too:
    # test_analyze_file_upload()

    # ── Summary ──────────────────────────────────────────────────────────────
    total = passed + failed
    print("\n" + "═"*70)
    print(f"  📊 Test Results: {passed}/{total} passed, {failed} failed")
    if failed == 0:
        print("  🎉 All tests passed!")
    else:
        print(f"  ⚠️  {failed} test(s) failed — review output above")
    print("═"*70 + "\n")


if __name__ == "__main__":
    main()
