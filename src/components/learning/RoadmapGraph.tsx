'use client';

import { motion } from 'framer-motion';
import { Star, Eye } from 'lucide-react';
import type { CareerTransition } from '@/lib/learning-data';

interface RoadmapGraphProps {
    transition: CareerTransition;
}

export function RoadmapGraph({ transition }: RoadmapGraphProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 overflow-x-auto">
            <div className="min-w-[600px]">
                <div className="flex items-start gap-0">
                    {/* Source node */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-lg px-5 py-3 shadow-sm shrink-0"
                    >
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-sm">👤</span>
                        </div>
                        <span className="font-semibold text-sm text-gray-900">{transition.from}</span>
                    </motion.div>

                    {/* Connectors and targets */}
                    <div className="flex-1 flex flex-col items-stretch relative ml-[-1px]">
                        {/* Label */}
                        {transition.label && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.4 }}
                                className="flex items-center gap-1.5 ml-16 mb-2"
                            >
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <span className="text-xs font-medium text-gray-600">{transition.label}</span>
                            </motion.div>
                        )}

                        <svg
                            className="absolute left-0 top-0 w-full h-full pointer-events-none"
                            style={{ minHeight: `${transition.to.length * 70 + 20}px` }}
                        >
                            {transition.to.map((_, idx) => {
                                const startX = 0;
                                const startY = 44;
                                const endX = 200;
                                const endY = 30 + idx * 70;
                                const cpX1 = 60;
                                const cpX2 = 140;

                                return (
                                    <motion.path
                                        key={idx}
                                        d={`M ${startX} ${startY} C ${cpX1} ${startY}, ${cpX2} ${endY}, ${endX} ${endY}`}
                                        stroke={idx === 0 ? '#0a66c2' : '#93c5fd'}
                                        strokeWidth="2.5"
                                        fill="none"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ delay: 0.3 + idx * 0.15, duration: 0.6 }}
                                    />
                                );
                            })}
                        </svg>

                        {/* Target nodes */}
                        <div
                            className="flex flex-col gap-3 ml-[200px]"
                            style={{ minHeight: `${transition.to.length * 70 + 20}px` }}
                        >
                            {transition.to.map((target, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + idx * 0.15, duration: 0.4 }}
                                    className="bg-white border-2 border-gray-200 rounded-lg px-5 py-3 shadow-sm hover:border-[#0a66c2]/30 hover:shadow-md transition-all cursor-pointer"
                                    style={{ height: '58px' }}
                                >
                                    <p className="text-sm font-semibold text-gray-900">{target.title}</p>
                                    <p className="text-[11px] text-gray-500">{target.subtitle}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Similar label */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0, duration: 0.4 }}
                    className="flex items-center gap-1.5 mt-4 ml-16"
                >
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs font-medium text-gray-500">Similar transitions in your industry</span>
                </motion.div>
            </div>
        </div>
    );
}
