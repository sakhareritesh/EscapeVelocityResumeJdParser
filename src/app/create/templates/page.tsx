
'use client';

import { useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Button } from '@/components/ui/button';
import { Rocket, Eye, X, Loader2, Download, Lock } from 'lucide-react';
import { DashboardNavbar } from '@/components/dashboard-navbar';
import { Stepper } from '@/components/stepper';
import { templates, PortfolioTemplate } from '@/components/portfolio-template';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { PortfolioPreview } from '@/components/portfolio-preview';
import type { UserInfo } from '@/ai/flows/extract-user-info-flow';
import { deployToVercelAction, downloadPortfolioAction } from '@/app/actions/portfolio-actions';
import { generatePortfolioHtmlAction } from '@/app/actions/generate-html-action';
import { saveAs } from 'file-saver';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

export default function TemplatesPage() {
    const { user, userProfile } = useAuth();
    const router = useRouter();
    const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].id);
    const [previewTemplate, setPreviewTemplate] = useState<typeof templates[0] | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isDeploying, setIsDeploying] = useState(false);
    const [isDownloading, setIsDownloading] = useState<string | null>(null);
    const [customizations, setCustomizations] = useState({
        primaryColor: '#3b82f6',
        secondaryColor: '#8b5cf6',
        fontFamily: 'Inter',
        layout: 'standard',
    });
    const { toast } = useToast();

    useEffect(() => {
        try {
            const storedUserInfo = localStorage.getItem('userInfo');
            if (storedUserInfo) {
                const parsedInfo = JSON.parse(storedUserInfo);
                setUserInfo(parsedInfo);
            }
            const storedCustomizations = localStorage.getItem('customizations');
             if (storedCustomizations) {
                setCustomizations(JSON.parse(storedCustomizations));
            }
        } catch (error) {
            console.error("Failed to parse from local storage", error);
        }
    }, []);

    const getActiveCustomizations = (templateId: string) => {
        const activeTemplate = templates.find(t => t.id === templateId);
        return {
            primaryColor: activeTemplate?.colors.primary || customizations.primaryColor,
            secondaryColor: activeTemplate?.colors.secondary || customizations.secondaryColor,
            fontFamily: 'Inter',
            layout: templateId,
        };
    }

    const generateHtmlForTemplate = (templateId: string) => {
        const activeCustomizations = getActiveCustomizations(templateId);
        
        const dummySetState = () => {};

        const portfolioComponent = PortfolioPreview({
            userInfo,
            customizations: activeCustomizations,
            selectedTemplate: templateId,
            setUserInfo: dummySetState as any,
            setCustomizations: dummySetState as any,
        });

        return ReactDOMServer.renderToStaticMarkup(portfolioComponent);
    }

    const handleDeploy = async () => {
        setIsDeploying(true);
        toast({
            title: 'Deployment Started!',
            description: 'Your portfolio is being generated and deployed. This may take a moment.',
        });
        
        const staticMarkup = generateHtmlForTemplate(selectedTemplateId);

        const htmlResult = await generatePortfolioHtmlAction({
            staticMarkup,
            name: userInfo?.name,
            includeScripts: true,
        });

        if (!htmlResult.success || !htmlResult.data) {
             toast({
                variant: 'destructive',
                title: 'Deployment Failed',
                description: 'Could not generate the portfolio HTML.',
            });
            setIsDeploying(false);
            return;
        }
        
        const deploymentContent = {
            'index.html': htmlResult.data.html,
        };

        const result = await deployToVercelAction({
            projectName: `${userInfo?.name?.replace(/\s+/g, '-').toLowerCase()}-portfolio` || 'my-portfolio',
            files: deploymentContent,
        });

        setIsDeploying(false);

        if (result.success && result.data) {
            toast({
                title: 'Deployment Successful!',
                description: 'Your portfolio is now live.',
                action: (
                   <Button asChild variant="outline" size="sm">
                     <a href={result.data.url} target="_blank" rel="noopener noreferrer">View Site</a>
                   </Button>
                )
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Deployment Failed',
                description: result.error || 'An unexpected error occurred during deployment.',
            });
        }
    }

    const handleDownload = async (templateId: string) => {
        if (!user || !userProfile) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
            return;
        }

        setIsDownloading(templateId);
        toast({ title: 'Generating source code...', description: 'Please wait a moment.' });
        
        const staticMarkup = generateHtmlForTemplate(templateId);
        const activeCustomizations = getActiveCustomizations(templateId);

        const result = await downloadPortfolioAction(user.uid, staticMarkup, userInfo?.name || 'Portfolio', activeCustomizations);

        setIsDownloading(null);

        if (result.success) {
            saveAs(result.data, 'portfolio.zip');
            toast({ title: 'Download Started!', description: 'Your portfolio source code is being downloaded.' });
        } else {
            toast({
                variant: 'destructive',
                title: 'Download Failed',
                description: result.error || 'An unexpected error occurred.',
                action: (userProfile.planStatus === 'free' ? <Button onClick={() => router.push('/#pricing')}>Upgrade</Button> : undefined),
            });
        }
    }

    const handlePreview = (template: typeof templates[0]) => {
        setPreviewTemplate(template);
         setCustomizations({
            primaryColor: template.colors.primary,
            secondaryColor: template.colors.secondary,
            fontFamily: 'Inter',
            layout: template.id
        })
    }
    
    const handleSelectTemplate = (template: typeof templates[0]) => {
        setSelectedTemplateId(template.id);
        const newCustomizations = {
             primaryColor: template.colors.primary,
             secondaryColor: template.colors.secondary,
             fontFamily: 'Inter',
             layout: template.id,
        };
        setCustomizations(newCustomizations);
        localStorage.setItem('customizations', JSON.stringify(newCustomizations));
        localStorage.setItem('selectedTemplateId', template.id);
    }


    return (
        <div className="flex flex-col h-screen">
            <DashboardNavbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Stepper currentStep={3} />
                <div className="text-center my-12">
                    <h1 className="text-4xl font-bold tracking-tight">Choose Your Template</h1>
                    <p className="text-muted-foreground mt-2">Select a professionally designed template. You can always change it later.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {templates.map((template) => (
                        <div key={template.id} className="flex flex-col">
                           <div onClick={() => handleSelectTemplate(template)} className="cursor-pointer h-full">
                                <PortfolioTemplate 
                                    template={template}
                                    isSelected={selectedTemplateId === template.id} 
                                />
                           </div>
                           <div className="grid grid-cols-2 gap-2 mt-2">
                               <Button variant="outline" className="w-full" onClick={() => handlePreview(template)}>
                                   <Eye className="mr-2 h-4 w-4" /> Preview
                               </Button>
                               <Button variant="outline" className="w-full" onClick={() => handleDownload(template.id)} disabled={isDownloading === template.id}>
                                   {isDownloading === template.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (userProfile?.planStatus === 'pro' ? <Download className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />)} 
                                   Download
                               </Button>
                           </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-12">
                    <Button 
                        size="lg" 
                        className="font-bold text-lg neon-glow bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white" 
                        onClick={handleDeploy}
                        disabled={isDeploying}
                    >
                        {isDeploying ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Rocket className="mr-2 h-5 w-5" />}
                        {isDeploying ? 'Deploying...' : `Deploy with '${templates.find(t => t.id === selectedTemplateId)?.name}'`}
                    </Button>
                </div>

                <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
                    <DialogContent className="max-w-none w-[95vw] h-[90vh] p-0 bg-background">
                         <DialogTitle className="sr-only">Portfolio Preview</DialogTitle>
                         <DialogClose asChild>
                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-50">
                                <X className="h-6 w-6" />
                            </Button>
                         </DialogClose>
                         {previewTemplate && (
                            <PortfolioPreview
                                userInfo={userInfo}
                                setUserInfo={setUserInfo}
                                customizations={{
                                    ...customizations,
                                    primaryColor: previewTemplate.colors.primary,
                                    secondaryColor: previewTemplate.colors.secondary,
                                    layout: previewTemplate.id,
                                }}
                                setCustomizations={setCustomizations}
                                selectedTemplate={previewTemplate.id}
                            />
                         )}
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
