'use client';

import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { SkillGap } from '@/lib/learning-data';

interface SkillGapCardProps {
    data: SkillGap;
}

export function SkillGapCard({ data }: SkillGapCardProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl border border-gray-200 p-5"
            >
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h3 className="text-sm font-semibold text-gray-900">Matched Skills</h3>
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        {data.matchedSkills.length} found
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.matchedSkills.map((skill, idx) => (
                        <motion.span
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05, duration: 0.3 }}
                            className="text-xs font-medium bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full"
                        >
                            {skill}
                        </motion.span>
                    ))}
                </div>
            </motion.div>

            {/* Missing Skills */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl border border-gray-200 p-5"
            >
                <div className="flex items-center gap-2 mb-4">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <h3 className="text-sm font-semibold text-gray-900">Skill Gaps</h3>
                    <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                        {data.missingSkills.length} missing
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.missingSkills.map((skill, idx) => (
                        <motion.span
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05, duration: 0.3 }}
                            className="text-xs font-medium bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-full"
                        >
                            {skill}
                        </motion.span>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
