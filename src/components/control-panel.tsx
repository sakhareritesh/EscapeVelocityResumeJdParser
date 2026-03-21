
'use client';

import React, { useState } from 'react';
import type { UserInfo } from '@/ai/flows/extract-user-info-flow';
import { generateImageAction, generateAvatarAction } from '@/app/actions/portfolio-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Wand2, Upload, Trash2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ControlPanelProps {
  userInfo: UserInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  customizations: any;
  setCustomizations: React.Dispatch<React.SetStateAction<any>>;
  themes: any;
  setThemes: React.Dispatch<React.SetStateAction<any>>;
  selectedTemplate: string;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<string>>;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const saveUserInfo = (userInfo: UserInfo | null, toast: (options: any) => void) => {
  if (!userInfo) return;
  try {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  } catch (e: any) {
    // Handle potential storage errors, e.g., quota exceeded
    console.error("Failed to save user info to local storage", e);
    toast({
      variant: 'destructive',
      title: 'Storage Error',
      description: "Couldn't save changes. Your browser's storage might be full.",
    });
  }
};

export function ControlPanel({ userInfo, setUserInfo }: ControlPanelProps) {
  const [imageGenLoading, setImageGenLoading] = useState<Record<number, boolean>>({});
  const { toast } = useToast();
  const [skillInput, setSkillInput] = useState('');
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [isGenderDialogOpen, setIsGenderDialogOpen] = useState(false);

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!userInfo) return;
    const { name, value } = e.target;
    const updatedUserInfo = { ...userInfo, [name]: value };
    setUserInfo(updatedUserInfo);
    saveUserInfo(updatedUserInfo, toast);
  };

  const handleProjectInfoChange = (index: number, field: 'title' | 'description' | 'projectUrl', value: string) => {
    if (!userInfo) return;
    const updatedProjects = [...(userInfo.projects || [])];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    const updatedUserInfo = { ...userInfo, projects: updatedProjects };
    setUserInfo(updatedUserInfo);
    saveUserInfo(updatedUserInfo, toast);
  };

  const handleSkillAdd = () => {
    if (skillInput.trim() && userInfo) {
      const updatedSkills = [...(userInfo.skills || []), skillInput.trim()];
      const updatedUserInfo = { ...userInfo, skills: updatedSkills };
      setUserInfo(updatedUserInfo);
      saveUserInfo(updatedUserInfo, toast);
      setSkillInput('');
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    if (userInfo) {
      const updatedSkills = userInfo.skills?.filter(skill => skill !== skillToRemove);
      const updatedUserInfo = { ...userInfo, skills: updatedSkills };
      setUserInfo(updatedUserInfo);
      saveUserInfo(updatedUserInfo, toast);
    }
  };

  const handleProjectImageUpload = async (projectIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && userInfo) {
      const dataUrl = await fileToDataUrl(file);
      const updatedProjects = [...(userInfo.projects || [])];
      updatedProjects[projectIndex].imageUrl = dataUrl;
      const updatedUserInfo = { ...userInfo, projects: updatedProjects };
      setUserInfo(updatedUserInfo);
      saveUserInfo(updatedUserInfo, toast);
      toast({
        title: 'Project Image Updated!',
        description: 'Your project image has been updated.',
      });
    }
  };

  const handleGenerateImage = async (projectIndex: number, projectTitle: string, projectDescription: string) => {
    setImageGenLoading(prev => ({ ...prev, [projectIndex]: true }));
    const fullPrompt = `${projectTitle}: ${projectDescription}`;
    const result = await generateImageAction({ prompt: fullPrompt });
    setImageGenLoading(prev => ({ ...prev, [projectIndex]: false }));

    if (result.success && result.data && setUserInfo && userInfo) {
      const updatedProjects = [...(userInfo.projects || [])];
      updatedProjects[projectIndex].imageUrl = result.data.imageUrl;
      const updatedUserInfo = { ...userInfo, projects: updatedProjects };
      setUserInfo(updatedUserInfo);
      saveUserInfo(updatedUserInfo, toast);
      toast({
        title: 'Image Generated!',
        description: 'The project image has been updated in the preview.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Image generation failed.',
        description: result.error,
      });
    }
  }

  const handleGenerateAvatar = async (gender?: 'man' | 'woman') => {
    setIsGenderDialogOpen(false);
    if (!userInfo) return;

    let prompt = userInfo.avatarGenerationPrompt;
    if (!prompt) {
      prompt = `A Ghibli-style anime portrait of ${userInfo.name || 'a professional'}, who is a ${userInfo.shortBio || 'passionate person'}.`;
    }

    setIsAvatarLoading(true);
    const result = await generateAvatarAction({ prompt, gender });
    setIsAvatarLoading(false);

    if (result.success && result.data && userInfo) {
      const updatedUserInfo = { ...userInfo, avatarUrl: result.data.imageUrl };
      setUserInfo(updatedUserInfo);
      saveUserInfo(updatedUserInfo, toast);
      toast({ title: 'Avatar Re-generated!', description: 'Your new Ghibli-style avatar is ready.' });
    } else {
      toast({ variant: 'destructive', title: 'Avatar Generation Failed', description: result.error });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && userInfo) {
      const dataUrl = await fileToDataUrl(file);
      const updatedUserInfo = { ...userInfo, avatarUrl: dataUrl };
      setUserInfo(updatedUserInfo);
      saveUserInfo(updatedUserInfo, toast);
      toast({ title: 'Avatar Updated!', description: 'Your personal photo has been set.' });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="mb-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-2 text-muted-foreground hover:text-foreground transition-colors">
          <Wand2 className="w-9 h-9 animated-gradient" />
          <h1 className="text-4xl font-extrabold ">
            SkillMapr
          </h1>
        </Link>
        <p className="text-muted-foreground mt-1">Build your stunning AI portfolio in minutes.</p>
      </header>

      <ScrollArea className="flex-grow pr-4 -mr-4">
        <div className="space-y-6">
          <Card className="bg-background/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="w-6 h-6 text-primary" />
                Live Editor
              </CardTitle>
              <CardDescription>Edit your info and see it update live.</CardDescription>
            </CardHeader>
            <CardContent>
              {userInfo && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={userInfo.name} onChange={handleUserInfoChange} />
                  </div>
                  <div>
                    <Label htmlFor="shortBio">Short Bio (Headline)</Label>
                    <Input id="shortBio" name="shortBio" value={userInfo.shortBio} onChange={handleUserInfoChange} />
                  </div>
                  <div>
                    <Label htmlFor="longBio">Long Bio (About Section)</Label>
                    <Textarea id="longBio" name="longBio" value={userInfo.longBio} onChange={handleUserInfoChange} rows={4} />
                  </div>

                  {/* Avatar Controls */}
                  <div className="space-y-3 pt-4 border-t">
                    <Label>Your Avatar</Label>
                    <div className="flex items-center justify-between gap-2">
                      <Label htmlFor="avatar-upload" className="flex-1">
                        <Button variant="outline" className="w-full justify-start gap-2" asChild>
                          <span><Upload className="h-4 w-4" /> Upload from computer</span>
                        </Button>
                      </Label>
                      <Input id="avatar-upload" type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />

                      <AlertDialog open={isGenderDialogOpen} onOpenChange={setIsGenderDialogOpen}>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="flex-1 gap-2" disabled={isAvatarLoading}>
                            {isAvatarLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                            Generate Ghibli Avatar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Generate Ghibli-style Avatar</AlertDialogTitle>
                            <AlertDialogDescription>
                              Select an option to help generate a more accurate avatar.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleGenerateAvatar('woman')}>Woman</AlertDialogAction>
                            <AlertDialogAction onClick={() => handleGenerateAvatar('man')}>Man</AlertDialogAction>
                            <AlertDialogAction onClick={() => handleGenerateAvatar()}>Unspecified</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div>
                    <Label>Skills</Label>
                    <div className="flex gap-2 mb-2">
                      <Input value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder="Add a new skill" onKeyDown={(e) => e.key === 'Enter' && handleSkillAdd()} />
                      <Button onClick={handleSkillAdd}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {userInfo.skills?.map((skill, index) => (
                        <div key={`${skill}-${index}`} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm">
                          <span>{skill}</span>
                          <button onClick={() => handleSkillRemove(skill)}><Trash2 className="w-3 h-3 text-destructive hover:text-destructive/80" /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project Controls */}
                  {userInfo?.projects && userInfo.projects.length > 0 && (
                    <div className="space-y-4 pt-4 border-t">
                      <Label>Projects</Label>
                      {userInfo.projects.map((project, index) => (
                        <div key={index} className="space-y-2 p-3 border rounded-md">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-semibold">{project.title}</p>
                            <div className="flex gap-1.5">
                              <Label htmlFor={`project-img-upload-${index}`} className="cursor-pointer">
                                <Button size="icon" variant="outline" asChild>
                                  <span className="flex items-center justify-center h-full w-full">
                                    <Upload className="h-4 w-4" />
                                  </span>
                                </Button>
                              </Label>
                              <Input id={`project-img-upload-${index}`} type="file" className="hidden" onChange={(e) => handleProjectImageUpload(index, e)} accept="image/*" />
                              <Button
                                size="icon"
                                variant="outline"
                                disabled={imageGenLoading[index]}
                                onClick={() => handleGenerateImage(index, project.title, project.description)}
                              >
                                {imageGenLoading[index] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`project-title-${index}`} className="text-xs">Title</Label>
                            <Input id={`project-title-${index}`} value={project.title} onChange={(e) => handleProjectInfoChange(index, 'title', e.target.value)} />
                            <Label htmlFor={`project-desc-${index}`} className="text-xs">Description</Label>
                            <Textarea id={`project-desc-${index}`} value={project.description} onChange={(e) => handleProjectInfoChange(index, 'description', e.target.value)} rows={3} />
                            <Label htmlFor={`project-url-${index}`} className="text-xs">Project URL</Label>
                            <Input id={`project-url-${index}`} value={project.projectUrl || ''} onChange={(e) => handleProjectInfoChange(index, 'projectUrl', e.target.value)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
