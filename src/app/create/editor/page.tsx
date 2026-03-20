
'use client';

import { useState, useEffect } from 'react';
import { ControlPanel } from '@/components/control-panel';
import { DashboardNavbar } from '@/components/dashboard-navbar';
import { Stepper } from '@/components/stepper';
import type { UserInfo } from '@/ai/flows/extract-user-info-flow';
import type { ScorePortfolioOutput } from '@/ai/flows/score-portfolio-flow';
import { Toaster } from '@/components/ui/toaster';
import { Loader2, Star, Award } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function EditorPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [portfolioScore, setPortfolioScore] = useState<ScorePortfolioOutput | null>(null);
  const [themes, setThemes] = useState<any | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('genz');
  const [customizations, setCustomizations] = useState({
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    fontFamily: 'Inter',
    layout: 'standard',
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  useEffect(() => {
    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
      const storedScoreInfo = localStorage.getItem('portfolioScore');
      if (storedScoreInfo) {
        setPortfolioScore(JSON.parse(storedScoreInfo));
      }
      const storedCustomizations = localStorage.getItem('customizations');
      if (storedCustomizations) {
        setCustomizations(JSON.parse(storedCustomizations));
      }
    } catch (error) {
        console.error("Failed to parse from local storage", error);
        setUserInfo({
          name: 'Your Name',
          shortBio: 'A passionate professional.',
          longBio: 'I am a passionate and creative professional ready to make an impact. This portfolio showcases my skills, experience, and projects. I am always open to new opportunities and collaborations.',
          skills: ['Skill 1', 'Skill 2', 'Skill 3'],
          projects: [],
          workExperience: [],
          education: [],
          achievements: [],
          contact: {},
        });
    } finally {
        setIsLoading(false);
    }
  }, []);

  if (isLoading || loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-muted/40">
      <DashboardNavbar />
       <div className="container mx-auto px-4 py-8 flex justify-between items-center">
        <Stepper currentStep={2} />
        <Button asChild size="lg">
          <Link href="/create/templates">Continue</Link>
        </Button>
      </div>

      <div className="flex-grow flex justify-center p-4 overflow-hidden">
        <div className="w-full max-w-4xl">
          <div className="h-full bg-background p-6 rounded-lg shadow-lg overflow-y-auto">
            {portfolioScore && (
              <Alert className="mb-6 bg-primary/5 border-primary/20">
                <Star className="h-4 w-4 text-primary" />
                <AlertTitle className="font-bold text-primary">Your Portfolio Score: {portfolioScore.score}/100</AlertTitle>
                <AlertDescription>
                  {portfolioScore.feedback}
                  <Progress value={portfolioScore.score} className="my-2 h-2" />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {portfolioScore.badges.map((badge, index) => (
                      <Badge key={index} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        <Award className="mr-1 h-3 w-3" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            <ControlPanel
              setThemes={setThemes}
              themes={themes}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              setCustomizations={setCustomizations}
              customizations={customizations}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
            />
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
