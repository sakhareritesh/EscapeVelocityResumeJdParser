'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import { getUserSessions } from '@/lib/backend-api';
import type { SessionListItem, LearningStep, LearningResource } from '@/lib/backend-api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
    BookOpen, Bookmark, CheckCircle, Clock, Target, BarChart3,
    ExternalLink, Sparkles, Loader2, Upload, FileText, Calendar,
    TrendingUp, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function MyContentPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [sessions, setSessions] = useState<SessionListItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (user?.uid) {
                try {
                    const userSessions = await getUserSessions(user.uid);
                    setSessions(userSessions);
                } catch (err) {
                    console.error('Failed to fetch user sessions:', err);
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

    // Collect all unique resources from all sessions
    const allResources: { resource: LearningResource; skill: string; sessionTitle: string }[] = [];
    sessions.forEach((session) => {
        session.learning_path?.forEach((step: LearningStep) => {
            step.resources?.forEach((res: LearningResource) => {
                allResources.push({
                    resource: res,
                    skill: step.skill,
                    sessionTitle: session.role_title || 'Analysis',
                });
            });
        });
    });

    // Deduplicate resources by URL
    const uniqueResources = allResources.filter(
        (item, index, self) => index === self.findIndex(t => t.resource.url === item.resource.url)
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-2xl font-bold text-gray-900">My Content</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Your analysis history, learning resources, and session data — all in one place.
                </p>
            </motion.div>

            {sessions.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200"
                >
                    <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-violet-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Content Yet</h3>
                    <p className="text-sm text-gray-500 text-center max-w-md mb-6">
                        Upload your resume to start building your personalized learning library with AI-curated resources and session history.
                    </p>
                    <Link href="/upload-resume">
                        <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white gap-2">
                            <Upload className="w-4 h-4" />
                            Upload Resume
                        </Button>
                    </Link>
                </motion.div>
            ) : (
                <Tabs defaultValue="sessions" className="w-full">
                    <TabsList className="bg-white border border-gray-200 p-1 rounded-lg">
                        <TabsTrigger value="sessions" className="gap-1.5 text-xs data-[state=active]:bg-[#e8f1fd] data-[state=active]:text-[#0a66c2]">
                            <BarChart3 className="w-3.5 h-3.5" />
                            Analysis Sessions ({sessions.length})
                        </TabsTrigger>
                        <TabsTrigger value="resources" className="gap-1.5 text-xs data-[state=active]:bg-[#e8f1fd] data-[state=active]:text-[#0a66c2]">
                            <BookOpen className="w-3.5 h-3.5" />
                            Resources ({uniqueResources.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Analysis Sessions Tab */}
                    <TabsContent value="sessions" className="mt-6">
                        <div className="space-y-4">
                            {sessions.map((session, idx) => (
                                <motion.div
                                    key={session._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                                    className="bg-white rounded-xl border border-gray-200 p-5 hover:border-violet-200 hover:shadow-sm transition-all"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-sm font-bold text-gray-900">
                                                    {session.role_title || 'Resume Analysis'}
                                                </h3>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                    session.stats.match_percentage >= 70
                                                        ? 'bg-green-100 text-green-700'
                                                        : session.stats.match_percentage >= 40
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {session.stats.match_percentage}% match
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(session.created_at).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Target className="w-3 h-3" />
                                                    {session.skill_gap?.length || 0} gaps
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {session.stats.total_learning_hours}h learning
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <TrendingUp className="w-3 h-3" />
                                                    {session.learning_path?.length || 0} steps
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skills preview */}
                                    {session.resume_skills && session.resume_skills.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                            {session.resume_skills.slice(0, 8).map((skill) => (
                                                <span
                                                    key={skill.name}
                                                    className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                                                >
                                                    {skill.name}
                                                </span>
                                            ))}
                                            {session.resume_skills.length > 8 && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-100">
                                                    +{session.resume_skills.length - 8} more
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Skill gaps preview */}
                                    {session.skill_gap && session.skill_gap.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {session.skill_gap.slice(0, 5).map((gap) => {
                                                const gapName = typeof gap === 'string' ? gap : gap.skill;
                                                return (
                                                    <span
                                                        key={gapName}
                                                        className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100"
                                                    >
                                                        ✗ {gapName}
                                                    </span>
                                                );
                                            })}
                                            {session.skill_gap.length > 5 && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-100">
                                                    +{session.skill_gap.length - 5} more gaps
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Resources Tab */}
                    <TabsContent value="resources" className="mt-6">
                        {uniqueResources.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {uniqueResources.map((item, idx) => (
                                    <motion.a
                                        key={idx}
                                        href={item.resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03, duration: 0.3 }}
                                        className="bg-white rounded-xl border border-gray-200 p-4 hover:border-violet-200 hover:shadow-md transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 bg-violet-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-violet-200 transition-colors">
                                                <ExternalLink className="w-4 h-4 text-violet-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-gray-900 group-hover:text-violet-700 transition-colors truncate">
                                                    {item.resource.name}
                                                </h4>
                                                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                                    <Sparkles className="w-3 h-3" />
                                                    {item.skill}
                                                </p>
                                                <p className="text-[10px] text-gray-300 mt-1 truncate">
                                                    {item.resource.url}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        ) : (
                            <EmptyState icon={<BookOpen />} message="No learning resources yet. Run an analysis to get AI-curated resources." />
                        )}
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="w-12 h-12 mb-3">{icon}</div>
            <p className="text-sm">{message}</p>
        </div>
    );
}
