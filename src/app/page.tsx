
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wand2, FileText, Github, Linkedin, BrainCircuit, Eye, Bot, Pencil, Send, Palette, Rocket, CheckCircle, Heart, Check, Code, BarChart3, GraduationCap, Briefcase, Users, Feather, Sparkles, User, Download, LineChart, Gem, Loader2, Star, Shield, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { createPaymentOrderAction } from '@/app/actions/portfolio-actions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Chatbot } from '@/components/chatbot';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, update } from 'firebase/database';

// Dashboard imports for authenticated users
import { LearningSidebar } from '@/components/learning/LearningSidebar';
import { LearningNavbar } from '@/components/learning/LearningNavbar';
import { CourseCard } from '@/components/learning/CourseCard';
import { RoleCard } from '@/components/learning/RoleCard';
import { DashboardSkeleton } from '@/components/learning/LearningSkeletons';
import { courses, careerRoles } from '@/lib/learning-data';
import { TrendingUp, BookOpen, Target } from 'lucide-react';
import { motion } from 'framer-motion';


const homeFeatureCards = [
    {
        icon: <FileText className="w-8 h-8 text-blue-600" />,
        title: "Smart Resume Parser",
        description: "AI extracts every detail from PDF/Word resumes",
        bgColor: "bg-blue-500/10",
    },
    {
        icon: <Github className="w-8 h-8 text-purple-600" />,
        title: "GitHub Integration",
        description: "Auto-fetch projects, skills, and contributions",
        bgColor: "bg-purple-500/10",
    },
    {
        icon: <Linkedin className="w-8 h-8 text-green-600" />,
        title: "LinkedIn Sync",
        description: "Import experience, education, and achievements",
        bgColor: "bg-green-500/10",

    },
    {
        icon: <BrainCircuit className="w-8 h-8 text-orange-600" />,
        title: "AI Enhancement",
        description: "Intelligent content optimization and suggestions",
        bgColor: "bg-orange-500/10",
    },
]

const howItWorksSteps = [
    {
        icon: <Bot className="w-10 h-10 text-primary" />,
        title: "Import Your Data",
        description: "Connect your GitHub, LinkedIn, or upload your resume. Our AI intelligently parses and structures your professional information.",
    },
    {
        icon: <Pencil className="w-10 h-10 text-primary" />,
        title: "Customize Your Content",
        description: "Fine-tune the AI-generated content, select from professionally designed templates, and personalize the layout to match your style.",
    },
    {
        icon: <Send className="w-10 h-10 text-primary" />,
        title: "Publish Your Site",
        description: "Deploy your stunning new portfolio with a single click. Download the source code or host it with us for free.",
    },
];

const TemplateDevPro = () => (
    <div className="w-full h-full bg-gray-800 p-2 rounded-t-md space-y-1.5">
        <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        </div>
        <div className="bg-gray-900/80 p-2 rounded-sm space-y-1">
            <div className="h-2 w-1/2 bg-gray-700 rounded-full"></div>
            <div className="h-2 w-3/4 bg-gray-700 rounded-full"></div>
        </div>
        <div className="flex gap-2">
            <div className="flex-1 p-2 bg-gray-900/80 rounded-sm space-y-1">
                <div className="h-2 w-full bg-gray-700 rounded-full"></div>
                <div className="h-2 w-2/3 bg-gray-700 rounded-full"></div>
            </div>
            <div className="flex-1 p-2 bg-gray-900/80 rounded-sm space-y-1">
                <div className="h-2 w-full bg-gray-700 rounded-full"></div>
                <div className="h-2 w-1/2 bg-gray-700 rounded-full"></div>
            </div>
        </div>
    </div>
);

const TemplateCreative = () => (
    <div className="w-full h-full bg-white p-2 rounded-t-md space-y-2">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-300"></div>
            <div className="flex-1 space-y-1">
                <div className="h-2 w-1/3 bg-pink-200 rounded-full"></div>
                <div className="h-2 w-1/4 bg-pink-100 rounded-full"></div>
            </div>
        </div>
        <div className="flex gap-2">
            <div className="flex-1 h-12 bg-pink-200/80 rounded-md"></div>
            <div className="flex-1 h-12 bg-purple-200/80 rounded-md"></div>
        </div>
        <div className="w-full h-12 bg-gray-100 rounded-md"></div>
    </div>
);

const TemplateDataScientist = () => (
    <div className="w-full h-full bg-white p-2 rounded-t-md space-y-2">
        <div className="flex items-end gap-2 h-1/2">
            <div className="w-1/4 h-full bg-green-200 rounded-sm"></div>
            <div className="w-1/4 h-1/2 bg-green-200 rounded-sm"></div>
            <div className="w-1/4 h-3/4 bg-green-200 rounded-sm"></div>
            <div className="w-1/4 h-1/3 bg-green-200 rounded-sm"></div>
        </div>
        <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
        <div className="flex gap-2">
            <div className="flex-1 h-6 bg-gray-100 rounded-sm space-y-1"></div>
            <div className="flex-1 h-6 bg-gray-100 rounded-sm space-y-1"></div>
        </div>
    </div>
);

const TemplateMinimalist = () => (
    <div className="w-full h-full bg-gray-100 p-2 rounded-t-md">
        <div className="w-full h-full bg-white rounded-sm p-2 space-y-2">
            <div className="h-2 w-1/3 bg-gray-200 rounded-full"></div>
            <div className="h-1 w-full bg-gray-200 rounded-full"></div>
            <div className="h-1 w-full bg-gray-200 rounded-full"></div>
            <div className="h-1 w-2/3 bg-gray-200 rounded-full"></div>
            <div className="flex gap-1 pt-2">
                <div className="w-4 h-4 border-2 border-gray-300 rounded-sm"></div>
                <div className="w-4 h-4 border-2 border-gray-300 rounded-sm"></div>
            </div>
        </div>
    </div>
);
const TemplateAcademic = () => (
    <div className="w-full h-full bg-white p-2 rounded-t-md space-y-2">
        <div className="flex items-center gap-2">
            <div className="p-1 bg-indigo-100 rounded-sm"><GraduationCap className="w-4 h-4 text-indigo-500" /></div>
            <div className="text-sm font-semibold text-indigo-800">ACADEMIC</div>
        </div>
        <div className="space-y-1">
            <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded-full w-full"></div>
            <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
        </div>
        <div className="h-px bg-gray-200"></div>
        <div className="space-y-1">
            <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded-full w-full"></div>
        </div>
    </div>
);

const TemplateExecutive = () => (
    <div className="w-full h-full bg-white p-2 rounded-t-md space-y-2">
        <div className="flex justify-between items-center">
            <div className="p-1 bg-orange-100 rounded-sm"><Briefcase className="w-4 h-4 text-orange-500" /></div>
            <div className="text-sm font-semibold text-orange-800 tracking-widest">EXECUTIVE</div>
        </div>
        <div className="flex gap-2">
            <div className="w-1/3 space-y-1">
                <div className="h-4 bg-orange-200 rounded-sm"></div>
                <div className="h-2 bg-gray-200 rounded-full"></div>
            </div>
            <div className="w-2/3 bg-gray-100 p-1 space-y-1 rounded-sm">
                <div className="h-2 bg-gray-200 rounded-full w-full"></div>
                <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
            </div>
        </div>
    </div>
);
const TemplateFreelancer = () => (
    <div className="w-full h-full bg-white p-2 rounded-t-md space-y-2">
        <div className="flex items-center gap-2">
            <div className="p-1 bg-yellow-100 rounded-full"><User className="w-4 h-4 text-yellow-600" /></div>
            <div className="h-3 bg-yellow-200 rounded-full w-1/3"></div>
        </div>
        <div className="p-1 bg-gray-100 rounded-sm space-y-1">
            <div className="h-2 bg-gray-200 rounded-full w-full"></div>
            <div className="h-2 bg-gray-200 rounded-full w-5/6"></div>
        </div>
        <div className="p-1 bg-gray-100 rounded-sm space-y-1">
            <div className="h-2 bg-gray-200 rounded-full w-full"></div>
            <div className="h-2 bg-gray-200 rounded-full w-4/6"></div>
        </div>
    </div>
);
const TemplateGenz = () => (
    <div className="w-full h-full bg-white p-2 rounded-t-md space-y-1.5">
        <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500"></div>
        </div>
        <div className="flex gap-2">
            <div className="h-6 w-1/2 bg-pink-200 rounded-lg"></div>
            <div className="h-6 w-1/2 bg-cyan-200 rounded-lg"></div>
        </div>
        <div className="h-10 w-full bg-gray-100 rounded-lg"></div>
    </div>
);

const templates = [
    { id: 'dev-pro', name: 'Developer Pro', description: 'Terminal-inspired dark theme with code syntax highlighting', badge: 'Most Popular', badgeColor: 'bg-green-100 text-green-800', bgColor: 'bg-[#1e293b]', textColor: 'text-white', preview: <TemplateDevPro /> },
    { id: 'creative', name: 'Creative Studio', description: 'Visual-first design with portfolio galleries', badge: 'Premium', badgeColor: 'bg-purple-100 text-purple-800', bgColor: 'bg-gradient-to-br from-pink-400 to-purple-500', textColor: 'text-white', preview: <TemplateCreative /> },
    { id: 'data-scientist', name: 'Data Scientist', description: 'Analytics-focused with interactive charts', badge: 'Specialized', badgeColor: 'bg-teal-100 text-teal-800', bgColor: 'bg-teal-500', textColor: 'text-white', preview: <TemplateDataScientist /> },
    { id: 'minimalist', name: 'Minimalist Pro', description: 'Clean, content-focused design', badge: 'Universal', badgeColor: 'bg-gray-200 text-gray-800', bgColor: 'bg-white', textColor: 'text-gray-800', preview: <TemplateMinimalist /> },
    { id: 'academic', name: 'Academic Pro', description: 'Research-focused with publications', badge: 'Academic', badgeColor: 'bg-indigo-100 text-indigo-800', bgColor: 'bg-indigo-500', textColor: 'text-white', preview: <TemplateAcademic /> },
    { id: 'executive', name: 'Business Executive', description: 'Leadership-focused professional template', badge: 'Business', badgeColor: 'bg-orange-100 text-orange-800', bgColor: 'bg-orange-500', textColor: 'text-white', preview: <TemplateExecutive /> },
    { id: 'freelancer', name: 'Freelancer Hub', description: 'Service-focused with client testimonials', badge: 'Versatile', badgeColor: 'bg-yellow-100 text-yellow-800', bgColor: 'bg-yellow-500', textColor: 'text-white', preview: <TemplateFreelancer /> },
    { id: 'gen-z', name: 'Gen-Z Vibrant', description: 'Bold, colorful, and modern design', badge: 'Trending', badgeColor: 'bg-pink-100 text-pink-800', bgColor: 'bg-gradient-to-br from-pink-400 to-cyan-400', textColor: 'text-white', preview: <TemplateGenz /> },
];

const allFeatureCards = [
    {
        icon: <FileText className="w-8 h-8 text-blue-600" />,
        title: "Intelligent Resume Parser",
        description: "Advanced NLP extracts every detail from PDF/Word resumes including education grades, work experience dates, skills, and achievements with 99% accuracy.",
        bgColor: "bg-blue-500/10",
    },
    {
        icon: <Github className="w-8 h-8 text-purple-600" />,
        title: "GitHub Deep Analysis",
        description: "Automatically analyzes repositories, extracts project descriptions, identifies tech stacks, and generates compelling project narratives from your code.",
        bgColor: "bg-purple-500/10",
    },
    {
        icon: <Linkedin className="w-8 h-8 text-green-600" />,
        title: "LinkedIn Professional Sync",
        description: "Imports complete professional history, education with GPAs, skills endorsements, and recommendations to build comprehensive profiles.",
        bgColor: "bg-green-500/10",

    },
    {
        icon: <BrainCircuit className="w-8 h-8 text-orange-600" />,
        title: "AI Content Enhancement",
        description: "Powered by advanced SkillMapr models to improve project descriptions, optimize professional summaries, and suggest impactful achievements with industry-specific insights.",
        bgColor: "bg-orange-500/10",
    },
    {
        icon: <Palette className="w-8 h-8 text-indigo-600" />,
        title: "Smart Template Matching",
        description: "SkillMapr analyzes your profession and experience to recommend the perfect template from our collection of 15+ unique, professionally designed layouts.",
        bgColor: "bg-indigo-500/10",
    },
    {
        icon: <Rocket className="w-8 h-8 text-teal-600" />,
        title: "One-Click Deployment",
        description: "Deploy your portfolio instantly with custom domains, SSL certificates, SEO optimization, and download complete source code for full ownership.",
        bgColor: "bg-teal-500/10",
    }
];

const freeTierFeatures = [
    "2 AI Portfolio Generations",
    "5 AI Job Analyses",
    "1 Source Code Download",
    "Basic Deployment",
];

const monthlyPlanFeatures = [
    "5 AI Portfolio Generations / month",
    "100 AI Job Analyses / month",
    "20 Source Code Downloads / month",
    "Pro Deployment Options",
];

const yearlyPlanFeatures = [
    "50 AI Portfolio Generations / year",
    "1500 AI Job Analyses / year",
    "300 Source Code Downloads / year",
    "Pro Deployment Options",
];


const floatingEmojis = [
    { emoji: '🖌️', top: '10%', left: '15%', size: 'text-4xl', duration: '15s' },
    { emoji: '📁', top: '20%', left: '80%', size: 'text-5xl', duration: '12s' },
    { emoji: '⚙️', top: '70%', left: '10%', size: 'text-3xl', duration: '18s' },
    { emoji: '🚀', top: '80%', left: '90%', size: 'text-6xl', duration: '10s' },
    { emoji: '📡', top: '50%', left: '50%', size: 'text-4xl', duration: '14s' },
    { emoji: '💡', top: '30%', left: '5%', size: 'text-5xl', duration: '16s' },
    { emoji: '✨', top: '5%', left: '50%', size: 'text-3xl', duration: '11s' },
    { emoji: '💻', top: '90%', left: '40%', size: 'text-5xl', duration: '19s' },
];

// ═══════════════════════════════════════════════════════════════════
// Dashboard Home (shown when user is logged in)
// ═══════════════════════════════════════════════════════════════════
function DashboardHome() {
    const { userProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const firstName = userProfile?.name?.split(' ')[0] || 'there';

    return (
        <div className="flex h-screen bg-[#f8f7f4] dark:bg-background overflow-hidden">
            <LearningSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <LearningNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
                        {isLoading ? (
                            <DashboardSkeleton />
                        ) : (
                            <div className="space-y-8">
                                {/* Welcome Banner */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative overflow-hidden bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(262,83%,40%)] rounded-2xl p-6 md:p-8 text-white"
                                >
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
                                    <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
                                    <div className="relative z-10">
                                        <h1 className="text-2xl md:text-3xl font-bold mb-2">
                                            Welcome back, {firstName}! 👋
                                        </h1>
                                        <p className="text-purple-100 text-sm md:text-base max-w-lg">
                                            Start your personalized AI-adaptive onboarding journey. Upload your resume to get started.
                                        </p>
                                        <div className="flex flex-wrap gap-3 mt-5">
                                            <Link
                                                href="/upload-resume"
                                                className="inline-flex items-center gap-2 bg-white text-[hsl(262,83%,58%)] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors"
                                            >
                                                <Sparkles className="w-4 h-4" />
                                                Upload Resume & Analyze
                                            </Link>
                                            <Link
                                                href="/my-career-plan"
                                                className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/25 transition-colors border border-white/20"
                                            >
                                                <Target className="w-4 h-4" />
                                                My Career Plan
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Quick Stats */}
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                                >
                                    {[
                                        { label: 'Courses in Progress', value: '3', icon: BookOpen, color: 'text-purple-600 bg-purple-50' },
                                        { label: 'Skills Identified', value: '12', icon: TrendingUp, color: 'text-green-600 bg-green-50' },
                                        { label: 'Skill Gaps', value: '0', icon: Target, color: 'text-indigo-600 bg-indigo-50' },
                                        { label: 'Learning Hours', value: '24h', icon: Sparkles, color: 'text-amber-600 bg-amber-50' },
                                    ].map((stat, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white dark:bg-card rounded-xl border border-gray-100 dark:border-border p-4 flex items-center gap-3"
                                        >
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                                                <stat.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-gray-900 dark:text-foreground">{stat.value}</p>
                                                <p className="text-[11px] text-gray-500 dark:text-muted-foreground">{stat.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>

                                {/* Continue Learning */}
                                <section>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-foreground">Continue Learning</h2>
                                        <Link
                                            href="/my-content"
                                            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                                        >
                                            View all <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                        {courses.slice(0, 4).map((course, idx) => (
                                            <CourseCard
                                                key={course.id}
                                                course={{ ...course, progress: [35, 60, 15, 80][idx] }}
                                                index={idx}
                                            />
                                        ))}
                                    </div>
                                </section>

                                {/* Explore Career Paths */}
                                <section>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-foreground">Explore Career Paths</h2>
                                        <Link
                                            href="/career-paths"
                                            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                                        >
                                            See all paths <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                        {careerRoles.slice(0, 4).map((role, idx) => (
                                            <RoleCard key={role.id} role={role} index={idx} />
                                        ))}
                                    </div>
                                </section>

                                {/* Recommended Courses */}
                                <section>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-foreground">Recommended for You</h2>
                                        <Link
                                            href="/browse"
                                            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                                        >
                                            Browse all <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                        {courses.slice(4, 8).map((course, idx) => (
                                            <CourseCard key={course.id} course={course} index={idx} />
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════
// Main Page: Conditional Rendering
// ═══════════════════════════════════════════════════════════════════
export default function HomePage() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    // Logged-in users see the dashboard
    if (user) {
        return <DashboardHome />;
    }

    // Guests see the splash page
    return <SplashPage />;
}

// ═══════════════════════════════════════════════════════════════════
// Splash / Landing Page (shown to guests)
// ═══════════════════════════════════════════════════════════════════
function SplashPage() {
    const [isPaying, setIsPaying] = useState(false);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const { toast } = useToast();
    const { user } = useAuth();
    const router = useRouter();

    const handlePayment = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        setIsPaying(true);

        const currentPlan = billingCycle === 'monthly' ? 'monthly' : 'yearly';
        const amount = currentPlan === 'monthly' ? 99 * 100 : 999 * 100;

        const result = await createPaymentOrderAction({
            amount: amount,
        });

        if (!result.success || !result.data) {
            setIsPaying(false);
            toast({
                variant: 'destructive',
                title: 'Payment Error',
                description: result.error || 'Could not create payment order.',
            });
            return;
        }

        const { amount: orderAmount, id: order_id, currency } = result.data;
        const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

        if (!razorpayKey) {
            console.error("Razorpay Key ID is not set.");
            toast({
                variant: 'destructive',
                title: 'Configuration Error',
                description: 'Payment gateway is not configured.',
            });
            setIsPaying(false);
            return;
        }

        const options = {
            key: razorpayKey,
            amount: orderAmount.toString(),
            currency: currency,
            name: 'SkillMapr Pro',
            description: `${currentPlan === 'monthly' ? 'Monthly' : 'Yearly'} Subscription`,
            order_id: order_id,
            handler: async function (response: any) {
                try {
                    const userRef = ref(db, 'users/' + user.uid);

                    const newResetDate = new Date();
                    let newUsage;

                    if (currentPlan === 'monthly') {
                        newResetDate.setMonth(newResetDate.getMonth() + 1);
                        newUsage = { analysis: 100, downloads: 20, generations: 5 };
                    } else { // yearly
                        newResetDate.setFullYear(newResetDate.getFullYear() + 1);
                        newUsage = { analysis: 1500, downloads: 300, generations: 50 };
                    }

                    await update(userRef, {
                        planStatus: 'pro',
                        plan: currentPlan,
                        usage: newUsage,
                        usageResetDate: newResetDate.toISOString(),
                    });

                    toast({
                        title: 'Payment Successful!',
                        description: 'Welcome to the Pro plan!',
                    });
                    router.push('/user/profile');
                } catch (error) {
                    console.error("Failed to update user plan:", error);
                    toast({
                        variant: 'destructive',
                        title: 'Update Failed',
                        description: 'Your payment was successful, but we failed to update your account. Please contact support.',
                    });
                } finally {
                    setIsPaying(false);
                }
            },
            prefill: {
                name: user.displayName || '',
                email: user.email || '',
            },
            theme: {
                color: '#3b82f6',
            },
            modal: {
                ondismiss: function () {
                    toast({
                        variant: 'destructive',
                        title: 'Payment Cancelled',
                        description: "You have cancelled the payment.",
                    });
                    setIsPaying(false);
                }
            },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <main className="flex-1">
                <section className="relative container mx-auto px-4 py-24 md:py-32 text-center flex flex-col items-center overflow-hidden">
                    <div className="absolute inset-0 -z-10 opacity-50">
                        {floatingEmojis.map((item, index) => (
                            <span
                                key={index}
                                className={cn("absolute", item.size, "animate-float")}
                                style={{
                                    top: item.top,
                                    left: item.left,
                                    animationDuration: item.duration,
                                    animationDelay: `${index * 1.5}s`,
                                }}
                            >
                                {item.emoji}
                            </span>
                        ))}
                    </div>
                    <div className="relative z-10">
                        <Badge variant="outline" className="mb-4 text-sm font-semibold border-primary/30 bg-primary/10 text-primary py-1 px-3 rounded-full">
                            <Sparkles className="w-4 h-4 mr-2 text-primary" />
                            SkillMapr Resume Parser & Portfolio Builder
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">
                            <span className="animated-gradient">AI Creates Your</span> Perfect Portfolio
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                            Upload your resume, connect GitHub & LinkedIn, and watch our advanced AI create a stunning, professional portfolio website in minutes. Choose from 15+ unique templates designed by experts.
                        </p>
                        <div className="flex justify-center items-center gap-4">
                            <Button asChild size="lg" className="text-lg font-bold px-8 py-6">
                                <Link href="/create"><Rocket className="mr-2" />Create Portfolio Now</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="text-lg font-bold px-8 py-6">
                                <Link href="#templates"><Eye className="mr-2" />View Live Examples</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20 w-full max-w-6xl">
                        {homeFeatureCards.map((card, index) => (
                            <Card key={index} className="bg-background/50 dark:bg-slate-900/50 shadow-lg hover:shadow-xl transition-shadow rounded-xl text-center p-6 flex flex-col items-center gap-4">
                                <div className={cn("w-16 h-16 rounded-lg flex items-center justify-center shrink-0", card.bgColor)}>
                                    {card.icon}
                                </div>
                                <div className="text-center">
                                    <h3 className="text-lg font-bold mb-1">{card.title}</h3>
                                    <p className="text-muted-foreground text-sm">{card.description}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                <section id="how-it-works" className="py-16 md:py-24 bg-muted/40">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">How It Works</h2>
                            <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">Three simple steps to your new portfolio.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            {howItWorksSteps.map((step, index) => (
                                <Card key={index} className="bg-background shadow-lg border-transparent hover:border-primary/50 transition-colors pt-6">
                                    <CardHeader>
                                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                            {step.icon}
                                        </div>
                                        <CardTitle className="text-2xl font-bold">{step.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{step.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="templates" className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Choose Your Template</h2>
                            <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">Select from a variety of professionally designed templates. Switch anytime.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {templates.map((template) => (
                                <Card key={template.id} className={cn("group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col", template.bgColor)}>
                                    <div className="h-48 flex items-center justify-center p-2">
                                        {template.preview}
                                    </div>
                                    <div className={cn("p-4 flex-grow flex flex-col", template.textColor)}>
                                        <h3 className="text-xl font-bold">{template.name}</h3>
                                        <p className={cn("text-sm opacity-90 flex-grow", template.textColor === 'text-white' ? 'text-white/80' : 'text-gray-600')}>{template.description}</p>
                                        {template.badge && <Badge className={cn("mt-4 self-start font-semibold", template.badgeColor)}>{template.badge}</Badge>}
                                    </div>
                                </Card>
                            ))}
                        </div>
                        <div className="text-center mt-12 text-muted-foreground">
                            <p>And 20+ more stunning templates to choose from!</p>
                        </div>
                    </div>
                </section>

                <section id="features" className="py-16 md:py-24 bg-background">
                    <div className="container mx-auto px-4 text-center flex flex-col justify-center">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-foreground/20 tracking-tighter mb-4">Powerful AI Features</h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
                            Our advanced AI doesn't just extract data - it enhances, optimizes, and perfects your professional story.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {allFeatureCards.map((card, index) => (
                                <Card key={index} className="bg-white dark:bg-slate-900/50 shadow-lg hover:shadow-xl transition-shadow rounded-xl text-left p-6 flex items-start gap-4">
                                    <div className={cn("w-16 h-16 rounded-lg flex items-center justify-center shrink-0", card.bgColor)}>
                                        {card.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">{card.title}</h3>
                                        <p className="text-muted-foreground text-sm">{card.description}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="pricing" className="py-16 md:py-24 bg-muted/40">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Pricing Plans</h2>
                            <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">Choose the plan that's right for you.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Free Tier */}
                            <Card className="bg-background shadow-lg p-6 rounded-xl border">
                                <CardHeader className="p-0">
                                    <CardTitle className="text-2xl">Free</CardTitle>
                                    <CardDescription>For individuals getting started.</CardDescription>
                                    <p className="text-4xl font-bold py-4">₹0 <span className="text-lg font-normal text-muted-foreground">/ forever</span></p>
                                </CardHeader>
                                <CardContent className="p-0 mt-6">
                                    <ul className="space-y-3">
                                        {freeTierFeatures.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button variant="outline" className="w-full mt-8 text-lg py-6" asChild><Link href="/create">Get Started</Link></Button>
                                </CardContent>
                            </Card>
                            {/* Paid Tier */}
                            <Card className="bg-background shadow-lg p-6 rounded-xl border-2 border-primary relative overflow-visible">
                                <Badge className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-4 py-1">Most Popular</Badge>
                                <CardHeader className="p-0">
                                    <Tabs defaultValue="monthly" onValueChange={(value) => setBillingCycle(value as 'monthly' | 'yearly')} className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="monthly">Monthly</TabsTrigger>
                                            <TabsTrigger value="yearly">Yearly</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="monthly">
                                            <CardTitle className="text-2xl mt-4">Pro Monthly</CardTitle>
                                            <CardDescription>Ideal for short-term projects.</CardDescription>
                                            <div className="flex items-baseline gap-2 py-4">
                                                <p className="text-4xl font-bold">₹99</p>
                                                <p className="text-lg font-normal text-muted-foreground">/ month</p>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="yearly">
                                            <CardTitle className="text-2xl mt-4">Pro Yearly</CardTitle>
                                            <CardDescription>Best value for long-term users.</CardDescription>
                                            <div className="flex items-baseline gap-2 py-4">
                                                <p className="text-4xl font-bold">₹999</p>
                                                <p className="text-lg font-normal text-muted-foreground">/ year</p>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardHeader>
                                <CardContent className="p-0 mt-6">
                                    <ul className="space-y-3">
                                        {(billingCycle === 'monthly' ? monthlyPlanFeatures : yearlyPlanFeatures).map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <CheckCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        className="w-full mt-8 text-lg py-6 neon-glow"
                                        onClick={handlePayment}
                                        disabled={isPaying}
                                    >
                                        {isPaying ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            'Upgrade Now'
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-24 bg-gradient-to-r from-blue-800 to-purple-800">
                    <div className="container mx-auto px-4 text-center text-white">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Ready to Build Your Future?</h2>
                        <p className="max-w-2xl mx-auto mb-8 text-lg opacity-90">
                            Join thousands of professionals who've transformed their careers with AI-generated portfolios. Create yours in minutes, not hours.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-200 text-lg font-bold px-8 py-6 rounded-full shadow-lg transform hover:scale-105 transition-transform">
                                <Link href="/create"><Rocket className="mr-2" />Start Building Free</Link>
                            </Button>
                        </div>
                        <div className="flex justify-center items-center gap-x-8 gap-y-2 flex-wrap text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span>No Credit Card Required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span>Free Forever Plan</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span>Source Code Included</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-slate-900 text-slate-300 mt-auto">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-2">
                            <Link href="/" className="flex items-center gap-2 mb-4">
                                <div className="bg-primary p-2 rounded-lg">
                                    <Wand2 className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <div>
                                    <span className="font-bold text-xl text-white">SkillMapr</span>
                                    <p className="text-xs text-slate-400 -mt-1"></p>
                                </div>
                            </Link>
                            <p className="max-w-md text-sm">
                                Revolutionary AI-powered portfolio generation platform that transforms your professional data into stunning, deployable websites in minutes.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li><Link href="/#templates" className="hover:text-white transition-colors">Templates</Link></li>
                                <li><Link href="/#features" className="hover:text-white transition-colors">AI Features</Link></li>
                                <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-700 text-center text-sm">
                        <p className="flex items-center justify-center gap-1.5">
                            © {new Date().getFullYear()} SkillMapr. All rights reserved. Built with <Heart className="w-4 h-4 text-red-500" /> and advanced AI.
                        </p>
                    </div>
                </div>
            </footer>
            <Chatbot />
        </div>
    );
}
