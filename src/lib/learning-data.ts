// ===== TYPES =====

export interface Course {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  instructor: string;
  progress?: number;
}

export interface CareerRole {
  id: string;
  title: string;
  description: string;
  icon: string;
  courseCount: number;
}

export interface CareerTransition {
  from: string;
  to: { title: string; subtitle: string }[];
  label?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  duration: string;
  skills: string[];
  progress: number;
}

export interface SkillGap {
  matchedSkills: string[];
  missingSkills: string[];
  learningPath: {
    skill: string;
    courses: Course[];
    priority: 'High' | 'Medium' | 'Low';
  }[];
}

// ===== MOCK DATA =====

export const careerRoles: CareerRole[] = [
  { id: 'product-manager', title: 'Product Manager', description: 'Lead product strategy and roadmaps', icon: '📋', courseCount: 24 },
  { id: 'software-engineer', title: 'Software Engineer', description: 'Build and ship great software products', icon: '💻', courseCount: 48 },
  { id: 'data-scientist', title: 'Data Scientist', description: 'Unlock insights from data at scale', icon: '📊', courseCount: 32 },
  { id: 'founder', title: 'Founder', description: 'Build and scale your own venture', icon: '🚀', courseCount: 18 },
  { id: 'business-analyst', title: 'Business Analyst', description: 'Bridge business needs and technology', icon: '📈', courseCount: 22 },
  { id: 'ux-designer', title: 'UX Designer', description: 'Design user-centered digital experiences', icon: '🎨', courseCount: 20 },
  { id: 'devops-engineer', title: 'DevOps Engineer', description: 'Automate infrastructure and deployment', icon: '⚙️', courseCount: 28 },
  { id: 'marketing-manager', title: 'Marketing Manager', description: 'Drive growth and brand awareness', icon: '📣', courseCount: 16 },
];

export const roleGuides: string[] = [
  'Marketing Manager', 'Operations Manager', 'Program Manager', 'Product Manager',
  'Project Manager', 'Financial Analyst', 'Sales Manager', 'Business Development Manager',
  'Accountant', 'Salesperson', 'Recruiter', 'Marketing Specialist',
  'Human Resources Specialist', 'Supply Chain Specialist', 'Social Media Manager', 'People Manager',
];

export const courses: Course[] = [
  { id: 'c1', title: 'Integrating Generative AI into Business Strategy', duration: '36m', thumbnail: '/api/placeholder/280/160', level: 'Beginner', category: 'AI & Business', instructor: 'Dr. Sarah Chen' },
  { id: 'c2', title: 'Generative AI Approaches to Business Challenges', duration: '37m', thumbnail: '/api/placeholder/280/160', level: 'Beginner', category: 'AI & Business', instructor: 'Prof. James Wilson' },
  { id: 'c3', title: 'Strategic Leadership for Founders', duration: '1h 12m', thumbnail: '/api/placeholder/280/160', level: 'Intermediate', category: 'Leadership', instructor: 'Lisa Rodriguez' },
  { id: 'c4', title: 'Building Scalable Systems', duration: '2h 5m', thumbnail: '/api/placeholder/280/160', level: 'Advanced', category: 'Engineering', instructor: 'Alex Kumar' },
  { id: 'c5', title: 'Data-Driven Decision Making', duration: '45m', thumbnail: '/api/placeholder/280/160', level: 'Beginner', category: 'Analytics', instructor: 'Maria Thompson' },
  { id: 'c6', title: 'Product Management Fundamentals', duration: '1h 30m', thumbnail: '/api/placeholder/280/160', level: 'Beginner', category: 'Product', instructor: 'David Park' },
  { id: 'c7', title: 'Advanced Machine Learning Pipelines', duration: '2h 45m', thumbnail: '/api/placeholder/280/160', level: 'Advanced', category: 'Data Science', instructor: 'Dr. Emily Zhang' },
  { id: 'c8', title: 'UX Research Methods', duration: '55m', thumbnail: '/api/placeholder/280/160', level: 'Intermediate', category: 'Design', instructor: 'Kate Johnson' },
  { id: 'c9', title: 'Financial Modeling for Startups', duration: '1h 15m', thumbnail: '/api/placeholder/280/160', level: 'Intermediate', category: 'Finance', instructor: 'Robert Chen' },
  { id: 'c10', title: 'Cloud Architecture Fundamentals', duration: '1h 50m', thumbnail: '/api/placeholder/280/160', level: 'Beginner', category: 'Cloud Computing', instructor: 'Priya Sharma' },
  { id: 'c11', title: 'Agile Project Management', duration: '1h 20m', thumbnail: '/api/placeholder/280/160', level: 'Beginner', category: 'Management', instructor: 'Tom Harris' },
  { id: 'c12', title: 'React & Next.js Masterclass', duration: '3h 10m', thumbnail: '/api/placeholder/280/160', level: 'Advanced', category: 'Engineering', instructor: 'Nina Patel' },
];

export const careerTransitions: Record<string, CareerTransition> = {
  founder: {
    from: 'Founder',
    to: [
      { title: 'Co-Founder', subtitle: 'Business Development' },
      { title: 'Owner', subtitle: 'Business Development' },
      { title: 'Co-Owner', subtitle: 'Business Development' },
    ],
    label: 'Most common',
  },
  'software-engineer': {
    from: 'Software Engineer',
    to: [
      { title: 'Senior Software Engineer', subtitle: 'Engineering' },
      { title: 'Tech Lead', subtitle: 'Engineering' },
      { title: 'Engineering Manager', subtitle: 'Management' },
    ],
    label: 'Most common',
  },
  'product-manager': {
    from: 'Product Manager',
    to: [
      { title: 'Senior Product Manager', subtitle: 'Product' },
      { title: 'Director of Product', subtitle: 'Product' },
      { title: 'VP of Product', subtitle: 'Executive' },
    ],
    label: 'Most common',
  },
  'data-scientist': {
    from: 'Data Scientist',
    to: [
      { title: 'Senior Data Scientist', subtitle: 'Data Science' },
      { title: 'ML Engineer', subtitle: 'Engineering' },
      { title: 'Head of Analytics', subtitle: 'Analytics' },
    ],
    label: 'Most common',
  },
  'business-analyst': {
    from: 'Business Analyst',
    to: [
      { title: 'Senior Business Analyst', subtitle: 'Analysis' },
      { title: 'Product Owner', subtitle: 'Product' },
      { title: 'Program Manager', subtitle: 'Management' },
    ],
    label: 'Most common',
  },
  'ux-designer': {
    from: 'UX Designer',
    to: [
      { title: 'Senior UX Designer', subtitle: 'Design' },
      { title: 'Design Lead', subtitle: 'Design' },
      { title: 'Head of Design', subtitle: 'Design' },
    ],
    label: 'Most common',
  },
  'devops-engineer': {
    from: 'DevOps Engineer',
    to: [
      { title: 'Senior DevOps Engineer', subtitle: 'DevOps' },
      { title: 'Site Reliability Engineer', subtitle: 'SRE' },
      { title: 'Platform Architect', subtitle: 'Architecture' },
    ],
    label: 'Most common',
  },
  'marketing-manager': {
    from: 'Marketing Manager',
    to: [
      { title: 'Senior Marketing Manager', subtitle: 'Marketing' },
      { title: 'Director of Marketing', subtitle: 'Marketing' },
      { title: 'CMO', subtitle: 'Executive' },
    ],
    label: 'Most common',
  },
};

export const certifications: Certification[] = [
  { id: 'cert1', title: 'AI-Adaptive Onboarding Specialist', issuer: 'Platform Certification', duration: '8 hours', skills: ['AI Integration', 'Onboarding', 'Learning Design'], progress: 0 },
  { id: 'cert2', title: 'Career Path Architect', issuer: 'Platform Certification', duration: '12 hours', skills: ['Career Planning', 'Skill Assessment', 'Roadmapping'], progress: 0 },
  { id: 'cert3', title: 'Generative AI for Business', issuer: 'Platform Certification', duration: '6 hours', skills: ['Generative AI', 'Business Strategy', 'Innovation'], progress: 35 },
  { id: 'cert4', title: 'Full-Stack Development', issuer: 'Platform Certification', duration: '20 hours', skills: ['React', 'Node.js', 'Databases', 'APIs'], progress: 0 },
  { id: 'cert5', title: 'Product Management Mastery', issuer: 'Platform Certification', duration: '15 hours', skills: ['Product Strategy', 'User Research', 'Roadmapping'], progress: 60 },
  { id: 'cert6', title: 'Data Analytics Professional', issuer: 'Platform Certification', duration: '18 hours', skills: ['SQL', 'Python', 'Visualization', 'Statistics'], progress: 0 },
];

export const mockResumeParseResult = {
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'REST APIs', 'Agile'],
  experience: [
    { role: 'Frontend Developer', company: 'TechCorp', duration: '2 years' },
    { role: 'Junior Developer', company: 'StartupXYZ', duration: '1 year' },
  ],
  education: [
    { degree: 'B.Tech Computer Science', institution: 'IIT Mumbai', year: '2021' },
  ],
};

export const mockSkillGapResult: SkillGap = {
  matchedSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Git', 'REST APIs'],
  missingSkills: ['System Design', 'AWS/Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'GraphQL', 'Testing Frameworks'],
  learningPath: [
    {
      skill: 'System Design',
      priority: 'High',
      courses: [
        { id: 'lp1', title: 'System Design Fundamentals', duration: '2h 30m', thumbnail: '/api/placeholder/280/160', level: 'Intermediate', category: 'Engineering', instructor: 'Alex Kumar' },
        { id: 'lp2', title: 'Designing Distributed Systems', duration: '3h 15m', thumbnail: '/api/placeholder/280/160', level: 'Advanced', category: 'Engineering', instructor: 'Dr. Sarah Chen' },
      ],
    },
    {
      skill: 'AWS/Cloud',
      priority: 'High',
      courses: [
        { id: 'lp3', title: 'AWS Cloud Practitioner Essentials', duration: '1h 45m', thumbnail: '/api/placeholder/280/160', level: 'Beginner', category: 'Cloud Computing', instructor: 'Priya Sharma' },
      ],
    },
    {
      skill: 'Docker & Kubernetes',
      priority: 'Medium',
      courses: [
        { id: 'lp4', title: 'Docker for Developers', duration: '1h 20m', thumbnail: '/api/placeholder/280/160', level: 'Beginner', category: 'DevOps', instructor: 'Tom Harris' },
        { id: 'lp5', title: 'Kubernetes in Action', duration: '2h 50m', thumbnail: '/api/placeholder/280/160', level: 'Intermediate', category: 'DevOps', instructor: 'Nina Patel' },
      ],
    },
    {
      skill: 'CI/CD Pipelines',
      priority: 'Medium',
      courses: [
        { id: 'lp6', title: 'CI/CD with GitHub Actions', duration: '1h 10m', thumbnail: '/api/placeholder/280/160', level: 'Beginner', category: 'DevOps', instructor: 'Robert Chen' },
      ],
    },
    {
      skill: 'GraphQL',
      priority: 'Low',
      courses: [
        { id: 'lp7', title: 'GraphQL Essentials', duration: '58m', thumbnail: '/api/placeholder/280/160', level: 'Beginner', category: 'Engineering', instructor: 'David Park' },
      ],
    },
  ],
};

export const browseCategories = [
  { name: 'Artificial Intelligence', count: 45, icon: '🤖' },
  { name: 'Web Development', count: 120, icon: '🌐' },
  { name: 'Data Science', count: 68, icon: '📊' },
  { name: 'Cloud Computing', count: 52, icon: '☁️' },
  { name: 'Leadership', count: 38, icon: '👔' },
  { name: 'Product Management', count: 28, icon: '📋' },
  { name: 'UX Design', count: 34, icon: '🎨' },
  { name: 'DevOps', count: 42, icon: '⚙️' },
  { name: 'Cybersecurity', count: 29, icon: '🔒' },
  { name: 'Mobile Development', count: 36, icon: '📱' },
  { name: 'Marketing', count: 25, icon: '📣' },
  { name: 'Finance', count: 22, icon: '💰' },
];
