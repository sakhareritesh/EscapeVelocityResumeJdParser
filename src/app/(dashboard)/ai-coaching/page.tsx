'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAnalysis } from '@/context/analysis-context';
import { Button } from '@/components/ui/button';
import {
    Sparkles, ArrowLeft, MessageSquareText, Brain, Upload,
    ArrowRight, Target, Clock, BarChart3, Route
} from 'lucide-react';
import Link from 'next/link';

export default function AICoachingPage() {
    const router = useRouter();
    const { analysisResult } = useAnalysis();

    useEffect(() => {
        if (!analysisResult) {
            router.push('/upload-resume');
        }
    }, [analysisResult, router]);

    if (!analysisResult) return null;

    const { explanation, role_info, meta, learning_path, skill_gap } = analysisResult;

    // Split explanation into paragraphs for better rendering
    const paragraphs = explanation
        .split('\n')
        .filter(p => p.trim().length > 0)
        .map(p => p.trim());

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground">SkillMapr Coaching</h1>
                        <p className="text-sm text-gray-500 dark:text-muted-foreground">
                            Personalized onboarding guidance from your SkillMapr coach
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Quick Summary Cards */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {[
                    { label: 'Target Role', value: role_info.title, icon: Target, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
                    { label: 'Match Score', value: `${meta.match_percentage}%`, icon: BarChart3, color: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
                    { label: 'Skill Gaps', value: `${meta.total_gaps}`, icon: Route, color: 'text-red-600 bg-red-50 dark:bg-red-900/30' },
                    { label: 'Est. Time', value: `~${meta.total_learning_weeks}w`, icon: Clock, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-card rounded-xl border border-gray-100 dark:border-border p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-foreground truncate">{stat.value}</p>
                            <p className="text-[11px] text-gray-500 dark:text-muted-foreground">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* AI Coaching Message */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-white dark:bg-card rounded-2xl border border-gray-200 dark:border-border overflow-hidden"
            >
                {/* Coach header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">SkillMapr Onboarding Coach</h3>
                        <p className="text-xs text-purple-200">Powered by SkillMapr </p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-purple-200">Active</span>
                    </div>
                </div>

                {/* Message content */}
                <div className="p-6 md:p-8">
                    <div className="flex gap-4">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center shrink-0 mt-1">
                            <MessageSquareText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 space-y-4">
                            {paragraphs.map((paragraph, idx) => (
                                <motion.p
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
                                    className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                                >
                                    {paragraph}
                                </motion.p>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Key Action Items */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border p-6"
            >
                <h3 className="text-base font-bold text-gray-900 dark:text-foreground mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    Recommended Next Steps
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {learning_path.slice(0, 4).map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + idx * 0.1, duration: 0.3 }}
                            className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-muted rounded-lg"
                        >
                            <div className="w-7 h-7 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-purple-700 dark:text-purple-300">{step.step || idx + 1}</span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-foreground">{step.skill}</p>
                                <p className="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">
                                    {step.estimated_hours}h · {step.difficulty}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Skill Gaps Quick View */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border p-6"
            >
                <h3 className="text-base font-bold text-gray-900 dark:text-foreground mb-4">Skills to Develop</h3>
                <div className="flex flex-wrap gap-2">
                    {skill_gap.map((gap, idx) => {
                        const gapName = typeof gap === 'string' ? gap : gap.skill;
                        return (
                            <motion.span
                                key={gapName}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 + idx * 0.03, duration: 0.3 }}
                                className="text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 px-3 py-1.5 rounded-full"
                            >
                                {gapName}
                            </motion.span>
                        );
                    })}
                </div>
            </motion.div>

            {/* Navigation */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
            >
                <Link href="/learning-roadmap" className="flex-1">
                    <Button variant="outline" className="w-full h-12 gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Learning Roadmap
                    </Button>
                </Link>
                <Link href="/career-paths" className="flex-1">
                    <Button className="w-full h-12 gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-lg shadow-violet-200 dark:shadow-none">
                        Explore Career Paths
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
                <Link href="/upload-resume" className="flex-1">
                    <Button variant="outline" className="w-full h-12 gap-2">
                        <Upload className="w-4 h-4" />
                        New Analysis
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}
