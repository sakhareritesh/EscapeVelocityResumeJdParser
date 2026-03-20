'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CourseCard } from '@/components/learning/CourseCard';
import { courses } from '@/lib/learning-data';
import { Target, Pencil, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function MyCareerPlanPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const beginnerCourses = courses.filter((c) => c.level === 'Beginner');
    const intermediateCourses = courses.filter((c) => c.level === 'Intermediate');
    const advancedCourses = courses.filter((c) => c.level === 'Advanced');

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
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase">Role</span>
                            <button className="p-0.5 hover:bg-gray-100 rounded transition-colors">
                                <Pencil className="w-3 h-3 text-gray-400" />
                            </button>
                        </div>
                        <p className="text-sm font-bold text-gray-900">Founder</p>
                    </div>
                </div>

                {/* Goal */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase">Goal</span>
                            <button className="p-0.5 hover:bg-gray-100 rounded transition-colors">
                                <Pencil className="w-3 h-3 text-gray-400" />
                            </button>
                        </div>
                        <p className="text-sm font-bold text-gray-900">Grow and advance as a Founder</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-[#0a66c2]" />
                    </div>
                    <div className="flex-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Plan Progress</span>
                        <div className="flex items-center gap-3 mt-1">
                            <Progress value={25} className="flex-1 h-2" />
                            <span className="text-sm font-bold text-gray-900">25%</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Current Learning Plan */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
            >
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">
                            Applying Generative AI to Enhance Business Leadership and Strategy
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            My Learning Plan ·{' '}
                            <span className="text-[#0a66c2] cursor-pointer hover:underline">Show details</span>
                        </p>
                    </div>
                    <Button className="bg-[#0a66c2] hover:bg-[#004182] text-white gap-2">
                        <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                            <span className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-[#0a66c2] ml-0.5" />
                        </span>
                        Start learning
                    </Button>
                </div>
            </motion.div>

            {/* Learning sections */}
            {[
                { title: 'Beginner', courses: beginnerCourses, color: 'bg-green-500' },
                { title: 'Intermediate', courses: intermediateCourses, color: 'bg-amber-500' },
                { title: 'Advanced', courses: advancedCourses, color: 'bg-red-500' },
            ].map((section, sIdx) => (
                <motion.section
                    key={section.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + sIdx * 0.1, duration: 0.4 }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`w-2.5 h-2.5 rounded-full ${section.color}`} />
                        <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
                        <span className="text-xs text-gray-500">({section.courses.length} courses)</span>
                    </div>
                    <div className="space-y-3">
                        {section.courses.map((course, idx) => (
                            <CourseCard key={course.id} course={course} variant="list" index={idx} />
                        ))}
                    </div>
                </motion.section>
            ))}
        </div>
    );
}
