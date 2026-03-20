"""
routes/analyze.py - POST /analyze endpoint with enhanced skill analysis
"""

import traceback
from datetime import datetime, timezone

from flask import Blueprint, request, jsonify

from services.parser import (
    parse_resume, parse_job_description,
    calculate_skill_gap, calculate_skill_gap_simple, get_resume_summary,
)
from services.roadmap import generate_learning_path, generate_explanation, export_learning_graph
from db.mongo import get_sessions_collection
from utils.file_handler import get_text_input, extract_text_from_file

analyze_bp = Blueprint("analyze", __name__)


# ── POST /parse (instant — no Gemini) ────────────────────────────────────────────

@analyze_bp.route("/parse", methods=["POST"])
def parse_files():
    """
    Extract text from uploaded files WITHOUT calling Gemini.
    This is instant (<1 sec) and lets the frontend verify parsing works.

    Accepts multipart/form-data with:
      - resume_file  (file upload — PDF, DOCX, TXT)
      - jd_file      (file upload — PDF, DOCX, TXT)
      OR
      - resume_text   (str)
      - jd_text       (str)

    Returns the raw extracted text so frontend can preview before analysis.
    """
    result = {"success": True}

    # Parse resume
    try:
        resume_text = get_text_input(
            request.form, request.files,
            text_field="resume_text",
            file_field="resume_file",
        )
        result["resume"] = {
            "text": resume_text,
            "char_count": len(resume_text),
            "word_count": len(resume_text.split()),
            "preview": resume_text[:500],
            "status": "ok",
        }
    except ValueError as e:
        result["resume"] = {"text": "", "char_count": 0, "status": "error", "error": str(e)}

    # Parse JD
    try:
        jd_text = get_text_input(
            request.form, request.files,
            text_field="jd_text",
            file_field="jd_file",
        )
        result["jd"] = {
            "text": jd_text,
            "char_count": len(jd_text),
            "word_count": len(jd_text.split()),
            "preview": jd_text[:500],
            "status": "ok",
        }
    except ValueError as e:
        result["jd"] = {"text": "", "char_count": 0, "status": "error", "error": str(e)}

    return jsonify(result), 200


# ── Helper ──────────────────────────────────────────────────────────────────────

def _error(message: str, status: int = 400) -> tuple:
    return jsonify({"success": False, "error": message}), status


# ── POST /analyze ───────────────────────────────────────────────────────────────

@analyze_bp.route("/analyze", methods=["POST"])
def analyze():
    """
    Analyze a resume against a job description.

    Accepts multipart/form-data OR application/x-www-form-urlencoded with:
      - resume_text  (str)  OR  resume_file  (file upload — PDF, DOCX, TXT)
      - jd_text      (str)  OR  jd_file      (file upload — PDF, DOCX, TXT)

    Returns JSON with skills, gaps, learning path, dependency graph, and explanation.
    """

    # ── 1. Extract input text ────────────────────────────────────────────────────
    try:
        resume_text = get_text_input(
            request.form, request.files,
            text_field="resume_text",
            file_field="resume_file",
        )
    except ValueError as e:
        return _error(f"Resume input error: {e}", 400)

    try:
        jd_text = get_text_input(
            request.form, request.files,
            text_field="jd_text",
            file_field="jd_file",
        )
    except ValueError as e:
        return _error(f"Job description input error: {e}", 400)

    print(f"📝 Resume text length: {len(resume_text)} chars")
    print(f"📝 JD text length: {len(jd_text)} chars")

    # ── 2. Parse Resume ──────────────────────────────────────────────────────────
    try:
        resume_skills = parse_resume(resume_text)
        print(f"✅ Extracted {len(resume_skills)} skills from resume")
    except Exception as e:
        traceback.print_exc()
        return _error(f"Resume parsing failed: {e}", 500)

    # ── 3. Parse Job Description ─────────────────────────────────────────────────
    try:
        jd_parsed = parse_job_description(jd_text)
        jd_required = jd_parsed.get("required_skills", [])
        jd_optional = jd_parsed.get("optional_skills", [])
        role_title = jd_parsed.get("role_title", "Not specified")
        seniority_level = jd_parsed.get("seniority_level", "Not specified")
        domain = jd_parsed.get("domain", "Not specified")
        print(f"✅ JD parsed — {len(jd_required)} required, {len(jd_optional)} optional skills")
    except Exception as e:
        traceback.print_exc()
        return _error(f"Job description parsing failed: {e}", 500)

    # Build unified jd_skills list for storage
    jd_skills = (
        [{"name": s, "level": "Required"} for s in jd_required]
        + [{"name": s, "level": "Optional"} for s in jd_optional]
    )

    # ── 4. Calculate Skill Gap (enhanced) ────────────────────────────────────────
    skill_gap = calculate_skill_gap(resume_skills, jd_required)
    skill_gap_names = [g["skill"] if isinstance(g, dict) else g for g in skill_gap]
    print(f"🔍 Identified {len(skill_gap)} skill gaps")

    # ── 5. Generate Learning Path (graph-based) ─────────────────────────────────
    try:
        learning_path = generate_learning_path(resume_skills, skill_gap)
        print(f"🗺  Generated {len(learning_path)} learning steps")
    except Exception as e:
        traceback.print_exc()
        return _error(f"Learning path generation failed: {e}", 500)

    # ── 6. Export Dependency Graph ───────────────────────────────────────────────
    try:
        dependency_graph = export_learning_graph(resume_skills, skill_gap)
    except Exception as e:
        traceback.print_exc()
        dependency_graph = {"nodes": [], "edges": [], "stats": {}}

    # ── 7. Generate Explanation ──────────────────────────────────────────────────
    try:
        explanation = generate_explanation(
            resume_skills, jd_required, skill_gap, learning_path
        )
    except Exception as e:
        traceback.print_exc()
        # Non-fatal: degrade gracefully
        explanation = (
            "Unable to generate explanation at this time. "
            "Please review the learning path above."
        )

    # ── 8. Calculate Summary Statistics ──────────────────────────────────────────
    total_hours = sum(s.get("estimated_hours", 0) for s in learning_path)
    total_weeks = max(1, total_hours // 20)  # assuming ~20h/week

    # Skill match percentage
    if jd_required:
        match_percentage = round(
            ((len(jd_required) - len(skill_gap)) / len(jd_required)) * 100, 1
        )
    else:
        match_percentage = 100.0

    # ── 9. Store in MongoDB ──────────────────────────────────────────────────────
    session_id = None
    try:
        doc = {
            "created_at": datetime.now(timezone.utc),
            "resume_text": resume_text,
            "jd_text": jd_text,
            "role_title": role_title,
            "seniority_level": seniority_level,
            "domain": domain,
            "resume_skills": resume_skills,
            "jd_skills": jd_skills,
            "skill_gap": skill_gap,
            "learning_path": learning_path,
            "dependency_graph": dependency_graph,
            "explanation": explanation,
            "stats": {
                "match_percentage": match_percentage,
                "total_learning_hours": total_hours,
                "total_learning_weeks": total_weeks,
            },
        }
        collection = get_sessions_collection()
        result = collection.insert_one(doc)
        session_id = str(result.inserted_id)
        print(f"✅ Session saved: {session_id}")
    except Exception as e:
        # Log but don't block the response
        print(f"⚠️  MongoDB save failed (non-fatal): {e}")
        traceback.print_exc()

    # ── 10. Return Response ──────────────────────────────────────────────────────
    response_payload = {
        "success": True,
        "session_id": session_id,
        "role_info": {
            "title": role_title,
            "seniority": seniority_level,
            "domain": domain,
        },
        "resume_skills": resume_skills,
        "jd_skills": jd_skills,
        "skill_gap": skill_gap,
        "learning_path": learning_path,
        "dependency_graph": dependency_graph,
        "explanation": explanation,
        "meta": {
            "total_resume_skills": len(resume_skills),
            "total_required_skills": len(jd_required),
            "total_optional_skills": len(jd_optional),
            "total_gaps": len(skill_gap),
            "total_learning_steps": len(learning_path),
            "match_percentage": match_percentage,
            "total_learning_hours": total_hours,
            "total_learning_weeks": total_weeks,
        },
    }

    return jsonify(response_payload), 200


# ── GET /session/<id> ────────────────────────────────────────────────────────────

@analyze_bp.route("/session/<session_id>", methods=["GET"])
def get_session(session_id: str):
    """Retrieve a stored session by its MongoDB ObjectId string."""
    from bson import ObjectId
    from bson.errors import InvalidId

    try:
        oid = ObjectId(session_id)
    except InvalidId:
        return _error("Invalid session ID format.", 400)

    try:
        collection = get_sessions_collection()
        doc = collection.find_one({"_id": oid})
    except Exception as e:
        return _error(f"Database error: {e}", 500)

    if not doc:
        return _error("Session not found.", 404)

    # Convert ObjectId and datetime for JSON serialisation
    doc["_id"] = str(doc["_id"])
    if "created_at" in doc:
        doc["created_at"] = doc["created_at"].isoformat()

    return jsonify({"success": True, "session": doc}), 200


# ── GET /sessions ────────────────────────────────────────────────────────────────

@analyze_bp.route("/sessions", methods=["GET"])
def list_sessions():
    """List recent sessions (last 20), without full text blobs."""
    try:
        collection = get_sessions_collection()
        cursor = collection.find(
            {},
            {
                "resume_text": 0,   # exclude heavy fields
                "jd_text": 0,
                "explanation": 0,
                "dependency_graph": 0,
            }
        ).sort("created_at", -1).limit(20)

        sessions = []
        for doc in cursor:
            doc["_id"] = str(doc["_id"])
            if "created_at" in doc:
                doc["created_at"] = doc["created_at"].isoformat()
            sessions.append(doc)

    except Exception as e:
        return _error(f"Database error: {e}", 500)

    return jsonify({"success": True, "sessions": sessions, "count": len(sessions)}), 200
