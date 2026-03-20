
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { extractUserInfoAction, scorePortfolioAction } from '@/app/actions/portfolio-actions';
import type { UserInfo } from '@/ai/flows/extract-user-info-flow';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  resume: z.string().optional(),
  github: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  linkedin: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
}).refine(data => data.resume || data.github || data.linkedin, {
  message: 'Please provide at least one source: Resume, GitHub, or LinkedIn.',
  path: ['root'], // assign error to root to display a general message
});

type FormValues = z.infer<typeof formSchema>;

export function useUnifiedCreateForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resume: '',
      github: '',
      linkedin: '',
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFileName(file.name);
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('resume', dataUri, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSuccess = (userInfo: UserInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    // After saving user info, kick off the scoring flow but don't wait for it
    scorePortfolioAction(userInfo).then(scoreResult => {
        if (scoreResult.success && scoreResult.data) {
            localStorage.setItem('portfolioScore', JSON.stringify(scoreResult.data));
        }
        // Even if scoring fails, we still proceed to the editor.
        router.push('/create/editor');
    });
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to create a portfolio.'});
        return;
    }
    
    setIsLoading(true);
    
    const result = await extractUserInfoAction(user.uid, { 
      resumeDataUri: data.resume,
      githubUrl: data.github,
      linkedinUrl: data.linkedin,
    });
    
    setIsLoading(false);

    if (result && result.success && result.data) {
      toast({
        title: 'Information Extracted!',
        description: 'Analyzing your portfolio strength...',
      });
      handleSuccess(result.data as UserInfo);
    } else {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: result?.error || 'An unexpected error occurred.',
        action: (<Button onClick={() => router.push('/#pricing')}>Upgrade</Button>)
      });
    }
  };

  return {
    form,
    isLoading,
    resumeFileName,
    handleFileChange,
    onSubmit,
  };
}
