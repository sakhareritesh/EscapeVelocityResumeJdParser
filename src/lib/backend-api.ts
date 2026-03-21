/**
 * Backend API client for the Python Flask backend
 * Proxies requests through Next.js API routes to avoid CORS issues
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// ── Types matching backend response schema ──────────────────────────────────

export interface ResumeSkill {
  name: string;
  level: string;
  category: string;
  years_experience: number;
  context: string;
}

export interface JdSkill {
  name: string;
  level: 'Required' | 'Optional';
}

export interface SkillGapItem {
  skill: string;
  category: string;
  priority: string;
  candidate_has_related?: string[];
}

export interface LearningResource {
  name: string;
  url: string;
}

export interface LearningStep {
  step: number;
  skill: string;
  reason: string;
  estimated_hours: number;
  difficulty: string;
  prerequisites_met?: string[];
  resources?: LearningResource[];
  milestones?: string[];
  project_idea?: string;
  cumulative_hours: number;
  category: string;
  is_implicit?: boolean;
}

export interface GraphNode {
  id: string;
  group: string;
  estimated_hours: number;
  is_implicit?: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface DependencyGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  stats: {
    total_nodes: number;
    total_edges: number;
    total_hours: number;
    estimated_weeks?: number;
  };
}

export interface RoleInfo {
  title: string;
  seniority: string;
  domain: string;
}

export interface AnalysisMeta {
  total_resume_skills: number;
  total_required_skills: number;
  total_optional_skills: number;
  total_gaps: number;
  total_learning_steps: number;
  match_percentage: number;
  total_learning_hours: number;
  total_learning_weeks: number;
}

export interface AnalysisResult {
  success: boolean;
  session_id: string;
  role_info: RoleInfo;
  resume_skills: ResumeSkill[];
  jd_skills: JdSkill[];
  skill_gap: SkillGapItem[];
  learning_path: LearningStep[];
  dependency_graph: DependencyGraph;
  explanation: string;
  meta: AnalysisMeta;
}

export interface ParseResult {
  success: boolean;
  resume: {
    text: string;
    char_count: number;
    word_count: number;
    status: string;
    error?: string;
  };
  jd: {
    text: string;
    char_count: number;
    word_count: number;
    status: string;
    error?: string;
  };
}

export interface SessionListItem {
  _id: string;
  created_at: string;
  role_title: string;
  resume_skills: ResumeSkill[];
  jd_skills: JdSkill[];
  skill_gap: SkillGapItem[];
  learning_path: LearningStep[];
  stats: {
    match_percentage: number;
    total_learning_hours: number;
    total_learning_weeks: number;
  };
}

export interface SessionDetail {
  _id: string;
  created_at: string;
  role_title: string;
  seniority_level: string;
  domain: string;
  resume_skills: ResumeSkill[];
  jd_skills: JdSkill[];
  skill_gap: SkillGapItem[];
  learning_path: LearningStep[];
  dependency_graph: DependencyGraph;
  explanation: string;
  stats: {
    match_percentage: number;
    total_learning_hours: number;
    total_learning_weeks: number;
  };
}

// ── API Functions ───────────────────────────────────────────────────────────

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/health`, { 
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}

export async function parseDocuments(resumeFile: File, jdFile?: File, jdText?: string): Promise<ParseResult> {
  const formData = new FormData();
  formData.append('resume_file', resumeFile);
  
  if (jdFile) {
    formData.append('jd_file', jdFile);
  } else if (jdText) {
    formData.append('jd_text', jdText);
  }

  const res = await fetch(`${BACKEND_URL}/parse`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `Parse failed with status ${res.status}`);
  }

  return res.json();
}

export async function analyzeResumeAndJd(
  options: {
    resumeFile?: File;
    resumeText?: string;
    jdFile?: File;
    jdText?: string;
    firebaseUid?: string;
  }
): Promise<AnalysisResult> {
  const formData = new FormData();

  if (options.resumeFile) {
    formData.append('resume_file', options.resumeFile);
  } else if (options.resumeText) {
    formData.append('resume_text', options.resumeText);
  }

  if (options.jdFile) {
    formData.append('jd_file', options.jdFile);
  } else if (options.jdText) {
    formData.append('jd_text', options.jdText);
  }

  // Send Firebase UID so backend can link the session to the user
  if (options.firebaseUid) {
    formData.append('firebase_uid', options.firebaseUid);
  }

  const res = await fetch(`${BACKEND_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `Analysis failed with status ${res.status}`);
  }

  return res.json();
}

export async function getSession(sessionId: string): Promise<SessionDetail> {
  const res = await fetch(`${BACKEND_URL}/session/${sessionId}`);
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `Failed to get session: ${res.status}`);
  }

  const data = await res.json();
  return data.session;
}

export async function listSessions(): Promise<SessionListItem[]> {
  const res = await fetch(`${BACKEND_URL}/sessions`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `Failed to list sessions: ${res.status}`);
  }

  const data = await res.json();
  return data.sessions || [];
}

// ── User-specific API Functions ─────────────────────────────────────────────

export async function getUserSessions(firebaseUid: string): Promise<SessionListItem[]> {
  const res = await fetch(`${BACKEND_URL}/user/sessions?firebase_uid=${encodeURIComponent(firebaseUid)}`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `Failed to list user sessions: ${res.status}`);
  }

  const data = await res.json();
  return data.sessions || [];
}

export async function getUserLatestSession(firebaseUid: string): Promise<SessionDetail | null> {
  const res = await fetch(`${BACKEND_URL}/user/latest-session?firebase_uid=${encodeURIComponent(firebaseUid)}`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `Failed to get latest session: ${res.status}`);
  }

  const data = await res.json();
  return data.session || null;
}

