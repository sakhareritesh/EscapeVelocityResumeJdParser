
'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, CheckCircle, XCircle, Lightbulb, UploadCloud, Building, Eye, Briefcase, Cpu, Code, ArrowRight, BookOpen, Target, Award, ExternalLink } from 'lucide-react';
import { recruitmentMatcherAction } from '@/app/actions/portfolio-actions';
import { useToast } from '@/hooks/use-toast';
import type { RecruitmentMatcherOutput, RecruitmentMatcherInput } from '@/ai/flows/recruitment-matcher-flow';
import { DashboardNavbar } from '@/components/dashboard-navbar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { jobListings as rawJobListings, parsedJobListings, type Job } from '@/lib/job-data';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

type EligibilityStatus = 'Eligible' | 'Not Eligible' | 'Pending';

export default function RecruitmentMatcherPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [resumeDataUri, setResumeDataUri] = useState<string | null>(null);
    const [resumeFileName, setResumeFileName] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<'software' | 'hardware'>('software');
    const [eligibilityResults, setEligibilityResults] = useState<Record<string, EligibilityStatus>>({});
    const [analysisReport, setAnalysisReport] = useState<RecruitmentMatcherOutput | null>(null);

    const { toast } = useToast();
    const resultsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (analysisReport && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [analysisReport]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast({ variant: 'destructive', title: 'File too large', description: 'Please upload a resume under 5MB.' });
                return;
            }
            setResumeFileName(file.name);
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                const dataUri = loadEvent.target?.result as string;
                setResumeDataUri(dataUri);
            };
            reader.readAsDataURL(file);
        }
    };

    const filteredAndSortedJobs = useMemo(() => {
        if (!selectedCategory) return [];
        return parsedJobListings.filter(job => job.category.toLowerCase() === selectedCategory);
    }, [selectedCategory]);

    const handleSubmit = async () => {
        if (!resumeDataUri) {
            toast({ variant: 'destructive', title: 'Missing Resume', description: 'Please upload your resume to begin.' });
            return;
        }
        if (!user) {
            toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to use this feature.' });
            return;
        }

        setIsLoading(true);
        setAnalysisReport(null);
        setEligibilityResults({});

        const visibleCompanyNames = new Set(filteredAndSortedJobs.map(job => job.companyName));
        if (visibleCompanyNames.size === 0) {
            toast({ variant: 'destructive', title: 'No Jobs to Analyze', description: 'There are no jobs for the selected category.' });
            setIsLoading(false);
            return;
        }

        const filteredJobEntries = rawJobListings.trim().split('---').filter(entry => {
            const companyNameMatch = entry.match(/Company:\s*(.*)/);
            if (!companyNameMatch) return false;
            const companyName = companyNameMatch[1].trim();
            return visibleCompanyNames.has(companyName);
        });

        if (filteredJobEntries.length === 0) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not find job listings to match against.' });
            setIsLoading(false);
            return;
        }

        const jobListingsText = filteredJobEntries.join('---\n');

        const result = await recruitmentMatcherAction(user.uid, {
            resumeDataUri,
            jobListingsText,
        });

        setIsLoading(false);

        if (result.success && result.data) {
            setAnalysisReport(result.data);
            const newEligibility: Record<string, EligibilityStatus> = {};
            result.data.evaluations.forEach(e => {
                newEligibility[e.companyName] = e.eligibility;
            });
            setEligibilityResults(newEligibility);
            toast({
                title: 'Analysis Complete!',
                description: `Matched against ${result.data.evaluations.length} job roles.`,
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Analysis Failed',
                description: result.error || 'An unexpected error occurred.',
            });
        }
    };

    const sortedEvaluations = useMemo(() => {
        if (!analysisReport) return [];
        return [...analysisReport.evaluations].sort((a, b) => {
            if (a.eligibility === 'Eligible' && b.eligibility !== 'Eligible') return -1;
            if (a.eligibility !== 'Eligible' && b.eligibility === 'Eligible') return 1;
            return a.companyName.localeCompare(b.companyName);
        });
    }, [analysisReport]);

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-muted/40">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/40">
            <DashboardNavbar />
            <main className="container mx-auto px-4 py-8">
                <div className="text-center my-8">
                    <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-4"><Sparkles className="w-10 h-10 text-primary" /> SkillMapr Job Matcher</h1>
                    <p className="text-muted-foreground mt-2">Upload your resume, select a category, and instantly see your eligibility and a personalized learning path.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
                    <Card className="lg:col-span-1 shadow-lg">
                        <CardHeader>
                            <CardTitle>Your Information</CardTitle>
                            <CardDescription>Provide your details to start.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label className="font-semibold">1. Upload Your Resume</Label>
                                <Label htmlFor="resume-upload" className="mt-2 flex flex-col items-center justify-center w-full px-6 py-10 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary transition-colors">
                                    <UploadCloud className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    {resumeFileName ? (
                                        <p className="font-medium text-primary text-sm">{resumeFileName}</p>
                                    ) : (
                                        <>
                                            <p className="text-gray-600 dark:text-gray-300 font-semibold text-sm">Drop your resume here</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Or click to choose a file (PDF, DOCX)</p>
                                        </>
                                    )}
                                </Label>
                                <Input id="resume-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.doc,.txt" />
                            </div>
                            <div>
                                <Label className="font-semibold">2. Select Job Category</Label>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <Button variant={selectedCategory === 'software' ? 'default' : 'outline'} onClick={() => setSelectedCategory('software')} className="h-20 flex-col gap-2">
                                        <Code className="w-8 h-8" />
                                        Software
                                    </Button>
                                    <Button variant={selectedCategory === 'hardware' ? 'default' : 'outline'} onClick={() => setSelectedCategory('hardware')} className="h-20 flex-col gap-2">
                                        <Cpu className="w-8 h-8" />
                                        Hardware
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Job Listings Marketplace: <span className="capitalize text-primary">{selectedCategory}</span></CardTitle>
                                <CardDescription>Click the button below to match your resume against these opportunities.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[400px] p-1">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {filteredAndSortedJobs.map((job, index) => (
                                            <Dialog key={index}>
                                                <DialogTrigger asChild>
                                                    <Card className={cn("flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:shadow-lg hover:border-primary transition-all relative group", job.status === 'Closed' && 'grayscale opacity-60')}>
                                                        <div className="w-16 h-16 relative mb-2">
                                                            <Image src={job.logoUrl} alt={`${job.companyName} logo`} fill className="object-contain" />
                                                        </div>
                                                        <p className="font-semibold text-sm">{job.companyName}</p>
                                                        <p className="text-xs text-muted-foreground">{job.role}</p>
                                                        <Badge variant={job.type === 'Internship' ? 'secondary' : 'default'} className="mt-1 text-xs">{job.type}</Badge>
                                                        {eligibilityResults[job.companyName] && (
                                                            <div className={cn("absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center",
                                                                eligibilityResults[job.companyName] === 'Eligible' ? 'bg-green-500' : 'bg-red-500')}>
                                                                {eligibilityResults[job.companyName] === 'Eligible' ? <CheckCircle className="w-3 h-3 text-white" /> : <XCircle className="w-3 h-3 text-white" />}
                                                            </div>
                                                        )}
                                                    </Card>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[600px]">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-2xl flex items-center gap-4">
                                                            <div className="w-16 h-16 relative">
                                                                <Image src={job.logoUrl} alt={`${job.companyName} logo`} fill className="object-contain" />
                                                            </div>
                                                            <div>
                                                                {job.companyName}
                                                                <p className="text-lg font-normal">{job.role}</p>
                                                            </div>
                                                        </DialogTitle>
                                                        {job.status === 'Closed' && (
                                                            <div className="!mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive font-semibold rounded-lg text-center">
                                                                This hiring drive has ended.
                                                            </div>
                                                        )}
                                                        <DialogDescription className="pt-4 text-left">
                                                            {job.description}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="space-y-2">
                                                            <h4 className="font-semibold">Package (LPA)</h4>
                                                            <p className="text-sm text-muted-foreground">{job.packageLPA} LPA</p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h4 className="font-semibold">Eligibility</h4>
                                                            <p className="text-sm text-muted-foreground">{job.eligibility}</p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h4 className="font-semibold">Minimum CGPA</h4>
                                                            <p className="text-sm text-muted-foreground">{job.cgpa}</p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h4 className="font-semibold">Required Skills</h4>
                                                            <div className="flex flex-wrap gap-2">
                                                                {job.skills.split(',').map(skill => (
                                                                    <Badge key={skill} variant="secondary">{skill.trim()}</Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button asChild className="w-full" disabled={job.status === 'Closed'}>
                                                        <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
                                                            Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                </DialogContent>
                                            </Dialog>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-center mb-8">
                    <Button size="lg" onClick={handleSubmit} disabled={isLoading || !resumeDataUri} className="w-full max-w-md">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Analyze My Eligibility
                    </Button>
                </div>

                <div ref={resultsRef} className="mt-12">
                    {analysisReport && (
                        <>
                            <h2 className="text-3xl font-bold text-center mb-8">Your Personalized Matching Report</h2>
                            <div className="space-y-6">
                                {sortedEvaluations.map((evaluation, index) => (
                                    <Card key={index} className={cn(
                                        "shadow-md",
                                        evaluation.eligibility === 'Eligible' ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : 'border-red-500 bg-red-50/50 dark:bg-red-900/10'
                                    )}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle>{evaluation.companyName} - <span className="font-normal">{evaluation.role}</span></CardTitle>
                                                    <CardDescription className="mt-1">Eligibility Analysis</CardDescription>
                                                </div>
                                                <Badge variant={evaluation.eligibility === 'Eligible' ? 'default' : 'destructive'} className={cn(evaluation.eligibility === 'Eligible' && "bg-green-600")}>
                                                    {evaluation.eligibility === 'Eligible' ? <CheckCircle className="mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
                                                    {evaluation.eligibility}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div>
                                                <h4 className="font-semibold text-sm">Reason:</h4>
                                                <p className="text-muted-foreground text-sm">{evaluation.reason}</p>
                                            </div>

                                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-900/20 dark:border-amber-500/30">
                                                <h4 className="font-semibold text-sm flex items-center gap-2 text-amber-800 dark:text-amber-300"><Lightbulb className="w-4 h-4" />Your Personalized Learning Path</h4>
                                                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                                    <div>
                                                        <h5 className="font-semibold flex items-center gap-2 mb-2"><BookOpen className="w-4 h-4" />Courses to Take</h5>
                                                        <ul className="list-disc pl-5 space-y-1 text-amber-700 dark:text-amber-400">
                                                            {evaluation.learningPath.courses.map((course, i) => <li key={i}>{course}</li>)}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-semibold flex items-center gap-2 mb-2"><Target className="w-4 h-4" />Projects to Build</h5>
                                                        <ul className="list-disc pl-5 space-y-1 text-amber-700 dark:text-amber-400">
                                                            {evaluation.learningPath.projects.map((project, i) => <li key={i}>{project}</li>)}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-semibold flex items-center gap-2 mb-2"><Award className="w-4 h-4" />Certifications to Earn</h5>
                                                        <ul className="list-disc pl-5 space-y-1 text-amber-700 dark:text-amber-400">
                                                            {evaluation.learningPath.certifications.map((cert, i) => <li key={i}>{cert}</li>)}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            {evaluation.suggestions && (
                                                <div>
                                                    <h4 className="font-semibold text-sm">Alternative Roles:</h4>
                                                    <p className="text-muted-foreground text-sm">{evaluation.suggestions}</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
