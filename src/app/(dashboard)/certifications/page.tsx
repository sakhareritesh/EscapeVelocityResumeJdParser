'use client';

import { motion } from 'framer-motion';
import { certifications } from '@/lib/learning-data';
import { Award, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

export default function CertificationsPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-2xl font-bold text-gray-900">Certifications</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Earn certifications to validate your skills and boost your career.
                </p>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#e8f1fd] rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-[#0a66c2]" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">
                            {certifications.filter((c) => c.progress === 100).length}
                        </p>
                        <p className="text-xs text-gray-500">Completed</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">
                            {certifications.filter((c) => c.progress > 0 && c.progress < 100).length}
                        </p>
                        <p className="text-xs text-gray-500">In Progress</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{certifications.length}</p>
                        <p className="text-xs text-gray-500">Available</p>
                    </div>
                </div>
            </motion.div>

            {/* Certification Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {certifications.map((cert, idx) => (
                    <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08, duration: 0.4 }}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 group"
                    >
                        {/* Top color bar */}
                        <div className="h-1.5 bg-gradient-to-r from-[#0a66c2] to-blue-400" />

                        <div className="p-5 space-y-4">
                            {/* Header */}
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-[#e8f1fd] rounded-lg flex items-center justify-center shrink-0">
                                    <Award className="w-5 h-5 text-[#0a66c2]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#0a66c2] transition-colors">
                                        {cert.title}
                                    </h3>
                                    <p className="text-[11px] text-gray-500 mt-0.5">{cert.issuer}</p>
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{cert.duration}</span>
                            </div>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-1.5">
                                {cert.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="text-[10px] font-medium bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full border border-gray-100"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* Progress */}
                            {cert.progress > 0 ? (
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[11px] text-gray-500">Progress</span>
                                        <span className="text-[11px] font-semibold text-gray-700">
                                            {cert.progress}%
                                        </span>
                                    </div>
                                    <Progress value={cert.progress} className="h-1.5" />
                                </div>
                            ) : null}

                            {/* CTA */}
                            <Button
                                variant={cert.progress > 0 ? 'default' : 'outline'}
                                className={`w-full text-xs font-semibold gap-1.5 ${cert.progress > 0
                                        ? 'bg-[#0a66c2] hover:bg-[#004182] text-white'
                                        : 'text-[#0a66c2] border-[#0a66c2]/30 hover:bg-[#e8f1fd]'
                                    }`}
                                size="sm"
                            >
                                {cert.progress > 0 ? 'Continue' : 'Start Certification'}
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
