'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAnalysis } from '@/context/analysis-context';
import { Button } from '@/components/ui/button';
import {
    Route, ArrowRight, ArrowLeft, Clock, Layers, BookOpen,
    ExternalLink, ChevronDown, ChevronUp, Target, CheckCircle,
    Sparkles, Upload, Zap
} from 'lucide-react';
import Link from 'next/link';
import type { LearningStep } from '@/lib/backend-api';

export default function LearningRoadmapPage() {
    const router = useRouter();
    const { analysisResult } = useAnalysis();
    const [expandedStep, setExpandedStep] = useState<number | null>(null);

    useEffect(() => {
        if (!analysisResult) {
            router.push('/upload-resume');
        }
    }, [analysisResult, router]);

    if (!analysisResult) return null;

    const { learning_path, dependency_graph, meta, role_info } = analysisResult;

    const difficultyColors: Record<string, string> = {
        Easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        Hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    };

    const categoryColors: Record<string, string> = {
        programming_languages: 'border-l-blue-500',
        frontend_frameworks: 'border-l-purple-500',
        backend_frameworks: 'border-l-green-500',
        databases: 'border-l-amber-500',
        devops_tools: 'border-l-red-500',
        cloud_platforms: 'border-l-cyan-500',
        data_ml: 'border-l-pink-500',
        other: 'border-l-gray-400',
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <Route className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground">Personalized Learning Roadmap</h1>
                        <p className="text-sm text-gray-500 dark:text-muted-foreground">
                            Graph-based adaptive path to become a {role_info.title}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Overview Stats */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white"
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-amber-100 text-xs uppercase tracking-wider">Total Steps</p>
                        <p className="text-3xl font-bold mt-1">{learning_path.length}</p>
                    </div>
                    <div>
                        <p className="text-amber-100 text-xs uppercase tracking-wider">Learning Hours</p>
                        <p className="text-3xl font-bold mt-1">{meta.total_learning_hours}h</p>
                    </div>
                    <div>
                        <p className="text-amber-100 text-xs uppercase tracking-wider">Est. Weeks</p>
                        <p className="text-3xl font-bold mt-1">~{meta.total_learning_weeks}w</p>
                    </div>
                    <div>
                        <p className="text-amber-100 text-xs uppercase tracking-wider">Dependencies</p>
                        <p className="text-3xl font-bold mt-1">{dependency_graph.edges?.length || 0}</p>
                    </div>
                </div>
            </motion.div>

            {/* Dependency Graph Visualization */}
            {dependency_graph.edges && dependency_graph.edges.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border p-6"
                >
                    <h3 className="text-base font-bold text-gray-900 dark:text-foreground mb-4 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-amber-500" />
                        Skill Dependency Graph
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {dependency_graph.edges.map((edge, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + idx * 0.05, duration: 0.3 }}
                                className="flex items-center gap-2 bg-gray-50 dark:bg-muted py-2 px-4 rounded-lg border border-gray-200 dark:border-border"
                            >
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{edge.source}</span>
                                <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{edge.target}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Learning Steps */}
            <div className="space-y-4">
                {learning_path.map((step, idx) => {
                    const isExpanded = expandedStep === idx;
                    const borderColor = categoryColors[step.category] || categoryColors.other;

                    return (
                        <motion.div
                            key={step.step || idx}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.05, duration: 0.4 }}
                            className={`bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border overflow-hidden border-l-4 ${borderColor}`}
                        >
                            {/* Step Header */}
                            <button
                                onClick={() => setExpandedStep(isExpanded ? null : idx)}
                                className="w-full flex items-center gap-4 p-5 hover:bg-gray-50/50 dark:hover:bg-muted/50 transition-colors text-left"
                            >
                                <div className="w-10 h-10 bg-gray-100 dark:bg-muted rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{step.step || idx + 1}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="text-sm font-bold text-gray-900 dark:text-foreground">{step.skill}</h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${difficultyColors[step.difficulty] || difficultyColors.Medium}`}>
                                            {step.difficulty}
                                        </span>
                                        {step.is_implicit && (
                                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                prerequisite
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-muted-foreground mt-1 line-clamp-1">{step.reason}</p>
                                </div>
                                <div className="text-right shrink-0 hidden sm:block">
                                    <p className="text-sm font-bold text-gray-900 dark:text-foreground">{step.estimated_hours}h</p>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500">cumul: {step.cumulative_hours}h</p>
                                </div>
                                {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                                )}
                            </button>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="border-t border-gray-100 dark:border-border px-5 pb-5"
                                >
                                    {/* Reason */}
                                    <div className="mt-4 mb-4">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Why this skill?</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{step.reason}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Resources */}
                                        {step.resources && step.resources.length > 0 && (
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center gap-1.5">
                                                    <BookOpen className="w-3.5 h-3.5" /> Resources
                                                </p>
                                                <div className="space-y-2">
                                                    {step.resources.map((res, rIdx) => (
                                                        <a
                                                            key={rIdx}
                                                            href={res.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                                        >
                                                            <ExternalLink className="w-3 h-3 shrink-0" />
                                                            <span className="line-clamp-1">{res.name}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Milestones */}
                                        {step.milestones && step.milestones.length > 0 && (
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center gap-1.5">
                                                    <Target className="w-3.5 h-3.5" /> Milestones
                                                </p>
                                                <div className="space-y-1.5">
                                                    {step.milestones.map((m, mIdx) => (
                                                        <div key={mIdx} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
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
                                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center gap-1.5">
                                                    <Zap className="w-3.5 h-3.5" /> Project Idea
                                                </p>
                                                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
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

            {/* Navigation */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
            >
                <Link href="/skill-analysis" className="flex-1">
                    <Button variant="outline" className="w-full h-12 gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Skill Analysis
                    </Button>
                </Link>
                <Link href="/ai-coaching" className="flex-1">
                    <Button className="w-full h-12 gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-lg shadow-violet-200 dark:shadow-none">
                        <Sparkles className="w-4 h-4" />
                        View SkillMapr Coaching
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}
