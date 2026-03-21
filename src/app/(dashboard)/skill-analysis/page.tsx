'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAnalysis } from '@/context/analysis-context';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    BarChart3, CheckCircle, XCircle, ArrowRight, Upload, Target,
    Briefcase, Clock, BookOpen, Sparkles, TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function SkillAnalysisPage() {
    const router = useRouter();
    const { analysisResult } = useAnalysis();

    // Redirect to upload if no analysis data
    useEffect(() => {
        if (!analysisResult) {
            router.push('/upload-resume');
        }
    }, [analysisResult, router]);

    if (!analysisResult) {
        return null;
    }

    const { role_info, resume_skills, jd_skills, skill_gap, meta } = analysisResult;
    const requiredSkills = jd_skills.filter(s => s.level === 'Required');
    const optionalSkills = jd_skills.filter(s => s.level === 'Optional');

    // Find matched skills (resume skills that are required by JD)
    const resumeSkillNames = new Set(resume_skills.map(s => s.name.toLowerCase()));
    const matchedJdSkills = requiredSkills.filter(s => resumeSkillNames.has(s.name.toLowerCase()));
    const gapSkillNames = skill_gap.map(g => (typeof g === 'string' ? g : g.skill));

    const matchColor = meta.match_percentage >= 70 ? 'text-green-600' : meta.match_percentage >= 40 ? 'text-amber-600' : 'text-red-500';
    const matchBg = meta.match_percentage >= 70 ? 'bg-green-500' : meta.match_percentage >= 40 ? 'bg-amber-500' : 'bg-red-500';

    const levelColors: Record<string, string> = {
        Expert: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
        Advanced: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
        Intermediate: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
        Beginner: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground">Skill Gap Analysis</h1>
                        <p className="text-sm text-gray-500 dark:text-muted-foreground">
                            SkillMapr analysis of your skills against the target role
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Role Info Card */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-900 dark:to-slate-950 rounded-2xl p-6 text-white"
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Target Role</p>
                        <h2 className="text-xl font-bold">{role_info.title}</h2>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="flex items-center gap-1.5 text-xs text-slate-300">
                                <Briefcase className="w-3.5 h-3.5" /> {role_info.seniority}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-slate-300">
                                <Target className="w-3.5 h-3.5" /> {role_info.domain}
                            </span>
                        </div>
                    </div>
                    <div className="text-center md:text-right">
                        <p className={`text-4xl font-bold ${matchColor}`}>{meta.match_percentage}%</p>
                        <p className="text-xs text-slate-400 mt-1">Skill Match</p>
                        <div className="w-48 mt-2">
                            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full rounded-full ${matchBg}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${meta.match_percentage}%` }}
                                    transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {[
                    { label: 'Your Skills', value: meta.total_resume_skills, icon: CheckCircle, color: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
                    { label: 'Required Skills', value: meta.total_required_skills, icon: Target, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
                    { label: 'Skill Gaps', value: meta.total_gaps, icon: XCircle, color: 'text-red-600 bg-red-50 dark:bg-red-900/30' },
                    { label: 'Est. Learning', value: `${meta.total_learning_hours}h`, icon: Clock, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-card rounded-xl border border-gray-100 dark:border-border p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-900 dark:text-foreground">{stat.value}</p>
                            <p className="text-[11px] text-gray-500 dark:text-muted-foreground">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Resume Skills */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border p-6"
            >
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h3 className="text-base font-bold text-gray-900 dark:text-foreground">Your Resume Skills</h3>
                    <span className="text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
                        {resume_skills.length} found
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {resume_skills.map((skill, idx) => (
                        <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.03, duration: 0.3 }}
                            className={`text-xs font-medium border px-3 py-1.5 rounded-full ${levelColors[skill.level] || levelColors.Intermediate}`}
                        >
                            {skill.name} · {skill.level}
                            {skill.years_experience > 0 && ` · ${skill.years_experience}y`}
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Skill Gaps */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border p-6"
            >
                <div className="flex items-center gap-2 mb-4">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <h3 className="text-base font-bold text-gray-900 dark:text-foreground">Skill Gaps</h3>
                    <span className="text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-2 py-0.5 rounded-full font-medium">
                        {skill_gap.length} missing
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {skill_gap.map((gap, idx) => {
                        const gapName = typeof gap === 'string' ? gap : gap.skill;
                        const gapCategory = typeof gap === 'string' ? '' : gap.category;
                        const relatedSkills = typeof gap === 'string' ? [] : (gap.candidate_has_related || []);
                        return (
                            <motion.div
                                key={gapName}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.04, duration: 0.3 }}
                                className="text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-700 px-3 py-1.5 rounded-full"
                                title={relatedSkills.length > 0 ? `Related: ${relatedSkills.join(', ')}` : undefined}
                            >
                                ✗ {gapName}
                                {gapCategory && <span className="text-red-400 dark:text-red-500"> [{gapCategory}]</span>}
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* JD Requirements */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border p-6"
            >
                <h3 className="text-base font-bold text-gray-900 dark:text-foreground mb-4">JD Skill Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Required ({requiredSkills.length})</p>
                        <div className="flex flex-wrap gap-2">
                            {requiredSkills.map((skill) => {
                                const isGap = gapSkillNames.some(g => g.toLowerCase() === skill.name.toLowerCase());
                                return (
                                    <span
                                        key={skill.name}
                                        className={`text-xs font-medium px-3 py-1.5 rounded-full border ${isGap
                                                ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 border-red-200 dark:border-red-700'
                                                : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700'
                                            }`}
                                    >
                                        {isGap ? '✗' : '✓'} {skill.name}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                    {optionalSkills.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Optional ({optionalSkills.length})</p>
                            <div className="flex flex-wrap gap-2">
                                {optionalSkills.map((skill) => (
                                    <span
                                        key={skill.name}
                                        className="text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full"
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Navigation */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
            >
                <Link href="/upload-resume" className="flex-1">
                    <Button variant="outline" className="w-full h-12 gap-2">
                        <Upload className="w-4 h-4" />
                        Upload New Documents
                    </Button>
                </Link>
                <Link href="/learning-roadmap" className="flex-1">
                    <Button className="w-full h-12 gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-lg shadow-violet-200 dark:shadow-none">
                        View Learning Roadmap
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}
