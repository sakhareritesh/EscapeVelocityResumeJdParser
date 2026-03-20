'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { RoadmapGraph } from '@/components/learning/RoadmapGraph';
import { CourseCard } from '@/components/learning/CourseCard';
import { careerTransitions, careerRoles, courses } from '@/lib/learning-data';
import { ArrowLeft, Bookmark, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CareerPathDetailPage() {
    const params = useParams();
    const roleId = params.role as string;

    const transition = careerTransitions[roleId] || careerTransitions['founder'];
    const role = careerRoles.find((r) => r.id === roleId);
    const roleName = role?.title || transition.from;

    // Get courses relevant to this role
    const roleCourses = courses.slice(0, 6);

    return (
        <div className="space-y-8">
            {/* Back link */}
            <Link
                href="/career-paths"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Career Paths
            </Link>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-start justify-between"
            >
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{role?.icon || '🎯'}</span>
                        <h1 className="text-2xl font-bold text-gray-900">{roleName}</h1>
                    </div>
                    <p className="text-sm text-gray-600 max-w-xl">
                        {role?.description || 'Explore career transitions and growth opportunities for this role.'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <Bookmark className="w-3.5 h-3.5" /> Save
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <Share2 className="w-3.5 h-3.5" /> Share
                    </Button>
                </div>
            </motion.div>

            {/* Career Transitions */}
            <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                <h2 className="text-lg font-bold text-gray-900 mb-4">Career Transitions</h2>
                <RoadmapGraph transition={transition} />
            </motion.section>

            {/* Recommended Courses */}
            <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Recommended Courses for {roleName}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {roleCourses.map((course, idx) => (
                        <CourseCard key={course.id} course={course} index={idx} />
                    ))}
                </div>
            </section>

            {/* Skills Section */}
            <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
            >
                <h2 className="text-base font-bold text-gray-900 mb-4">Key Skills for {roleName}</h2>
                <div className="flex flex-wrap gap-2">
                    {['Leadership', 'Strategic Planning', 'Communication', 'Problem Solving', 'Team Management', 'Innovation', 'Data Analysis', 'Project Management'].map(
                        (skill, idx) => (
                            <motion.span
                                key={skill}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="text-xs font-medium bg-[#e8f1fd] text-[#0a66c2] px-3 py-1.5 rounded-full border border-[#0a66c2]/10"
                            >
                                {skill}
                            </motion.span>
                        )
                    )}
                </div>
            </motion.section>
        </div>
    );
}
