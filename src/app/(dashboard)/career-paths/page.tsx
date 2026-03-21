'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RoadmapGraph } from '@/components/learning/RoadmapGraph';
import { careerTransitions, type CareerTransition } from '@/lib/learning-data';
import { Sparkles, ExternalLink, BookOpen, Clock } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { getUserLatestSession } from '@/lib/backend-api';
import type { SessionDetail, LearningStep } from '@/lib/backend-api';

export default function CareerPathsPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [latestSession, setLatestSession] = useState<SessionDetail | null>(null);

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



    // Determine career transition based on session data
    const sessionRoleKey = latestSession?.role_title?.toLowerCase().replace(/\s+/g, '-') || '';

    // Build a dynamic transition from LLM analysis if no static match
    const getDynamicTransition = (): CareerTransition => {
        if (!latestSession) return careerTransitions['founder'];

        const roleTitle = latestSession.role_title || 'Your Role';

        // If we have a dependency_graph with nodes, use those to build transitions
        if (latestSession.dependency_graph?.nodes && latestSession.dependency_graph.nodes.length > 0) {
            const topNodes = latestSession.dependency_graph.nodes.slice(0, 4);
            return {
                from: roleTitle,
                to: topNodes.map((node) => ({
                    title: `${roleTitle} + ${node.id}`,
                    subtitle: node.group?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Skill Development',
                })),
                label: 'SkillMapr Recommended',
            };
        }

        // If we have learning_path, build from skill progression
        if (latestSession.learning_path && latestSession.learning_path.length > 0) {
            const topSkills = latestSession.learning_path.slice(0, 3);
            return {
                from: roleTitle,
                to: topSkills.map((step) => ({
                    title: `${step.skill} Specialist`,
                    subtitle: step.category?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || step.difficulty,
                })),
                label: 'Based on your skill gaps',
            };
        }

        // Final fallback
        return {
            from: roleTitle,
            to: [
                { title: `Senior ${roleTitle}`, subtitle: 'Career Growth' },
                { title: `${roleTitle} Lead`, subtitle: 'Leadership' },
                { title: `${latestSession.domain || 'Industry'} Specialist`, subtitle: latestSession.domain || 'Specialization' },
            ],
            label: 'Suggested paths',
        };
    };

    const activeTransition = careerTransitions[sessionRoleKey] || getDynamicTransition();

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-2xl font-bold text-gray-900">Career Paths</h1>
                <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                    {latestSession
                        ? `Based on your analysis for "${latestSession.role_title}" - explore recommended career transitions and skill development paths.`
                        : 'Upload your resume to get personalized career path recommendations.'}
                </p>
            </motion.div>

            {/* User's Latest Analysis Summary */}
            {latestSession && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5" />
                        <h3 className="text-sm font-bold uppercase tracking-wider opacity-80">Your Profile Analysis</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-indigo-200 text-xs">Target Role</p>
                            <p className="text-lg font-bold">{latestSession.role_title}</p>
                        </div>
                        <div>
                            <p className="text-indigo-200 text-xs">Match Score</p>
                            <p className="text-lg font-bold">{latestSession.stats.match_percentage}%</p>
                        </div>
                        <div>
                            <p className="text-indigo-200 text-xs">Skills Found</p>
                            <p className="text-lg font-bold">{latestSession.resume_skills?.length || 0}</p>
                        </div>
                        <div>
                            <p className="text-indigo-200 text-xs">Skill Gaps</p>
                            <p className="text-lg font-bold">{latestSession.skill_gap?.length || 0}</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Career Transition Visualization */}
            <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-start gap-2 mb-4">
                        <div>
                            <h2 className="text-base font-bold text-gray-900">
                                Explore your next role
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {latestSession
                                    ? `Based on your analysis for ${latestSession.role_title}.`
                                    : 'Based on transitions in your industry.'}{' '}
                                <span className="text-[#0a66c2] font-medium cursor-pointer hover:underline">
                                    Learn more
                                </span>
                            </p>
                        </div>
                    </div>
                    <RoadmapGraph transition={activeTransition} />
                </div>
            </motion.section>

            {/* Dynamic Recommended Resources from Session */}
            {latestSession?.learning_path && latestSession.learning_path.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                >
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-violet-500" />
                            Recommended Learning Resources
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {latestSession.learning_path.slice(0, 6).map((step: LearningStep, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35 + idx * 0.05, duration: 0.3 }}
                                    className="bg-gray-50 rounded-xl border border-gray-100 p-4 hover:border-violet-200 hover:shadow-sm transition-all"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="text-sm font-bold text-gray-900">{step.skill}</h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${step.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                            step.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {step.difficulty}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{step.reason}</p>
                                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {step.estimated_hours}h
                                        </span>
                                        <span className="text-gray-300">•</span>
                                        <span>Step {step.step}</span>
                                    </div>
                                    {/* Resource Links as Cards */}
                                    {step.resources && step.resources.length > 0 && (
                                        <div className="space-y-2 pt-2 border-t border-gray-200">
                                            {step.resources.slice(0, 2).map((res, rIdx) => (
                                                <a
                                                    key={rIdx}
                                                    href={res.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-100 hover:border-violet-200 hover:bg-violet-50/50 transition-all group"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5 text-violet-400 group-hover:text-violet-600 shrink-0" />
                                                    <span className="text-xs text-gray-700 group-hover:text-violet-700 truncate font-medium">
                                                        {res.name}
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>
            )}


        </div>
    );
}
