'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import { CourseCard } from '@/components/learning/CourseCard';
import { RoleCard } from '@/components/learning/RoleCard';
import { DashboardSkeleton } from '@/components/learning/LearningSkeletons';
import { courses, careerRoles } from '@/lib/learning-data';
import { ArrowRight, Sparkles, TrendingUp, BookOpen, Target } from 'lucide-react';
import Link from 'next/link';

export default function LearningHome() {
    const { userProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <DashboardSkeleton />;

    const firstName = userProfile?.name?.split(' ')[0] || 'there';

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden bg-gradient-to-r from-[#0a66c2] to-[#004182] rounded-2xl p-6 md:p-8 text-white"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
                <div className="relative z-10">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                        Welcome back, {firstName}! 👋
                    </h1>
                    <p className="text-blue-100 text-sm md:text-base max-w-lg">
                        Continue your learning journey. Your personalized AI-adaptive path awaits.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-5">
                        <Link
                            href="/learning/ai-coaching"
                            className="inline-flex items-center gap-2 bg-white text-[#0a66c2] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
                        >
                            <Sparkles className="w-4 h-4" />
                            AI Coaching
                        </Link>
                        <Link
                            href="/learning/my-career-plan"
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
                    { label: 'Courses in Progress', value: '3', icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
                    { label: 'Skills Identified', value: '12', icon: TrendingUp, color: 'text-green-600 bg-green-50' },
                    { label: 'Certifications', value: '1', icon: Target, color: 'text-purple-600 bg-purple-50' },
                    { label: 'Learning Hours', value: '24h', icon: Sparkles, color: 'text-amber-600 bg-amber-50' },
                ].map((stat, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3"
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                            <p className="text-[11px] text-gray-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Continue Learning */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Continue Learning</h2>
                    <Link
                        href="/learning/my-content"
                        className="text-sm font-medium text-[#0a66c2] hover:underline flex items-center gap-1"
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
                    <h2 className="text-lg font-bold text-gray-900">Explore Career Paths</h2>
                    <Link
                        href="/learning/career-paths"
                        className="text-sm font-medium text-[#0a66c2] hover:underline flex items-center gap-1"
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
                    <h2 className="text-lg font-bold text-gray-900">Recommended for You</h2>
                    <Link
                        href="/learning/browse"
                        className="text-sm font-medium text-[#0a66c2] hover:underline flex items-center gap-1"
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
    );
}
