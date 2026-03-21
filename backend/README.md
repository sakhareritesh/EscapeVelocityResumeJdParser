# 🧠 AI Adaptive Onboarding Engine - Backend

A production-ready Flask backend that uses **Gemini 2.5 Flash** to analyze candidate resumes against job descriptions, identify skill gaps, and generate **Graph-Based Personalized Learning Roadmaps**.

This repository was built to solve the challenge of static, "one-size-fits-all" corporate onboarding by dynamically mapping optimal, personalized training pathways based on a candidate's existing baseline.

---

## ✨ Key Features & Architecture

### 1. 📄 Multi-Strategy Intelligent Document Parsing

Traditional parsing (like PyPDF2) easily breaks on multi-column or scanned resumes. We built a robust 3-tier cascade extraction strategy:

- **Strategy 1 (pdfplumber)**: Excellent for complex, multi-column layouts and tables.
- **Strategy 2 (PyPDF2)**: Reliable fallback for simple, single-column text PDFs.
- **Strategy 3 (Gemini Multimodal)**: A nuclear fallback that passes raw PDF bytes to Gemini for native OCR and visual extraction of scanned or image-heavy documents.

### 2. 🧬 O\*NET-Inspired Skill Taxonomy & Extraction

Instead of raw keyword matching, skills are extracted into rich JSON objects with:

- Standardized categorization into 15+ domains (e.g., `programming_languages`, `cloud_services`).
- Inferred **Years of Experience** and **Project Context**.
- Fuzzy-logic alias matching (e.g., `JS` → `JavaScript`, `k8s` → `Kubernetes`).

### 3. 🗺️ Graph-Based Adaptive Pathing (The Algorithm)

Using **NetworkX**, the engine builds a Directed Acyclic Graph (DAG) for the learning path:

1.  **Dependency Mapping**: Automatically injects missing prerequisites (e.g., you can't learn Docker without basic Linux).
2.  **Topological Sort**: Prioritizes foundational skills first, ensuring candidates learn in a logical, impossible-to-fail order.
3.  **Adaptive Weighting**: Estimates learning hours, natively reducing projected time by 40% if the candidate possesses a highly related skill.

---

## 🗂 Project Structure

```text
backend/
├── app.py                  # Flask application factory & entry point
├── routes/
│   └── analyze.py          # Core endpoints: POST /analyze, GET /sessions
├── services/
│   ├── gemini_service.py   # Gemini LLM initialization, config, and retry logic
│   ├── parser.py           # Resume & JD parsing, O*NET taxonomy, Gap calculation
│   └── roadmap.py          # NetworkX Graph algorithm & learning path generation
├── db/
│   └── mongo.py            # MongoDB singleton connection
├── utils/
│   └── file_handler.py     # 3-tier PDF / DOCX / TXT strategy text extraction
├── .env.example            # Environment variables template
├── requirements.txt        # Python dependencies
├── run_analysis.py         # CLI script to test APIs locally with test files
├── test_api.py             # Comprehensive test suite mapping all endpoints
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone & create virtualenv

```bash
python3 -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure `.env`

Create a `.env` file in the root based on `.env.example`:

```env
# Get an API key from https://aistudio.google.com
GEMINI_API_KEY=your_gemini_api_key_here

# Recommended for demo/high limits: gemini-2.0-flash or gemini-2.5-flash-lite
GEMINI_MODEL=gemini-2.0-flash

MONGO_URI=your_mongodb_connection_string_here
MONGO_DB_NAME=adaptive_onboarding
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000
```

### 4. Run the API Server

```bash
python app.py
```

### 5. Run the Test Suite

The testing script validates the graph-building algorithm, metadata extraction, endpoint schemas, and DB saving:

```bash
python test_api.py
```

---

## 🔌 API Reference

### `GET /upload`

Serves a responsive, dark-themed HTML UI for testing the flow directly in the browser. Features a 2-step workflow:

1. Upload & Parse (instant text extraction).
2. Review & Analyze (run full Gemini AI pipeline).

---

### `POST /parse`

Instantly extracts raw text from Resume and JD files (PDF/DOCX/TXT) using our 3-tier OCR strategy. **Does not hit the AI / LLM.**

**Input** (`multipart/form-data`):

- `resume_file`: Candidate resume document
- `jd_file`: Job description document

**Response** (`200 OK`):

```json
{
  "resume": {
    "status": "ok",
    "text": "Parsed text...",
    "char_count": 3498,
    "word_count": 520
  },
  "jd": {
    "status": "ok",
    "text": "Parsed text...",
    "char_count": 2149,
    "word_count": 310
  }
}
```

---

### `POST /analyze`

Analyzes a resume against a job description, calculates skill gaps, and generates a rich adaptive learning DAG path using Gemini LLM.

**Input** (`multipart/form-data`):

- `resume_file` / `resume_text`: PDF/DOCX/TXT file OR raw string
- `jd_file` / `jd_text`: PDF/DOCX/TXT file OR raw string

**Response** (`200 OK`):

```json
{
  "success": true,
  "session_id": "69bd...c129",
  "role_info": {
    "title": "Full Stack Engineer",
    "seniority": "Mid-Senior",
    "domain": "SaaS/Web Development"
  },
  "resume_skills": [
    {
       "name": "Python",
       "level": "Advanced",
       "category": "programming_languages",
       "years_experience": 4,
       "context": "Built REST APIs"
    }
  ],
  "jd_skills": [ ... ],
  "skill_gap": [
    {
       "skill": "React",
       "priority": "high",
       "category": "frontend_frameworks",
       "candidate_has_related": ["JavaScript"]
    }
  ],
  "learning_path": [
    {
      "step": 1,
      "skill": "JavaScript",
      "reason": "Core prerequisite for React...",
      "estimated_hours": 30,
      "difficulty": "Medium",
      "prerequisites_met": ["Python"],
      "resources": [{"name": "MDN JS", "url": "https://developer.mozilla.org/..."}],
      "milestones": ["Build a CLI tool using Node.js"],
      "project_idea": "Build a weather dashboard CLI",
      "cumulative_hours": 30,
      "category": "programming_languages"
    }
  ],
  "dependency_graph": {
    "nodes": [{"id": "JavaScript", "group": "programming_languages", "estimated_hours": 30}],
    "edges": [{"source": "JavaScript", "target": "React"}],
    "stats": {"total_nodes": 2, "total_edges": 1, "total_hours": 80}
  },
  "explanation": "Welcome aboard! Looking at your profile, it's clear...",
  "meta": {
    "match_percentage": 75.0,
    "total_gaps": 2,
    "total_learning_hours": 80,
    "total_learning_weeks": 4
  }
}
```

---

### `GET /sessions`

List the 20 most recent sessions (excludes heavy blobs like raw resume text or large DAG arrays for lightning-fast frontend loading).

---

### `GET /session/<session_id>`

Retrieve a previously generated session containing the full dependency graph and learning path.

---

### `GET /health`

Returns the status of the API and verifies connectivity with MongoDB.

**Response** (`200 OK`):

```json
{
  "database": "connected",
  "service": "AI Adaptive Onboarding Engine",
  "status": "ok",
  "version": "1.0.0"
}
```

---

## 🗄 MongoDB Schema (`sessions` collection)

```text
_id               ObjectId    Auto-generated
created_at        ISODate     UTC timestamp
resume_text       string      Raw text extracted from input
jd_text           string      Raw text extracted from JD
role_title        string      Extracted role
resume_skills     array       Objects with category & years_experience
jd_skills         array       Required vs Optional
skill_gap         array       Missing skills with related baseline
learning_path     array       Rich steps with resources and time
dependency_graph  object      Nodes and edges array for UI
explanation       string      GenAI coaching narrative
stats             object      Match % and Hour/Week estimates
```

---

## ⚠️ Error Handling

All errors return JSON in standard format: `{"success": false, "error": "Human-readable error"}`

- **400**: Bad input (missing fields, un-extractable file bytes).
- **404**: Endpoint/Session not found.
- **413**: File too large (>10 MB).
- **500**: Gemini API exhaustion or timeout.
