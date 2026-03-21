# 🧠 SkillMapr — AI-Adaptive Learning Platform

> Parse resumes, identify skill gaps, generate personalized learning pathways, and build stunning portfolios — all powered by AI.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Flask](https://img.shields.io/badge/Flask-3.0-blue?logo=flask)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Firebase](https://img.shields.io/badge/Firebase-Auth-orange?logo=firebase)
![Gemini](https://img.shields.io/badge/Google-Gemini-purple?logo=google)

---

## 📑 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Build & Production](#build--production)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [License](#license)

---

## Overview

**SkillMapr** is a full-stack AI-powered platform that:

- 📄 **Parses resumes & job descriptions** (PDF, DOCX, TXT)
- 🔍 **Identifies skill gaps** between a candidate and a job role
- 🗺️ **Generates personalized learning roadmaps** with estimated hours, difficulty, and resources
- 📊 **Visualizes dependency graphs** of skills to learn
- 🎯 **AI Coaching** with tailored career advice via Google Gemini
- 🔐 **Authentication** via Firebase (Google, Email/Password)
- 💳 **Razorpay** payment integration
- 🌗 **Dark/Light mode** with system theme detection

---

## Tech Stack

### Frontend (Next.js)

| Technology       | Purpose                          |
| ---------------- | -------------------------------- |
| Next.js 15       | React framework (App Router)     |
| TypeScript       | Type-safe development            |
| Tailwind CSS 3   | Utility-first styling            |
| shadcn/ui        | Radix-based component library    |
| Framer Motion    | Animations & transitions         |
| Firebase SDK     | Authentication & Realtime DB     |
| Recharts         | Data visualization / charts      |
| Razorpay         | Payment gateway                  |
| GenKit           | Gemini AI integration            |

### Backend (Flask)

| Technology         | Purpose                        |
| ------------------ | ------------------------------ |
| Flask 3.0          | Python web framework           |
| Gunicorn           | Production WSGI server         |
| MongoDB (PyMongo)  | Database (Atlas cloud)         |
| Google Generative AI | Gemini API for analysis      |
| Firebase Admin SDK | Server-side token verification |
| PyPDF2 / pdfplumber | PDF text extraction           |
| python-docx        | DOCX text extraction           |
| NetworkX           | Dependency graph generation    |

---

## Project Structure

```
EscapeVelocityResumeJdParser/
├── src/                        # Next.js frontend source
│   ├── app/                    # App Router pages & API routes
│   │   ├── (dashboard)/        # Dashboard group routes
│   │   ├── api/                # Next.js API routes
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   ├── user/               # User profile pages
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   ├── components/             # React components (52 files)
│   ├── context/                # React context providers
│   ├── hooks/                  # Custom React hooks
│   └── lib/                    # Utilities & API client
│       ├── backend-api.ts      # Flask backend API client
│       ├── firebase.ts         # Firebase client config
│       └── utils.ts            # Helper utilities
│
├── backend/                    # Flask backend
│   ├── app.py                  # Flask app factory
│   ├── wsgi.py                 # WSGI entry point (production)
│   ├── routes/
│   │   ├── analyze.py          # /parse, /analyze, /session endpoints
│   │   └── user.py             # /user/* endpoints
│   ├── services/
│   │   ├── gemini_service.py   # Google Gemini AI integration
│   │   ├── parser.py           # Resume/JD text extraction
│   │   ├── roadmap.py          # Learning path generation
│   │   └── firebase_admin_service.py  # Firebase Admin SDK
│   ├── db/
│   │   └── mongo.py            # MongoDB connection manager
│   ├── requirements.txt        # Python dependencies
│   ├── Procfile                # Render/Heroku process file
│   ├── build.sh                # Render build script
│   ├── runtime.txt             # Python version (3.11.9)
│   └── .env.example            # Backend env template
│
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── package.json                # Node.js dependencies & scripts
├── tsconfig.json               # TypeScript configuration
└── .env                        # Environment variables (not committed)
```

---

## Prerequisites

| Tool     | Version   | Install Link                                |
| -------- | --------- | ------------------------------------------- |
| Node.js  | ≥ 18.x    | https://nodejs.org                          |
| npm      | ≥ 9.x     | Bundled with Node.js                        |
| Python   | 3.11.x    | https://python.org                          |
| pip      | Latest    | Bundled with Python                         |
| Git      | Latest    | https://git-scm.com                         |
| MongoDB  | Atlas (cloud) or local | https://mongodb.com              |

---

## Environment Variables

### Root `.env` (for both frontend & backend)

Create a `.env` file in the project root:

```env
# ─── Backend (Flask) ───────────────────────────────────────
GEMINI_API_KEY=your_gemini_api_key
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

# ─── Vercel (optional, for CI/CD) ─────────────────────────
VERCEL_TOKEN=your_vercel_token

# ─── Firebase Client SDK ──────────────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebasedatabase.app/

# ─── Firebase Admin (Backend, choose one method) ──────────
# Option A: JSON string (recommended for cloud deployment)
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
# Option B: File path (for local development)
FIREBASE_SERVICE_ACCOUNT_PATH=./backend/firebase-service-account.json
```

---

## Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/sakhareritesh/EscapeVelocityResumeJdParser.git
cd EscapeVelocityResumeJdParser
```

### 2. Setup Frontend

```bash
# Install Node.js dependencies
npm install

# Start Next.js dev server (with Turbopack)
npm run dev
```

Frontend runs at: **http://localhost:3000**

### 3. Setup Backend

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

Backend runs at: **http://localhost:5000**

### 4. Verify Both Are Running

- Frontend: http://localhost:3000
- Backend Health: http://localhost:5000/health
- Backend Upload UI: http://localhost:5000/upload

---

## Build & Production

### Frontend Build

```bash
# Type-check (optional but recommended)
npm run typecheck

# Lint check (optional)
npm run lint

# Production build
npm run build

# Start production server
npm run start
```

The production server runs at **http://localhost:3000** by default.

### Backend Production

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run with Gunicorn (Linux/macOS)
gunicorn -w 2 -k gthread --threads 4 --bind 0.0.0.0:5000 --timeout 120 wsgi:app
```

> **Note:** Gunicorn does not run on Windows. For Windows production, use `waitress`:
> ```bash
> pip install waitress
> waitress-serve --port=5000 wsgi:app
> ```

---

## Deployment

### 🚀 Frontend → Vercel (Recommended)

1. **Push to GitHub** (ensure `.env` is in `.gitignore`)

2. **Import project in Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repo
   - Framework: **Next.js** (auto-detected)

3. **Set Environment Variables** in Vercel Dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=...
   NEXT_PUBLIC_RAZORPAY_KEY_ID=...
   RAZORPAY_KEY_ID=...
   RAZORPAY_KEY_SECRET=...
   GEMINI_API_KEY=...
   ```

4. **Deploy** — Vercel auto-builds with `npm run build` and serves the app.

### 🚀 Backend → Render (Recommended)

1. **Push to GitHub** (the `backend/` directory)

2. **Create a new Web Service on Render:**
   - Go to [render.com/new](https://dashboard.render.com/new)
   - Connect your GitHub repo
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn -w 2 -k gthread --threads 4 --bind 0.0.0.0:$PORT --timeout 120 wsgi:app`

3. **Set Environment Variables** in Render Dashboard:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   MONGO_URI=mongodb+srv://...
   MONGO_DB_NAME=adaptive_onboarding
   FLASK_ENV=production
   FLASK_DEBUG=False
   FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
   ```

4. **Deploy** — Render auto-builds and starts the service.

### 🔗 Post-Deployment Checklist

- [ ] Update `NEXT_PUBLIC_BACKEND_URL` in Vercel to point to your Render backend URL
- [ ] Update CORS origins in `backend/app.py` to restrict to your Vercel domain (replace `"*"` with your domain)
- [ ] Add your Vercel domain to Firebase Auth → Authorized Domains
- [ ] Add your Vercel domain to Razorpay Dashboard → Allowed Origins
- [ ] Test the `/health` endpoint on Render to verify MongoDB connection
- [ ] Test the full flow: Upload → Parse → Analyze → View Results

### Alternative Deployment Platforms

| Platform           | Frontend | Backend | Notes                              |
| ------------------ | -------- | ------- | ---------------------------------- |
| **Vercel + Render** | ✅       | ✅      | Recommended combo                  |
| **Railway**         | ✅       | ✅      | Single platform for both           |
| **Firebase Hosting** | ✅      | ❌      | Frontend only (`apphosting.yaml`)  |
| **Heroku**          | ✅       | ✅      | Uses `Procfile`                    |
| **AWS (EC2/ECS)**   | ✅       | ✅      | Full control, more setup           |
| **DigitalOcean App Platform** | ✅ | ✅  | Simple PaaS                        |

---

## API Endpoints

### Backend API (Flask — Port 5000)

| Method | Endpoint               | Description                              |
| ------ | ---------------------- | ---------------------------------------- |
| `GET`  | `/`                    | API info & available endpoints           |
| `GET`  | `/health`              | Health check (includes DB status)        |
| `POST` | `/parse`               | Extract text from uploaded PDF/DOCX/TXT  |
| `POST` | `/analyze`             | Full AI analysis (skills, gaps, roadmap) |
| `GET`  | `/upload`              | Test upload UI                           |
| `GET`  | `/session/<id>`        | Retrieve a stored analysis session       |
| `GET`  | `/sessions`            | List recent sessions (last 20)           |
| `GET`  | `/user/sessions`       | Get all sessions for a Firebase user     |
| `GET`  | `/user/latest-session` | Get the latest session for a user        |
| `GET`  | `/user/session/<id>`   | Get a specific user session              |

### Frontend Pages (Next.js — Port 3000)

| Route                 | Description                          |
| --------------------- | ------------------------------------ |
| `/`                   | Landing page                         |
| `/login`              | Login page (Firebase Auth)           |
| `/signup`             | Sign up page                         |
| `/dashboard`          | Main dashboard                       |
| `/upload-resume`      | Resume & JD upload page              |
| `/skill-analysis`     | Skill analysis results               |
| `/learning-roadmap`   | Generated learning roadmap           |
| `/career-paths`       | Browse career paths                  |
| `/my-career-plan`     | Personalized career plan             |
| `/ai-coaching`        | AI coaching chat                     |
| `/ai-matcher`         | AI job matcher                       |
| `/profile`            | User profile                         |
| `/create`             | Portfolio / resume builder           |
| `/spin`               | Spin wheel (gamification)            |
| `/admin/recruitment`  | Admin recruitment dashboard          |

---

## NPM Scripts Reference

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run genkit:dev   # Start GenKit AI dev server
npm run genkit:watch # Start GenKit AI with file watching
```

---

## License

This project is private and proprietary. All rights reserved.
