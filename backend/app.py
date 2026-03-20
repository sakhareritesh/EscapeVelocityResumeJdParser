"""
app.py - Flask application factory and entry point
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

# ── App Factory ─────────────────────────────────────────────────────────────────

def create_app() -> Flask:
    app = Flask(__name__)

    # ── CORS ─────────────────────────────────────────────────────────────────────
    CORS(
        app,
        resources={r"/*": {"origins": "*"}},
        methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
    )

    # ── Config ───────────────────────────────────────────────────────────────────
    app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16 MB upload limit
    app.config["JSON_SORT_KEYS"] = False

    # ── MongoDB startup connection ────────────────────────────────────────────────
    try:
        from db.mongo import MongoDB
        MongoDB.connect()
    except Exception as e:
        print(f"⚠️  MongoDB not available at startup: {e}")
        print("   The API will start but /analyze will fail until DB is reachable.")

    # ── Register Blueprints ───────────────────────────────────────────────────────
    from routes.analyze import analyze_bp
    app.register_blueprint(analyze_bp)

    # ── Health Check ─────────────────────────────────────────────────────────────
    @app.route("/health", methods=["GET"])
    def health():
        from db.mongo import MongoDB
        db_status = "connected"
        try:
            MongoDB.get_db().command("ping")
        except Exception:
            db_status = "disconnected"

        return jsonify({
            "status": "ok",
            "service": "AI Adaptive Onboarding Engine",
            "version": "1.0.0",
            "database": db_status,
        }), 200

    # ── Root ─────────────────────────────────────────────────────────────────────
    @app.route("/", methods=["GET"])
    def root():
        return jsonify({
            "service": "AI Adaptive Onboarding Engine",
            "version": "1.0.0",
            "endpoints": {
                "POST /analyze":          "Analyze resume vs job description",
                "GET  /session/<id>":     "Retrieve a stored session",
                "GET  /sessions":         "List recent sessions (last 20)",
                "GET  /health":           "Health check",
            },
        }), 200

    # ── Global Error Handlers ────────────────────────────────────────────────────
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"success": False, "error": str(e)}), 400

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "error": "Endpoint not found."}), 404

    @app.errorhandler(413)
    def too_large(e):
        return jsonify({
            "success": False,
            "error": "File too large. Maximum upload size is 16 MB.",
        }), 413

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"success": False, "error": "Internal server error."}), 500

    # ── Teardown ─────────────────────────────────────────────────────────────────
    @app.teardown_appcontext
    def close_db(error):
        pass  # PyMongo manages its own connection pool

    return app


# ── Entry Point ─────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    app = create_app()
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "True").lower() == "true"

    print(f"""
╔══════════════════════════════════════════════════════╗
║       AI Adaptive Onboarding Engine — Backend        ║
║                                                      ║
║  POST  http://localhost:{port}/analyze                 ║
║  GET   http://localhost:{port}/health                  ║
║  GET   http://localhost:{port}/sessions                ║
╚══════════════════════════════════════════════════════╝
""")
    app.run(host="0.0.0.0", port=port, debug=debug)
