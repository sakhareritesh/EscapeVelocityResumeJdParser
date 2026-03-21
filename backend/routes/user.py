"""
routes/user.py - User-specific routes for session history and profile data
"""

import traceback
from datetime import datetime, timezone

from flask import Blueprint, request, jsonify
from bson import ObjectId
from bson.errors import InvalidId

from db.mongo import MongoDB
from services.firebase_admin_service import get_uid_from_request

user_bp = Blueprint("user", __name__)


def _error(message: str, status: int = 400) -> tuple:
    return jsonify({"success": False, "error": message}), status


# ── GET /user/sessions ──────────────────────────────────────────────────────────

@user_bp.route("/user/sessions", methods=["GET"])
def get_user_sessions():
    """
    Get all analysis sessions for a specific user (by Firebase UID).
    Pass firebase_uid as query param or use Authorization Bearer token.
    """
    uid = get_uid_from_request(request)
    if not uid:
        return _error("Missing firebase_uid parameter or valid Authorization header.", 401)

    try:
        db = MongoDB.get_db()
        collection = db["sessions"]
        cursor = collection.find(
            {"user_uid": uid},
            {
                "resume_text": 0,
                "jd_text": 0,
            }
        ).sort("created_at", -1).limit(50)

        sessions = []
        for doc in cursor:
            doc["_id"] = str(doc["_id"])
            if "created_at" in doc:
                doc["created_at"] = doc["created_at"].isoformat()
            sessions.append(doc)

    except Exception as e:
        traceback.print_exc()
        return _error(f"Database error: {e}", 500)

    return jsonify({"success": True, "sessions": sessions, "count": len(sessions)}), 200


# ── GET /user/latest-session ────────────────────────────────────────────────────

@user_bp.route("/user/latest-session", methods=["GET"])
def get_latest_session():
    """
    Get the most recent analysis session for a user.
    This is used by dynamic pages like career-paths, my-career-plan, my-content.
    """
    uid = get_uid_from_request(request)
    if not uid:
        return _error("Missing firebase_uid parameter or valid Authorization header.", 401)

    try:
        db = MongoDB.get_db()
        collection = db["sessions"]
        doc = collection.find_one(
            {"user_uid": uid},
            sort=[("created_at", -1)]
        )

        if not doc:
            return jsonify({"success": True, "session": None, "message": "No sessions found."}), 200

        doc["_id"] = str(doc["_id"])
        if "created_at" in doc:
            doc["created_at"] = doc["created_at"].isoformat()

    except Exception as e:
        traceback.print_exc()
        return _error(f"Database error: {e}", 500)

    return jsonify({"success": True, "session": doc}), 200


# ── GET /user/session/<id> ──────────────────────────────────────────────────────

@user_bp.route("/user/session/<session_id>", methods=["GET"])
def get_user_session(session_id: str):
    """Retrieve a specific session, scoped to the user's UID for security."""
    uid = get_uid_from_request(request)

    try:
        oid = ObjectId(session_id)
    except InvalidId:
        return _error("Invalid session ID format.", 400)

    try:
        db = MongoDB.get_db()
        collection = db["sessions"]

        # If UID is available, scope the query
        query = {"_id": oid}
        if uid:
            query["user_uid"] = uid

        doc = collection.find_one(query)
    except Exception as e:
        traceback.print_exc()
        return _error(f"Database error: {e}", 500)

    if not doc:
        return _error("Session not found.", 404)

    doc["_id"] = str(doc["_id"])
    if "created_at" in doc:
        doc["created_at"] = doc["created_at"].isoformat()

    return jsonify({"success": True, "session": doc}), 200
