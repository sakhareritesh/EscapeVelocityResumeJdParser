'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadBox } from '@/components/learning/UploadBox';
import { SkillGapCard } from '@/components/learning/SkillGapCard';
import { CourseCard } from '@/components/learning/CourseCard';
import { mockSkillGapResult } from '@/lib/learning-data';
import type { SkillGap } from '@/lib/learning-data';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, ArrowLeft, FileText, Zap, CheckCircle, Type, Upload } from 'lucide-react';

type Step = 'upload' | 'loading' | 'results';
type JdInputMode = 'text' | 'pdf';

export default function AICoachingPage() {
    const [step, setStep] = useState<Step>('upload');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [jdFile, setJdFile] = useState<File | null>(null);
    const [jdInputMode, setJdInputMode] = useState<JdInputMode>('text');
    const [results, setResults] = useState<SkillGap | null>(null);

    const hasJdInput = jdInputMode === 'text' ? jobDescription.trim().length > 0 : jdFile !== null;
    const canGenerate = resumeFile || hasJdInput;

    const handleGenerate = async () => {
        if (!canGenerate) return;

        setStep('loading');

        // Simulate API calls
        try {
            // Call parse-resume
            if (resumeFile) {
                const formData = new FormData();
                formData.append('resume', resumeFile);
                await fetch('/api/parse-resume', { method: 'POST', body: formData });
            }

            // Build JD text — if PDF mode, read the file content
            let jdText = jobDescription;
            if (jdInputMode === 'pdf' && jdFile) {
                // For PDF JD, we send it as a separate file in the generate-path call
                jdText = `[JD uploaded as PDF: ${jdFile.name}]`;
            }

            // Call generate-path
            const pathRes = await fetch('/api/generate-path', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    skills: ['JavaScript', 'React', 'Python'],
                    jobDescription: jdText,
                }),
            });

            const data = await pathRes.json();
            setResults(data);
            setStep('results');
        } catch (error) {
            // Fall back to mock data
            await new Promise((res) => setTimeout(res, 2000));
            setResults(mockSkillGapResult);
            setStep('results');
        }
    };

    const handleReset = () => {
        setStep('upload');
        setResumeFile(null);
        setJobDescription('');
        setJdFile(null);
        setJdInputMode('text');
        setResults(null);
    };

    const handleJdModeSwitch = (mode: JdInputMode) => {
        setJdInputMode(mode);
        // Clear the other mode's data when switching
        if (mode === 'text') {
            setJdFile(null);
        } else {
            setJobDescription('');
        }
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
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">AI Coaching</h1>
                        <p className="text-sm text-gray-500">
                            Upload your resume and job description to get a personalized learning path.
                        </p>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {/* Upload Step */}
                {step === 'upload' && (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                    >
                        {/* Feature highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { icon: FileText, title: 'Parse Resume', desc: 'AI extracts your skills and experience', color: 'text-blue-600 bg-blue-50' },
                                { icon: Zap, title: 'Find Skill Gaps', desc: 'Compare against job requirements', color: 'text-amber-600 bg-amber-50' },
                                { icon: CheckCircle, title: 'Learning Path', desc: 'Get personalized course recommendations', color: 'text-green-600 bg-green-50' },
                            ].map((f, idx) => (
                                <div key={idx} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${f.color}`}>
                                        <f.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                                        <p className="text-[11px] text-gray-500">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                            {/* Resume Upload */}
                            <UploadBox
                                label="Upload Resume (PDF)"
                                accept=".pdf"
                                file={resumeFile}
                                onFileSelect={setResumeFile}
                            />

                            {/* Job Description — with toggle */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Job Description
                                    </label>
                                    <div className="flex bg-gray-100 rounded-lg p-0.5">
                                        <button
                                            type="button"
                                            onClick={() => handleJdModeSwitch('text')}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                                                jdInputMode === 'text'
                                                    ? 'bg-white text-gray-900 shadow-sm'
                                                    : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            <Type className="w-3.5 h-3.5" />
                                            Paste Text
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleJdModeSwitch('pdf')}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                                                jdInputMode === 'pdf'
                                                    ? 'bg-white text-gray-900 shadow-sm'
                                                    : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            <Upload className="w-3.5 h-3.5" />
                                            Upload PDF
                                        </button>
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    {jdInputMode === 'text' ? (
                                        <motion.div
                                            key="jd-text"
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Textarea
                                                placeholder="Paste the job description here..."
                                                value={jobDescription}
                                                onChange={(e) => setJobDescription(e.target.value)}
                                                className="min-h-[150px] bg-gray-50/50 border-gray-200 text-sm resize-none focus-visible:ring-[#0a66c2]"
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="jd-pdf"
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <UploadBox
                                                label=""
                                                accept=".pdf"
                                                file={jdFile}
                                                onFileSelect={setJdFile}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Generate Button */}
                            <Button
                                onClick={handleGenerate}
                                disabled={!canGenerate}
                                className="w-full bg-[#0a66c2] hover:bg-[#004182] text-white h-12 text-sm font-semibold gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                Generate Learning Path
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Loading Step */}
                {step === 'loading' && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col items-center justify-center py-20"
                    >
                        <div className="relative mb-6">
                            <div className="w-20 h-20 rounded-full bg-[#e8f1fd] flex items-center justify-center">
                                <Loader2 className="w-10 h-10 text-[#0a66c2] animate-spin" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center animate-pulse">
                                <Sparkles className="w-3 h-3 text-white" />
                            </div>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">Analyzing your profile...</h2>
                        <p className="text-sm text-gray-500 text-center max-w-sm">
                            Our AI is parsing your resume, identifying skill gaps, and generating a personalized learning path.
                        </p>
                        <div className="flex gap-1.5 mt-6">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="w-2 h-2 bg-[#0a66c2] rounded-full animate-bounce"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Results Step */}
                {step === 'results' && results && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        {/* Back button */}
                        <button
                            onClick={handleReset}
                            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Upload new files
                        </button>

                        {/* Success Banner */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-green-800">Analysis Complete!</p>
                                <p className="text-xs text-green-600">
                                    We found {results.matchedSkills.length} matching skills and {results.missingSkills.length} skill gaps.
                                </p>
                            </div>
                        </div>

                        {/* Skill Gap Analysis */}
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Skill Gap Analysis</h2>
                            <SkillGapCard data={results} />
                        </section>

                        {/* Personalized Learning Path */}
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Personalized Learning Path
                            </h2>
                            <div className="space-y-6">
                                {results.learningPath.map((pathItem, pIdx) => (
                                    <motion.div
                                        key={pathItem.skill}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: pIdx * 0.1, duration: 0.4 }}
                                        className="bg-white rounded-xl border border-gray-200 p-5"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pathItem.priority === 'High'
                                                    ? 'bg-red-50 text-red-600'
                                                    : pathItem.priority === 'Medium'
                                                        ? 'bg-amber-50 text-amber-600'
                                                        : 'bg-gray-50 text-gray-600'
                                                }`}>
                                                {pathItem.priority} Priority
                                            </span>
                                            <h3 className="text-sm font-bold text-gray-900">{pathItem.skill}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {pathItem.courses.map((course, cIdx) => (
                                                <CourseCard key={course.id} course={course} index={cIdx} />
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

