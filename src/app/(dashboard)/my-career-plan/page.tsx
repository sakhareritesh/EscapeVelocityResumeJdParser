'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, BookOpen, ExternalLink, Sparkles, Loader2, ChevronDown, ChevronUp, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/auth-context';
import { getUserLatestSession } from '@/lib/backend-api';
import type { SessionDetail, LearningStep } from '@/lib/backend-api';
import Link from 'next/link';

export default function MyCareerPlanPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [latestSession, setLatestSession] = useState<SessionDetail | null>(null);
    const [expandedStep, setExpandedStep] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (user?.uid) {
                try {
                    const session = await getUserLatestSession(user.uid);
                    setLatestSession(session);
                } catch (err) {
                    console.error('Failed to fetch user session:', err);
                }
            }
            setIsLoading(false);
        };
        fetchData();
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
        );
    }

    // If there's no session, show a prompt to upload
    if (!latestSession) {
        return (
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-2xl font-bold text-gray-900">My Career Plan</h1>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200"
                >
                    <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                        <Sparkles className="w-8 h-8 text-violet-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Career Plan Yet</h3>
                    <p className="text-sm text-gray-500 text-center max-w-md mb-6">
                        Upload your resume and a job description to generate your personalized career plan with AI-powered skill analysis and learning roadmap.
                    </p>
                    <Link href="/upload-resume">
                        <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white gap-2">
                            <Sparkles className="w-4 h-4" />
                            Start Your Analysis
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    const { learning_path, role_title, seniority_level, domain, stats, skill_gap, explanation } = latestSession;
    const totalSteps = learning_path?.length || 0;

    const difficultyColors: Record<string, string> = {
        Easy: 'bg-green-100 text-green-700',
        Medium: 'bg-amber-100 text-amber-700',
        Hard: 'bg-red-100 text-red-700',
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-2xl font-bold text-gray-900">My Career Plan</h1>
            </motion.div>

            {/* Plan Overview */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                {/* Role */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                        🚀
                    </div>
                    <div className="flex-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Target Role</span>
                        <p className="text-sm font-bold text-gray-900">{role_title || 'Not specified'}</p>
                        {seniority_level && (
                            <p className="text-[11px] text-gray-400">{seniority_level} · {domain}</p>
                        )}
                    </div>
                </div>

                {/* Match Score */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Skill Match</span>
                        <div className="flex items-center gap-3 mt-1">
                            <Progress value={stats.match_percentage} className="flex-1 h-2" />
                            <span className="text-sm font-bold text-gray-900">{stats.match_percentage}%</span>
                        </div>
                    </div>
                </div>

                {/* Learning Progress */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-[#0a66c2]" />
                    </div>
                    <div className="flex-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Est. Plan</span>
                        <p className="text-sm font-bold text-gray-900">
                            {stats.total_learning_hours}h · ~{stats.total_learning_weeks} weeks
                        </p>
                        <p className="text-[11px] text-gray-400">{totalSteps} learning steps · {skill_gap?.length || 0} gaps</p>
                    </div>
                </div>
            </motion.div>

            {/* Dynamic Learning Path */}
            {learning_path && learning_path.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-violet-500" />
                                Your Personalized Learning Roadmap
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {totalSteps} steps · {stats.total_learning_hours} hours total
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Learning Steps */}
            <div className="space-y-3">
                {learning_path?.map((step: LearningStep, idx: number) => {
                    const isExpanded = expandedStep === idx;

                    return (
                        <motion.div
                            key={step.step || idx}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 + idx * 0.03, duration: 0.4 }}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                        >
                            <button
                                onClick={() => setExpandedStep(isExpanded ? null : idx)}
                                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors text-left"
                            >
                                <div className="w-9 h-9 bg-violet-100 rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-sm font-bold text-violet-700">{step.step || idx + 1}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="text-sm font-bold text-gray-900">{step.skill}</h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${difficultyColors[step.difficulty] || difficultyColors.Medium}`}>
                                            {step.difficulty}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{step.reason}</p>
                                </div>
                                <div className="text-right shrink-0 hidden sm:flex items-center gap-3">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{step.estimated_hours}h</p>
                                        <p className="text-[10px] text-gray-400">est. time</p>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronUp className="w-4 h-4 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                            </button>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="border-t border-gray-100 px-4 pb-4"
                                >
                                    <div className="mt-3 mb-3">
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Why this skill?</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">{step.reason}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Resources as Cards */}
                                        {step.resources && step.resources.length > 0 && (
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                                                    <BookOpen className="w-3.5 h-3.5" /> Resources
                                                </p>
                                                <div className="space-y-2">
                                                    {step.resources.map((res, rIdx) => (
                                                        <a
                                                            key={rIdx}
                                                            href={res.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:border-violet-200 hover:bg-violet-50/50 transition-all group"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5 text-violet-400 group-hover:text-violet-600 shrink-0" />
                                                            <span className="text-xs text-gray-700 group-hover:text-violet-700 truncate font-medium">
                                                                {res.name}
                                                            </span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Milestones */}
                                        {step.milestones && step.milestones.length > 0 && (
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                                                    <Target className="w-3.5 h-3.5" /> Milestones
                                                </p>
                                                <div className="space-y-1.5">
                                                    {step.milestones.map((m, mIdx) => (
                                                        <div key={mIdx} className="flex items-start gap-2 text-xs text-gray-700">
                                                            <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                                                            <span>{m}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Project Idea */}
                                        {step.project_idea && (
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                                                    <Zap className="w-3.5 h-3.5" /> Project Idea
                                                </p>
                                                <p className="text-xs text-gray-700 leading-relaxed bg-amber-50 border border-amber-200 rounded-lg p-3">
                                                    🔨 {step.project_idea}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>


        </div>
    );
}
