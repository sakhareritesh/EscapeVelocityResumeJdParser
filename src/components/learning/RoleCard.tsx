'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CareerRole } from '@/lib/learning-data';
import { motion } from 'framer-motion';

interface RoleCardProps {
    role: CareerRole;
    index?: number;
}

export function RoleCard({ role, index = 0 }: RoleCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
        >
            <Link
                href={`/learning/career-paths/${role.id}`}
                className="group block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg hover:border-[#0a66c2]/20 transition-all duration-300"
            >
                <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{role.icon}</span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#0a66c2] group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-[15px] font-semibold text-gray-900 group-hover:text-[#0a66c2] transition-colors">
                    {role.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{role.description}</p>
                <div className="mt-3 flex items-center gap-1.5">
                    <span className="text-[11px] font-medium text-[#0a66c2] bg-[#e8f1fd] px-2 py-0.5 rounded-full">
                        {role.courseCount} courses
                    </span>
                </div>
            </Link>
        </motion.div>
    );
}

// Simple role guide card (used in the browse grid)
interface RoleGuideCardProps {
    title: string;
    index?: number;
}

export function RoleGuideCard({ title, index = 0 }: RoleGuideCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
        >
            <Link
                href={`/learning/career-paths/${title.toLowerCase().replace(/\s+/g, '-')}`}
                className="block px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-[#0a66c2] hover:text-[#0a66c2] hover:bg-[#e8f1fd]/50 transition-all"
            >
                {title}
            </Link>
        </motion.div>
    );
}
