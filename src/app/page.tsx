"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Wand2,
  FileText,
  Github,
  Linkedin,
  BrainCircuit,
  Eye,
  Bot,
  Pencil,
  Send,
  Palette,
  Rocket,
  CheckCircle,
  Heart,
  Check,
  Code,
  BarChart3,
  GraduationCap,
  Briefcase,
  Users,
  Feather,
  Sparkles,
  User,
  Download,
  LineChart,
  Gem,
  Loader2,
  Star,
  Shield,
  Cpu,
  Target,
  TrendingUp,
  BookOpen,
  Zap,
  Route,
  Upload,
  Search,
  Map,
  Brain,
  Layers,
  Database,
  Globe,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { createPaymentOrderAction } from "@/app/actions/portfolio-actions";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Chatbot } from "@/components/chatbot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, update } from "firebase/database";

// Dashboard imports for authenticated users
import { LearningSidebar } from "@/components/learning/LearningSidebar";
import { LearningNavbar } from "@/components/learning/LearningNavbar";
import { CourseCard } from "@/components/learning/CourseCard";
import { RoleCard } from "@/components/learning/RoleCard";
import { DashboardSkeleton } from "@/components/learning/LearningSkeletons";
import { courses, careerRoles } from "@/lib/learning-data";
import { motion } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════
// Data Constants
// ═══════════════════════════════════════════════════════════════════

const heroFeatureCards = [
  {
    icon: <FileText className="w-7 h-7 text-blue-500" />,
    title: "Intelligent Parsing",
    description:
      "Extracts skills & experience from Resume and Job Description with NLP precision",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    icon: <Target className="w-7 h-7 text-rose-500" />,
    title: "Skill Gap Analysis",
    description:
      "Identifies exact competency gaps between your current skills and target role",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
  },
  {
    icon: <Route className="w-7 h-7 text-emerald-500" />,
    title: "Learning Pathways",
    description:
      "Dynamically generates personalized training roadmaps to bridge skill gaps",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    icon: <Palette className="w-7 h-7 text-violet-500" />,
    title: "Portfolio Builder",
    description:
      "SkillMapr-powered portfolio generation with 15+ professional templates",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
  },
];

const howItWorksSteps = [
  {
    step: "01",
    icon: <Upload className="w-10 h-10 text-primary" />,
    title: "Upload Documents",
    description:
      "Upload your Resume and the target Job Description. Our SkillMapr-powered NLP engine intelligently parses and structures your professional data.",
    gradient: "from-blue-500/20 to-purple-500/20",
  },
  {
    step: "02",
    icon: <Search className="w-10 h-10 text-primary" />,
    title: "Analyze Skill Gaps",
    description:
      "Our custom fine-tuned model identifies your existing skills and maps them against the JD requirements, precisely highlighting competency gaps.",
    gradient: "from-purple-500/20 to-rose-500/20",
  },
  {
    step: "03",
    icon: <Map className="w-10 h-10 text-primary" />,
    title: "Get Personalized Roadmap",
    description:
      "Receive a dynamic, optimized learning pathway tailored to bridge your specific skill gaps and reach role-specific competency efficiently.",
    gradient: "from-rose-500/20 to-amber-500/20",
  },
  {
    step: "04",
    icon: <Rocket className="w-10 h-10 text-primary" />,
    title: "Build & Deploy Portfolio",
    description:
      "Create a stunning portfolio website using AI-enhanced content from your professional data. Deploy or download with a single click.",
    gradient: "from-amber-500/20 to-emerald-500/20",
  },
];

const allFeatureCards = [
  {
    icon: <BrainCircuit className="w-8 h-8 text-violet-600" />,
    title: "Adaptive Learning Engine",
    description:
      "AI-driven engine that parses a new hire's current capabilities and dynamically maps optimized, personalized training pathways to reach role-specific competency.",
    bgColor: "bg-violet-500/10",
  },
  {
    icon: <FileText className="w-8 h-8 text-blue-600" />,
    title: "Intelligent Resume Parser",
    description:
      "Advanced NLP extracts every detail from PDF/Word resumes including skills, experience levels, education, and achievements with high accuracy.",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: <Briefcase className="w-8 h-8 text-amber-600" />,
    title: "JD Skills Extraction",
    description:
      "Parses target Job Descriptions to identify required competencies, experience levels, and technical requirements for precise skill matching.",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: <Target className="w-8 h-8 text-rose-600" />,
    title: "Dynamic Gap Mapping",
    description:
      "Generates a personalized learning pathway that addresses the specific skill gap identified between your current capabilities and the target role.",
    bgColor: "bg-rose-500/10",
  },
  {
    icon: <Github className="w-8 h-8 text-purple-600" />,
    title: "GitHub Deep Analysis",
    description:
      "Automatically analyzes repositories, extracts project descriptions, identifies tech stacks, and generates compelling project narratives from your code.",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: <Palette className="w-8 h-8 text-teal-600" />,
    title: "Portfolio Generation",
    description:
      "Choose from 15+ professionally designed templates. AI enhances your content and generates a deployable portfolio website in minutes.",
    bgColor: "bg-teal-500/10",
  },
];

const techStackItems = [
  {
    name: "Next.js",
    category: "Frontend",
    icon: <Globe className="w-5 h-5" />,
  },
  {
    name: "Tailwind CSS",
    category: "Frontend",
    icon: <Palette className="w-5 h-5" />,
  },
  { name: "Flask", category: "Backend/AI", icon: <Cpu className="w-5 h-5" /> },
  {
    name: "Python",
    category: "Backend/AI",
    icon: <Code className="w-5 h-5" />,
  },
  {
    name: "Hugging Face",
    category: "AI & API",
    icon: <Brain className="w-5 h-5" />,
  },
  {
    name: "Mistral / LLaMA",
    category: "AI & API",
    icon: <BrainCircuit className="w-5 h-5" />,
  },
  {
    name: "Firebase",
    category: "Database",
    icon: <Database className="w-5 h-5" />,
  },
  {
    name: "MongoDB",
    category: "Database",
    icon: <Layers className="w-5 h-5" />,
  },
  { name: "Docker", category: "Deployment", icon: <Cpu className="w-5 h-5" /> },
  {
    name: "Razorpay",
    category: "Payment",
    icon: <Shield className="w-5 h-5" />,
  },
];

const freeTierFeatures = [
  "5 AI Resume Analyses",
  "5 Skill Gap Reports",
  "5 Learning Pathway Generations",
  "5 Portfolio Generations",
  "5 Source Code Downloads",
  "Basic Deployment",
];

const monthlyPlanFeatures = [
  "Unlimited Resume Analyses",
  "Unlimited Skill Gap Reports",
  "50 Learning Pathway Generations / month",
  "5 Portfolio Generations / month",
  "20 Source Code Downloads / month",
  "Priority AI Processing",
];

const yearlyPlanFeatures = [
  "Unlimited Resume Analyses",
  "Unlimited Skill Gap Reports",
  "600 Learning Pathway Generations / year",
  "50 Portfolio Generations / year",
  "300 Source Code Downloads / year",
  "Priority AI Processing",
];

const floatingEmojis = [
  { emoji: "🎯", top: "10%", left: "15%", size: "text-4xl", duration: "15s" },
  { emoji: "📄", top: "20%", left: "80%", size: "text-5xl", duration: "12s" },
  { emoji: "🧠", top: "70%", left: "10%", size: "text-3xl", duration: "18s" },
  { emoji: "🚀", top: "80%", left: "90%", size: "text-6xl", duration: "10s" },
  { emoji: "📊", top: "50%", left: "50%", size: "text-4xl", duration: "14s" },
  { emoji: "💡", top: "30%", left: "5%", size: "text-5xl", duration: "16s" },
  { emoji: "✨", top: "5%", left: "50%", size: "text-3xl", duration: "11s" },
  { emoji: "🗺️", top: "90%", left: "40%", size: "text-5xl", duration: "19s" },
];

// Template preview components
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
  {
    id: "dev-pro",
    name: "Developer Pro",
    description: "Terminal-inspired dark theme with code syntax highlighting",
    badge: "Most Popular",
    badgeColor: "bg-green-100 text-green-800",
    bgColor: "bg-[#1e293b]",
    textColor: "text-white",
    preview: <TemplateDevPro />,
  },
  {
    id: "creative",
    name: "Creative Studio",
    description: "Visual-first design with portfolio galleries",
    badge: "Premium",
    badgeColor: "bg-purple-100 text-purple-800",
    bgColor: "bg-gradient-to-br from-pink-400 to-purple-500",
    textColor: "text-white",
    preview: <TemplateCreative />,
  },
  {
    id: "minimalist",
    name: "Minimalist Pro",
    description: "Clean, content-focused design",
    badge: "Universal",
    badgeColor: "bg-gray-200 text-gray-800",
    bgColor: "bg-white",
    textColor: "text-gray-800",
    preview: <TemplateMinimalist />,
  },
  {
    id: "gen-z",
    name: "Gen-Z Vibrant",
    description: "Bold, colorful, and modern design",
    badge: "Trending",
    badgeColor: "bg-pink-100 text-pink-800",
    bgColor: "bg-gradient-to-br from-pink-400 to-cyan-400",
    textColor: "text-white",
    preview: <TemplateGenz />,
  },
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

  const firstName = userProfile?.name?.split(" ")[0] || "there";

  return (
    <div className="flex h-screen bg-[#f8f7f4] dark:bg-background overflow-hidden">
      <LearningSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
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
                      Start your personalized AI-adaptive onboarding journey.
                      Upload your resume to get started.
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
                    {
                      label: "Analyses Remaining",
                      value: String(userProfile?.usage?.analysis ?? 0),
                      icon: BookOpen,
                      color: "text-purple-600 bg-purple-50",
                    },
                    {
                      label: "Pathways Remaining",
                      value: String(userProfile?.usage?.generations ?? 0),
                      icon: TrendingUp,
                      color: "text-green-600 bg-green-50",
                    },
                    {
                      label: "Portfolio Credits",
                      value: String(userProfile?.usage?.generations ?? 0),
                      icon: Target,
                      color: "text-indigo-600 bg-indigo-50",
                    },
                    {
                      label: "Downloads Left",
                      value: String(userProfile?.usage?.downloads ?? 0),
                      icon: Sparkles,
                      color: "text-amber-600 bg-amber-50",
                    },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-card rounded-xl border border-gray-100 dark:border-border p-4 flex items-center gap-3"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}
                      >
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900 dark:text-foreground">
                          {stat.value}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Continue Learning */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-foreground">
                      Continue Learning
                    </h2>
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
                    <h2 className="text-lg font-bold text-gray-900 dark:text-foreground">
                      Explore Career Paths
                    </h2>
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
                    <h2 className="text-lg font-bold text-gray-900 dark:text-foreground">
                      Recommended for You
                    </h2>
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
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const handlePayment = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setIsPaying(true);

    const currentPlan = billingCycle === "monthly" ? "monthly" : "yearly";
    const amount = currentPlan === "monthly" ? 99 * 100 : 999 * 100;

    const result = await createPaymentOrderAction({
      amount: amount,
    });

    if (!result.success || !result.data) {
      setIsPaying(false);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: result.error || "Could not create payment order.",
      });
      return;
    }

    const { amount: orderAmount, id: order_id, currency } = result.data;
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      console.error("Razorpay Key ID is not set.");
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Payment gateway is not configured.",
      });
      setIsPaying(false);
      return;
    }

    const options = {
      key: razorpayKey,
      amount: orderAmount.toString(),
      currency: currency,
      name: "SkillMapr Pro",
      description: `${currentPlan === "monthly" ? "Monthly" : "Yearly"} Subscription`,
      order_id: order_id,
      handler: async function (response: any) {
        try {
          const userRef = ref(db, "users/" + user.uid);

          const newResetDate = new Date();
          let newUsage;

          if (currentPlan === "monthly") {
            newResetDate.setMonth(newResetDate.getMonth() + 1);
            newUsage = { analysis: 100, downloads: 20, generations: 5 };
          } else {
            // yearly
            newResetDate.setFullYear(newResetDate.getFullYear() + 1);
            newUsage = { analysis: 1500, downloads: 300, generations: 50 };
          }

          await update(userRef, {
            planStatus: "pro",
            plan: currentPlan,
            usage: newUsage,
            usageResetDate: newResetDate.toISOString(),
          });

          toast({
            title: "Payment Successful!",
            description: "Welcome to the Pro plan!",
          });
          router.push("/user/profile");
        } catch (error) {
          console.error("Failed to update user plan:", error);
          toast({
            variant: "destructive",
            title: "Update Failed",
            description:
              "Your payment was successful, but we failed to update your account. Please contact support.",
          });
        } finally {
          setIsPaying(false);
        }
      },
      prefill: {
        name: user.displayName || "",
        email: user.email || "",
      },
      theme: {
        color: "#7c3aed",
      },
      modal: {
        ondismiss: function () {
          toast({
            variant: "destructive",
            title: "Payment Cancelled",
            description: "You have cancelled the payment.",
          });
          setIsPaying(false);
        },
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1">
        {/* ═══════════════════════════════════════════════ */}
        {/* HERO SECTION */}
        {/* ═══════════════════════════════════════════════ */}
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
            <Badge
              variant="outline"
              className="mb-4 text-sm font-semibold border-primary/30 bg-primary/10 text-primary py-1 px-3 rounded-full"
            >
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              Adaptive Learning & Portfolio Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">
              <span className="animated-gradient">Your Skills, </span>Your
              Roadmap, <span className="animated-gradient">Your Career</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Upload your resume and job description - our SkillMapr-powered engine
              identifies skill gaps and generates a personalized learning
              pathway to accelerate your career. Plus, build a stunning
              portfolio in minutes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button asChild size="lg" className="text-lg font-bold px-8 py-6">
                <Link href="/signup">
                  <Rocket className="mr-2" />
                  Get Started Free
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg font-bold px-8 py-6"
              >
                <Link href="#how-it-works">
                  <Eye className="mr-2" />
                  See How It Works
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 w-full max-w-6xl">
            {heroFeatureCards.map((card, index) => (
              <Card
                key={index}
                className={cn(
                  "bg-background/60 dark:bg-slate-900/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl text-center p-6 flex flex-col items-center gap-3 border hover:-translate-y-1",
                  card.borderColor,
                )}
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center shrink-0",
                    card.bgColor,
                  )}
                >
                  {card.icon}
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold mb-1">{card.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {card.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* HOW IT WORKS */}
        {/* ═══════════════════════════════════════════════ */}
        <section id="how-it-works" className="py-16 md:py-24 bg-muted/40">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge
                variant="outline"
                className="mb-4 text-sm font-semibold border-primary/30 bg-primary/10 text-primary py-1 px-3 rounded-full"
              >
                <Zap className="w-4 h-4 mr-2" /> Simple & Powerful
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                How SkillMapr Works
              </h2>
              <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
                From document upload to a personalized, adaptive career roadmap
                in 4 simple steps.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorksSteps.map((step, index) => (
                <Card
                  key={index}
                  className="bg-background shadow-lg border-transparent hover:border-primary/50 transition-all duration-300 pt-6 relative overflow-hidden group"
                >
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                      step.gradient,
                    )}
                  />
                  <CardHeader className="relative z-10">
                    <div className="text-6xl font-black text-primary/10 absolute -top-2 -left-1">
                      {step.step}
                    </div>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                      {step.icon}
                    </div>
                    <CardTitle className="text-xl font-bold">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </CardContent>
                  {index < howItWorksSteps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                      <ArrowRight className="w-6 h-6 text-primary/40" />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* FEATURES - AI & PLATFORM */}
        {/* ═══════════════════════════════════════════════ */}
        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 text-center flex flex-col justify-center">
            <Badge
              variant="outline"
              className="mx-auto mb-4 text-sm font-semibold border-primary/30 bg-primary/10 text-primary py-1 px-3 rounded-full w-fit"
            >
              <BrainCircuit className="w-4 h-4 mr-2" /> SkillMapr-Powered Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Powerful AI Features
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              Our adaptive learning engine doesn't just extract data - it
              analyzes, maps, and personalizes your entire career development
              journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allFeatureCards.map((card, index) => (
                <Card
                  key={index}
                  className="bg-white dark:bg-slate-900/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl text-left p-6 flex items-start gap-4 hover:-translate-y-1"
                >
                  <div
                    className={cn(
                      "w-16 h-16 rounded-xl flex items-center justify-center shrink-0",
                      card.bgColor,
                    )}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{card.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {card.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* AI ENGINE / TECH SECTION */}
        {/* ═══════════════════════════════════════════════ */}
        <section
          id="technology"
          className="py-16 md:py-24 bg-muted/40 overflow-hidden"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge
                  variant="outline"
                  className="mb-4 text-sm font-semibold border-primary/30 bg-primary/10 text-primary py-1 px-3 rounded-full"
                >
                  <Cpu className="w-4 h-4 mr-2" /> Our AI Engine
                </Badge>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                  Custom Fine-Tuned AI Model
                </h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  Our platform is powered by a custom-built, fine-tuned language
                  model developed on top of advanced open-source architectures
                  from <strong className="text-foreground">Hugging Face</strong>
                  , including transformer variants inspired by models like{" "}
                  <strong className="text-foreground">Mistral</strong> and{" "}
                  <strong className="text-foreground">LLaMA</strong>.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Rather than using a generic pretrained model, we engineered a
                  specialized pipeline tailored specifically for resume parsing
                  and intelligent content suggestion. The model has been trained
                  on curated datasets of structured resume formats, job
                  descriptions, and industry-specific language patterns.
                </p>
                <div className="space-y-3">
                  {[
                    "Parameter-efficient fine-tuning with domain adaptation",
                    "Semantic understanding layer using embeddings",
                    "Continuous refinement through feedback loops",
                    "Full control over optimization, privacy & scalability",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-3xl opacity-50" />
                <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl p-8 border shadow-xl">
                  <h3 className="text-xl font-bold mb-6 text-center">
                    Tech Stack
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {techStackItems.map((tech, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3 hover:bg-muted transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          {tech.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{tech.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {tech.category}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* TEMPLATES (condensed) */}
        {/* ═══════════════════════════════════════════════ */}
        <section id="templates" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge
                variant="outline"
                className="mb-4 text-sm font-semibold border-primary/30 bg-primary/10 text-primary py-1 px-3 rounded-full"
              >
                <Palette className="w-4 h-4 mr-2" /> Portfolio Templates
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Stunning Portfolio Templates
              </h2>
              <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
                Select from 15+ professionally designed templates. AI auto-fills
                your content and deploys in one click.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={cn(
                    "group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-1",
                    template.bgColor,
                  )}
                >
                  <div className="h-48 flex items-center justify-center p-2">
                    {template.preview}
                  </div>
                  <div
                    className={cn(
                      "p-4 flex-grow flex flex-col",
                      template.textColor,
                    )}
                  >
                    <h3 className="text-xl font-bold">{template.name}</h3>
                    <p
                      className={cn(
                        "text-sm opacity-90 flex-grow",
                        template.textColor === "text-white"
                          ? "text-white/80"
                          : "text-gray-600",
                      )}
                    >
                      {template.description}
                    </p>
                    {template.badge && (
                      <Badge
                        className={cn(
                          "mt-4 self-start font-semibold",
                          template.badgeColor,
                        )}
                      >
                        {template.badge}
                      </Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg font-bold px-8 py-6"
              >
                <Link href="/create">
                  <Eye className="mr-2" /> View All 15+ Templates
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* PRICING */}
        {/* ═══════════════════════════════════════════════ */}
        <section id="pricing" className="py-16 md:py-24 bg-muted/40">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge
                variant="outline"
                className="mb-4 text-sm font-semibold border-primary/30 bg-primary/10 text-primary py-1 px-3 rounded-full"
              >
                <Gem className="w-4 h-4 mr-2" /> Pricing
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
                Start free and upgrade as your career grows.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Tier */}
              <Card className="bg-background shadow-lg p-6 rounded-xl border">
                <CardHeader className="p-0">
                  <CardTitle className="text-2xl">Free</CardTitle>
                  <CardDescription>
                    For individuals exploring the platform.
                  </CardDescription>
                  <p className="text-4xl font-bold py-4">
                    ₹0{" "}
                    <span className="text-lg font-normal text-muted-foreground">
                      / forever
                    </span>
                  </p>
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
                  <Button
                    variant="outline"
                    className="w-full mt-8 text-lg py-6"
                    asChild
                  >
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
              {/* Paid Tier */}
              <Card className="bg-background shadow-lg p-6 rounded-xl border-2 border-primary relative overflow-visible">
                <Badge className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-4 py-1">
                  Most Popular
                </Badge>
                <CardHeader className="p-0">
                  <Tabs
                    defaultValue="monthly"
                    onValueChange={(value) =>
                      setBillingCycle(value as "monthly" | "yearly")
                    }
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="monthly">Monthly</TabsTrigger>
                      <TabsTrigger value="yearly">Yearly</TabsTrigger>
                    </TabsList>
                    <TabsContent value="monthly">
                      <CardTitle className="text-2xl mt-4">
                        Pro Monthly
                      </CardTitle>
                      <CardDescription>
                        Full access to all AI features.
                      </CardDescription>
                      <div className="flex items-baseline gap-2 py-4">
                        <p className="text-4xl font-bold">₹99</p>
                        <p className="text-lg font-normal text-muted-foreground">
                          / month
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="yearly">
                      <CardTitle className="text-2xl mt-4">
                        Pro Yearly
                      </CardTitle>
                      <CardDescription>
                        Best value - save over 16%.
                      </CardDescription>
                      <div className="flex items-baseline gap-2 py-4">
                        <p className="text-4xl font-bold">₹999</p>
                        <p className="text-lg font-normal text-muted-foreground">
                          / year
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardHeader>
                <CardContent className="p-0 mt-6">
                  <ul className="space-y-3">
                    {(billingCycle === "monthly"
                      ? monthlyPlanFeatures
                      : yearlyPlanFeatures
                    ).map((feature, i) => (
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
                      "Upgrade Now"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* CTA SECTION */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-violet-800 via-purple-800 to-indigo-800 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center text-white relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Ready to Accelerate Your Career?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-lg opacity-90">
              Join professionals who are using AI-adaptive learning to bridge
              skill gaps, build stunning portfolios, and land their dream roles
              faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-gray-200 text-lg font-bold px-8 py-6 rounded-full shadow-lg transform hover:scale-105 transition-transform"
              >
                <Link href="/signup">
                  <Rocket className="mr-2" />
                  Start Your Journey Free
                </Link>
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
                <span>SkillMapr-Powered Insights</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ═══════════════════════════════════════════════ */}
      <footer className="bg-slate-900 text-slate-300 mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="bg-primary p-2 rounded-lg">
                  <Wand2 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <span className="font-bold text-xl text-white">
                    SkillMapr
                  </span>
                  <p className="text-xs text-slate-400 -mt-1">
                    AI-Adaptive Learning Platform
                  </p>
                </div>
              </Link>
              <p className="max-w-md text-sm">
                SkillMapr-powered adaptive learning platform that parses your resume
                and job descriptions, identifies skill gaps, generates
                personalized training roadmaps, and builds stunning portfolio
                websites - all in minutes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/#features"
                    className="hover:text-white transition-colors"
                  >
                    AI Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#technology"
                    className="hover:text-white transition-colors"
                  >
                    Our Technology
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#templates"
                    className="hover:text-white transition-colors"
                  >
                    Templates
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-700 text-center text-sm">
            <p className="flex items-center justify-center gap-1.5">
              © {new Date().getFullYear()} SkillMapr. All rights reserved. Built
              with <Heart className="w-4 h-4 text-red-500" /> and advanced AI.
            </p>
          </div>
        </div>
      </footer>
      <Chatbot />
    </div>
  );
}
