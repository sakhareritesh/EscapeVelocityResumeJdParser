"""
app.py - Flask application factory and entry point
"""

import os
from flask import Flask, jsonify, render_template_string, request
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
                "POST /parse":            "Extract text from PDF/DOCX/TXT (instant, no AI)",
                "POST /analyze":          "Full analysis: skills, gaps, learning path",
                "GET  /upload":           "Upload UI for testing",
                "GET  /session/<id>":     "Retrieve a stored session",
                "GET  /sessions":         "List recent sessions (last 20)",
                "GET  /health":           "Health check",
            },
        }), 200

    # ── Upload UI ─────────────────────────────────────────────────────────────────
    @app.route("/upload", methods=["GET"])
    def upload_page():
        """Serve a simple HTML upload page for testing."""
        return render_template_string(UPLOAD_HTML)

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


# ── Upload Page HTML ────────────────────────────────────────────────────────────

UPLOAD_HTML = r"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Onboarding Engine</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Segoe UI',system-ui,sans-serif;background:#0f0f17;color:#ddd;min-height:100vh}
    .wrap{max-width:940px;margin:0 auto;padding:32px 20px}
    h1{font-size:24px;color:#a78bfa;margin-bottom:4px}
    .sub{color:#666;font-size:13px;margin-bottom:32px}
    .step{background:#16161e;border:1px solid #222;border-radius:14px;padding:24px;margin-bottom:24px}
    .step-title{font-size:16px;font-weight:700;color:#c4b5fd;margin-bottom:16px;display:flex;align-items:center;gap:10px}
    .step-num{background:#7c3aed;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0}
    .step.disabled{opacity:0.4;pointer-events:none}
    .upload-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
    .upload-box{border:2px dashed #333;border-radius:12px;padding:24px;text-align:center;cursor:pointer;position:relative;transition:all 0.2s}
    .upload-box:hover{border-color:#7c3aed;background:#1a1a2e}
    .upload-box.ok{border-color:#22c55e;border-style:solid;background:#0d1f12}
    .upload-box input{position:absolute;inset:0;opacity:0;cursor:pointer}
    .upload-box h4{font-size:15px;margin-bottom:6px}
    .upload-box p{color:#555;font-size:12px}
    .upload-box .fname{margin-top:8px;font-size:12px;color:#86efac;display:none}
    .btn{padding:12px 28px;border-radius:10px;border:none;cursor:pointer;font-size:14px;font-weight:600;transition:all 0.2s}
    .btn:disabled{opacity:0.3;cursor:not-allowed}
    .btn-purple{background:#7c3aed;color:#fff}
    .btn-purple:hover:not(:disabled){background:#6d28d9}
    .btn-green{background:#16a34a;color:#fff}
    .btn-green:hover:not(:disabled){background:#15803d}
    .btn-row{display:flex;gap:10px;align-items:center}
    .text-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
    .text-group label{font-size:13px;color:#888;display:block;margin-bottom:6px}
    .text-group textarea{width:100%;height:200px;background:#0f0f17;color:#ddd;border:1px solid #333;border-radius:10px;padding:12px;font-size:12px;font-family:inherit;resize:vertical;line-height:1.5}
    .text-group textarea:focus{border-color:#7c3aed;outline:none}
    .text-group .stats{font-size:11px;color:#555;margin-top:4px}
    .status{padding:12px 16px;border-radius:10px;font-size:13px;margin-bottom:16px;display:none}
    .status.info{display:block;background:#1e1b4b;color:#a5b4fc;border:1px solid #312e81}
    .status.ok{display:block;background:#052e16;color:#86efac;border:1px solid #166534}
    .status.err{display:block;background:#2d0a0a;color:#fca5a5;border:1px solid #7f1d1d}
    .results{background:#16161e;border:1px solid #222;border-radius:14px;padding:24px;display:none}
    .results h2{color:#a78bfa;font-size:18px;margin-bottom:16px}
    .tag{display:inline-block;padding:3px 9px;border-radius:5px;font-size:11px;margin:2px}
    .tag-adv{background:#1e3a5f;color:#93c5fd}.tag-int{background:#052e16;color:#86efac}
    .tag-beg{background:#422006;color:#fed7aa}.tag-exp{background:#3b0764;color:#d8b4fe}
    .tag-gap{background:#2d0a0a;color:#fca5a5}
    .match-bar{width:100%;height:10px;background:#1e293b;border-radius:5px;overflow:hidden;margin:6px 0}
    .match-fill{height:100%;border-radius:5px;transition:width 0.8s}
    .lp-step{background:#1e1e2e;border-radius:8px;padding:12px 14px;margin-bottom:8px;border-left:3px solid #7c3aed;font-size:13px}
    .lp-step strong{color:#c4b5fd}.lp-step .meta{color:#555;font-size:11px;float:right}
    .lp-step .reason{color:#888;font-size:12px;margin-top:4px}
    .section{margin-bottom:20px}.section h3{font-size:14px;color:#c4b5fd;margin-bottom:8px}
    .expl{color:#94a3b8;font-size:13px;line-height:1.7;white-space:pre-wrap}
    .spin{display:inline-block;width:14px;height:14px;border:2px solid #fff4;border-top-color:#fff;border-radius:50%;animation:sp .5s linear infinite;margin-right:6px;vertical-align:middle}
    @keyframes sp{to{transform:rotate(360deg)}}
    @media(max-width:640px){.upload-row,.text-row{grid-template-columns:1fr}}
  </style>
</head>
<body>
<div class="wrap">
  <h1>&#x1f9e0; AI Adaptive Onboarding Engine</h1>
  <p class="sub">Upload Resume + Job Description &#x2192; Parse &#x2192; Review &#x2192; Analyze</p>

  <!-- STEP 1: Upload & Parse -->
  <div class="step" id="step1">
    <div class="step-title"><span class="step-num">1</span> Upload &amp; Parse Documents</div>
    <div class="upload-row">
      <div class="upload-box" id="rBox">
        <h4>&#x1f4c4; Resume</h4>
        <p>PDF, DOCX, or TXT</p>
        <input type="file" id="rFile" accept=".pdf,.docx,.doc,.txt">
        <div class="fname" id="rName"></div>
      </div>
      <div class="upload-box" id="jBox">
        <h4>&#x1f4cb; Job Description</h4>
        <p>PDF, DOCX, or TXT</p>
        <input type="file" id="jFile" accept=".pdf,.docx,.doc,.txt">
        <div class="fname" id="jName"></div>
      </div>
    </div>
    <div class="btn-row">
      <button class="btn btn-purple" id="parseBtn" onclick="doParse()" disabled>&#x1f50d; Parse Documents</button>
      <span id="parseStatus" style="color:#666;font-size:12px"></span>
    </div>
  </div>

  <div id="statusBar" class="status"></div>

  <!-- STEP 2: Review & Edit parsed text -->
  <div class="step disabled" id="step2">
    <div class="step-title"><span class="step-num">2</span> Review &amp; Edit Parsed Text</div>
    <p style="color:#666;font-size:12px;margin-bottom:12px">Check the extracted text below. You can edit it before running the analysis.</p>
    <div class="text-row">
      <div class="text-group">
        <label>&#x1f4c4; Resume Text</label>
        <textarea id="rText" placeholder="Parsed resume text will appear here..."></textarea>
        <div class="stats" id="rStats"></div>
      </div>
      <div class="text-group">
        <label>&#x1f4cb; JD Text</label>
        <textarea id="jText" placeholder="Parsed JD text will appear here..."></textarea>
        <div class="stats" id="jStats"></div>
      </div>
    </div>
    <div class="btn-row">
      <button class="btn btn-green" id="analyzeBtn" onclick="doAnalyze()">&#x1f680; Run Full Analysis</button>
      <span style="color:#555;font-size:12px">This calls Gemini AI and takes 30-90 seconds</span>
    </div>
  </div>

  <!-- RESULTS -->
  <div class="results" id="results">
    <h2>&#x1f4ca; Analysis Results</h2>
    <div class="section" id="matchSec">
      <h3>Match Score</h3>
      <div id="matchInfo"></div>
      <div class="match-bar"><div class="match-fill" id="matchFill"></div></div>
    </div>
    <div class="section"><h3>&#x1f4dd; Resume Skills</h3><div id="skillsDiv"></div></div>
    <div class="section"><h3>&#x26a0;&#xfe0f; Skill Gaps</h3><div id="gapsDiv"></div></div>
    <div class="section"><h3>&#x1f5fa;&#xfe0f; Learning Roadmap</h3><div id="pathDiv"></div></div>
    <div class="section"><h3>&#x1f4ac; AI Coaching</h3><p class="expl" id="explDiv"></p></div>
  </div>
</div>

<script>
const rFile=document.getElementById('rFile'), jFile=document.getElementById('jFile');

rFile.onchange=function(e){var f=e.target.files[0];if(f){document.getElementById('rBox').classList.add('ok');var n=document.getElementById('rName');n.style.display='block';n.textContent=f.name+' ('+(f.size/1024).toFixed(1)+' KB)';}updateParse()};
jFile.onchange=function(e){var f=e.target.files[0];if(f){document.getElementById('jBox').classList.add('ok');var n=document.getElementById('jName');n.style.display='block';n.textContent=f.name+' ('+(f.size/1024).toFixed(1)+' KB)';}updateParse()};

function updateParse(){document.getElementById('parseBtn').disabled=!(rFile.files.length&&jFile.files.length)}

function setStatus(t,m){var b=document.getElementById('statusBar');b.className='status '+t;b.innerHTML=m}

function doParse(){
  var fd=new FormData();
  fd.append('resume_file',rFile.files[0]);
  fd.append('jd_file',jFile.files[0]);
  setStatus('info','<span class="spin"></span> Extracting text from files...');
  document.getElementById('parseBtn').disabled=true;

  fetch('/parse',{method:'POST',body:fd})
    .then(function(r){return r.json()})
    .then(function(d){
      if(d.resume && d.resume.status==='ok'){
        document.getElementById('rText').value=d.resume.text;
        document.getElementById('rStats').textContent=d.resume.char_count+' chars, '+d.resume.word_count+' words';
      } else {
        document.getElementById('rText').value='[Error] '+(d.resume?d.resume.error:'unknown');
      }
      if(d.jd && d.jd.status==='ok'){
        document.getElementById('jText').value=d.jd.text;
        document.getElementById('jStats').textContent=d.jd.char_count+' chars, '+d.jd.word_count+' words';
      } else {
        document.getElementById('jText').value='[Error] '+(d.jd?d.jd.error:'unknown');
      }
      document.getElementById('step2').classList.remove('disabled');
      setStatus('ok','&#x2705; Parsing complete! Review the text below, edit if needed, then click Run Full Analysis.');
      document.getElementById('parseBtn').disabled=false;
    })
    .catch(function(e){
      setStatus('err','&#x274c; Parse error: '+e.message);
      document.getElementById('parseBtn').disabled=false;
    });
}

function doAnalyze(){
  var rText=document.getElementById('rText').value.trim();
  var jText=document.getElementById('jText').value.trim();
  if(!rText||!jText){setStatus('err','Both resume and JD text are required.');return}

  var fd=new FormData();
  fd.append('resume_text',rText);
  fd.append('jd_text',jText);

  var btn=document.getElementById('analyzeBtn');
  btn.disabled=true;btn.innerHTML='<span class="spin"></span> Analyzing...';
  setStatus('info','<span class="spin"></span> AI is analyzing (30-90 sec)...');

  fetch('/analyze',{method:'POST',body:fd})
    .then(function(r){return r.json()})
    .then(function(d){
      if(!d.success){setStatus('err','&#x274c; '+d.error);btn.disabled=false;btn.textContent='\u{1f680} Run Full Analysis';return}

      var pct=d.meta?d.meta.match_percentage||0:0;
      document.getElementById('matchFill').style.width=pct+'%';
      document.getElementById('matchFill').style.background=pct>=70?'#22c55e':pct>=40?'#eab308':'#ef4444';
      document.getElementById('matchInfo').innerHTML='<strong>'+pct+'%</strong> match &middot; '+d.meta.total_gaps+' gaps &middot; ~'+d.meta.total_learning_hours+'h &middot; ~'+d.meta.total_learning_weeks+' weeks';

      var lc={Expert:'tag-exp',Advanced:'tag-adv',Intermediate:'tag-int',Beginner:'tag-beg'};
      document.getElementById('skillsDiv').innerHTML=(d.resume_skills||[]).map(function(s){return'<span class="tag '+(lc[s.level]||'')+'">'+s.name+' &middot; '+s.level+'</span>'}).join('');

      document.getElementById('gapsDiv').innerHTML=(d.skill_gap||[]).map(function(g){var n=typeof g==='string'?g:g.skill;return'<span class="tag tag-gap">'+n+'</span>'}).join('');

      document.getElementById('pathDiv').innerHTML=(d.learning_path||[]).map(function(s){return'<div class="lp-step"><span class="meta">'+(s.estimated_hours||'?')+'h &middot; '+(s.difficulty||'')+'</span><strong>Step '+s.step+':</strong> '+s.skill+'<div class="reason">'+(s.reason||'')+'</div></div>'}).join('');

      document.getElementById('explDiv').textContent=d.explanation||'';
      document.getElementById('results').style.display='block';
      setStatus('ok','&#x2705; Done! Session: '+d.session_id);
      btn.disabled=false;btn.textContent='\u{1f680} Run Full Analysis';
    })
    .catch(function(e){
      setStatus('err','&#x274c; '+e.message);
      btn.disabled=false;btn.textContent='\u{1f680} Run Full Analysis';
    });
}
</script>
</body>
</html>
"""


# ── Entry Point ─────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    app = create_app()
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "True").lower() == "true"

    print(f"""
╔══════════════════════════════════════════════════════╗
║       AI Adaptive Onboarding Engine — Backend        ║
║                                                      ║
║  Upload UI:  http://localhost:{port}/upload            ║
║  POST  http://localhost:{port}/parse  (instant)        ║
║  POST  http://localhost:{port}/analyze (full AI)       ║
║  GET   http://localhost:{port}/health                  ║
╚══════════════════════════════════════════════════════╝
""")
    app.run(host="0.0.0.0", port=port, debug=debug)
