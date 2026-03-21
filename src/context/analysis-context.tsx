'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AnalysisResult } from '@/lib/backend-api';

interface AnalysisContextType {
  /** The latest analysis result from the backend */
  analysisResult: AnalysisResult | null;
  /** Whether an analysis is currently in progress */
  isAnalyzing: boolean;
  /** Error message if analysis failed */
  error: string | null;
  /** Set the analysis result (called after successful API call) */
  setAnalysisResult: (result: AnalysisResult | null) => void;
  /** Set analyzing state */
  setIsAnalyzing: (state: boolean) => void;
  /** Set error */
  setError: (error: string | null) => void;
  /** Clear all analysis data */
  clearAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setError(null);
  }, []);

  return (
    <AnalysisContext.Provider
      value={{
        analysisResult,
        isAnalyzing,
        error,
        setAnalysisResult,
        setIsAnalyzing,
        setError,
        clearAnalysis,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}
