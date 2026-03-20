
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UploadCloud, Github, Linkedin, Plus, FileText, Info, Rocket } from 'lucide-react';
import { DashboardNavbar } from '@/components/dashboard-navbar';
import { Stepper } from '@/components/stepper';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUnifiedCreateForm } from '@/hooks/use-unified-create-form.tsx';

export default function CreatePage() {
  const router = useRouter();
  const {
    form,
    isLoading,
    resumeFileName,
    handleFileChange,
    onSubmit,
  } = useUnifiedCreateForm();

  return (
    <div className="min-h-screen bg-muted/40">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <Stepper currentStep={1} />
        <div className="text-center my-12">
            <h1 className="text-4xl font-bold tracking-tight">Extract Your Professional Data</h1>
            <p className="text-muted-foreground mt-2">Import from GitHub, LinkedIn, or upload your resume. Or jump to manual entry.</p>
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Resume Card */}
                <Card className="bg-green-500/5 border-green-500/20 shadow-lg flex flex-col">
                    <CardHeader className="items-center text-center">
                         <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-green-100 mb-2">
                            <FileText className="w-8 h-8 text-green-600"/>
                        </div>
                        <CardTitle>Upload Resume</CardTitle>
                        <CardDescription>PDF, DOC, DOCX</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-center">
                        <Label 
                            htmlFor="resume-upload" 
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full px-6 py-10 border-2 border-dashed rounded-lg cursor-pointer",
                                form.formState.errors.resume ? "border-destructive" : "border-green-300/50"
                            )}
                        >
                            <UploadCloud className={cn("w-8 h-8 mx-auto mb-2", form.formState.errors.resume ? "text-destructive" : "text-green-600/80")} />
                            {resumeFileName ? (
                                <p className="font-medium text-primary text-sm">{resumeFileName}</p>
                            ) : (
                                <>
                                    <p className="text-green-900/80 dark:text-green-200/80 font-semibold text-sm">Drop your resume here</p>
                                    <p className="text-xs text-green-800/70 dark:text-green-300/70">Or click to choose a file</p>
                                </>
                            )}
                        </Label>
                        <Input 
                          id="resume-upload" 
                          type="file" 
                          className="hidden" 
                          onChange={handleFileChange} 
                          accept=".pdf,.doc,.docx,.txt" 
                        />
                    </CardContent>
                </Card>

                {/* GitHub Card */}
                <Card className="bg-background shadow-lg flex flex-col">
                     <CardHeader className="items-center text-center">
                         <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-gray-800 mb-2">
                            <Github className="w-8 h-8 text-white"/>
                        </div>
                        <CardTitle>GitHub Profile</CardTitle>
                        <CardDescription>Repos, contributions, tech stack</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-center">
                        <Label htmlFor="github" className="font-semibold text-sm mb-1">GitHub URL</Label>
                        <Input 
                            id="github" 
                            {...form.register('github')} 
                            placeholder="https://github.com/username"
                        />
                        {form.formState.errors.github && !form.formState.errors.root && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.github.message}</p>}
                    </CardContent>
                </Card>

                {/* LinkedIn Card */}
                <Card className="bg-background shadow-lg flex flex-col">
                     <CardHeader className="items-center text-center">
                         <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-blue-600 mb-2">
                            <Linkedin className="w-8 h-8 text-white"/>
                        </div>
                        <CardTitle>LinkedIn Profile</CardTitle>
                        <CardDescription>Experience, education, achievements</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-center">
                        <Label htmlFor="linkedin" className="font-semibold text-sm mb-1">LinkedIn URL</Label>
                        <Input 
                            id="linkedin" 
                            {...form.register('linkedin')} 
                            placeholder="https://linkedin.com/in/username"
                        />
                        {form.formState.errors.linkedin && !form.formState.errors.root && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.linkedin.message}</p>}
                    </CardContent>
                </Card>
            </div>
            {form.formState.errors.root && (
              <div className="text-center text-sm font-medium text-destructive mt-4">
                  {form.formState.errors.root.message}
              </div>
            )}
            <div className="flex justify-center mt-12">
                 <Button type="submit" size="lg" disabled={isLoading} className="w-full max-w-md text-lg py-6">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}
                    Generate Portfolio
                </Button>
            </div>
        </form>

        <Card className="max-w-2xl mx-auto mt-12 bg-background shadow-lg">
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                        <Plus className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Prefer Manual Entry?</h3>
                        <p className="text-sm text-muted-foreground">Fill in your info manually and let AI enhance it.</p>
                    </div>
                </div>
                <Button variant="outline" onClick={() => router.push('/create/editor')}>Manual Entry</Button>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
