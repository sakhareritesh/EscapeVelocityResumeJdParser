<p align="center">
  <img src="https://img.icons8.com/3d-fluency/94/brain.png" width="80" alt="SkillMapr Logo"/>
</p>

<h1 align="center">SkillMapr</h1>
<h3 align="center">🚀 AI-Adaptive Learning & Career Intelligence Platform</h3>

<p align="center">
  <em>Parse resumes. Map skill gaps. Generate personalized learning roadmaps. Build stunning portfolios. All powered by AI.</em>
</p>

<p align="center">
  <a href="#-features"><img src="https://img.shields.io/badge/Features-12+-7c3aed?style=for-the-badge&logo=sparkles&logoColor=white" alt="Features"/></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Full_Stack-Next.js_+_Flask-000?style=for-the-badge&logo=vercel&logoColor=white" alt="Full Stack"/></a>
  <a href="#-quick-start"><img src="https://img.shields.io/badge/Quick_Start-5_min-22c55e?style=for-the-badge&logo=rocket&logoColor=white" alt="Quick Start"/></a>
  <a href="#license"><img src="https://img.shields.io/badge/License-Proprietary-ef4444?style=for-the-badge&logo=lock&logoColor=white" alt="License"/></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Flask-3.0-000?logo=flask&logoColor=white" alt="Flask"/>
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=black" alt="Firebase"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Razorpay-Payments-0C2451?logo=razorpay&logoColor=white" alt="Razorpay"/>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Frontend Routes](#-frontend-routes)
- [Deployment](#-deployment)
- [NPM Scripts](#-npm-scripts)
- [Contributing](#-contributing)
- [Team](#-team)
- [License](#license)

---

## 🧠 Overview

**SkillMapr** is a production-ready, full-stack AI platform that bridges the gap between a job seeker's current skill set and their dream role. It combines advanced document parsing, Google NLP analysis, personalized learning roadmap generation, and a portfolio builder into a single, seamless experience.

### The Problem

> Job seekers struggle to understand exactly which skills they lack for target roles and have no structured path to bridge those gaps efficiently.

### The Solution

SkillMapr automates the entire career development pipeline:

```
📄 Upload Resume + JD  →  🔍 AI Skill Extraction  →  🎯 Gap Analysis  →  🗺️ Personalized Roadmap  →  🎨 Portfolio Builder
```

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔬 Core Intelligence
| Feature | Description |
|---------|-------------|
| **📄 Smart Resume Parser** | NLP-powered extraction from PDF, DOCX & TXT with skill-level classification |
| **📋 JD Analysis Engine** | Automatically identifies required competencies, experience levels & technical requirements |
| **🎯 Dynamic Gap Mapping** | Precisely maps skill gaps between your profile and target role requirements |
| **🗺️ Learning Roadmap** | AI-generated, ordered learning paths with estimated hours, difficulty & resources |
| **📊 Dependency Graphs** | Visual skill dependency trees powered by NetworkX |
| **🤖 AI Career Coach** | Personalized career advice via  with contextual understanding |

</td>
<td width="50%">

### 🎨 Platform Features
| Feature | Description |
|---------|-------------|
| **🎨 Portfolio Builder** | 15+ professionally designed templates with AI-enhanced content |
| **💼 AI Job Matcher** | Intelligent matching between your profile and relevant opportunities |
| **📈 Career Path Explorer** | Browse and explore various career trajectories with skill requirements |
| **🎰 Gamification (Spin Wheel)** | Engagement mechanics to keep users motivated |
| **💳 Razorpay Payments** | Subscription plans (Free / Monthly / Yearly) with secure checkout |
| **🌗 Dark / Light Mode** | System theme detection with manual toggle |

</td>
</tr>
</table>

### 🔐 Authentication & Security
- **Firebase Authentication** — Google OAuth + Email/Password sign-in
- **Firebase Admin SDK** — Server-side token verification for all protected endpoints
- **Role-based access** — Free tier, Pro monthly, and Pro yearly plans with usage quotas

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Next.js 15 (App Router)                  │  │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────────────────┐ │  │
│  │  │ shadcn/ui│ │ Framer   │ │ Firebase Client SDK   │ │  │
│  │  │ + Radix  │ │ Motion   │ │ (Auth + Realtime DB)  │ │  │
│  │  └──────────┘ └──────────┘ └───────────────────────┘ │  │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────────────────┐ │  │
│  │  │ Recharts │ │ Razorpay │ │ GenKit (NLP)    │ │  │
│  │  └──────────┘ └──────────┘ └───────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
│                          │ REST API                         │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                   BACKEND (Flask 3.0)                       │
│                          │                                  │
│  ┌───────────┐ ┌─────────┴───────┐ ┌────────────────────┐  │
│  │ Parser    │ │ NLP Service  │ │ Roadmap Generator  │  │
│  │ (PDF/DOCX)│ │ (Skills + Gaps) │ │ (Learning Paths)   │  │
│  └───────────┘ └─────────────────┘ └────────────────────┘  │
│  ┌───────────┐ ┌─────────────────┐ ┌────────────────────┐  │
│  │ Firebase  │ │  NetworkX       │ │  User Routes       │  │
│  │ Admin SDK │ │  (Graphs)       │ │  (Sessions)        │  │
│  └───────────┘ └─────────────────┘ └────────────────────┘  │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │    MongoDB Atlas        │
              │  (Sessions, Analysis,   │
              │   User Data, Results)   │
              └─────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| **Next.js** | 15 | React framework with App Router & Turbopack |
| **React** | 18 | UI component library |
| **TypeScript** | 5 | Type-safe development |
| **Tailwind CSS** | 3 | Utility-first styling |
| **shadcn/ui + Radix** | Latest | Accessible component primitives |
| **Framer Motion** | 12 | Animations & page transitions |
| **Recharts** | 2.x | Data visualization & charts |
| **Firebase SDK** | 11 | Authentication & Realtime Database |
| **Razorpay** | 2.x | Payment gateway integration |

### Backend

| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| **Flask** | 3.0 | Lightweight Python web framework |
| **Gunicorn** | Latest | Production WSGI HTTP server |
| **MongoDB (PyMongo)** | 4.7 | Cloud database via Atlas |
| **Firebase Admin SDK** | 6.5 | Server-side auth token verification |
| **PyPDF2 + pdfplumber** | Latest | PDF text extraction |
| **python-docx** | 1.1 | DOCX text extraction |
| **NetworkX** | 3.3 | Skill dependency graph generation |

---

## 📁 Project Structure

```
SkillMapr/
│
├── 📂 src/                          # Next.js frontend source
│   ├── 📂 app/                      # App Router pages & API routes
│   │   ├── 📂 (dashboard)/          # Protected dashboard routes
│   │   │   ├── ai-coaching/         #   └── AI career coaching chat
│   │   │   ├── ai-matcher/          #   └── AI job matching
│   │   │   ├── career-paths/        #   └── Explore career paths
│   │   │   ├── create/              #   └── Portfolio builder
│   │   │   ├── learning-roadmap/    #   └── Generated roadmaps
│   │   │   ├── my-career-plan/      #   └── Personalized career plan
│   │   │   ├── skill-analysis/      #   └── Skill analysis results
│   │   │   ├── spin/                #   └── Gamification (spin wheel)
│   │   │   ├── upload-resume/       #   └── Resume & JD upload
│   │   │   └── profile/             #   └── User profile
│   │   ├── 📂 api/                  # Next.js API routes
│   │   ├── 📂 admin/                # Admin dashboard
│   │   ├── login/                   # Login page
│   │   ├── signup/                  # Signup page
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Landing / Dashboard page
│   ├── 📂 components/               # Reusable React components
│   │   ├── 📂 ui/                   # shadcn/ui primitives
│   │   ├── 📂 learning/             # Learning dashboard components
│   │   ├── chatbot.tsx              # AI chatbot widget
│   │   ├── portfolio-preview.tsx    # Portfolio live preview
│   │   └── portfolio-template.tsx   # Template engine
│   ├── 📂 context/                  # React context providers (Auth)
│   ├── 📂 hooks/                    # Custom React hooks
│   └── 📂 lib/                      # Utilities & API clients
│       ├── backend-api.ts           # Flask backend API client
│       ├── firebase.ts              # Firebase client config
│       └── utils.ts                 # Helper utilities
│
├── 📂 backend/                      # Flask backend
│   ├── app.py                       # Flask app factory
│   ├── wsgi.py                      # WSGI entry point (production)
│   ├── 📂 routes/
│   │   ├── analyze.py               # /parse, /analyze, /session endpoints
│   │   └── user.py                  # /user/* endpoints
│   ├── 📂 services/
│   │   ├── gi_service.py        
│   │   ├── parser.py                # Resume/JD text extraction
│   │   ├── roadmap.py               # Learning path generation
│   │   └── firebase_admin_service.py # Firebase Admin SDK
│   ├── 📂 db/
│   │   └── mongo.py                 # MongoDB connection manager
│   ├── requirements.txt             # Python dependencies
│   ├── Procfile                     # Render/Heroku process file
│   └── runtime.txt                  # Python version (3.11.x)
│
├── next.config.ts                   # Next.js configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── package.json                     # Node.js dependencies & scripts
├── tsconfig.json                    # TypeScript configuration
└── .env                             # Environment variables (not committed)
```

---

## ⚡ Quick Start

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 18.x | [nodejs.org](https://nodejs.org) |
| Python | 3.11.x | [python.org](https://python.org) |
| Git | Latest | [git-scm.com](https://git-scm.com) |
| MongoDB | Atlas (cloud) | [mongodb.com](https://mongodb.com) |

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sakhareritesh/EscapeVelocityResumeJdParser.git
cd EscapeVelocityResumeJdParser
```

### 2️⃣ Setup Environment Variables

Create a `.env` file in the project root (see [Environment Variables](#-environment-variables) section below).

### 3️⃣ Start Frontend

```bash
# Install dependencies
npm install

# Start Next.js dev server (with Turbopack ⚡)
npm run dev
```
> Frontend runs at → **http://localhost:3000**

### 4️⃣ Start Backend

```bash
# Navigate to backend
cd backend

# Create & activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start Flask dev server
python app.py
```
> Backend runs at → **http://localhost:5000**

### 5️⃣ Verify 🎉

| Service | URL | Check |
|---------|-----|-------|
| Frontend | http://localhost:3000 | Landing page loads |
| Backend Health | http://localhost:5000/health | `{"status": "ok"}` |
| Backend Upload UI | http://localhost:5000/upload | Test upload interface |

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
# ─── Backend (Flask) ───────────────────────────────────────
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/?appName=Cluster0
MONGO_DB_NAME=adaptive_onboarding
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000

# ─── Frontend → Backend Connection ────────────────────────
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# ─── Razorpay ─────────────────────────────────────────────
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# ─── Firebase Client SDK ──────────────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebasedatabase.app/

# ─── Firebase Admin SDK (choose one) ──────────────────────
# Option A: JSON string (recommended for cloud)
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
# Option B: File path (for local development)
FIREBASE_SERVICE_ACCOUNT_PATH=./backend/firebase-service-account.json
```

---

## 📡 API Reference

### Backend Endpoints (Flask — Port `5000`)

| Method | Endpoint | Description | Auth |
|:------:|----------|-------------|:----:|
| `GET` | `/` | API info & available endpoints | ❌ |
| `GET` | `/health` | Health check (includes DB status) | ❌ |
| `POST` | `/parse` | Extract text from uploaded PDF/DOCX/TXT | ❌ |
| `POST` | `/analyze` | Full AI analysis (skills, gaps, roadmap) | ❌ |
| `GET` | `/upload` | Test upload UI | ❌ |
| `GET` | `/session/<id>` | Retrieve a stored analysis session | ❌ |
| `GET` | `/sessions` | List recent sessions (last 20) | ❌ |
| `GET` | `/user/sessions` | Get all sessions for a Firebase user | 🔒 |
| `GET` | `/user/latest-session` | Get the latest session for a user | 🔒 |
| `GET` | `/user/session/<id>` | Get a specific user session | 🔒 |

<details>
<summary><b>📝 Example: Parse Documents</b></summary>

```bash
curl -X POST http://localhost:5000/parse \
  -F "resume_file=@resume.pdf" \
  -F "jd_file=@job_description.pdf"
```

**Response:**
```json
{
  "resume": {
    "status": "ok",
    "text": "John Doe — Software Engineer...",
    "char_count": 2450,
    "word_count": 412
  },
  "jd": {
    "status": "ok",
    "text": "We are looking for a Senior...",
    "char_count": 1890,
    "word_count": 320
  }
}
```
</details>

<details>
<summary><b>🚀 Example: Full AI Analysis</b></summary>

```bash
curl -X POST http://localhost:5000/analyze \
  -F "resume_text=John Doe, 3 years Python, React..." \
  -F "jd_text=Senior Full Stack Engineer, requires..."
```

**Response:**
```json
{
  "success": true,
  "session_id": "abc123",
  "resume_skills": [
    { "name": "Python", "level": "Advanced" },
    { "name": "React", "level": "Intermediate" }
  ],
  "skill_gap": [
    { "skill": "Kubernetes", "priority": "High" },
    { "skill": "System Design", "priority": "Medium" }
  ],
  "learning_path": [
    {
      "step": 1,
      "skill": "Docker Fundamentals",
      "estimated_hours": 15,
      "difficulty": "Beginner",
      "reason": "Foundation for Kubernetes"
    }
  ],
  "meta": {
    "match_percentage": 64,
    "total_gaps": 5,
    "total_learning_hours": 120,
    "total_learning_weeks": 8
  },
  "explanation": "Detailed AI coaching advice..."
}
```
</details>

---

## 🗺️ Frontend Routes

| Route | Description | Access |
|-------|-------------|:------:|
| `/` | Landing page (guests) / Dashboard (authenticated) | 🌐 |
| `/login` | Login page (Firebase Auth) | 🌐 |
| `/signup` | Sign up page | 🌐 |
| `/upload-resume` | Resume & JD upload page | 🔒 |
| `/skill-analysis` | Skill analysis results | 🔒 |
| `/learning-roadmap` | Generated learning roadmap | 🔒 |
| `/career-paths` | Browse career paths | 🔒 |
| `/my-career-plan` | Personalized career plan | 🔒 |
| `/ai-coaching` | AI coaching chat | 🔒 |
| `/ai-matcher` | AI job matcher | 🔒 |
| `/profile` | User profile & settings | 🔒 |
| `/create` | Portfolio / resume builder | 🔒 |
| `/spin` | Spin wheel (gamification) | 🔒 |
| `/admin/recruitment` | Admin recruitment dashboard | 🔒 |

> 🌐 = Public &nbsp; | &nbsp; 🔒 = Requires Authentication

---

## 🚀 Deployment

### Recommended Stack: **Vercel + Render**

<table>
<tr>
<td width="50%">

#### 🔵 Frontend → Vercel

1. Push to GitHub (ensure `.env` is in `.gitignore`)
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Framework: **Next.js** (auto-detected)
4. Add all `NEXT_PUBLIC_*` environment variables
5. Deploy — Vercel auto-builds and serves

</td>
<td width="50%">

#### 🟣 Backend → Render

1. Push to GitHub (the `backend/` directory)
2. Create a Web Service at [render.com](https://dashboard.render.com/new)
3. **Root Directory:** `backend`
4. **Build:** `pip install -r requirements.txt`
5. **Start:** `gunicorn -w 2 -k gthread --threads 4 --bind 0.0.0.0:$PORT --timeout 120 wsgi:app`
6. Add backend environment variables

</td>
</tr>
</table>

### 🔗 Post-Deployment Checklist

- [ ] Update `NEXT_PUBLIC_BACKEND_URL` in Vercel → your Render backend URL
- [ ] Restrict CORS origins in `backend/app.py` to your Vercel domain
- [ ] Add Vercel domain to Firebase Auth → Authorized Domains
- [ ] Add Vercel domain to Razorpay Dashboard → Allowed Origins
- [ ] Verify `/health` endpoint on Render
- [ ] Test full flow: Upload → Parse → Analyze → View Results

### Alternative Platforms

| Platform | Frontend | Backend | Notes |
|----------|:--------:|:-------:|-------|
| **Vercel + Render** | ✅ | ✅ | Recommended combo |
| **Railway** | ✅ | ✅ | Single platform for both |
| **Firebase Hosting** | ✅ | ❌ | Frontend only |
| **Heroku** | ✅ | ✅ | Uses included `Procfile` |
| **AWS (EC2/ECS)** | ✅ | ✅ | Full control, more setup |
| **DigitalOcean** | ✅ | ✅ | Simple PaaS |

---

## 📦 NPM Scripts

```bash
npm run dev            # Start dev server with Turbopack ⚡
npm run build          # Production build
npm run start          # Start production server
npm run lint           # Run ESLint
npm run typecheck      # TypeScript type checking
npm run genkit:dev     # Start GenKit AI dev server
npm run genkit:watch   # Start GenKit AI with file watching
```

---

## 🏗️ Build & Production

### Frontend

```bash
npm run typecheck      # Type-check (recommended)
npm run lint           # Lint check
npm run build          # Production build
npm run start          # Start production server → http://localhost:3000
```

### Backend

```bash
cd backend
pip install -r requirements.txt

# Linux / macOS
gunicorn -w 2 -k gthread --threads 4 --bind 0.0.0.0:5000 --timeout 120 wsgi:app

# Windows (Gunicorn not supported)
pip install waitress
waitress-serve --port=5000 wsgi:app
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. Open a **Pull Request**

---

## 👥 Team

Built with ❤️ by **Team Escape Velocity**

| Member | Role |
|--------|------|
| **Ritesh Sakhare** | Feature Ideation, Architecture & Database |
| **Vedant Deore** | Frontend, Map System, Routing & AI Copilot |
| **Samyak Raka** | UI Design & Development |
| **Satyajit Shinde** | 3D Packing System (Three.js) |

---

## License

This project is **private and proprietary**. All rights reserved.

---

<p align="center">
  <sub>
    Made with 🧠 + ☕ by <b>Team Escape Velocity</b>
  </sub>
</p>

<p align="center">
  <a href="#skillmapr">⬆️ Back to Top</a>
</p>
