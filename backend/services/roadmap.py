"""
services/roadmap.py - Learning path generation using graph-based adaptive pathing

Algorithm: Skill Dependency Graph + Topological Sort + Adaptive Weighting
  1. Build a directed acyclic graph (DAG) of skill prerequisites
  2. Use Gemini to identify dependencies between gap skills
  3. Apply topological sort to determine optimal learning order
  4. Weight edges by candidate's existing skills (adaptive component)
  5. Generate rich learning steps with time estimates and resources
"""

import networkx as nx
from .gemini_service import generate_response, generate_text


# ── Skill Dependency Knowledge Base ─────────────────────────────────────────────
# Pre-defined common dependency relationships to accelerate graph building

KNOWN_DEPENDENCIES = {
    # Frontend path
    "react": ["javascript", "html", "css"],
    "angular": ["typescript", "javascript", "html", "css"],
    "vue": ["javascript", "html", "css"],
    "vue.js": ["javascript", "html", "css"],
    "next.js": ["react", "javascript"],
    "nuxt.js": ["vue", "javascript"],
    "svelte": ["javascript", "html", "css"],
    "typescript": ["javascript"],
    "redux": ["react", "javascript"],
    "graphql": ["rest", "javascript"],
    "tailwindcss": ["css", "html"],
    "sass": ["css"],
    "webpack": ["javascript"],

    # Backend path
    "node.js": ["javascript"],
    "express.js": ["node.js", "javascript"],
    "nestjs": ["typescript", "node.js"],
    "django": ["python"],
    "flask": ["python"],
    "fastapi": ["python"],
    "spring boot": ["java"],
    "spring": ["java"],
    ".net": ["c#"],
    "ruby on rails": ["ruby"],
    "laravel": ["php"],

    # Database path
    "postgresql": ["sql"],
    "mysql": ["sql"],
    "mongodb": [],
    "redis": [],
    "elasticsearch": [],
    "dynamodb": ["aws"],

    # Cloud & DevOps path
    "kubernetes": ["docker"],
    "docker": ["linux"],
    "terraform": ["cloud computing basics"],
    "aws": ["cloud computing basics"],
    "gcp": ["cloud computing basics"],
    "azure": ["cloud computing basics"],
    "ci/cd": ["git"],
    "github actions": ["git", "ci/cd"],
    "jenkins": ["ci/cd"],
    "helm": ["kubernetes"],
    "argocd": ["kubernetes", "git"],

    # Data/ML path
    "tensorflow": ["python", "machine learning basics"],
    "pytorch": ["python", "machine learning basics"],
    "scikit-learn": ["python", "numpy", "pandas"],
    "pandas": ["python"],
    "numpy": ["python"],
    "deep learning": ["machine learning basics", "python"],
    "nlp": ["machine learning basics", "python"],
    "computer vision": ["deep learning", "python"],
    "langchain": ["python", "llm"],
    "spark": ["python", "sql"],

    # Mobile path
    "react native": ["react", "javascript"],
    "flutter": ["dart"],
    "swiftui": ["swift"],

    # Testing
    "jest": ["javascript"],
    "pytest": ["python"],
    "cypress": ["javascript"],
    "selenium": ["python"],
    "playwright": ["javascript"],

    # Security
    "oauth": ["authentication"],
    "jwt": ["authentication"],
}

# Time estimates (in hours) for learning each skill from scratch
SKILL_TIME_ESTIMATES = {
    # Programming languages
    "python": 40, "javascript": 50, "typescript": 30, "java": 60,
    "c++": 80, "c#": 60, "go": 40, "rust": 80, "ruby": 40,
    "dart": 30, "swift": 50, "kotlin": 40, "sql": 25,
    "html": 15, "css": 25,

    # Frameworks
    "react": 50, "angular": 60, "vue": 40, "next.js": 30,
    "node.js": 35, "express.js": 20, "django": 40, "flask": 25,
    "fastapi": 20, "spring boot": 50, "nestjs": 35,

    # Databases
    "postgresql": 30, "mysql": 25, "mongodb": 25, "redis": 15,
    "elasticsearch": 25, "dynamodb": 20,

    # Cloud
    "aws": 60, "gcp": 50, "azure": 50, "docker": 25,
    "kubernetes": 40, "terraform": 30,

    # DevOps
    "ci/cd": 20, "github actions": 15, "jenkins": 20,

    # Data/ML
    "pandas": 20, "numpy": 15, "scikit-learn": 30,
    "tensorflow": 50, "pytorch": 50, "machine learning basics": 40,

    # Testing
    "jest": 15, "pytest": 15, "cypress": 20, "selenium": 20,

    # Mobile
    "react native": 40, "flutter": 45,
}


def _normalize(name: str) -> str:
    return name.lower().strip()


def _get_prerequisites(skill: str) -> list[str]:
    """Get known prerequisites for a skill."""
    return KNOWN_DEPENDENCIES.get(_normalize(skill), [])


def _estimate_time(skill: str, has_related: bool = False) -> int:
    """Estimate learning hours, reduced if candidate has related skills."""
    base = SKILL_TIME_ESTIMATES.get(_normalize(skill), 30)
    if has_related:
        return max(int(base * 0.6), 5)  # 40% reduction if has related skills
    return base


# ── Graph-Based Learning Path Algorithm ─────────────────────────────────────────

def build_skill_dependency_graph(
    skill_gaps: list[dict],
    resume_skills: list[dict],
) -> nx.DiGraph:
    """
    Build a directed acyclic graph (DAG) of skill dependencies.

    Nodes: skills to learn (from gap analysis)
    Edges: prerequisite relationships (A → B means "learn A before B")
    Node weights: adjusted learning time based on existing skills
    """
    G = nx.DiGraph()
    resume_skill_names = {_normalize(s["name"]) for s in resume_skills}

    # Extract gap skill names
    gap_skill_names = []
    for gap in skill_gaps:
        if isinstance(gap, dict):
            gap_skill_names.append(gap.get("skill", ""))
        else:
            gap_skill_names.append(str(gap))

    # Add nodes for each gap skill
    for skill_name in gap_skill_names:
        has_related = any(
            _normalize(rs["name"]) in _get_prerequisites(skill_name)
            for rs in resume_skills
        )

        G.add_node(skill_name, **{
            "estimated_hours": _estimate_time(skill_name, has_related),
            "has_related_skills": has_related,
            "category": _get_category(skill_name),
        })

    # Add edges from known dependencies
    for skill_name in gap_skill_names:
        prereqs = _get_prerequisites(skill_name)
        for prereq in prereqs:
            # Only add edge if the prereq is also a gap skill
            # (skip if candidate already knows the prereq)
            if _normalize(prereq) not in resume_skill_names:
                # Check if this prereq is in our gap list
                matching_gap = None
                for gn in gap_skill_names:
                    if _normalize(gn) == _normalize(prereq):
                        matching_gap = gn
                        break

                if matching_gap:
                    # prereq → skill (learn prereq before skill)
                    G.add_edge(matching_gap, skill_name)
                else:
                    # Prereq is not in the gap list and not in resume
                    # Add it as an implicit prerequisite
                    has_related = False
                    G.add_node(prereq, **{
                        "estimated_hours": _estimate_time(prereq, has_related),
                        "has_related_skills": has_related,
                        "category": _get_category(prereq),
                        "implicit": True,
                    })
                    G.add_edge(prereq, skill_name)

    # Ensure no cycles
    if not nx.is_directed_acyclic_graph(G):
        # Remove edges that create cycles
        try:
            cycles = list(nx.simple_cycles(G))
            for cycle in cycles:
                if len(cycle) >= 2:
                    G.remove_edge(cycle[-1], cycle[0])
        except Exception:
            pass

    return G


def _get_category(skill_name: str) -> str:
    """Get the skill category."""
    from .parser import _categorize_skill
    return _categorize_skill(skill_name)


def topological_sort_with_priority(G: nx.DiGraph) -> list[str]:
    """
    Enhanced topological sort that considers:
    1. Prerequisites first (topological order)
    2. Foundational skills before specialized ones
    3. Skills with more dependents are prioritized
    """
    if len(G.nodes()) == 0:
        return []

    # Use topological sort with tiebreaking by out-degree (most dependents first)
    try:
        # Get topological generations (parallel layers)
        generations = list(nx.topological_generations(G))
        sorted_skills = []

        for gen in generations:
            # Within each generation, sort by:
            # 1. Implicit prereqs first
            # 2. More out-edges (more things depend on them) first
            # 3. Lower estimated time first (quick wins)
            gen_sorted = sorted(gen, key=lambda n: (
                0 if G.nodes[n].get("implicit", False) else 1,
                -G.out_degree(n),
                G.nodes[n].get("estimated_hours", 30),
            ))
            sorted_skills.extend(gen_sorted)

        return sorted_skills
    except Exception:
        # Fallback: simple topological sort
        try:
            return list(nx.topological_sort(G))
        except nx.NetworkXUnfeasible:
            return list(G.nodes())


# ── Learning Path Generator ─────────────────────────────────────────────────────

def generate_learning_path(
    resume_skills: list[dict],
    skill_gap: list,
) -> list[dict]:
    """
    Generate a step-by-step personalised learning roadmap using graph-based
    adaptive pathing.

    Algorithm:
    1. Build skill dependency graph
    2. Apply topological sort with priority weighting
    3. Enrich each step with Gemini-generated details
    4. Add time estimates adjusted for existing skills

    Returns:
        List of learning steps with rich metadata:
        [
            {
                "step": 1,
                "skill": "JavaScript Fundamentals",
                "reason": "...",
                "estimated_hours": 50,
                "difficulty": "Medium",
                "prerequisites_met": ["Python"],
                "resources": [...],
                "milestones": [...]
            }
        ]
    """
    if not skill_gap:
        return []

    # ── Step 1: Build the dependency graph ──────────────────────────────────
    G = build_skill_dependency_graph(skill_gap, resume_skills)
    sorted_skills = topological_sort_with_priority(G)

    # ── Step 2: Get rich learning details from Gemini ───────────────────────
    current_skills_str = ", ".join(
        [f"{s['name']} ({s['level']})" for s in resume_skills]
    ) or "No prior technical skills listed"

    skills_to_learn = sorted_skills if sorted_skills else [
        g.get("skill", g) if isinstance(g, dict) else str(g) for g in skill_gap
    ]

    prompt = f"""You are a senior technical learning architect and career coach.

A candidate needs to upskill. Here's their profile:

Current skills: {current_skills_str}
Skills to learn (in recommended order): {', '.join(skills_to_learn)}

The learning order has been determined by prerequisite analysis. Your task is to
enrich each step with practical learning details.

For EACH skill in the order given, provide:
1. "skill" — exact name as provided
2. "reason" — why this skill is placed here and how it builds on prior knowledge (1-2 sentences)
3. "difficulty" — "Easy", "Medium", or "Hard" (relative to candidate's background)
4. "resources" — exactly 3 high-quality free learning resources (name + URL)
5. "milestones" — exactly 3 practical milestones to prove competency
6. "project_idea" — one hands-on project to solidify the skill

Return ONLY a valid JSON object (no markdown, no extra text):
{{
  "learning_path": [
    {{
      "skill": "JavaScript",
      "reason": "Core prerequisite for React and Node.js. Your Python background makes the transition smooth.",
      "difficulty": "Medium",
      "resources": [
        {{"name": "MDN Web Docs", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide"}},
        {{"name": "JavaScript.info", "url": "https://javascript.info"}},
        {{"name": "freeCodeCamp JS", "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/"}}
      ],
      "milestones": [
        "Build a CLI tool using Node.js",
        "Implement async/await patterns with error handling",
        "Create a REST API client with fetch"
      ],
      "project_idea": "Build a weather dashboard CLI that fetches data from a public API"
    }}
  ]
}}
"""
    try:
        result = generate_response(prompt)

        if isinstance(result, dict) and "learning_path" in result:
            path = result["learning_path"]
        else:
            path = []
    except Exception as e:
        print(f"⚠️  Gemini enrichment failed: {e}")
        path = []

    # ── Step 3: Merge graph data with Gemini enrichment ────────────────────
    gemini_map = {}
    for step in path:
        if isinstance(step, dict) and "skill" in step:
            gemini_map[_normalize(step["skill"])] = step

    final_path = []
    total_hours = 0

    for i, skill_name in enumerate(skills_to_learn, start=1):
        node_data = G.nodes.get(skill_name, {})
        gemini_data = gemini_map.get(_normalize(skill_name), {})

        estimated_hours = node_data.get(
            "estimated_hours",
            _estimate_time(skill_name, False)
        )
        total_hours += estimated_hours

        # Find which of the candidate's existing skills are prerequisites
        prereqs_from_resume = []
        prereqs = _get_prerequisites(skill_name)
        for rs in resume_skills:
            if _normalize(rs["name"]) in [_normalize(p) for p in prereqs]:
                prereqs_from_resume.append(rs["name"])

        step_data = {
            "step": i,
            "skill": skill_name,
            "reason": gemini_data.get("reason",
                f"Required for the target role. "
                f"{'Builds on your ' + ', '.join(prereqs_from_resume) + ' experience.' if prereqs_from_resume else 'A new skill area to develop.'}"
            ),
            "estimated_hours": estimated_hours,
            "difficulty": gemini_data.get("difficulty", "Medium"),
            "prerequisites_met": prereqs_from_resume,
            "is_implicit_prereq": node_data.get("implicit", False),
            "category": node_data.get("category", _get_category(skill_name)),
            "resources": gemini_data.get("resources", []),
            "milestones": gemini_data.get("milestones", []),
            "project_idea": gemini_data.get("project_idea", ""),
            "cumulative_hours": total_hours,
        }

        final_path.append(step_data)

    return final_path


# ── Explanation Generator ───────────────────────────────────────────────────────

def generate_explanation(
    resume_skills: list[dict],
    jd_required_skills: list[str],
    skill_gap: list,
    learning_path: list[dict],
) -> str:
    """
    Generate a human-readable explanation of the learning path rationale.
    """
    current_skills_str = ", ".join(
        [f"{s['name']} ({s['level']})" for s in resume_skills]
    ) or "No prior skills listed"

    # Handle both old format (list[str]) and new format (list[dict])
    gap_names = []
    for g in skill_gap:
        if isinstance(g, dict):
            gap_names.append(g.get("skill", str(g)))
        else:
            gap_names.append(str(g))

    path_summary = "\n".join(
        [f"  Step {s['step']}: {s['skill']} ({s.get('estimated_hours', '?')}h) — {s.get('reason', '')}"
         for s in learning_path]
    ) or "  No learning steps generated (no skill gaps found)"

    total_hours = sum(s.get("estimated_hours", 0) for s in learning_path)
    total_weeks = max(1, total_hours // 20)  # assuming ~20 hours/week of study

    prompt = f"""You are a career coach writing a personalised onboarding report for a new hire.

Here is their profile:

Current Skills: {current_skills_str}
Job Required Skills: {', '.join(jd_required_skills) or 'Not specified'}
Skill Gaps Identified: {', '.join(gap_names) or 'None — fully qualified!'}
Total Learning Time Estimate: ~{total_hours} hours (~{total_weeks} weeks at 20h/week)

Generated Learning Path:
{path_summary}

Write a clear, encouraging, and professional explanation (4-5 paragraphs) covering:
1. A warm welcome and summary of the candidate's current strengths (be specific)
2. Why the specific skill gaps exist relative to the role
3. How the learning path uses a graph-based dependency algorithm to optimize the order
4. Key milestones and what "success" looks like at each phase
5. Motivational closing with the estimated timeline and encouragement

Be specific, practical, and encouraging. Reference their actual skills by name.
Write in plain English — no bullet points, no headers, no markdown formatting.
Just well-structured paragraphs.
"""

    return generate_text(prompt)


# ── Graph Export (for frontend visualization) ───────────────────────────────────

def export_learning_graph(
    resume_skills: list[dict],
    skill_gap: list,
) -> dict:
    """
    Export the skill dependency graph as JSON for frontend visualization.

    Returns:
        {
            "nodes": [{"id": "React", "group": "frontend", ...}],
            "edges": [{"source": "JavaScript", "target": "React"}],
            "stats": {"total_nodes": 5, "total_edges": 3, "total_hours": 150}
        }
    """
    G = build_skill_dependency_graph(skill_gap, resume_skills)

    nodes = []
    for node_name in G.nodes():
        data = G.nodes[node_name]
        nodes.append({
            "id": node_name,
            "group": data.get("category", "other"),
            "estimated_hours": data.get("estimated_hours", 30),
            "has_related_skills": data.get("has_related_skills", False),
            "is_implicit": data.get("implicit", False),
        })

    edges = []
    for u, v in G.edges():
        edges.append({
            "source": u,
            "target": v,
        })

    total_hours = sum(G.nodes[n].get("estimated_hours", 30) for n in G.nodes())

    return {
        "nodes": nodes,
        "edges": edges,
        "stats": {
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "total_hours": total_hours,
            "estimated_weeks": max(1, total_hours // 20),
        }
    }
