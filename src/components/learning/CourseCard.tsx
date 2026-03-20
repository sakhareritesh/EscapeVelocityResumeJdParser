'use client';

import Link from 'next/link';
import { Play, Clock, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Course } from '@/lib/learning-data';
import { motion } from 'framer-motion';

interface CourseCardProps {
    course: Course;
    variant?: 'default' | 'compact' | 'list';
    index?: number;
}

export function CourseCard({ course, variant = 'default', index = 0 }: CourseCardProps) {
    if (variant === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group"
            >
                {/* Thumbnail */}
                <div className="relative w-[120px] h-[68px] rounded-lg overflow-hidden bg-gradient-to-br from-[#0a66c2]/10 to-[#0a66c2]/5 shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a66c2]/20 to-blue-400/10" />
                    <Play className="w-6 h-6 text-[#0a66c2]/60" />
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                        {course.duration}
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Course</p>
                    <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#0a66c2] transition-colors">
                        {course.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{course.instructor}</p>
                </div>

                {/* Actions */}
                <button className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 shrink-0">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
        >
            <Link
                href="#"
                className="group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300"
            >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-[#0a66c2]/15 to-blue-300/10 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a66c2]/20 via-transparent to-blue-400/10" />
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-5 h-5 text-[#0a66c2] ml-0.5" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/75 text-white text-[11px] px-2 py-0.5 rounded-md font-medium backdrop-blur-sm">
                        {course.duration}
                    </div>
                    <div className="absolute top-2 left-2">
                        <span className={cn(
                            'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                            course.level === 'Beginner' && 'bg-green-100 text-green-700',
                            course.level === 'Intermediate' && 'bg-amber-100 text-amber-700',
                            course.level === 'Advanced' && 'bg-red-100 text-red-700',
                        )}>
                            {course.level}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <p className="text-[11px] text-gray-500 font-medium mb-1">{course.category}</p>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-[#0a66c2] transition-colors leading-snug">
                        {course.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2">{course.instructor}</p>
                    {course.progress !== undefined && course.progress > 0 && (
                        <div className="mt-3">
                            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#0a66c2] rounded-full transition-all"
                                    style={{ width: `${course.progress}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">{course.progress}% complete</p>
                        </div>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}
