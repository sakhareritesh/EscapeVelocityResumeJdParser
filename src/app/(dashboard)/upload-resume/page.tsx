"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UploadBox } from "@/components/learning/UploadBox";
import { useAnalysis } from "@/context/analysis-context";
import { analyzeResumeAndJd, checkBackendHealth } from "@/lib/backend-api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Loader2,
  FileText,
  Zap,
  CheckCircle,
  Type,
  Upload,
  ArrowRight,
  AlertCircle,
  Wifi,
  WifiOff,
  Brain,
  Target,
  Route,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

type JdInputMode = "text" | "pdf";

export default function UploadResumePage() {
  const router = useRouter();
  const { setAnalysisResult, setIsAnalyzing, setError, isAnalyzing } =
    useAnalysis();
  const { user } = useAuth();

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [jdInputMode, setJdInputMode] = useState<JdInputMode>("text");
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const hasJdInput =
    jdInputMode === "text" ? jobDescription.trim().length > 0 : jdFile !== null;
  const canGenerate = resumeFile && hasJdInput && !isAnalyzing;

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth().then(setBackendOnline);
  }, []);

  const handleJdModeSwitch = (mode: JdInputMode) => {
    setJdInputMode(mode);
    if (mode === "text") {
      setJdFile(null);
    } else {
      setJobDescription("");
    }
  };

  const handleAnalyze = async () => {
    if (!canGenerate) return;

    setAnalyzeError(null);
    setError(null);
    setIsAnalyzing(true);

    try {
      const result = await analyzeResumeAndJd({
        resumeFile: resumeFile!,
        jdFile: jdInputMode === "pdf" ? jdFile! : undefined,
        jdText: jdInputMode === "text" ? jobDescription : undefined,
        firebaseUid: user?.uid,
      });

      if (result.success) {
        setAnalysisResult(result);
        setIsAnalyzing(false);
        // Navigate to skill analysis page
        router.push("/skill-analysis");
      } else {
        throw new Error("Analysis returned unsuccessful");
      }
    } catch (err: any) {
      setIsAnalyzing(false);
      const msg = err.message || "Analysis failed. Please try again.";
      setAnalyzeError(msg);
      setError(msg);
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
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground">
              Upload Resume & Job Description
            </h1>
            <p className="text-sm text-gray-500 dark:text-muted-foreground">
              Start your personalized onboarding journey by uploading your
              documents.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Backend Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {backendOnline === false && (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <WifiOff className="w-5 h-5 text-red-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                Backend Server Offline
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                Please start the Python backend server on port 5000. Run:{" "}
                <code className="bg-red-100 dark:bg-red-900/40 px-1 rounded">
                  cd backend && python app.py
                </code>
              </p>
            </div>
          </div>
        )}
        {backendOnline === true && (
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <Wifi className="w-5 h-5 text-green-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                SkillMapr Engine Connected
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                Backend is online and ready to analyze your documents with
                SkillMapr.
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Flow Steps Overview */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          {
            icon: Upload,
            title: "Upload",
            desc: "Resume & JD files",
            color: "text-violet-600 bg-violet-50 dark:bg-violet-900/30",
            active: true,
          },
          {
            icon: Brain,
            title: "SkillMapr Analysis",
            desc: "Skill gap detection",
            color: "text-blue-600 bg-blue-50 dark:bg-blue-900/30",
            active: false,
          },
          {
            icon: Route,
            title: "Learning Path",
            desc: "Personalized roadmap",
            color: "text-amber-600 bg-amber-50 dark:bg-amber-900/30",
            active: false,
          },
          {
            icon: Sparkles,
            title: "SkillMapr Coaching",
            desc: "Onboarding guidance",
            color: "text-green-600 bg-green-50 dark:bg-green-900/30",
            active: false,
          },
        ].map((f, idx) => (
          <div
            key={idx}
            className={`bg-white dark:bg-card rounded-xl border p-4 flex items-center gap-3 ${f.active ? "border-violet-300 dark:border-violet-700 ring-2 ring-violet-100 dark:ring-violet-900" : "border-gray-100 dark:border-border"}`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${f.color}`}
            >
              <f.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-foreground">
                {f.title}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-muted-foreground">
                {f.desc}
              </p>
            </div>
            {idx < 3 && (
              <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 ml-auto hidden md:block" />
            )}
          </div>
        ))}
      </motion.div>

      {/* Upload Form */}
      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-foreground mb-2">
              Analyzing your profile...
            </h2>
            <p className="text-sm text-gray-500 dark:text-muted-foreground text-center max-w-sm">
              Our AI is parsing your resume, identifying skill gaps, and
              building a personalized graph-based learning roadmap. This may
              take 30-90 seconds.
            </p>
            <div className="flex gap-1.5 mt-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="space-y-6"
          >
            {analyzeError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                    Analysis Failed
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {analyzeError}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border p-6 space-y-6">
              {/* Resume Upload */}
              <UploadBox
                label="Upload Resume (PDF, DOCX, or TXT)"
                accept=".pdf,.docx,.doc,.txt"
                file={resumeFile}
                onFileSelect={setResumeFile}
              />

              {/* Job Description - with toggle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Job Description
                  </label>
                  <div className="flex bg-gray-100 dark:bg-muted rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => handleJdModeSwitch("text")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                        jdInputMode === "text"
                          ? "bg-white dark:bg-card text-gray-900 dark:text-foreground shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                    >
                      <Type className="w-3.5 h-3.5" />
                      Paste Text
                    </button>
                    <button
                      type="button"
                      onClick={() => handleJdModeSwitch("pdf")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                        jdInputMode === "pdf"
                          ? "bg-white dark:bg-card text-gray-900 dark:text-foreground shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload File
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {jdInputMode === "text" ? (
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
                        className="min-h-[180px] bg-gray-50/50 dark:bg-muted border-gray-200 dark:border-border text-sm resize-none focus-visible:ring-violet-500"
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
                        accept=".pdf,.docx,.doc,.txt"
                        file={jdFile}
                        onFileSelect={setJdFile}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={!canGenerate || backendOnline === false}
                className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white h-12 text-sm font-semibold gap-2 shadow-lg shadow-violet-200 dark:shadow-none"
              >
                <Sparkles className="w-4 h-4" />
                Analyze with AI & Generate Learning Path
              </Button>

              <p className="text-center text-[11px] text-gray-400 dark:text-gray-500">
                Powered by SkillMapr · Graph-Based Adaptive Pathing · ~30-90
                seconds
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
