'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CourseCard } from '@/components/learning/CourseCard';
import { courses } from '@/lib/learning-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Bookmark, CheckCircle } from 'lucide-react';

export default function MyContentPage() {
    const inProgressCourses = courses.slice(0, 3).map((c, i) => ({
        ...c,
        progress: [35, 60, 15][i],
    }));
    const savedCourses = courses.slice(3, 7);
    const completedCourses = courses.slice(7, 9).map((c) => ({
        ...c,
        progress: 100,
    }));

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
                    Track your progress and revisit saved courses.
                </p>
            </motion.div>

            {/* Tabs */}
            <Tabs defaultValue="in-progress" className="w-full">
                <TabsList className="bg-white border border-gray-200 p-1 rounded-lg">
                    <TabsTrigger value="in-progress" className="gap-1.5 text-xs data-[state=active]:bg-[#e8f1fd] data-[state=active]:text-[#0a66c2]">
                        <BookOpen className="w-3.5 h-3.5" />
                        In Progress ({inProgressCourses.length})
                    </TabsTrigger>
                    <TabsTrigger value="saved" className="gap-1.5 text-xs data-[state=active]:bg-[#e8f1fd] data-[state=active]:text-[#0a66c2]">
                        <Bookmark className="w-3.5 h-3.5" />
                        Saved ({savedCourses.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="gap-1.5 text-xs data-[state=active]:bg-[#e8f1fd] data-[state=active]:text-[#0a66c2]">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Completed ({completedCourses.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="in-progress" className="mt-6">
                    {inProgressCourses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {inProgressCourses.map((course, idx) => (
                                <CourseCard key={course.id} course={course} index={idx} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon={<BookOpen />} message="No courses in progress yet." />
                    )}
                </TabsContent>

                <TabsContent value="saved" className="mt-6">
                    {savedCourses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {savedCourses.map((course, idx) => (
                                <CourseCard key={course.id} course={course} index={idx} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon={<Bookmark />} message="No saved courses yet." />
                    )}
                </TabsContent>

                <TabsContent value="completed" className="mt-6">
                    {completedCourses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {completedCourses.map((course, idx) => (
                                <CourseCard key={course.id} course={course} index={idx} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon={<CheckCircle />} message="No completed courses yet." />
                    )}
                </TabsContent>
            </Tabs>
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
