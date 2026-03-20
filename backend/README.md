# 🧠 AI Adaptive Onboarding Engine — Backend

A production-ready Flask backend that uses **Gemini LLM** to analyze resumes against
job descriptions, identify skill gaps, and generate personalized learning roadmaps.

---

## 🗂 Project Structure

```
backend/
├── app.py                  # Flask app factory + entry point
├── routes/
│   └── analyze.py          # POST /analyze, GET /session/<id>, GET /sessions
├── services/
│   ├── gemini_service.py   # Gemini API wrapper with retry logic
│   ├── parser.py           # Resume & JD parsing + skill gap calculation
│   └── roadmap.py          # Learning path & explanation generation
├── db/
│   └── mongo.py            # MongoDB singleton connection
├── utils/
│   └── file_handler.py     # PDF / DOCX / TXT text extraction
├── .env                    # 🔑 API keys (never commit this)
├── requirements.txt
└── README.md
```

---

## ⚙️ Setup

### 1. Clone & create virtualenv
```bash
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure `.env`
```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGO_URI=your_mongodb_connection_string_here
MONGO_DB_NAME=adaptive_onboarding
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000
```

> **MongoDB URI examples:**
> - Local:  `mongodb://localhost:27017`
> - Atlas:  `mongodb+srv://<user>:<pass>@cluster.mongodb.net/?retryWrites=true&w=majority`

### 4. Run
```bash
python app.py
```

---

## 🔌 API Reference

### `POST /analyze`

Analyze a resume against a job description.

**Input** — `multipart/form-data` or `application/x-www-form-urlencoded`:

| Field         | Type           | Description                              |
|---------------|----------------|------------------------------------------|
| `resume_text` | string         | Plain-text resume (alternative to file)  |
| `resume_file` | file upload    | PDF / DOCX / TXT resume file             |
| `jd_text`     | string         | Plain-text job description               |
| `jd_file`     | file upload    | PDF / DOCX / TXT job description file    |

> Either `*_text` or `*_file` must be provided for each. File takes priority.

**Response** `200 OK`:
```json
{
  "success": true,
  "session_id": "664f1a2b3c4d5e6f7a8b9c0d",
  "resume_skills": [
    {"name": "Python", "level": "Advanced"},
    {"name": "SQL",    "level": "Intermediate"}
  ],
  "jd_skills": [
    {"name": "React",  "level": "Required"},
    {"name": "Docker", "level": "Optional"}
  ],
  "skill_gap": ["React", "Node.js"],
  "learning_path": [
    {"step": 1, "skill": "JavaScript Fundamentals", "reason": "Prerequisite for React"},
    {"step": 2, "skill": "React",                   "reason": "Required for the role"}
  ],
  "explanation": "Based on your strong Python background...",
  "meta": {
    "total_resume_skills": 8,
    "total_required_skills": 5,
    "total_optional_skills": 2,
    "total_gaps": 2,
    "total_learning_steps": 3
  }
}
```

---

### `GET /session/<session_id>`

Retrieve a stored analysis session by ID.

```json
{
  "success": true,
  "session": { ...full session document... }
}
```

---

### `GET /sessions`

List the 20 most recent sessions (without heavy text fields).

---

### `GET /health`

```json
{
  "status": "ok",
  "service": "AI Adaptive Onboarding Engine",
  "version": "1.0.0",
  "database": "connected"
}
```

---

## 🧪 Quick Test (curl)

```bash
# Text input
curl -X POST http://localhost:5000/analyze \
  -F "resume_text=Experienced Python developer with 4 years building REST APIs using Flask and Django. Proficient in PostgreSQL, Redis, and Docker. BS Computer Science." \
  -F "jd_text=We are looking for a Full Stack Engineer with React, Node.js, TypeScript, and Python. Docker and AWS experience required."

# File upload
curl -X POST http://localhost:5000/analyze \
  -F "resume_file=@/path/to/resume.pdf" \
  -F "jd_file=@/path/to/job_description.txt"
```

---

## 🏗 Next.js Integration

```javascript
// pages/api/analyze.js or a client fetch
const formData = new FormData();
formData.append("resume_text", resumeText);
formData.append("jd_text", jdText);

const res = await fetch("http://localhost:5000/analyze", {
  method: "POST",
  body: formData,
});
const data = await res.json();
// data.skill_gap, data.learning_path, data.resume_skills, etc.
```

---

## 🗄 MongoDB Schema

Collection: **sessions**

```
_id          ObjectId    Auto-generated
created_at   ISODate     UTC timestamp
resume_text  string      Raw resume input
jd_text      string      Raw JD input
resume_skills  array     [{name, level}]
jd_skills      array     [{name, level:"Required"|"Optional"}]
skill_gap      array     [string]  — missing required skills
learning_path  array     [{step, skill, reason}]
explanation    string    AI-generated narrative
```

---

## ⚠️ Error Handling

All errors return:
```json
{"success": false, "error": "Human-readable error message"}
```

| Status | Meaning                                   |
|--------|-------------------------------------------|
| 400    | Bad input (missing fields, bad file type) |
| 404    | Session not found                         |
| 413    | File too large (>16 MB)                   |
| 500    | Gemini API or server error                |
