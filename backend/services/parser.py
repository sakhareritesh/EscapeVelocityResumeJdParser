"""
services/parser.py - Resume and Job Description parsing via Gemini

Enhanced with:
  - Structured skill extraction (categories, years, project context)
  - O*NET-aligned skill taxonomy for standardization
  - Fuzzy matching for skill gap calculation
  - Confidence scoring
"""

from .gemini_service import generate_response


# ── O*NET-Inspired Skill Taxonomy ───────────────────────────────────────────────
# Used to normalize and categorize extracted skills

SKILL_TAXONOMY = {
    "programming_languages": [
        "python", "javascript", "typescript", "java", "c++", "c#", "c",
        "go", "golang", "rust", "ruby", "php", "swift", "kotlin", "scala",
        "r", "matlab", "perl", "lua", "dart", "elixir", "haskell",
        "objective-c", "assembly", "sql", "html", "css", "sass", "less",
    ],
    "frontend_frameworks": [
        "react", "angular", "vue", "vue.js", "svelte", "next.js", "nextjs",
        "nuxt", "nuxt.js", "gatsby", "remix", "ember", "backbone",
        "jquery", "bootstrap", "tailwind", "tailwindcss", "material ui",
        "chakra ui", "ant design", "storybook",
    ],
    "backend_frameworks": [
        "node.js", "nodejs", "express", "express.js", "django", "flask",
        "fastapi", "spring", "spring boot", ".net", "asp.net", "rails",
        "ruby on rails", "laravel", "nestjs", "koa", "hapi", "gin",
        "fiber", "actix", "rocket",
    ],
    "databases": [
        "postgresql", "postgres", "mysql", "mongodb", "redis", "sqlite",
        "oracle", "sql server", "dynamodb", "cassandra", "couchdb",
        "neo4j", "elasticsearch", "firebase", "firestore", "supabase",
        "cockroachdb", "mariadb", "memcached", "influxdb",
    ],
    "cloud_platforms": [
        "aws", "amazon web services", "gcp", "google cloud", "azure",
        "microsoft azure", "heroku", "vercel", "netlify", "digitalocean",
        "cloudflare", "fly.io", "railway",
    ],
    "cloud_services": [
        "ec2", "s3", "lambda", "rds", "sqs", "sns", "cloudfront",
        "ecs", "eks", "fargate", "cloudwatch", "iam", "api gateway",
        "cloud functions", "cloud run", "bigquery", "cloud storage",
        "azure functions", "azure devops", "cosmos db",
    ],
    "devops_tools": [
        "docker", "kubernetes", "k8s", "terraform", "ansible", "jenkins",
        "github actions", "gitlab ci", "circleci", "travis ci",
        "prometheus", "grafana", "datadog", "new relic", "nginx",
        "apache", "helm", "argocd", "pulumi", "vagrant",
    ],
    "data_ml": [
        "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch",
        "keras", "opencv", "spark", "hadoop", "airflow", "dbt",
        "tableau", "power bi", "matplotlib", "seaborn", "plotly",
        "hugging face", "langchain", "llm", "nlp", "computer vision",
        "deep learning", "machine learning", "data science",
    ],
    "testing": [
        "pytest", "jest", "mocha", "cypress", "selenium", "playwright",
        "junit", "testng", "rspec", "unittest", "vitest", "testing library",
        "enzyme", "supertest", "postman",
    ],
    "version_control": [
        "git", "github", "gitlab", "bitbucket", "svn", "mercurial",
    ],
    "methodologies": [
        "agile", "scrum", "kanban", "tdd", "bdd", "ci/cd",
        "devops", "microservices", "serverless", "rest", "restful",
        "graphql", "grpc", "websocket", "event-driven", "domain-driven design",
    ],
    "mobile": [
        "react native", "flutter", "swift", "swiftui", "kotlin",
        "android", "ios", "expo", "ionic", "xamarin",
    ],
    "security": [
        "oauth", "jwt", "ssl/tls", "owasp", "penetration testing",
        "encryption", "authentication", "authorization", "rbac",
        "sso", "saml", "openid connect",
    ],
}


def _normalize_skill_name(name: str) -> str:
    """Normalize a skill name for comparison."""
    return name.lower().strip().replace("-", " ").replace("_", " ")


def _categorize_skill(skill_name: str) -> str:
    """Find the category a skill belongs to using the taxonomy."""
    normalized = _normalize_skill_name(skill_name)
    for category, skills in SKILL_TAXONOMY.items():
        if normalized in skills:
            return category
    return "other"


# ── Resume Parser ───────────────────────────────────────────────────────────────

def parse_resume(resume_text: str) -> list[dict]:
    """
    Extract technical skills and proficiency levels from a resume.

    Returns:
        List of dicts with rich skill metadata:
        [
            {
                "name": "Python",
                "level": "Advanced",
                "category": "programming_languages",
                "years_experience": 4,
                "context": "Built REST APIs, data pipelines"
            },
            ...
        ]
    """
    if not resume_text or not resume_text.strip():
        raise ValueError("Resume text is empty.")

    prompt = f"""You are an expert technical recruiter and skills analyst with deep 
knowledge of software engineering, data science, DevOps, and IT roles.

Carefully analyze the following resume and extract ALL technical skills mentioned,
including programming languages, frameworks, libraries, tools, platforms, databases,
methodologies, cloud services, and domain expertise.

For each skill, provide:
1. "name" — the industry-standard name (e.g., "React" not "ReactJS")
2. "level" — proficiency based on context clues:
   - "Beginner": mentioned once, no project context, coursework only
   - "Intermediate": used in 1-2 projects, 1-3 years implied  
   - "Advanced": led projects involving this, 3-5 years, solid expertise
   - "Expert": primary technology, 5+ years, extensive leadership/contributions
3. "years_experience" — estimated years of experience (integer, 0 if unclear)
4. "context" — brief note on HOW they used it (max 15 words)

IMPORTANT RULES:
- Extract skills from ALL sections: experience, education, projects, certifications
- Include soft skills only if they are technical (e.g., "System Design", "Technical Writing")
- Standardize names (e.g., "JS" → "JavaScript", "k8s" → "Kubernetes")
- Do NOT duplicate skills — merge if mentioned multiple times
- Be thorough — a typical experienced developer resume should yield 15-30+ skills

Return ONLY a valid JSON object with this exact structure (no markdown):
{{
  "skills": [
    {{
      "name": "Python",
      "level": "Advanced",
      "years_experience": 4,
      "context": "Built REST APIs with Flask and FastAPI"
    }},
    {{
      "name": "React",
      "level": "Intermediate",
      "years_experience": 2,
      "context": "Developed SPAs for internal tools"
    }}
  ],
  "summary": {{
    "total_years_experience": 6,
    "strongest_domain": "Backend Development",
    "experience_level": "Mid-Senior"
  }}
}}

Resume:
\"\"\"
{resume_text}
\"\"\"
"""
    result = generate_response(prompt)

    # Validate and extract
    if isinstance(result, dict) and "skills" in result:
        skills = result["skills"]
        validated = []
        seen_names = set()

        for s in skills:
            if not isinstance(s, dict) or "name" not in s:
                continue

            name = str(s.get("name", "")).strip()
            if not name or name.lower() in seen_names:
                continue
            seen_names.add(name.lower())

            category = _categorize_skill(name)

            validated.append({
                "name": name,
                "level": str(s.get("level", "Unknown")).strip(),
                "category": category,
                "years_experience": int(s.get("years_experience", 0)),
                "context": str(s.get("context", "")).strip(),
            })

        # Attach the summary if present
        summary = result.get("summary", {})

        return validated

    raise ValueError(f"Unexpected resume parse result shape: {result}")


def get_resume_summary(resume_text: str) -> dict:
    """
    Extract a high-level summary from the resume (separate from skills).
    Used for the explanation and profile overview.
    """
    prompt = f"""Analyze this resume and provide a brief profile summary.

Return ONLY a valid JSON object:
{{
    "candidate_name": "John Doe",
    "total_years_experience": 5,
    "strongest_domain": "Backend Development",
    "experience_level": "Mid-Senior",
    "education_level": "Bachelor's in CS",
    "key_strengths": ["API design", "Python ecosystem", "Database optimization"]
}}

Resume:
\"\"\"
{resume_text}
\"\"\"
"""
    try:
        return generate_response(prompt)
    except Exception:
        return {}


# ── Job Description Parser ──────────────────────────────────────────────────────

def parse_job_description(jd_text: str) -> dict:
    """
    Extract required and optional skills from a job description with
    additional metadata for better matching.

    Returns:
        Dict: {
            "role_title": "...",
            "seniority_level": "...",
            "required_skills": [...],
            "optional_skills": [...],
            "domain": "..."
        }
    """
    if not jd_text or not jd_text.strip():
        raise ValueError("Job description text is empty.")

    prompt = f"""You are an expert technical recruiter and job market analyst.

Carefully analyze the following job description and extract:
1. REQUIRED skills — explicitly stated as must-have, required, or mandatory
2. OPTIONAL skills — listed as nice-to-have, preferred, bonus, or advantageous
3. Role metadata — title, seniority level, domain

Include: programming languages, frameworks, libraries, tools, platforms, databases,
cloud services, methodologies, soft skills if technical in nature.

IMPORTANT:
- Use industry-standard skill names
- Separate compound requirements (e.g., "React/Angular" → two separate skills)
- Include implied requirements (e.g., if React is required, JavaScript is implied-required)

Return ONLY a valid JSON object with this exact structure (no markdown):
{{
  "role_title": "Full Stack Engineer",
  "seniority_level": "Mid-Senior",
  "domain": "SaaS/Web Development",
  "required_skills": ["Python", "React", "PostgreSQL"],
  "optional_skills": ["Docker", "Kubernetes", "GraphQL"],
  "skill_priorities": {{
    "Python": "high",
    "React": "high",
    "Docker": "medium"
  }}
}}

Job Description:
\"\"\"
{jd_text}
\"\"\"
"""
    result = generate_response(prompt)

    if isinstance(result, dict):
        return {
            "role_title": result.get("role_title", "Not specified"),
            "seniority_level": result.get("seniority_level", "Not specified"),
            "domain": result.get("domain", "Not specified"),
            "required_skills": result.get("required_skills", []),
            "optional_skills": result.get("optional_skills", []),
            "skill_priorities": result.get("skill_priorities", {}),
        }

    raise ValueError(f"Unexpected JD parse result shape: {result}")


# ── Skill Gap Calculator ────────────────────────────────────────────────────────

def _fuzzy_skill_match(skill_a: str, skill_b: str) -> bool:
    """
    Check if two skill names refer to the same skill.
    Handles common aliases and abbreviations.
    """
    ALIASES = {
        "js": "javascript",
        "ts": "typescript",
        "py": "python",
        "react.js": "react",
        "reactjs": "react",
        "vue.js": "vue",
        "vuejs": "vue",
        "node": "node.js",
        "nodejs": "node.js",
        "next": "next.js",
        "nextjs": "next.js",
        "nuxt": "nuxt.js",
        "nuxtjs": "nuxt.js",
        "k8s": "kubernetes",
        "pg": "postgresql",
        "postgres": "postgresql",
        "mongo": "mongodb",
        "express": "express.js",
        "expressjs": "express.js",
        "tf": "tensorflow",
        "sklearn": "scikit-learn",
        "aws": "amazon web services",
        "gcp": "google cloud platform",
        "azure": "microsoft azure",
    }

    a = _normalize_skill_name(skill_a)
    b = _normalize_skill_name(skill_b)

    # Direct match
    if a == b:
        return True

    # Alias match
    a_canonical = ALIASES.get(a, a)
    b_canonical = ALIASES.get(b, b)
    if a_canonical == b_canonical:
        return True

    # Substring match (handles "Amazon S3" matching "S3", "AWS Lambda" matching "Lambda")
    if a in b or b in a:
        return True

    return False


def calculate_skill_gap(
    resume_skills: list[dict],
    jd_required_skills: list[str],
) -> list[dict]:
    """
    Identify skills required by the JD that are missing from the resume,
    with enhanced detail for each gap.

    Returns:
        List of skill gap dicts:
        [
            {
                "skill": "React",
                "priority": "high",
                "category": "frontend_frameworks",
                "candidate_has_related": ["JavaScript", "Angular"]
            },
            ...
        ]
    """
    resume_skill_names = [s["name"] for s in resume_skills]

    gaps = []
    for required_skill in jd_required_skills:
        # Check if candidate has this skill (with fuzzy matching)
        has_skill = any(
            _fuzzy_skill_match(required_skill, rs)
            for rs in resume_skill_names
        )

        if not has_skill:
            # Find related skills the candidate does have
            required_category = _categorize_skill(required_skill)
            related = [
                s["name"] for s in resume_skills
                if _categorize_skill(s["name"]) == required_category
                and required_category != "other"
            ]

            gaps.append({
                "skill": required_skill,
                "priority": "high",  # all required skills are high priority
                "category": required_category,
                "candidate_has_related": related[:5],  # cap at 5
            })

    return gaps


def calculate_skill_gap_simple(
    resume_skills: list[dict],
    jd_required_skills: list[str],
) -> list[str]:
    """
    Simple version that returns just skill names (backward compatible).
    """
    gaps = calculate_skill_gap(resume_skills, jd_required_skills)
    return [g["skill"] for g in gaps]
