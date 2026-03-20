'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RoleCard, RoleGuideCard } from '@/components/learning/RoleCard';
import { RoadmapGraph } from '@/components/learning/RoadmapGraph';
import { RoleCardSkeleton } from '@/components/learning/LearningSkeletons';
import { careerRoles, careerTransitions, roleGuides } from '@/lib/learning-data';
import { ChevronDown, Info } from 'lucide-react';

export default function CareerPathsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    const visibleGuides = showMore ? roleGuides : roleGuides.slice(0, 12);

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
                    Role recommendations are based on your skills and career goals. Click on a role
                    to see how your skills match or update your career goal to view different career paths.
                </p>
            </motion.div>

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
                                Based on transitions in your industry.{' '}
                                <span className="text-[#0a66c2] font-medium cursor-pointer hover:underline">
                                    Learn more
                                </span>
                            </p>
                        </div>
                    </div>
                    <RoadmapGraph transition={careerTransitions['founder']} />
                </div>
            </motion.section>

            {/* Career Role Cards */}
            <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Explore Roles</h2>
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <RoleCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {careerRoles.map((role, idx) => (
                            <RoleCard key={role.id} role={role} index={idx} />
                        ))}
                    </div>
                )}
            </section>

            {/* Role Guides Grid */}
            <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
            >
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-4">
                        Browse our collection of Role Guides
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {visibleGuides.map((guide, idx) => (
                            <RoleGuideCard key={guide} title={guide} index={idx} />
                        ))}
                    </div>
                    {roleGuides.length > 12 && (
                        <button
                            onClick={() => setShowMore(!showMore)}
                            className="flex items-center gap-1 mx-auto mt-4 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            {showMore ? 'Show less' : 'Show more'}
                            <ChevronDown className={`w-4 h-4 transition-transform ${showMore ? 'rotate-180' : ''}`} />
                        </button>
                    )}
                </div>
            </motion.section>
        </div>
    );
}
