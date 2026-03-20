
'use client';
import React, { useState, useEffect, useRef } from 'react';
import type { UserInfo } from '@/ai/flows/extract-user-info-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Github, Linkedin, Mail, ArrowRight, FileText, Award, Briefcase, GraduationCap, Star, BarChart3, Check, Code, Users, Feather, Sparkles, UserRound, Paintbrush, LineChart, Gem, MessageSquare, Send, X, Loader2, Video, Music, Camera, PenTool, BrainCircuit, Rocket, Palette, Heart, Gamepad, Target, ChefHat, Dumbbell, Map, Building, DraftingCompass, Home, GitFork, UserPlus, GitPullRequest, CodeXml, Layers, FileJson, Server, BookOpen, ExternalLink, Milestone, Network, Zap, Cpu, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Inter, Space_Mono, Libre_Baskerville, Source_Code_Pro, Montserrat, Lora } from 'next/font/google';
import { Badge } from './ui/badge';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell, Line as RechartsLine } from "recharts"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';
import { nanoid } from 'nanoid';
import { ScrollArea } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { saveAs } from 'file-saver';


const inter = Inter({ subsets: ['latin'] });
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'] });
const libreBaskerville = Libre_Baskerville({ subsets: ['latin'], weight: ['400', '700'] });
const sourceCodePro = Source_Code_Pro({ subsets: ['latin'], weight: ['400', '700'] });
const montserrat = Montserrat({ subsets: ['latin'] });
const lora = Lora({ subsets: ['latin'] });


interface PortfolioPreviewProps {
  userInfo: UserInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  customizations: {
    layout: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  setCustomizations: React.Dispatch<React.SetStateAction<any>>;
  selectedTemplate: string;
}

const defaultProjects = [
  { title: 'Project Showcase 1', description: 'A brief description of this cool project. It solves a real-world problem using modern technologies.', imageUrl: 'https://picsum.photos/600/400?random=1', projectUrl: '#' },
  { title: 'Project Showcase 2', description: 'Another awesome project that demonstrates my skills and passion for development.', imageUrl: 'https://picsum.photos/600/400?random=2', projectUrl: '#' },
  { title: 'Project Showcase 3', description: 'This project is a testament to my ability to build beautiful and functional applications.', imageUrl: 'https://picsum.photos/600/400?random=3', projectUrl: '#' },
];

const isValidUrl = (url?: string | null): boolean => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:');
}

function handleResumeDownload(resumeDataUri?: string) {
    if (!resumeDataUri) {
        alert("No resume available for download.");
        return;
    }
    try {
        const mimeTypeMatch = resumeDataUri.match(/data:(.*);base64,/);
        const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'application/pdf';
        const fileExtension = mimeType.split('/')[1] || 'pdf';

        const base64Data = resumeDataUri.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });

        saveAs(blob, `resume.${fileExtension}`);
    } catch (error) {
        console.error("Failed to download resume:", error);
        alert("Could not process the resume file for download.");
    }
}


function SkillsSection({ skills, className, badgeClassName }) {
  if (!skills || skills.length === 0) return null;
  return (
    <section id="skills" className={cn("py-16", className)}>
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center animated-gradient">Skills</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {skills.map((skill, index) => (
          <Badge key={index} variant="secondary" className={cn("text-lg px-4 py-2 preview-bg-secondary text-secondary-foreground", badgeClassName)}>{skill}</Badge>
        ))}
      </div>
    </section>
  )
}

function ExperienceSection({ experience, className }) {
  if (!experience || experience.length === 0) return null;
  return (
    <section id="experience" className={cn("py-16", className)}>
       <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center animated-gradient">Work Experience</h2>
       <div className="relative border-l-2 preview-border-primary ml-4 md:ml-0">
        {experience.map((job, index) => (
          <div key={index} className="mb-10 ml-8">
            <span className="absolute -left-[11px] flex items-center justify-center w-6 h-6 preview-bg-secondary rounded-full ring-8 ring-background">
              <Briefcase className="w-4 h-4 text-secondary-foreground" />
            </span>
            <h3 className="flex items-center mb-1 text-xl font-semibold">{job.role} <span className="preview-text-primary text-sm font-medium mr-2 px-2.5 py-0.5 rounded-md ml-3">{job.company}</span></h3>
            <time className="block mb-2 text-sm font-normal leading-none text-muted-foreground">{job.dates}</time>
            <p className="mb-4 text-base font-normal text-muted-foreground">{job.description}</p>
          </div>
        ))}
       </div>
    </section>
  )
}

function EducationSection({ education, className }) {
  if (!education || education.length === 0) return null;
  return (
    <section id="education" className={cn("py-16", className)}>
       <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center animated-gradient">Education</h2>
       <div className="relative border-l-2 preview-border-primary ml-4 md:ml-0">
        {education.map((edu, index) => (
          <div key={index} className="mb-10 ml-8">
            <span className="absolute -left-[11px] flex items-center justify-center w-6 h-6 preview-bg-secondary rounded-full ring-8 ring-background">
              <GraduationCap className="w-4 h-4 text-secondary-foreground" />
            </span>
            <h3 className="text-xl font-semibold">{edu.degree}</h3>
            <p className="text-md font-medium text-muted-foreground">{edu.institution}</p>
            <time className="block mt-1 text-sm font-normal leading-none text-muted-foreground">{edu.dates}</time>
          </div>
        ))}
       </div>
    </section>
  )
}

function AchievementsSection({ achievements, className }) {
  if (!achievements || achievements.length === 0) return null;
  return (
    <section id="achievements" className={cn("py-16", className)}>
       <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center animated-gradient">Achievements</h2>
       <ul className="space-y-4 max-w-2xl mx-auto">
        {achievements.map((ach, index) => (
          <li key={index} className="flex items-start gap-4 p-4 rounded-lg bg-background/5">
            <Award className="w-6 h-6 preview-text-primary mt-1 shrink-0" />
            <p className="text-muted-foreground">{ach}</p>
          </li>
        ))}
       </ul>
    </section>
  )
}


function ProjectsSection({ projects, userInfo, className, cardClassName }) {
    const projectList = (userInfo?.projects && userInfo.projects.length > 0 ? userInfo.projects : defaultProjects);
    if (projectList.length === 0) return null;
    return (
        <section id="projects" className={cn("py-16 md:py-24", className)}>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center animated-gradient">My Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectList.map((project, index) => {
              const imageUrl = isValidUrl(project.imageUrl) ? project.imageUrl : `https://picsum.photos/600/400?random=${index}`;
              
              return (
              <Card key={index} className={cn("bg-background/5 border-border/10 backdrop-blur-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-lg overflow-hidden group", cardClassName)}>
                <div className="overflow-hidden aspect-video bg-muted/50 flex items-center justify-center">
                    <Image 
                        src={imageUrl} 
                        data-ai-hint="abstract technology" 
                        width={600} 
                        height={400} 
                        alt={project.title || `Project ${index + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{project.description}</p>
                  <Button asChild className="preview-bg-primary text-primary-foreground w-full mt-2 neon-glow">
                    <a href={project.projectUrl || '#'} target="_blank" rel="noopener noreferrer">
                      View Project <ArrowRight className="ml-2 w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )})}
          </div>
        </section>
    )
}

function Footer({userInfo}) {
  return (
    <footer id="contact" className="py-16 text-center border-t border-border/10 mt-16">
      <h2 className="text-3xl font-bold mb-4 animated-gradient">Get In Touch</h2>
      <p className="max-w-xl mx-auto text-lg mb-8 text-muted-foreground">
        I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
      </p>
      <div className="flex justify-center items-center gap-4 mb-8">
          {userInfo?.contact?.email && (
             <Button asChild size="lg" className="preview-bg-primary text-primary-foreground rounded-full px-8 py-6 text-lg neon-glow">
                <a href={`mailto:${userInfo.contact.email}`}>
                    <Mail className="mr-2 w-5 h-5"/> Say Hello
                </a>
            </Button>
          )}
          {userInfo?.contact?.github && (
            <Button asChild size="icon" variant="outline" className="rounded-full w-14 h-14">
                <a href={userInfo.contact.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-6 h-6" />
                </a>
            </Button>
          )}
          {userInfo?.contact?.linkedin && (
            <Button asChild size="icon" variant="outline" className="rounded-full w-14 h-14">
                <a href={userInfo.contact.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-6 h-6" />
                </a>
            </Button>
          )}
          {userInfo?.resumeDataUri && (
             <Button onClick={() => handleResumeDownload(userInfo.resumeDataUri)} size="icon" variant="outline" className="rounded-full w-14 h-14">
                 <Download className="w-6 h-6" />
             </Button>
          )}
      </div>

       <div className="mt-8 text-muted-foreground text-sm">
          © {new Date().getFullYear()} {userInfo?.name || 'Your Name'}. All Rights Reserved.
        </div>
    </footer>
  )
}

// 1. Gen-Z Vibrant Layout
function GenzLayout({ userInfo }) {
  const avatarUrl = isValidUrl(userInfo?.avatarUrl) ? userInfo!.avatarUrl : "https://picsum.photos/256/256";

  return (
    <div className="w-full h-full">
      <ScrollArea className="w-full h-full absolute top-0 left-0">
        <div className="relative">
            <div className="fixed top-1/2 -translate-y-1/2 right-4 z-50 flex flex-col gap-2">
                {['hero', 'about', 'skills', 'projects', 'experience', 'contact'].map((section, index) => (
                <a key={index} href={`#${section}`} className="w-3 h-3 bg-white/50 rounded-full hover:bg-white transition-colors">
                    <span className="sr-only">Go to {section}</span>
                </a>
                ))}
            </div>
            
            <section id="hero" className="min-h-screen w-full flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-72 h-72 preview-bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-0 w-72 h-72 preview-bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

                <div className="relative z-10">
                <Image 
                    src={avatarUrl}
                    alt="User Avatar"
                    data-ai-hint="professional headshot"
                    width={200}
                    height={200}
                    className="rounded-full mb-8 border-4 shadow-2xl preview-border-primary"
                />
                <h1 className="text-7xl md:text-9xl font-extrabold animated-gradient">{userInfo?.name || 'Your Name'}</h1>
                <p className="text-2xl md:text-4xl mt-4 text-foreground/80 font-medium">{userInfo?.shortBio || 'A Passionate Professional'}</p>
                 {userInfo?.resumeDataUri && (
                    <Button onClick={() => handleResumeDownload(userInfo.resumeDataUri)} variant="outline" className="mt-8 rounded-full">
                        <Download className="mr-2 h-4 w-4" /> Download Resume
                    </Button>
                )}
                </div>
            </section>

            <section id="about" className="py-24 w-full flex items-center justify-center p-4">
                <div className="max-w-4xl text-center">
                    <h2 className="text-5xl md:text-7xl font-bold mb-6 animated-gradient">About Me</h2>
                    <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
                    {userInfo?.longBio || "I'm a dedicated and results-driven professional with a strong background in my field. This portfolio showcases my journey, skills, and the projects I'm passionate about. I thrive on solving complex problems and creating innovative solutions."}
                    </p>
                </div>
            </section>

            <SkillsSection skills={userInfo?.skills} className="py-24" />
            <ProjectsSection projects={userInfo?.projects} userInfo={userInfo} />
            <ExperienceSection experience={userInfo?.workExperience} className="py-24"/>
            <EducationSection education={userInfo?.education} className="py-24"/>
            <AchievementsSection achievements={userInfo?.achievements} className="py-24"/>
            <Footer userInfo={userInfo} />
        </div>
      </ScrollArea>
    </div>
  );
}

// 2. Minimalist Pro Layout
function MinimalistLayout({ userInfo }) {
  return (
     <ScrollArea className="h-full w-full">
        <div className="p-8 md:p-16 max-w-4xl mx-auto bg-white text-black">
          <header className="fixed top-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-b z-50">
              <nav className="max-w-4xl mx-auto flex justify-between items-center">
                <a href="#hero" className="font-bold text-lg">{userInfo?.name || 'Your Name'}</a>
                <div className="flex gap-4 text-sm">
                    <a href="#projects" className="hover:underline">Work</a>
                    <a href="#experience" className="hover:underline">Experience</a>
                    <a href="#contact" className="hover:underline">Contact</a>
                     {userInfo?.resumeDataUri && (
                        <button onClick={() => handleResumeDownload(userInfo.resumeDataUri)} className="hover:underline">Resume</button>
                    )}
                </div>
              </nav>
          </header>

          <main className="pt-24 space-y-32">
              <section id="hero" className="text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-2">{userInfo?.name || 'Your Name'}</h1>
                <p className="text-xl md:text-2xl text-gray-600">{userInfo?.shortBio || 'A Passionate Professional'}</p>
                 <p className="text-lg leading-relaxed text-gray-800 max-w-2xl mx-auto mt-8">
                  {userInfo?.longBio || "I'm a dedicated and results-driven professional with a strong background in my field. This portfolio showcases my journey, skills, and the projects I'm passionate about. I thrive on solving complex problems and creating innovative solutions."}
                </p>
              </section>

              <SkillsSection skills={userInfo?.skills} />
              <ProjectsSection projects={userInfo?.projects} userInfo={userInfo} />
              <ExperienceSection experience={userInfo?.workExperience} />
              <EducationSection education={userInfo?.education} />
              <AchievementsSection achievements={userInfo?.achievements} />
              
              <footer id="contact" className="text-center py-16 border-t">
                  <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
                  <a href={`mailto:${userInfo?.contact?.email || ''}`} className="text-lg text-blue-600 hover:underline">{userInfo?.contact?.email}</a>
                  <div className="flex justify-center gap-4 mt-8">
                    <a href={userInfo?.contact?.github || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black"><Github /></a>
                    <a href={userInfo?.contact?.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black"><Linkedin /></a>
                  </div>
              </footer>
          </main>
        </div>
    </ScrollArea>
  );
}

// 3. Classic Pro Layout
function ClassicLayout({ userInfo }) {
  const avatarUrl = isValidUrl(userInfo?.avatarUrl) ? userInfo!.avatarUrl : "https://picsum.photos/128/128";
  return (
    <div className="flex w-full h-full">
      <ScrollArea className="w-1/4 h-full preview-bg-secondary text-secondary-foreground">
        <aside className="p-8 flex flex-col items-center text-center sticky top-0">
          <Image 
            src={avatarUrl}
            alt="User Avatar"
            data-ai-hint="professional headshot"
            width={128}
            height={128}
            className="rounded-full mb-6 border-4 border-white"
          />
          <h1 className="text-3xl font-bold">{userInfo?.name || 'Your Name'}</h1>
          <p className="text-lg mt-1">{userInfo?.shortBio || 'A Passionate Professional'}</p>
          <nav className="mt-8 space-y-3 text-left w-full">
              <a href="#about" className="block p-2 rounded hover:bg-black/10">About</a>
              <a href="#projects" className="block p-2 rounded hover:bg-black/10">Projects</a>
              <a href="#experience" className="block p-2 rounded hover:bg-black/10">Experience</a>
              <a href="#education" className="block p-2 rounded hover:bg-black/10">Education</a>
          </nav>
           {userInfo?.resumeDataUri && (
                <Button onClick={() => handleResumeDownload(userInfo.resumeDataUri)} variant="outline" className="mt-4 w-full">
                    <Download className="mr-2 h-4 w-4" /> Download Resume
                </Button>
            )}
          <div className="mt-8 pt-8 border-t border-secondary-foreground/20 space-y-4">
            <a href={userInfo?.contact?.github || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline"><Github /> GitHub</a>
            <a href={userInfo?.contact?.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline"><Linkedin /> LinkedIn</a>
            <a href={`mailto:${userInfo?.contact?.email || '#'}`} className="flex items-center gap-2 hover:underline"><Mail /> Email</a>
          </div>
        </aside>
      </ScrollArea>
      <ScrollArea className="w-3/4 h-full">
        <main className="p-8 md:p-12">
          <section id="about" className="mb-12">
            <h2 className="text-4xl font-bold mb-4 preview-text-primary">About Me</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {userInfo?.longBio || "I'm a dedicated and results-driven professional with a strong background in my field. This portfolio showcases my journey, skills, and the projects I'm passionate about. I thrive on solving complex problems and creating innovative solutions."}
            </p>
          </section>
          <SkillsSection skills={userInfo?.skills} />
          <ProjectsSection projects={userInfo?.projects} userInfo={userInfo} />
          <ExperienceSection experience={userInfo?.workExperience} />
          <EducationSection education={userInfo?.education} />
          <AchievementsSection achievements={userInfo?.achievements} />
        </main>
      </ScrollArea>
    </div>
  );
}

// 4. Developer Pro Layout
function DeveloperProLayout({ userInfo, customizations }) {
    const projectList = (userInfo?.projects && userInfo.projects.length > 0 ? userInfo.projects : defaultProjects);
    const avatarUrl = isValidUrl(userInfo?.avatarUrl) ? userInfo.avatarUrl : "https://picsum.photos/128/128";
    
    const contributions = Array.from({ length: 365 }, (_, i) => {
      const date = new Date(2023, 0, 1);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      return {
        date: dateString,
        count: Math.floor(Math.random() * 15),
      }
    });

    return (
      <ScrollArea className="h-full w-full">
        <div className={cn("bg-[#0d1117] text-[#c9d1d9] w-full min-h-full p-4 md:p-8", sourceCodePro.className)}>
            <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: `radial-gradient(circle at 25px 25px, hsl(var(--preview-primary-hsl) / 0.2) 2%, transparent 0%), radial-gradient(circle at 75px 75px, hsl(var(--preview-primary-hsl) / 0.2) 2%, transparent 0%)`, backgroundSize: '100px 100px' }}></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-transparent via-transparent to-[hsl(var(--preview-primary-hsl)/0.1)]"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Sidebar */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="text-center">
                        <Image src={avatarUrl} data-ai-hint="developer avatar" alt="User Avatar" width={200} height={200} className="rounded-full mx-auto mb-4 border-2 border-[hsl(var(--preview-primary-hsl))] shadow-lg"/>
                        <h1 className="text-2xl font-bold text-white">{userInfo?.name}</h1>
                        <p className="text-lg" style={{ color: 'hsl(var(--preview-primary-hsl))' }}>{userInfo?.shortBio}</p>
                    </div>
                    <div className="space-y-2">
                        <Button asChild className="w-full"><a href={userInfo?.contact?.github || '#'} target="_blank" rel="noopener noreferrer"><Github className="mr-2"/> GitHub</a></Button>
                        <Button asChild variant="secondary" className="w-full"><a href={userInfo?.contact?.linkedin || '#'} target="_blank" rel="noopener noreferrer"><Linkedin className="mr-2"/> LinkedIn</a></Button>
                         {userInfo?.resumeDataUri && (
                            <Button onClick={() => handleResumeDownload(userInfo.resumeDataUri)} variant="secondary" className="w-full">
                                <Download className="mr-2 h-4 w-4" /> Download CV
                            </Button>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-2">About Me</h3>
                        <p className="text-sm text-gray-400">{userInfo?.longBio}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-2">Core Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {userInfo?.skills?.map((s, index) => <Badge key={index} variant="secondary" className="bg-gray-700/50 text-gray-300 border-gray-600">{s}</Badge>)}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-9 space-y-8">
                    {/* GitHub Stats */}
                    <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-white flex items-center gap-2"><Github/> GitHub Contributions</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <TooltipProvider>
                               <div className="flex flex-wrap gap-1">
                                    {contributions.map((c, i) => (
                                        <Tooltip key={i}><TooltipTrigger asChild><div className="w-3 h-3 rounded-sm bg-gray-800" style={{ opacity: c.count === 0 ? 0.2 : 0.2 + c.count / 15 * 0.8, backgroundColor: c.count > 0 ? 'hsl(var(--preview-primary-hsl))' : undefined }}></div></TooltipTrigger><TooltipContent><p>{c.count} contributions on {c.date}</p></TooltipContent></Tooltip>
                                    ))}
                               </div>
                           </TooltipProvider>
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-center">
                                <div className="p-4 bg-gray-800/50 rounded-lg"><p className="text-2xl font-bold text-white">58</p><p className="text-sm text-gray-400">Repositories</p></div>
                                <div className="p-4 bg-gray-800/50 rounded-lg"><p className="text-2xl font-bold text-white">1.2k</p><p className="text-sm text-gray-400">Followers</p></div>
                                <div className="p-4 bg-gray-800/50 rounded-lg"><p className="text-2xl font-bold text-white">345</p><p className="text-sm text-gray-400">Stars</p></div>
                                <div className="p-4 bg-gray-800/50 rounded-lg"><p className="text-2xl font-bold text-white">7.8k</p><p className="text-sm text-gray-400">Contributions</p></div>
                           </div>
                        </CardContent>
                    </Card>

                    {/* Projects */}
                     <section id="projects">
                        <h2 className="text-2xl font-bold text-white mb-4">Featured Projects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {projectList.map((p, index) => (
                                <Card key={index} className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm hover:border-[hsl(var(--preview-primary-hsl))] transition-colors">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><a href={p.projectUrl || '#'} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2"><CodeXml/>{p.title}</a></CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-400 mb-4 h-12 overflow-hidden">{p.description}</p>
                                        <div className="flex justify-between items-center text-sm text-gray-400">
                                            <div className="flex gap-2">
                                                <Badge variant="outline" className="border-gray-600">React</Badge>
                                                <Badge variant="outline" className="border-gray-600">Node.js</Badge>
                                            </div>
                                            <div className="flex gap-4">
                                                <span className="flex items-center gap-1"><Star size={16}/> 120</span>
                                                <span className="flex items-center gap-1"><GitFork size={16}/> 34</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Experience */}
                     <section id="experience">
                        <h2 className="text-2xl font-bold text-white mb-4">Career Timeline</h2>
                         <div className="relative border-l-2 border-gray-700">
                            {userInfo?.workExperience?.map((job, index) => (
                              <div key={index} className="mb-10 ml-8">
                                <span className="absolute -left-[11px] flex items-center justify-center w-6 h-6 bg-gray-700 rounded-full ring-8 ring-[#0d1117]">
                                  <Briefcase className="w-4 h-4 text-[hsl(var(--preview-primary-hsl))]" />
                                </span>
                                <h3 className="flex items-center mb-1 text-xl font-semibold text-white">{job.role}</h3>
                                <time className="block mb-2 text-sm font-normal leading-none text-gray-500">{job.dates} at {job.company}</time>
                                <p className="mb-4 text-base font-normal text-gray-400">{job.description}</p>
                              </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
        </ScrollArea>
    );
}

// 5. Creative Studio Layout
function CreativeLayout({ userInfo, customizations }) {
  const projectList = (userInfo?.projects && userInfo.projects.length > 0 ? userInfo.projects : defaultProjects);
  const avatarUrl = isValidUrl(userInfo?.avatarUrl) ? userInfo!.avatarUrl! : `https://picsum.photos/400/400?random=avatar`;

  return (
      <div className="w-full bg-[#111] text-white overflow-hidden font-sans">
          <ScrollArea className="w-full h-full">
              <header className="fixed top-0 left-0 right-0 p-8 z-50 flex justify-between items-center text-white mix-blend-difference">
                  <a href="#hero" className="font-bold text-lg tracking-widest uppercase">{userInfo?.name?.split(' ')[0] || 'ARTIST'}</a>
                  <nav className="hidden md:flex gap-6 text-sm font-semibold">
                      <a href="#work" className="hover:underline">Work</a>
                      <a href="#about" className="hover:underline">About</a>
                      <a href="#contact" className="hover:underline">Contact</a>
                  </nav>
              </header>

              <section id="hero" className="min-h-screen flex items-center justify-center p-8 relative">
                  <div className="absolute inset-0 z-0">
                      <div 
                          className="absolute inset-0 opacity-50" 
                          style={{
                              backgroundImage: `radial-gradient(circle at top left, ${customizations.primaryColor}, transparent 50%), radial-gradient(circle at bottom right, ${customizations.secondaryColor}, transparent 50%)`
                          }}
                      ></div>
                      <Image 
                          src={avatarUrl} 
                          alt="User Avatar"
                          data-ai-hint="artistic portrait"
                          fill
                          className="object-cover filter grayscale opacity-40"
                      />
                  </div>
                  <div className="relative z-10 text-center">
                      <h1 className="text-8xl md:text-[10rem] font-black uppercase tracking-tighter leading-none" style={{WebkitTextStroke: '2px white', color: 'transparent'}}>{userInfo?.name || 'Your Name'}</h1>
                      <p className="text-2xl font-semibold mt-2">{userInfo?.shortBio}</p>
                  </div>
              </section>

              <section id="work" className="py-24 px-8 container mx-auto">
                  <h2 className="text-5xl font-bold text-center mb-16">Selected Work</h2>
                  <div className="space-y-24">
                      {projectList.map((project, index) => (
                          <div key={index} className={cn("grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center", index % 2 !== 0 && "md:grid-flow-row-dense md:[&>*:first-child]:col-start-2")}>
                              <div className="relative group">
                                  <Image src={isValidUrl(project.imageUrl) ? project.imageUrl : `https://picsum.photos/800/1000?random=${index}`} data-ai-hint="creative portfolio piece" width={800} height={1000} alt={project.title || `Project ${index + 1}`} className="w-full h-full object-cover rounded-lg shadow-2xl" />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                                  <Button asChild className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 preview-bg-primary text-primary-foreground">
                                      <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">View Project</a>
                                  </Button>
                              </div>
                              <div className={cn("md:-ml-12", index % 2 !== 0 && "md:-mr-12 md:ml-0")}>
                                  <p className="text-sm font-semibold preview-text-primary">0{index + 1}</p>
                                  <h3 className="text-4xl font-bold mt-2">{project.title}</h3>
                                  <p className="text-lg text-gray-400 mt-4">{project.description}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </section>

              <section id="about" className="py-24 px-8 bg-black">
                  <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
                      <div>
                           <h2 className="text-5xl font-bold mb-4">About Me</h2>
                           <p className="text-lg text-gray-400 leading-relaxed">{userInfo?.longBio}</p>
                      </div>
                      <div>
                           <h3 className="text-2xl font-bold mb-4">Core Skills</h3>
                           <div className="flex flex-wrap gap-2">
                              {userInfo?.skills?.map((skill, index) => (
                                  <Badge key={index} variant="outline" className="text-lg border-gray-600 text-gray-300">{skill}</Badge>
                              ))}
                           </div>
                      </div>
                  </div>
              </section>
              <Footer userInfo={userInfo} />
          </ScrollArea>
      </div>
  );
}

// 6. Data Scientist Layout
function DataScientistLayout({ userInfo }) {
  const skillsData = userInfo?.skills?.map(skill => ({ name: skill, level: Math.floor(Math.random() * 80) + 20 })) || [];
  const projectStats = [{name: 'P1', accuracy: 92}, {name: 'P2', accuracy: 88}, {name: 'P3', accuracy: 95}];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <ScrollArea className="h-full w-full">
    <div className="bg-slate-100 p-4 md:p-8 min-h-screen">
      <header className="bg-white rounded-lg shadow p-4 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{userInfo?.name}</h1>
          <p className="text-gray-600">{userInfo?.shortBio}</p>
        </div>
        <div className="flex gap-4">
          <a href={userInfo?.contact?.github || '#'} target="_blank" rel="noopener noreferrer"><Github /></a>
          <a href={userInfo?.contact?.linkedin || '#'} target="_blank" rel="noopener noreferrer"><Linkedin /></a>
          <a href={`mailto:${userInfo?.contact?.email}`}><Mail /></a>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <Card className="shadow-lg">
             <CardHeader><CardTitle>Case Studies / Projects</CardTitle></CardHeader>
             <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(userInfo?.projects && userInfo.projects.length > 0 ? userInfo.projects : defaultProjects).map((p, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle className="text-lg">{p.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">Model Accuracy: {Math.floor(Math.random() * 10) + 90}%</p>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{p.description}</p>
                                <Button variant="link" asChild><a href={p.projectUrl} target="_blank" rel="noopener noreferrer">View Analysis</a></Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
             </CardContent>
          </Card>
          <Card className="shadow-lg">
             <CardHeader><CardTitle>Professional Experience</CardTitle></CardHeader>
             <CardContent>
                <ExperienceSection experience={userInfo?.workExperience} className="py-0" />
             </CardContent>
          </Card>
        </div>
        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader><CardTitle>Skill Proficiency</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillsData} layout="vertical" margin={{left: 20}}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={80} />
                  <RechartsTooltip cursor={{fill: 'rgba(200, 200, 200, 0.2)'}}/>
                  <Bar dataKey="level" fill="var(--preview-primary)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
             <CardHeader><CardTitle>Project Performance</CardTitle></CardHeader>
             <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie data={projectStats} dataKey="accuracy" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="var(--preview-secondary)">
                            {projectStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </ScrollArea>
  );
}

// 7. Academic Pro Layout
function AcademicProLayout({ userInfo }) {
    const avatarUrl = isValidUrl(userInfo?.avatarUrl) ? userInfo!.avatarUrl : "https://picsum.photos/128/128";
    const projectList = (userInfo?.projects && userInfo.projects.length > 0 ? userInfo.projects : defaultProjects);

    return (
        <div className={cn("flex min-h-full font-serif bg-gray-50 text-gray-800", libreBaskerville.className)}>
            <ScrollArea className="w-1/3 h-full bg-white border-r">
              <aside className="p-8 flex flex-col sticky top-0">
                  <div className="text-center">
                      <Image src={avatarUrl} alt="User Avatar" data-ai-hint="academic portrait" width={100} height={100} className="rounded-full mx-auto mb-4" />
                      <h1 className="text-3xl font-bold">{userInfo?.name}</h1>
                      <p className="text-lg text-gray-600">{userInfo?.shortBio}</p>
                  </div>
                  <nav className="mt-8 flex-grow">
                      <h2 className="font-bold mb-4">Index</h2>
                      <ul className="space-y-2">
                          <li><a href="#about" className="hover:underline">About</a></li>
                          <li><a href="#publications" className="hover:underline">Publications / Projects</a></li>
                          <li><a href="#experience" className="hover:underline">Experience</a></li>
                          <li><a href="#education" className="hover:underline">Education</a></li>
                           <li><a href={userInfo?.contact?.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a></li>
                           <li><a href={userInfo?.contact?.github || '#'} target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a></li>
                             {userInfo?.resumeDataUri && (
                                <li><button onClick={() => handleResumeDownload(userInfo.resumeDataUri)} className="hover:underline">Download CV</button></li>
                            )}
                      </ul>
                  </nav>
                  <div className="text-sm mt-8 pt-8 border-t">© {new Date().getFullYear()} {userInfo?.name}</div>
              </aside>
            </ScrollArea>
            <ScrollArea className="w-2/3 h-full">
              <main className="p-12">
                  <section id="about" className="mb-12">
                      <p className="text-lg leading-relaxed">{userInfo?.longBio}</p>
                  </section>
                  <section id="publications" className="mb-12">
                      <h2 className="text-2xl font-bold border-b pb-2 mb-4">Publications / Projects</h2>
                      <div className="space-y-4">
                          {projectList.map((p, i) => (
                              <div key={i}>
                                  <h3 className="font-bold">{p.title}</h3>
                                  <p>{p.description}</p>
                                  <a href={p.projectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">View Project</a>
                              </div>
                          ))}
                      </div>
                  </section>
                  <section id="experience" className="mb-12">
                      <h2 className="text-2xl font-bold border-b pb-2 mb-4">Experience</h2>
                      <ExperienceSection experience={userInfo?.workExperience} className="py-0" />
                  </section>
                  <section id="education" className="mb-12">
                      <h2 className="text-2xl font-bold border-b pb-2 mb-4">Education</h2>
                      <EducationSection education={userInfo?.education} className="py-0" />
                  </section>
              </main>
            </ScrollArea>
        </div>
    );
}

// 8. Business Executive Layout
function BusinessExecutiveLayout({ userInfo }) {
  const avatarUrl = isValidUrl(userInfo?.avatarUrl) ? userInfo!.avatarUrl : "https://picsum.photos/256/256";
  const coreCompetencies = ["Strategic Planning", "Leadership", "Financial Acumen", "Market Analysis", "Team Building", "P&L Management"];

  return (
    <ScrollArea className="h-full w-full">
    <div className="bg-slate-50 text-gray-800">
      <header className="bg-slate-800 text-white p-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-8">
            <Image src={avatarUrl} data-ai-hint="ceo headshot" alt="User Avatar" width={150} height={150} className="rounded-full border-4 border-slate-500" />
            <div>
                <h1 className="text-4xl font-bold tracking-tight">{userInfo?.name}</h1>
                <p className="text-xl text-slate-300 mt-1">{userInfo?.shortBio}</p>
                 <div className="flex gap-4 mt-4">
                  <a href={userInfo?.contact?.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white"><Linkedin /></a>
                  <a href={`mailto:${userInfo?.contact?.email}`} className="text-slate-300 hover:text-white"><Mail /></a>
                </div>
            </div>
        </div>
      </header>
      <main className="container mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
            <section id="summary" className="py-8">
                <h2 className="text-3xl font-bold mb-4 border-b pb-2 text-slate-700">Executive Summary</h2>
                <p className="text-lg text-gray-600">{userInfo?.longBio}</p>
            </section>
            <AchievementsSection achievements={userInfo?.achievements} className="py-8" />
            <ExperienceSection experience={userInfo?.workExperience} className="py-8" />
            <EducationSection education={userInfo?.education} className="py-8" />
        </div>
        <div className="lg:col-span-1">
            <Card className="bg-white shadow-lg sticky top-8">
                <CardHeader>
                    <CardTitle>Core Competencies</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {(userInfo?.skills || coreCompetencies).map((skill, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-green-500" />
                                <span>{skill}</span>
                            </li>
                        ))}
                    </ul>
                     {userInfo?.resumeDataUri && (
                        <Button onClick={() => handleResumeDownload(userInfo.resumeDataUri)} variant="outline" className="mt-6 w-full">
                            <Download className="mr-2 h-4 w-4" /> Download Resume
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
    </ScrollArea>
  );
}

// 9. Freelancer Hub Layout
function FreelancerHubLayout({ userInfo }) {
  return (
    <ScrollArea className="h-full w-full">
    <div className="bg-gray-50 text-gray-800">
        <header className="container mx-auto text-center py-24">
            <Badge variant="outline" className="mb-4 text-lg p-2 px-4 rounded-full preview-border-primary preview-text-primary">
              Freelance {userInfo?.shortBio || 'Professional'}
            </Badge>
            <h1 className="text-5xl font-extrabold mt-2">{userInfo?.name}</h1>
            <p className="text-xl max-w-2xl mx-auto mt-4 text-gray-600">{userInfo?.longBio}</p>
            <div className="flex justify-center gap-4 mt-8">
              <Button asChild size="lg" className="preview-bg-primary text-primary-foreground"><a href={`mailto:${userInfo?.contact?.email}`}>Hire Me</a></Button>
              <Button size="lg" variant="outline"><a href="#projects">View My Work</a></Button>
            </div>
        </header>

        <section id="services" className="bg-white py-16">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">My Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {(userInfo?.skills || ["Web Development", "UI/UX Design", "Mobile Apps"]).slice(0, 3).map((skill, i) => (
                        <Card key={i} className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow">
                          <div className="mx-auto w-16 h-16 rounded-full preview-bg-secondary flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 preview-text-primary" />
                          </div>
                           <h3 className="text-xl font-bold">{skill}</h3>
                           <p className="text-muted-foreground mt-2">Expert solutions in {skill} to help you achieve your business goals.</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        <ProjectsSection userInfo={userInfo} projects={userInfo?.projects} />
        
        <section id="testimonials" className="py-16">
             <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">What My Clients Say</h2>
                <Carousel className="w-full max-w-4xl mx-auto">
                    <CarouselContent>
                        {Array.from({ length: 2 }).map((_, index) => (
                            <CarouselItem key={index} className="md:basis-1/2">
                                <Card className="p-6 text-center h-full bg-white">
                                    <Image src={`https://picsum.photos/100/100?random=client${index}`} data-ai-hint="person face" width={60} height={60} alt={`client ${index + 1}`} className="rounded-full mx-auto mb-4" />
                                    <p className="text-muted-foreground">"{userInfo?.name} delivered exceptional results on our project. Highly professional and skilled."</p>
                                    <p className="font-bold mt-4">- Jane Doe, CEO of TechCorp</p>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious /><CarouselNext />
                </Carousel>
            </div>
        </section>
        <Footer userInfo={userInfo}/>
    </div>
    </ScrollArea>
  );
}


// 10. Brutalist Layout
function BrutalistLayout({ userInfo, customizations }) {
  const projectList = (userInfo?.projects && userInfo.projects.length > 0 ? userInfo.projects : defaultProjects);
  return (
    <ScrollArea className="w-full h-full">
    <div 
      className="p-2 md:p-4 bg-yellow-300 text-black font-mono w-full min-h-full"
    >
        <div className="border-2 border-black p-4 space-y-4">
            <header 
                className="p-4 flex justify-between items-center border-2 border-black"
            >
                <h1 className="text-2xl md:text-4xl font-bold uppercase">{userInfo?.name || 'Your Name'}</h1>
                <div className="flex gap-2">
                    <a href={userInfo?.contact?.github || '#'} target="_blank" rel="noopener noreferrer" className="p-2 border-2 border-black hover:bg-black/20"><Github /></a>
                    <a href={userInfo?.contact?.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="p-2 border-2 border-black hover:bg-black/20"><Linkedin /></a>
                </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 p-4 border-2 border-black space-y-4">
                    <h2 className="text-xl font-bold uppercase underline">About</h2>
                    <p className="text-sm">
                        {userInfo?.longBio || "I'm a dedicated and results-driven professional with a strong background in my field."}
                    </p>
                    <h2 className="text-xl font-bold uppercase underline pt-4">Skills</h2>
                    <div className="flex flex-wrap gap-1">
                        {userInfo?.skills?.map((skill, index) => (
                          <div key={index} className="bg-black text-yellow-300 p-1 text-sm">{skill}</div>
                        ))}
                    </div>
                </div>
                <div className="md:col-span-2 p-4 border-2 border-black space-y-4">
                    <h2 className="text-xl font-bold uppercase underline">Projects</h2>
                    <div className="space-y-4">
                        {projectList.map((p,i) => (
                            <div key={i} className="pb-2 border-b-2 border-black">
                            <a href={p.projectUrl || '#'} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">{p.title} &rarr;</a>
                            <p className="text-sm">{p.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border-2 border-black">
                     <h2 className="text-xl font-bold uppercase underline mb-2">Experience</h2>
                     {userInfo?.workExperience?.map((job, index) => (
                        <div key={index} className="mb-2">
                            <h3 className="font-bold">{job.role} @ {job.company}</h3>
                            <p className="text-xs">{job.dates}</p>
                        </div>
                     ))}
                </div>
                 <div className="p-4 border-2 border-black">
                     <h2 className="text-xl font-bold uppercase underline mb-2">Education</h2>
                     {userInfo?.education?.map((edu, index) => (
                         <div key={index} className="mb-2">
                            <h3 className="font-bold">{edu.degree}</h3>
                            <p className="text-xs">{edu.institution} - {edu.dates}</p>
                        </div>
                     ))}
                </div>
            </div>
        </div>
    </div>
    </ScrollArea>
  );
}

// 11. Corporate Clean Layout
function CorporateCleanLayout({ userInfo }) {
  const projectList = (userInfo?.projects && userInfo.projects.length > 0 ? userInfo.projects : defaultProjects);
  return (
    <ScrollArea className="h-full w-full">
    <div className="bg-slate-50">
        <header className="bg-white border-b sticky top-0 z-50">
            <nav className="container mx-auto flex justify-between items-center p-4">
                <a href="#" className="font-bold text-xl text-slate-800 flex items-center gap-2"><Briefcase/> {userInfo?.name}</a>
                <div className="flex gap-6 text-slate-600">
                    <a href="#about" className="hover:text-blue-600">About</a>
                    <a href="#projects" className="hover:text-blue-600">Projects</a>
                    <a href="#experience" className="hover:text-blue-600">Experience</a>
                     <a href="#education" className="hover:text-blue-600">Education</a>
                    <a href="#contact" className="hover:text-blue-600">Contact</a>
                </div>
            </nav>
        </header>
        <main className="container mx-auto p-8">
            <section id="about" className="text-center py-24">
                 <Badge variant="outline" className="mb-4 preview-border-primary preview-text-primary">
                    {userInfo?.shortBio || "A Passionate Professional"}
                 </Badge>
                <h1 className="text-5xl font-bold text-slate-800">Driving Innovation and Growth</h1>
                <p className="text-lg max-w-3xl mx-auto mt-4 text-slate-600">{userInfo?.longBio}</p>
            </section>
            <ProjectsSection projects={projectList} userInfo={userInfo} cardClassName="bg-white" className="py-12" />
            <ExperienceSection experience={userInfo?.workExperience} className="py-12 bg-white rounded-lg" />
            <EducationSection education={userInfo?.education} className="py-12" />
            <Footer userInfo={userInfo} />
        </main>
    </div>
    </ScrollArea>
  );
}


// 12. Tech Startup Layout
function TechStartupLayout({ userInfo }) {
    const techStack = [
        { name: "React", icon: <CodeXml /> },
        { name: "Node.js", icon: <Server /> },
        { name: "Python", icon: <FileJson /> },
        { name: "GenAI", icon: <BrainCircuit /> },
        { name: "Vercel", icon: <Rocket /> },
        { name: "Kubernetes", icon: <Cpu />},
    ];
    const kpis = [
        { label: "Deployment Velocity", value: "2x Faster" },
        { label: "System Uptime", value: "99.99%" },
        { label: "User Growth", value: "150% MoM" },
    ];
    const projectList = (userInfo?.projects && userInfo.projects.length > 0 ? userInfo.projects : defaultProjects);
    const avatarUrl = isValidUrl(userInfo?.avatarUrl) ? userInfo.avatarUrl : "https://picsum.photos/128/128";

    return (
      <ScrollArea className="h-full w-full">
        <div className="bg-black text-gray-200 font-sans min-h-screen p-4 md:p-8" style={{'--primary-glow': 'hsl(36 100% 50%)', '--secondary-glow': 'hsl(215 100% 50%)'} as React.CSSProperties}>
            {/* Animated Background */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-0 left-0 w-1/2 h-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,var(--primary-glow)_0%,transparent_60%)] filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,var(--secondary-glow)_0%,transparent_60%)] filter blur-3xl animate-blob"></div>
            </div>

            <main className="relative z-10 grid grid-cols-12 gap-6">
                 {/* Header / Bento Item 1 */}
                 <div className="col-span-12 lg:col-span-8 p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md flex items-center gap-6">
                    <Image src={avatarUrl} data-ai-hint="tech founder" alt="User Avatar" width={100} height={100} className="rounded-full border-2 border-orange-400/50" />
                    <div>
                        <h1 className="text-4xl font-bold text-white">{userInfo?.name}</h1>
                        <p className="text-lg text-orange-400">{userInfo?.shortBio}</p>
                    </div>
                </div>

                {/* Socials / Bento Item 2 */}
                <div className="col-span-12 lg:col-span-4 p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md flex items-center justify-around">
                     <a href={userInfo?.contact?.github || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Github size={32}/></a>
                     <a href={userInfo?.contact?.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={32}/></a>
                     <a href={`mailto:${userInfo?.contact?.email}`} className="text-gray-400 hover:text-white transition-colors"><Mail size={32}/></a>
                </div>

                {/* About / Bento Item 3 */}
                <div className="col-span-12 lg:col-span-4 p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
                     <h2 className="text-xl font-bold text-white mb-2">About Me</h2>
                     <p className="text-gray-400 text-sm">{userInfo?.longBio}</p>
                </div>

                {/* Projects / Bento Item 4 */}
                 <div className="col-span-12 lg:col-span-8 p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
                     <h2 className="text-xl font-bold text-white mb-4">Featured Projects</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projectList.slice(0, 2).map((project, index) => (
                           <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" key={index} className="bg-white/5 hover:bg-white/10 p-4 rounded-lg transition-colors">
                                <h3 className="font-semibold text-white">{project.title}</h3>
                                <p className="text-xs text-gray-400 mt-1">{project.description}</p>
                           </a>
                        ))}
                     </div>
                 </div>

                 {/* Skills / Bento Item 5 */}
                <div className="col-span-12 lg:col-span-6 p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
                    <h2 className="text-xl font-bold text-white mb-4">Core Stack</h2>
                    <div className="flex flex-wrap gap-4">
                        {techStack.map((tech, index) => (
                            <div key={index} className="flex items-center gap-2 bg-white/5 py-1 px-3 rounded-full text-sm">
                                <span className="text-orange-400">{tech.icon}</span>
                                <span>{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* KPIs / Bento Item 6 */}
                <div className="col-span-12 lg:col-span-6 p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md flex items-center justify-around">
                     {kpis.map((kpi, index) => (
                        <div key={index} className="text-center">
                            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">{kpi.value}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">{kpi.label}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
      </ScrollArea>
    );
}

// 13. Modern Elegant Layout
function ModernElegantLayout({ userInfo }) {
    const projectList = (userInfo?.projects && userInfo.projects.length > 0 ? userInfo.projects : defaultProjects);
    
    return (
        <div className="bg-white text-gray-800 flex">
             <aside className="fixed left-0 top-0 h-screen w-16 flex flex-col items-center justify-center gap-6 border-r bg-white z-50">
                <a href="#home" title="Home"><UserRound size={20}/></a>
                <a href="#projects" title="Projects"><Briefcase size={20}/></a>
                <a href={`mailto:${userInfo?.contact?.email}`} title="Contact"><Mail size={20}/></a>
             </aside>
             <ScrollArea className="h-full w-full">
             <main className="ml-16 w-full">
                <section id="home" className="container mx-auto p-24 min-h-screen flex items-center">
                    <div>
                        <h1 className="text-7xl font-bold">{userInfo?.name}</h1>
                        <p className="text-2xl text-gray-600 mt-2">{userInfo?.shortBio}</p>
                        <p className="max-w-xl mt-8 text-lg">{userInfo?.longBio}</p>
                    </div>
                </section>
                <section id="projects" className="container mx-auto p-8">
                     {projectList.map((project, index) => (
                        <div key={index} className="relative mb-12">
                           <Card className="w-2/3 shadow-2xl">
                              <CardContent className="p-8">
                                <h3 className="text-3xl font-bold">{project.title}</h3>
                                <p className="mt-4 max-w-md">{project.description}</p>
                              </CardContent>
                           </Card>
                           <div className="absolute top-10 right-0 w-1/2">
                                <Image src={isValidUrl(project.imageUrl) ? project.imageUrl! : `https://picsum.photos/600/400?random=${index}`} alt={project.title!} width={600} height={400} className="rounded-lg shadow-lg" data-ai-hint="elegant design"/>
                           </div>
                        </div>
                    ))}
                </section>
                 <Footer userInfo={userInfo} />
             </main>
             </ScrollArea>
        </div>
    );
}

// 14. Marketing Pro Layout
function MarketingProLayout({ userInfo }) {
    const projectList = (userInfo?.projects && userInfo.projects.length > 0 ? userInfo.projects : defaultProjects);
    const kpis = [
        { label: "Engagement", value: "+300%" },
        { label: "Conversions", value: "+150%" },
        { label: "ROI", value: "2.5x" },
    ];

    return (
      <ScrollArea className="h-full w-full">
        <div className="bg-white">
            <header className="container mx-auto text-center py-24">
                <h1 className="text-6xl font-extrabold">{userInfo?.name}</h1>
                <p className="text-2xl text-red-600 font-semibold mt-2">{userInfo?.shortBio}</p>
            </header>
            <main>
                {projectList.map((project, index) => (
                    <section key={index} className={cn("py-24", index % 2 === 0 ? "bg-gray-50" : "bg-white")}>
                        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-4xl font-bold">{project.title}</h2>
                                <p className="mt-4 text-lg text-gray-600">{project.description}</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-center mb-4">Key Results</h3>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    {kpis.map((kpi, kpiIndex) => (
                                        <div key={kpiIndex} className="bg-white p-4 rounded-lg shadow">
                                            <p className="text-3xl font-bold text-red-600">{kpi.value}</p>
                                            <p className="text-sm text-gray-500">{kpi.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                ))}
                 <Footer userInfo={userInfo} />
            </main>
        </div>
        </ScrollArea>
    );
}

// 15. Luxury Brand Layout
function LuxuryBrandLayout({ userInfo }) {
    const avatarUrl = isValidUrl(userInfo?.avatarUrl) ? userInfo!.avatarUrl : "https://picsum.photos/128/128";
     const projectList = (userInfo?.projects && userInfo.projects.length > 0 ? userInfo.projects : defaultProjects);

    return (
        <div className={cn("bg-gray-900 text-white min-h-screen", lora.className)}>
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
                <div className="p-12 flex flex-col justify-center">
                    <h1 className="text-6xl font-bold tracking-tighter">{userInfo?.name}</h1>
                    <p className="text-xl mt-4 text-gray-400">{userInfo?.shortBio}</p>
                    <p className="mt-8 text-lg">{userInfo?.longBio}</p>
                </div>
                 <div className="relative">
                    <Carousel className="w-full h-full">
                        <CarouselContent>
                            {projectList.map((p, i) => (
                                <CarouselItem key={i}>
                                    <Image src={isValidUrl(p.imageUrl) ? p.imageUrl! : `https://picsum.photos/800/1200?random=${i}`} alt={p.title!} width={800} height={1200} className="w-full h-full object-cover" data-ai-hint="luxury product"/>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
        </div>
    );
}

// 16. Bold & Impactful Layout
function BoldImpactfulLayout({ userInfo }) {
    return (
      <ScrollArea className="h-full w-full">
        <div className="bg-white text-black">
            <header className="sticky top-0 z-50 flex justify-between items-center p-4 bg-white/50 backdrop-blur-md">
                 <h1 className="font-bold text-lg">{userInfo?.name}</h1>
                 <Button variant="outline" className="rounded-full" asChild><a href="#contact">Contact Me</a></Button>
            </header>
            <main>
                <section className="min-h-screen flex items-center justify-center text-center p-4" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)', backgroundColor: 'var(--preview-primary)' }}>
                    <div className="text-white">
                        <h1 className="text-7xl md:text-9xl font-black uppercase">{userInfo?.shortBio}</h1>
                    </div>
                </section>
                 <section className="container mx-auto p-8 -mt-32 relative z-10">
                    <Card className="p-8 shadow-2xl">
                        <p className="text-xl leading-relaxed">{userInfo?.longBio}</p>
                    </Card>
                </section>
                <ProjectsSection userInfo={userInfo} projects={userInfo?.projects}/>
                <section id="contact" className="py-24" style={{ backgroundColor: 'var(--preview-secondary)' }}>
                    <div className="text-center">
                         <h2 className="text-5xl font-black uppercase">Let's Work Together</h2>
                         <Button size="lg" className="mt-8 text-xl p-8 rounded-none" asChild><a href={`mailto:${userInfo?.contact?.email}`}>Get In Touch</a></Button>
                    </div>
                </section>
            </main>
        </div>
        </ScrollArea>
    );
}

// 17. Photographer
function PhotographerLayout({ userInfo }) {
    const projectList = (userInfo?.projects && userInfo.projects.length > 0 ? userInfo.projects : defaultProjects);
    return (
      <ScrollArea className="h-full w-full">
        <div className="bg-black text-white">
            <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center text-white mix-blend-difference">
                <h1 className="font-bold text-xl flex items-center gap-2"><Camera/>{userInfo?.name}</h1>
                <nav className="flex gap-4">
                    <a href="#portfolio" className="hover:underline">Portfolio</a>
                    <a href="#about" className="hover:underline">About</a>
                    <a href="#contact" className="hover:underline">Contact</a>
                </nav>
            </header>
            <main>
                <section id="portfolio" className="p-4 pt-24">
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                        {projectList.map((p, i) => (
                             <Image key={i} src={isValidUrl(p.imageUrl) ? p.imageUrl! : `https://picsum.photos/600/${Math.floor(Math.random() * 400) + 400}?random=${i}`} alt={p.title!} width={600} height={600} className="w-full h-auto mb-4 rounded" data-ai-hint="dramatic landscape" />
                        ))}
                    </div>
                </section>
                <section id="about" className="container mx-auto py-24 text-center">
                    <h2 className="text-4xl font-bold mb-4">About Me</h2>
                    <p className="max-w-2xl mx-auto text-gray-300">{userInfo?.longBio}</p>
                </section>
                <Footer userInfo={userInfo} />
            </main>
        </div>
        </ScrollArea>
    )
}

// 18. Musician
function MusicianLayout({ userInfo }) {
    const projectList = (userInfo?.projects && userInfo.projects.length > 0 ? userInfo.projects : defaultProjects);
    return (
      <ScrollArea className="h-full w-full">
        <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-4" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/stardust.png)'}}>
                 <Image src={isValidUrl(userInfo?.avatarUrl) ? userInfo.avatarUrl : "https://picsum.photos/200/200"} alt="Artist" width={200} height={200} className="rounded-full border-4 border-purple-500 shadow-2xl mb-4" data-ai-hint="musician portrait"/>
                <h1 className="text-7xl font-bold">{userInfo?.name}</h1>
                <p className="text-2xl text-purple-300">{userInfo?.shortBio}</p>
            </div>
            <main className="container mx-auto p-8">
                 <section id="music" className="py-16">
                     <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2"><Music/> Music / Albums</h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {projectList.map((p, i) => (
                            <Card key={i} className="bg-white/10 border-purple-500/20 text-white">
                                <Image src={isValidUrl(p.imageUrl) ? p.imageUrl! : `https://picsum.photos/400/400?random=${i}`} alt={p.title!} width={400} height={400} className="w-full h-auto rounded-t-lg" data-ai-hint="abstract album art"/>
                                <CardContent className="p-4">
                                    <h3 className="font-bold">{p.title}</h3>
                                    <p className="text-sm text-gray-300">{p.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                     </div>
                </section>
                <Footer userInfo={userInfo} />
            </main>
        </div>
        </ScrollArea>
    )
}

// 19. Author
function AuthorLayout({ userInfo }) {
    const projectList = (userInfo?.projects && userInfo.projects.length > 0 ? userInfo.projects : defaultProjects);
    return (
        <ScrollArea className="h-full w-full">
        <div className={cn("bg-[#fdfaf5] text-[#3d3d3d]", libreBaskerville.className)}>
            <div className="container mx-auto p-8 md:p-16 max-w-4xl">
                <header className="text-center py-16 border-b-2 border-gray-200">
                    <h1 className="text-5xl font-bold">{userInfo?.name}</h1>
                    <p className="text-xl text-gray-500 mt-2">{userInfo?.shortBio}</p>
                </header>
                <main className="py-16">
                    <section id="books">
                        <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2"><PenTool/> Books</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {projectList.map((p, i) => (
                                <div key={i}>
                                    <Image src={isValidUrl(p.imageUrl) ? p.imageUrl! : `https://picsum.photos/300/400?random=${i}`} alt={p.title!} width={300} height={400} className="w-full h-auto shadow-xl rounded" data-ai-hint="minimalist book cover"/>
                                    <h3 className="font-bold mt-2">{p.title}</h3>
                                </div>
                            ))}
                        </div>
                    </section>
                     <section id="about" className="py-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">About the Author</h2>
                        <p className="text-lg leading-relaxed">{userInfo?.longBio}</p>
                    </section>
                </main>
                <Footer userInfo={userInfo} />
            </div>
        </div>
        </ScrollArea>
    )
}

// 20. Filmmaker
function FilmmakerLayout({ userInfo }) {
    const projectList = (userInfo?.projects && userInfo.projects.length > 0 ? userInfo.projects : defaultProjects);
    return (
        <ScrollArea className="h-full w-full">
        <div className="bg-black text-white font-mono">
            <header className="container mx-auto p-6 flex justify-between items-center">
                 <h1 className="text-2xl font-bold tracking-widest">{userInfo?.name}</h1>
                 <p>{userInfo?.shortBio}</p>
            </header>
            <main>
                <section id="reels">
                    {projectList.map((p, i) => (
                        <div key={i} className="relative h-[60vh] bg-gray-900 flex items-center justify-center group">
                            <Image src={isValidUrl(p.imageUrl) ? p.imageUrl! : `https://picsum.photos/1920/1080?random=${i}`} alt={p.title!} fill className="object-cover opacity-50 group-hover:opacity-75 transition-opacity" data-ai-hint="cinematic film still"/>
                            <div className="relative text-center">
                                <h2 className="text-5xl font-bold">{p.title}</h2>
                                <p>{p.description}</p>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><Video className="w-16 h-16 text-white/50 group-hover:text-white/80 transition-colors"/></div>
                        </div>
                    ))}
                </section>
            </main>
            <Footer userInfo={userInfo} />
        </div>
        </ScrollArea>
    )
}

// 21. Illustrator
function IllustratorLayout({ userInfo }) {
    const projectList = (userInfo?.projects && userInfo.projects.length > 0 ? userInfo.projects : defaultProjects);
    return (
        <ScrollArea className="h-full w-full">
        <div className="bg-rose-50 text-rose-900">
            <header className="container mx-auto text-center py-16">
                <Image src={isValidUrl(userInfo?.avatarUrl) ? userInfo.avatarUrl! : "https://picsum.photos/150/150"} alt="Illustrator" width={150} height={150} className="rounded-full mx-auto mb-4 border-4 border-white shadow-lg" data-ai-hint="quirky illustration"/>
                <h1 className="text-5xl font-bold">{userInfo?.name}</h1>
                <p className="text-xl mt-2 text-rose-500">{userInfo?.shortBio}</p>
            </header>
            <main className="container mx-auto p-4">
                 <section id="illustrations">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         {projectList.map((p, i) => (
                             <Card key={i} className={cn("overflow-hidden group", i > 1 ? 'col-span-2' : '')}>
                                <Image src={isValidUrl(p.imageUrl) ? p.imageUrl! : `https://picsum.photos/600/400?random=${i}`} alt={p.title!} width={600} height={400} className="w-full h-auto rounded-lg shadow-lg hover:scale-105 transition-transform" data-ai-hint="colorful vector art"/>
                             </Card>
                         ))}
                     </div>
                </section>
            </main>
            <Footer userInfo={userInfo} />
        </div>
        </ScrollArea>
    )
}

// 22. Consultant
function ConsultantLayout({ userInfo }) {
    return (
        <ScrollArea className="h-full w-full">
        <div className="bg-slate-50 text-slate-800">
            <header className="bg-white border-b sticky top-0 z-50">
              <div className="container mx-auto flex justify-between items-center p-4">
                  <h1 className="text-xl font-bold flex items-center gap-2"><UserRound /> {userInfo?.name}</h1>
                  <nav className="flex items-center gap-4">
                    <a href="#services" className="text-sm text-muted-foreground hover:text-foreground">Services</a>
                    <a href="#projects" className="text-sm text-muted-foreground hover:text-foreground">Case Studies</a>
                    <Button asChild><a href={`mailto:${userInfo?.contact?.email}`}>Contact Me</a></Button>
                  </nav>
              </div>
            </header>
            <main>
                <section className="container mx-auto py-24 text-center">
                    <h2 className="text-lg font-semibold preview-text-primary">Strategic Consulting for Growth</h2>
                    <h1 className="text-5xl font-extrabold mt-2">{userInfo?.shortBio}</h1>
                    <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground">{userInfo?.longBio}</p>
                </section>
                <section id="services" className="py-16 bg-white">
                    <div className="container mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-8">What I Offer</h2>
                        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
                            {(userInfo?.skills || ["Business Strategy", "Market Analysis", "Operational Efficiency"]).map((skill, i) => (
                                <AccordionItem key={i} value={`item-${i}`}>
                                    <AccordionTrigger className="text-lg">{skill}</AccordionTrigger>
                                    <AccordionContent className="text-base text-muted-foreground">
                                        Leveraging deep expertise in {skill}, I provide data-driven strategies to enhance performance, optimize processes, and drive measurable business outcomes. Let's build a roadmap for your success.
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>
                <ProjectsSection userInfo={userInfo} projects={userInfo.projects} cardClassName="bg-white" />
                <Footer userInfo={userInfo} />
            </main>
        </div>
        </ScrollArea>
    );
}

// 23. Gamer
function GamerLayout({ userInfo }) {
    const stats = [{label: "K/D", value: "2.5"}, {label: "Win Rate", value: "68%"}, {label: "Rank", value: "Diamond"}];
    return (
        <ScrollArea className="h-full w-full">
        <div className="bg-gray-900 text-white font-mono" style={{'--preview-primary': '#22d3ee', '--preview-secondary': '#be185d'}}>
            <header className="container mx-auto py-8 text-center border-b border-cyan-500/20" style={{ textShadow: '0 0 10px var(--preview-primary)'}}>
                <h1 className="text-6xl font-bold uppercase">{userInfo?.name}</h1>
                <p className="text-cyan-400">{userInfo?.shortBio}</p>
            </header>
            <main className="container mx-auto p-8">
                <section id="stats" className="grid grid-cols-3 gap-4 text-center mb-16">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-gray-800/50 p-4 border border-cyan-500/20 rounded-lg">
                            <p className="text-4xl font-bold text-cyan-400">{stat.value}</p>
                            <p className="text-sm uppercase">{stat.label}</p>
                        </div>
                    ))}
                </section>
                <ProjectsSection userInfo={userInfo} projects={userInfo.projects} cardClassName="bg-gray-800/50 border-cyan-500/20" />
                 <div className="flex justify-center gap-4 mt-8">
                  <a href={userInfo?.contact?.github || '#'} target="_blank" rel="noopener noreferrer"><Github /></a>
                  <a href={userInfo?.contact?.linkedin || '#'} target="_blank" rel="noopener noreferrer"><Linkedin /></a>
                </div>
            </main>
        </div>
        </ScrollArea>
    );
}

// 24. Architect
function ArchitectLayout({ userInfo }) {
    return (
        <div className="bg-gray-100 text-gray-700 flex w-full h-full">
            <aside className="fixed top-0 left-0 w-16 h-screen border-r bg-white flex flex-col items-center py-8 gap-8">
                <DraftingCompass />
                <div className="flex flex-col gap-6" style={{ writingMode: 'vertical-rl' }}>
                    <a href="#about" className="text-gray-400 hover:text-black">ABOUT</a>
                    <a href="#projects" className="text-gray-400 hover:text-black">PROJECTS</a>
                </div>
            </aside>
            <ScrollArea className="h-full w-full">
            <main className="ml-16 p-12">
                <section id="about" className="min-h-screen">
                    <h1 className="text-5xl font-bold">{userInfo?.name}</h1>
                    <p className="text-xl mt-2">{userInfo?.shortBio}</p>
                    <p className="max-w-2xl mt-8 text-lg leading-relaxed border-l-4 pl-4">{userInfo?.longBio}</p>
                </section>
                <ProjectsSection userInfo={userInfo} projects={userInfo.projects} className="min-h-screen" cardClassName="bg-white shadow-none border" />
            </main>
            </ScrollArea>
        </div>
    );
}

// 25. Interior Designer
function InteriorDesignerLayout({ userInfo }) {
     const projectList = (userInfo?.projects && userInfo.projects.length > 0 ? userInfo.projects : defaultProjects);
    return (
        <ScrollArea className="h-full w-full">
        <div className={cn("bg-emerald-50 text-emerald-900", lora.className)}>
            <header className="container mx-auto text-center py-16">
                <h1 className="text-5xl font-bold">{userInfo?.name}</h1>
                <p className="text-xl mt-2 text-emerald-600">{userInfo?.shortBio}</p>
            </header>
            <main className="container mx-auto p-4">
                 <div className="columns-1 md:columns-2 gap-4 space-y-4">
                     {projectList.map((p, i) => (
                         <div key={i} className="break-inside-avoid relative group">
                             <Image src={isValidUrl(p.imageUrl) ? p.imageUrl! : `https://picsum.photos/600/400?random=${i}`} alt={p.title!} width={600} height={400} className="w-full h-auto rounded-lg shadow-lg" data-ai-hint="modern living room"/>
                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white p-4">
                                <h3 className="font-bold text-2xl">{p.title}</h3>
                             </div>
                         </div>
                     ))}
                 </div>
            </main>
            <Footer userInfo={userInfo}/>
        </div>
        </ScrollArea>
    );
}

// 26. Product Manager
function ProductManagerLayout({ userInfo }) {
    return (
        <ScrollArea className="h-full w-full">
        <div className="bg-white">
            <header className="container mx-auto py-12 flex items-center gap-6">
                 <Image src={isValidUrl(userInfo?.avatarUrl) ? userInfo.avatarUrl : "https://picsum.photos/100/100"} alt="User" width={100} height={100} className="rounded-full" data-ai-hint="professional headshot" />
                <div>
                    <h1 className="text-4xl font-bold">{userInfo?.name}</h1>
                    <p className="text-lg text-indigo-600">{userInfo?.shortBio}</p>
                </div>
            </header>
            <main className="container mx-auto p-8">
                 <section id="roadmap" className="py-16">
                    <h2 className="text-3xl font-bold text-center mb-8">Product Roadmap Vision</h2>
                    <ExperienceSection experience={userInfo.workExperience} className="py-0"/>
                 </section>
                 <ProjectsSection userInfo={userInfo} projects={userInfo.projects} cardClassName="bg-slate-50" />
            </main>
        </div>
        </ScrollArea>
    );
}


// 27. Researcher
function ResearcherLayout({ userInfo }) {
    return (
        <ScrollArea className="h-full w-full">
        <div className={cn("bg-slate-50 text-slate-800", libreBaskerville.className)}>
            <div className="container mx-auto p-8 max-w-4xl">
                 <header className="py-8 text-center border-b">
                    <h1 className="text-4xl font-bold">{userInfo?.name}</h1>
                    <p className="text-lg text-slate-500 mt-1">{userInfo?.shortBio}</p>
                </header>
                <main className="py-8">
                    <h2 className="text-xl font-bold mb-2">Abstract</h2>
                    <p className="leading-relaxed">{userInfo?.longBio}</p>
                    <ProjectsSection userInfo={userInfo} projects={userInfo.projects} className="py-8" cardClassName="bg-white"/>
                    <ExperienceSection experience={userInfo.workExperience} className="py-8"/>
                </main>
            </div>
        </div>
        </ScrollArea>
    );
}

// 28. Chef
function ChefLayout({ userInfo }) {
    const projectList = (userInfo?.projects && userInfo.projects.length > 0 ? userInfo.projects : defaultProjects);
    return (
        <ScrollArea className="h-full w-full">
        <div className={cn("bg-amber-50", lora.className)}>
            <header className="text-center py-16 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556909211-3a4871a7c515?w=800')"}}>
                 <div className="bg-black/50 py-16">
                    <h1 className="text-6xl font-bold text-white" style={{textShadow: '2px 2px 4px #000'}}>{userInfo?.name}</h1>
                    <p className="text-2xl text-amber-200 mt-2">{userInfo?.shortBio}</p>
                </div>
            </header>
            <main className="container mx-auto p-8">
                <h2 className="text-4xl font-bold text-center mb-8 text-amber-900">Signature Dishes</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {projectList.map((dish, i) => (
                    <Card key={i} className="bg-white shadow-xl">
                        <Image src={isValidUrl(dish.imageUrl) ? dish.imageUrl! : `https://picsum.photos/400/300?random=${i}`} alt={dish.title!} width={400} height={300} className="w-full h-auto rounded-t-lg" data-ai-hint="gourmet food"/>
                        <CardContent className="p-4">
                            <h3 className="text-2xl font-bold text-amber-800">{dish.title}</h3>
                            <p className="text-slate-600 mt-2">{dish.description}</p>
                        </CardContent>
                    </Card>
                ))}
                </div>
            </main>
        </div>
        </ScrollArea>
    );
}

// 29. Fitness Coach
function FitnessCoachLayout({ userInfo }) {
    return (
        <ScrollArea className="h-full w-full">
        <div className="bg-gray-900 text-white font-sans">
             <header className="min-h-screen flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800')"}}>
                 <div className="bg-black/70 min-h-screen w-full flex flex-col items-center justify-center p-4">
                    <h1 className="text-7xl font-black uppercase" style={{ WebkitTextStroke: '2px var(--preview-primary)' }}>{userInfo?.name}</h1>
                    <p className="text-3xl font-bold uppercase mt-2">{userInfo?.shortBio}</p>
                    <Button size="lg" className="mt-8 bg-red-600 hover:bg-red-700 text-white rounded-none p-8 text-xl uppercase" asChild><a href={`mailto:${userInfo?.contact?.email}`}>Get Started</a></Button>
                </div>
            </header>
            <main className="container mx-auto p-8">
                <h2 className="text-4xl font-black text-center uppercase mb-8">My Programs</h2>
                <ExperienceSection experience={userInfo.workExperience} className="py-0" />
            </main>
        </div>
        </ScrollArea>
    );
}

// 30. Travel Blogger
function TravelBloggerLayout({ userInfo }) {
    const projectList = (userInfo?.projects && userInfo.projects.length > 0 ? userInfo.projects : defaultProjects);
    return (
        <ScrollArea className="h-full w-full">
        <div className="bg-white">
            <header className="py-4 px-8 flex justify-between items-center border-b">
                <h1 className="text-2xl font-bold tracking-widest uppercase">{userInfo?.name}</h1>
                <p className="text-slate-500 hidden md:block">Adventures Across The Globe</p>
            </header>
            <main>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {projectList.map((post, i) => (
                    <div key={i} className="relative group aspect-square">
                        <Image src={isValidUrl(post.imageUrl) ? post.imageUrl! : `https://picsum.photos/600/600?random=${i}`} alt={post.title!} fill className="object-cover" data-ai-hint="beautiful landscape"/>
                        <div className="absolute inset-0 bg-black/50 flex items-end p-6">
                            <div className="text-white">
                                <h2 className="text-3xl font-bold">{post.title}</h2>
                                <p className="opacity-0 group-hover:opacity-100 transition-opacity">{post.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </main>
        </div>
        </ScrollArea>
    );
}



function getFontClass(fontFamily) {
  switch (fontFamily) {
    case 'Space Mono':
      return spaceMono.className;
    case 'Libre Baskerville':
      return libreBaskerville.className;
    case 'Source Code Pro':
        return sourceCodePro.className;
    case 'Montserrat':
        return montserrat.className;
    case 'Lora':
        return lora.className;
    case 'Inter':
    default:
      return inter.className;
  }
}

function hexToHsl(hex) {
  if (!hex) return '0 0% 100%';
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0 0% 100%';
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return `${h} ${s}% ${l}%`;
}


export function PortfolioPreview({ customizations, userInfo, setUserInfo, selectedTemplate, setCustomizations }: PortfolioPreviewProps) {
  const fontClass = getFontClass(customizations.fontFamily);
  
  const previewStyle = {
    '--preview-primary-hsl': hexToHsl(customizations.primaryColor),
    '--preview-secondary-hsl': hexToHsl(customizations.secondaryColor),
    '--preview-primary': customizations.primaryColor,
    '--preview-secondary': customizations.secondaryColor,
    colorScheme: 'dark',
  } as React.CSSProperties;

  const renderLayout = () => {
    switch (selectedTemplate) {
      case 'minimalist': return <MinimalistLayout userInfo={userInfo} />;
      case 'classic': return <ClassicLayout userInfo={userInfo} />;
      case 'brutalist': return <BrutalistLayout userInfo={userInfo} customizations={customizations} />;
      case 'creative': return <CreativeLayout userInfo={userInfo} customizations={customizations} />;
      case 'dev-pro': return <DeveloperProLayout userInfo={userInfo} customizations={customizations} />;
      case 'data-scientist': return <DataScientistLayout userInfo={userInfo} />;
      case 'academic': return <AcademicProLayout userInfo={userInfo} />;
      case 'executive': return <BusinessExecutiveLayout userInfo={userInfo} />;
      case 'freelancer': return <FreelancerHubLayout userInfo={userInfo} />;
      case 'corporate': return <CorporateCleanLayout userInfo={userInfo} />;
      case 'tech-startup': return <TechStartupLayout userInfo={userInfo} />;
      case 'modern': return <ModernElegantLayout userInfo={userInfo} />;
      case 'marketing': return <MarketingProLayout userInfo={userInfo} />;
      case 'luxury': return <LuxuryBrandLayout userInfo={userInfo} />;
      case 'bold': return <BoldImpactfulLayout userInfo={userInfo} />;
      case 'photographer': return <PhotographerLayout userInfo={userInfo} />;
      case 'musician': return <MusicianLayout userInfo={userInfo} />;
      case 'author': return <AuthorLayout userInfo={userInfo} />;
      case 'filmmaker': return <FilmmakerLayout userInfo={userInfo} />;
      case 'illustrator': return <IllustratorLayout userInfo={userInfo} />;
      case 'consultant': return <ConsultantLayout userInfo={userInfo} />;
      case 'gamer': return <GamerLayout userInfo={userInfo} />;
      case 'architect': return <ArchitectLayout userInfo={userInfo} />;
      case 'interior-designer': return <InteriorDesignerLayout userInfo={userInfo} />;
      case 'product-manager': return <ProductManagerLayout userInfo={userInfo} />;
      case 'researcher': return <ResearcherLayout userInfo={userInfo} />;
      case 'chef': return <ChefLayout userInfo={userInfo} />;
      case 'fitness-coach': return <FitnessCoachLayout userInfo={userInfo} />;
      case 'travel-blogger': return <TravelBloggerLayout userInfo={userInfo} />;
      case 'genz':
      default:
        return <GenzLayout userInfo={userInfo} />;
    }
  };

  return (
    <div 
      className={cn("w-full h-full bg-transparent overflow-y-auto preview-container", fontClass)}
      style={previewStyle}
    >
      <div className={cn("text-foreground relative", 
        selectedTemplate === 'brutalist' ? '' : 'bg-background', 
        ['genz', 'creative', 'dev-pro', 'tech-startup', 'luxury', 'bold', 'photographer', 'musician', 'filmmaker', 'illustrator', 'gamer'].includes(selectedTemplate) ? 'bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white' : '',
        ['classic', 'academic', 'modern'].includes(selectedTemplate) ? 'flex h-full w-full' : ''
      )}>
        {renderLayout()}
      </div>
    </div>
  );
}


    

    




