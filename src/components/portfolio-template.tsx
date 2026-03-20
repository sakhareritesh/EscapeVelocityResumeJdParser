
'use client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Briefcase, GraduationCap, Sparkles, User, Feather, UserRound, Paintbrush, BarChart3, Users, Code, LineChart, Gem, CheckCircle, Video, Music, Camera, PenTool, BrainCircuit, Rocket, Palette, Heart } from 'lucide-react';
import React from 'react';

const TemplateDevPro = () => (
    <div className="w-full h-full bg-gray-800 p-2 rounded-t-md space-y-1.5">
        <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        </div>
        <div className="bg-gray-900/80 p-2 rounded-sm space-y-1">
            <div className="h-2 w-1/2 bg-gray-700 rounded-full"></div>
            <div className="h-2 w-3/4 bg-gray-700 rounded-full"></div>
        </div>
        <div className="flex gap-2">
            <div className="flex-1 p-2 bg-gray-900/80 rounded-sm space-y-1">
                <div className="h-2 w-full bg-gray-700 rounded-full"></div>
                <div className="h-2 w-2/3 bg-gray-700 rounded-full"></div>
            </div>
            <div className="flex-1 p-2 bg-gray-900/80 rounded-sm space-y-1">
                <div className="h-2 w-full bg-gray-700 rounded-full"></div>
                <div className="h-2 w-1/2 bg-gray-700 rounded-full"></div>
            </div>
        </div>
    </div>
);

const TemplateCreative = () => (
    <div className="w-full h-full bg-white p-2 rounded-t-md space-y-2">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-300"></div>
            <div className="flex-1 space-y-1">
                <div className="h-2 w-1/3 bg-pink-200 rounded-full"></div>
                <div className="h-2 w-1/4 bg-pink-100 rounded-full"></div>
            </div>
        </div>
        <div className="flex gap-2">
            <div className="flex-1 h-12 bg-pink-200/80 rounded-md"></div>
            <div className="flex-1 h-12 bg-purple-200/80 rounded-md"></div>
        </div>
        <div className="w-full h-12 bg-gray-100 rounded-md"></div>
    </div>
);

const TemplateDataScientist = () => (
    <div className="w-full h-full bg-white p-2 rounded-t-md space-y-2">
        <div className="flex items-end gap-2 h-1/2">
            <div className="w-1/4 h-full bg-green-200 rounded-sm"></div>
            <div className="w-1/4 h-1/2 bg-green-200 rounded-sm"></div>
            <div className="w-1/4 h-3/4 bg-green-200 rounded-sm"></div>
            <div className="w-1/4 h-1/3 bg-green-200 rounded-sm"></div>
        </div>
        <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
        <div className="flex gap-2">
            <div className="flex-1 h-6 bg-gray-100 rounded-sm space-y-1"></div>
            <div className="flex-1 h-6 bg-gray-100 rounded-sm space-y-1"></div>
        </div>
    </div>
);

const TemplateMinimalist = () => (
    <div className="w-full h-full bg-gray-100 p-2 rounded-t-md">
        <div className="w-full h-full bg-white rounded-sm p-2 space-y-2">
            <div className="h-2 w-1/3 bg-gray-200 rounded-full"></div>
            <div className="h-1 w-full bg-gray-200 rounded-full"></div>
            <div className="h-1 w-full bg-gray-200 rounded-full"></div>
            <div className="h-1 w-2/3 bg-gray-200 rounded-full"></div>
            <div className="flex gap-1 pt-2">
                <div className="w-4 h-4 border-2 border-gray-300 rounded-sm"></div>
                <div className="w-4 h-4 border-2 border-gray-300 rounded-sm"></div>
            </div>
        </div>
    </div>
);

const TemplateAcademic = () => (
     <div className="w-full h-full bg-white p-2 rounded-t-md space-y-2">
        <div className="flex items-center gap-2">
             <div className="p-1 bg-indigo-100 rounded-sm"><GraduationCap className="w-4 h-4 text-indigo-500" /></div>
            <div className="text-sm font-semibold text-indigo-800">ACADEMIC</div>
        </div>
        <div className="space-y-1">
            <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded-full w-full"></div>
            <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
        </div>
        <div className="h-px bg-gray-200"></div>
         <div className="space-y-1">
            <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded-full w-full"></div>
        </div>
    </div>
);

const TemplateExecutive = () => (
    <div className="w-full h-full bg-white p-2 rounded-t-md space-y-2">
        <div className="flex justify-between items-center">
            <div className="p-1 bg-orange-100 rounded-sm"><Briefcase className="w-4 h-4 text-orange-500" /></div>
            <div className="text-sm font-semibold text-orange-800 tracking-widest">EXECUTIVE</div>
        </div>
        <div className="flex gap-2">
            <div className="w-1/3 space-y-1">
                <div className="h-4 bg-orange-200 rounded-sm"></div>
                <div className="h-2 bg-gray-200 rounded-full"></div>
            </div>
            <div className="w-2/3 bg-gray-100 p-1 space-y-1 rounded-sm">
                <div className="h-2 bg-gray-200 rounded-full w-full"></div>
                <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
            </div>
        </div>
    </div>
);
const TemplateFreelancer = () => (
    <div className="w-full h-full bg-white p-2 rounded-t-md space-y-2">
        <div className="flex items-center gap-2">
            <div className="p-1 bg-yellow-100 rounded-full"><User className="w-4 h-4 text-yellow-600" /></div>
            <div className="h-3 bg-yellow-200 rounded-full w-1/3"></div>
        </div>
        <div className="p-1 bg-gray-100 rounded-sm space-y-1">
            <div className="h-2 bg-gray-200 rounded-full w-full"></div>
            <div className="h-2 bg-gray-200 rounded-full w-5/6"></div>
        </div>
         <div className="p-1 bg-gray-100 rounded-sm space-y-1">
            <div className="h-2 bg-gray-200 rounded-full w-full"></div>
            <div className="h-2 bg-gray-200 rounded-full w-4/6"></div>
        </div>
    </div>
);
const TemplateGenz = () => (
     <div className="w-full h-full bg-white p-2 rounded-t-md space-y-1.5">
        <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500"></div>
        </div>
        <div className="flex gap-2">
            <div className="h-6 w-1/2 bg-pink-200 rounded-lg"></div>
            <div className="h-6 w-1/2 bg-cyan-200 rounded-lg"></div>
        </div>
        <div className="h-10 w-full bg-gray-100 rounded-lg"></div>
    </div>
);
const TemplateBrutalist = () => (
    <div className="w-full h-full bg-black p-2 rounded-t-md space-y-2 border-2 border-yellow-300">
        <div className="flex justify-between items-center text-yellow-300">
            <div className="font-mono text-sm">[BRUTALIST]</div>
            <div className="flex gap-1">
                <div className="w-2 h-2 border border-yellow-300"></div>
                <div className="w-2 h-2 border border-yellow-300"></div>
            </div>
        </div>
        <div className="h-12 border-2 border-dashed border-yellow-300"></div>
        <div className="h-2 bg-yellow-300 w-full"></div>
    </div>
);
const TemplateCorporate = () => (
    <div className="w-full h-full bg-white p-2 rounded-t-md space-y-2">
        <div className="flex items-center gap-2">
            <div className="p-1 bg-slate-100 rounded-sm"><Users className="w-4 h-4 text-slate-500" /></div>
            <div className="text-sm font-semibold text-slate-800">CORPORATE</div>
        </div>
        <div className="flex gap-2">
            <div className="w-1/3 bg-slate-100 p-1 space-y-1 rounded-sm">
                 <div className="h-4 bg-slate-300 rounded-sm w-1/2 mx-auto"></div>
                <div className="h-2 bg-slate-200 rounded-full w-full"></div>
            </div>
             <div className="w-2/3 bg-slate-50 p-1 space-y-1 rounded-sm">
                <div className="h-2 bg-slate-200 rounded-full w-full"></div>
                <div className="h-2 bg-slate-200 rounded-full w-3/4"></div>
            </div>
        </div>
    </div>
);
const TemplateTech = () => (
    <div className="w-full h-full bg-gray-900 p-2 rounded-t-md space-y-2">
         <div className="flex items-center gap-2">
            <div className="p-1 bg-cyan-900 rounded-sm"><Code className="w-4 h-4 text-cyan-400" /></div>
            <div className="text-sm font-semibold text-cyan-400">TECH</div>
        </div>
         <div className="p-1 bg-gray-800 rounded-sm space-y-1">
            <div className="h-2 bg-gray-700 rounded-full w-full"></div>
            <div className="h-2 bg-gray-700 rounded-full w-5/6"></div>
        </div>
         <div className="p-1 bg-gray-800 rounded-sm space-y-1">
            <div className="h-2 bg-gray-700 rounded-full w-full"></div>
            <div className="h-2 bg-gray-700 rounded-full w-4/6"></div>
        </div>
    </div>
);
const TemplateModern = () => (
    <div className="w-full h-full bg-white p-2 rounded-t-md space-y-2">
        <div className="flex items-center gap-2">
            <div className="p-1 bg-purple-100 rounded-full"><Sparkles className="w-4 h-4 text-purple-500" /></div>
            <div className="h-3 bg-purple-200 rounded-full w-1/3"></div>
        </div>
        <div className="flex gap-2">
            <div className="flex-1 h-12 bg-purple-100 rounded-lg"></div>
            <div className="flex-1 h-12 bg-gray-100 rounded-lg"></div>
        </div>
    </div>
);
const TemplateMarketing = () => (
    <div className="w-full h-full bg-white p-2 rounded-t-md space-y-2">
         <div className="flex items-center gap-2">
            <div className="p-1 bg-red-100 rounded-sm"><LineChart className="w-4 h-4 text-red-500" /></div>
            <div className="text-sm font-semibold text-red-800">MARKETING</div>
        </div>
        <div className="flex gap-2 items-end h-12">
            <div className="w-1/4 h-full bg-red-200 rounded-t-sm"></div>
            <div className="w-1/4 h-1/2 bg-red-200 rounded-t-sm"></div>
            <div className="w-1/4 h-3/4 bg-red-200 rounded-t-sm"></div>
            <div className="w-1/4 h-1/3 bg-red-200 rounded-t-sm"></div>
        </div>
    </div>
);
const TemplateLuxury = () => (
    <div className="w-full h-full bg-gray-900 p-2 rounded-t-md space-y-2 border-2 border-amber-300">
        <div className="flex justify-center">
            <div className="p-1 bg-amber-200 rounded-full"><Gem className="w-4 h-4 text-amber-800" /></div>
        </div>
        <div className="h-px bg-amber-300 w-1/2 mx-auto"></div>
        <div className="h-2 bg-amber-400/50 rounded-full w-3/4 mx-auto"></div>
        <div className="h-2 bg-amber-400/50 rounded-full w-1/2 mx-auto"></div>
    </div>
);
const TemplateBold = () => (
    <div className="w-full h-full bg-rose-600 p-2 rounded-t-md space-y-2">
        <div className="text-white font-extrabold text-lg text-center">BOLD</div>
        <div className="bg-white/90 p-1 rounded-sm space-y-1">
             <div className="h-2 bg-rose-200 rounded-full w-full"></div>
             <div className="h-2 bg-rose-200 rounded-full w-3/4"></div>
        </div>
         <div className="bg-white/90 p-1 rounded-sm space-y-1">
             <div className="h-2 bg-rose-200 rounded-full w-full"></div>
             <div className="h-2 bg-rose-200 rounded-full w-1/2"></div>
        </div>
    </div>
);

// --- New template previews start here ---

const TemplatePhotographer = () => (
    <div className="w-full h-full bg-black p-2 rounded-t-md grid grid-cols-3 gap-1">
        <div className="bg-gray-700 h-12 rounded-sm"></div>
        <div className="bg-gray-700 h-12 rounded-sm col-span-2"></div>
        <div className="bg-gray-700 h-12 rounded-sm col-span-2"></div>
        <div className="bg-gray-700 h-12 rounded-sm"></div>
    </div>
);

const TemplateMusician = () => (
    <div className="w-full h-full bg-purple-900 p-2 rounded-t-md flex flex-col items-center justify-center space-y-2">
        <div className="w-12 h-12 rounded-full border-2 border-purple-400 bg-purple-800 flex items-center justify-center"><Music className="w-6 h-6 text-purple-300"/></div>
        <div className="h-2 w-2/3 bg-purple-700 rounded-full"></div>
        <div className="h-2 w-1/2 bg-purple-700 rounded-full"></div>
    </div>
);

const TemplateAuthor = () => (
    <div className="w-full h-full bg-[#fdfaf5] p-2 rounded-t-md flex items-center justify-center">
        <div className="font-serif text-center">
            <div className="text-2xl text-[#3d3d3d]">The Author</div>
            <div className="h-px w-12 bg-gray-300 mx-auto my-1"></div>
            <div className="text-xs text-gray-500">A Collection of Works</div>
        </div>
    </div>
);

const TemplateFilmmaker = () => (
    <div className="w-full h-full bg-gray-900 p-2 rounded-t-md flex items-center justify-center">
        <div className="w-full h-4/5 bg-black border-2 border-gray-700 relative">
            <div className="absolute bottom-2 left-2 text-white font-mono text-xs">REC 00:15</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><Video className="w-8 h-8 text-red-500"/></div>
        </div>
    </div>
);

const TemplateIllustrator = () => (
    <div className="w-full h-full bg-rose-50 p-2 rounded-t-md grid grid-cols-2 gap-2">
        <div className="bg-rose-200 rounded-lg"></div>
        <div className="bg-rose-200 rounded-lg"></div>
        <div className="bg-rose-200 rounded-lg"></div>
        <div className="bg-rose-200 rounded-lg flex items-center justify-center"><Paintbrush className="w-6 h-6 text-rose-500"/></div>
    </div>
);

const TemplateConsultant = () => (
    <div className="w-full h-full bg-blue-50 p-2 rounded-t-md">
        <div className="text-center font-semibold text-blue-800">CONSULTANT</div>
        <div className="flex gap-2 mt-2">
            <div className="flex-1 bg-white p-1 rounded space-y-1 shadow">
                <div className="h-2 w-1/2 bg-blue-200 rounded-full"></div>
                <div className="h-2 w-full bg-gray-200 rounded-full"></div>
            </div>
            <div className="flex-1 bg-white p-1 rounded space-y-1 shadow">
                <div className="h-2 w-1/2 bg-blue-200 rounded-full"></div>
                <div className="h-2 w-full bg-gray-200 rounded-full"></div>
            </div>
        </div>
    </div>
);

const TemplateGamer = () => (
    <div className="w-full h-full bg-gray-900 p-2 rounded-t-md border-2 border-cyan-500 shadow-[0_0_10px_theme(colors.cyan.500)]">
        <div className="text-cyan-400 font-bold text-center tracking-widest">GAMER</div>
        <div className="flex justify-between items-center mt-2">
            <div className="h-4 w-1/3 bg-cyan-800 rounded-full"></div>
            <div className="h-4 w-8 bg-red-500 rounded-full"></div>
        </div>
    </div>
);

const TemplateArchitect = () => (
    <div className="w-full h-full bg-gray-200 p-2 rounded-t-md">
        <div className="border border-gray-400 h-full w-full p-1 space-y-1">
            <div className="h-4 w-1/3 border-b-2 border-gray-400"></div>
            <div className="flex gap-2 h-1/2">
                <div className="w-1/2 border border-gray-400"></div>
                <div className="w-1/2 border border-gray-400"></div>
            </div>
        </div>
    </div>
);

const TemplateInteriorDesigner = () => (
    <div className="w-full h-full bg-emerald-50 p-2 rounded-t-md">
        <div className="h-1/2 w-full bg-emerald-200 rounded-lg flex items-end p-1">
            <div className="w-1/3 h-1/2 bg-emerald-400 rounded-sm"></div>
        </div>
        <div className="mt-2 h-2 w-2/3 bg-emerald-100 rounded-full"></div>
    </div>
);

const TemplateProductManager = () => (
    <div className="w-full h-full bg-white p-2 rounded-t-md">
        <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-indigo-500"/>
            <div className="h-3 w-1/2 bg-indigo-200 rounded-full"></div>
        </div>
        <div className="mt-2 border-t pt-2 space-y-1">
            <div className="h-2 w-full bg-gray-200 rounded-full"></div>
            <div className="h-2 w-full bg-gray-200 rounded-full"></div>
        </div>
    </div>
);

const TemplateResearcher = () => (
    <div className="w-full h-full bg-slate-50 p-2 rounded-t-md">
        <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-slate-500"/>
            <div className="h-3 w-1/2 bg-slate-200 rounded-full"></div>
        </div>
         <div className="mt-2 border-t pt-2 space-y-1 text-xs text-slate-600">
            <p>Abstract: ...</p>
            <p>Keywords: ...</p>
        </div>
    </div>
);

const TemplateChef = () => (
    <div className="w-full h-full bg-amber-50 p-2 rounded-t-md flex gap-2">
        <div className="w-1/3 bg-amber-200 rounded-lg"></div>
        <div className="flex-1 space-y-1">
            <div className="h-3 w-full bg-amber-400 rounded-full"></div>
            <div className="h-2 w-2/3 bg-gray-300 rounded-full"></div>
            <div className="h-2 w-full bg-gray-300 rounded-full"></div>
        </div>
    </div>
);

const TemplateFitnessCoach = () => (
    <div className="w-full h-full bg-gray-800 p-2 rounded-t-md text-center text-white font-bold">
        <p className="text-2xl">MOVE</p>
        <div className="h-8 w-1/2 mx-auto bg-red-500 mt-2"></div>
    </div>
);

const TemplateTravelBlogger = () => (
    <div className="w-full h-full bg-sky-100 p-2 rounded-t-md relative">
        <div className="w-full h-1/2 bg-sky-300 rounded-lg"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-3/4 p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
            <div className="h-2 w-2/3 bg-gray-300 rounded-full"></div>
        </div>
    </div>
);


export const templates = [
  { id: 'genz', name: 'Gen-Z Vibrant', description: 'Full-screen scrolling with bold gradients.', badge: 'Trending', badgeColor: 'bg-pink-100 text-pink-800', bgColor: 'bg-gradient-to-br from-pink-400 to-cyan-400', textColor: 'text-white', preview: <TemplateGenz />, colors: { primary: '#ec4899', secondary: '#22d3ee' } },
  { id: 'minimalist', name: 'Minimalist Pro', description: 'Single-column layout with fixed navigation.', badge: 'Universal', badgeColor: 'bg-gray-200 text-gray-800', bgColor: 'bg-white', textColor: 'text-gray-800', preview: <TemplateMinimalist />, colors: { primary: '#111827', secondary: '#9ca3af' } },
  { id: 'classic', name: 'Classic Pro', description: 'Sidebar menu with two-column content.', badge: 'Business', badgeColor: 'bg-blue-100 text-blue-800', bgColor: 'bg-blue-500', textColor: 'text-white', preview: <TemplateExecutive />, colors: { primary: '#1e3a8a', secondary: '#60a5fa' } },
  { id: 'dev-pro', name: 'Developer Pro', description: 'Terminal-style dark theme with tabs.', badge: 'Most Popular', badgeColor: 'bg-green-100 text-green-800', bgColor: 'bg-[#1e293b]', textColor: 'text-white', preview: <TemplateDevPro />, colors: { primary: '#64748b', secondary: '#94a3b8' } },
  { id: 'creative', name: 'Creative Studio', description: 'Masonry grid with sticky filter bar.', badge: 'Creative', badgeColor: 'bg-purple-100 text-purple-800', bgColor: 'bg-gradient-to-br from-pink-400 to-purple-500', textColor: 'text-white', preview: <TemplateCreative />, colors: { primary: '#ec4899', secondary: '#8b5cf6' } },
  { id: 'data-scientist', name: 'Data Scientist', description: 'Dashboard-style with chart panels.', badge: 'Specialized', badgeColor: 'bg-teal-100 text-teal-800', bgColor: 'bg-teal-500', textColor: 'text-white', preview: <TemplateDataScientist />, colors: { primary: '#14b8a6', secondary: '#5eead4' } },
  { id: 'academic', name: 'Academic Pro', description: 'Split-page with research index.', badge: 'Academic', badgeColor: 'bg-indigo-100 text-indigo-800', bgColor: 'bg-indigo-500', textColor: 'text-white', preview: <TemplateAcademic />, colors: { primary: '#4f46e5', secondary: '#a5b4fc' } },
  { id: 'executive', name: 'Business Executive', description: 'Leadership-focused professional template.', badge: 'Business', badgeColor: 'bg-orange-100 text-orange-800', bgColor: 'bg-orange-500', textColor: 'text-white', preview: <TemplateExecutive />, colors: { primary: '#f97316', secondary: '#fdba74' } },
  { id: 'freelancer', name: 'Freelancer Hub', description: 'Service-focused with client testimonials.', badge: 'Versatile', badgeColor: 'bg-yellow-100 text-yellow-800', bgColor: 'bg-yellow-500', textColor: 'text-white', preview: <TemplateFreelancer />, colors: { primary: '#eab308', secondary: '#fde047' } },
  { id: 'brutalist', name: 'Brutalist', description: 'Rigid, blocky sections with massive type.', badge: 'Unique', badgeColor: 'bg-yellow-200 text-yellow-900', bgColor: 'bg-black', textColor: 'text-yellow-300', preview: <TemplateBrutalist />, colors: { primary: '#000000', secondary: '#fde047' } },
  { id: 'corporate', name: 'Corporate Clean', description: 'Card-based grid with hover reveals.', badge: 'Business', badgeColor: 'bg-slate-100 text-slate-800', bgColor: 'bg-slate-500', textColor: 'text-white', preview: <TemplateCorporate />, colors: { primary: '#475569', secondary: '#e2e8f0' } },
  { id: 'tech-startup', name: 'Tech Startup', description: 'Dark hero with side-floating CTA menu.', badge: 'Tech', badgeColor: 'bg-cyan-100 text-cyan-800', bgColor: 'bg-cyan-500', textColor: 'text-white', preview: <TemplateTech />, colors: { primary: '#0891b2', secondary: '#67e8f9' } },
  { id: 'modern', name: 'Modern Elegant', description: 'Overlapping card layers with side scroll nav.', badge: 'Stylish', badgeColor: 'bg-purple-100 text-purple-800', bgColor: 'bg-purple-500', textColor: 'text-white', preview: <TemplateModern />, colors: { primary: '#a855f7', secondary: '#d8b4fe' } },
  { id: 'marketing', name: 'Marketing Pro', description: 'Full-width case study blocks with KPIs.', badge: 'Data', badgeColor: 'bg-red-100 text-red-800', bgColor: 'bg-red-500', textColor: 'text-white', preview: <TemplateMarketing />, colors: { primary: '#ef4444', secondary: '#fca5a5' } },
  { id: 'luxury', name: 'Luxury Brand', description: 'Split hero with cinematic image slider.', badge: 'Premium', badgeColor: 'bg-amber-100 text-amber-800', bgColor: 'bg-amber-500', textColor: 'text-white', preview: <TemplateLuxury />, colors: { primary: '#d97706', secondary: '#fbbf24' } },
  { id: 'bold', name: 'Bold & Impactful', description: 'Diagonal dividers and oversized CTAs.', badge: 'Expressive', badgeColor: 'bg-rose-100 text-rose-800', bgColor: 'bg-rose-500', textColor: 'text-white', preview: <TemplateBold />, colors: { primary: '#e11d48', secondary: '#fda4af' } },
  { id: 'photographer', name: 'Photographer', description: 'A masonry grid perfect for showcasing photos.', badge: 'Creative', badgeColor: 'bg-gray-200 text-gray-800', bgColor: 'bg-black', textColor: 'text-white', preview: <TemplatePhotographer />, colors: { primary: '#ffffff', secondary: '#4b5563' } },
  { id: 'musician', name: 'Musician', description: 'Dark, atmospheric theme for artists & bands.', badge: 'Creative', badgeColor: 'bg-purple-100 text-purple-800', bgColor: 'bg-purple-900', textColor: 'text-white', preview: <TemplateMusician />, colors: { primary: '#a855f7', secondary: '#4c1d95' } },
  { id: 'author', name: 'Author', description: 'Classic, serif-font theme for writers.', badge: 'Academic', badgeColor: 'bg-amber-100 text-amber-800', bgColor: 'bg-[#fdfaf5]', textColor: 'text-[#3d3d3d]', preview: <TemplateAuthor />, colors: { primary: '#3d3d3d', secondary: '#e5e5e5' } },
  { id: 'filmmaker', name: 'Filmmaker', description: 'Cinematic, widescreen-focused design.', badge: 'Creative', badgeColor: 'bg-red-100 text-red-800', bgColor: 'bg-gray-900', textColor: 'text-white', preview: <TemplateFilmmaker />, colors: { primary: '#ef4444', secondary: '#374151' } },
  { id: 'illustrator', name: 'Illustrator', description: 'Playful and colorful for visual artists.', badge: 'Creative', badgeColor: 'bg-rose-100 text-rose-800', bgColor: 'bg-rose-50', textColor: 'text-rose-900', preview: <TemplateIllustrator />, colors: { primary: '#f43f5e', secondary: '#fecdd3' } },
  { id: 'consultant', name: 'Consultant', description: 'Clean, professional, and trustworthy.', badge: 'Business', badgeColor: 'bg-blue-100 text-blue-800', bgColor: 'bg-blue-50', textColor: 'text-blue-900', preview: <TemplateConsultant />, colors: { primary: '#2563eb', secondary: '#dbeafe' } },
  { id: 'gamer', name: 'Gamer', description: 'Neon, cyber-style for gaming profiles.', badge: 'Community', badgeColor: 'bg-cyan-100 text-cyan-800', bgColor: 'bg-gray-900', textColor: 'text-white', preview: <TemplateGamer />, colors: { primary: '#22d3ee', secondary: '#be185d' } },
  { id: 'architect', name: 'Architect', description: 'Blueprint-inspired, minimalist, and structural.', badge: 'Specialized', badgeColor: 'bg-gray-200 text-gray-800', bgColor: 'bg-gray-200', textColor: 'text-black', preview: <TemplateArchitect />, colors: { primary: '#4b5563', secondary: '#d1d5db' } },
  { id: 'interior-designer', name: 'Interior Designer', description: 'Elegant, modern, with a focus on space.', badge: 'Creative', badgeColor: 'bg-emerald-100 text-emerald-800', bgColor: 'bg-emerald-50', textColor: 'text-emerald-900', preview: <TemplateInteriorDesigner />, colors: { primary: '#10b981', secondary: '#a7f3d0' } },
  { id: 'product-manager', name: 'Product Manager', description: 'Roadmap-focused, clear, and strategic.', badge: 'Tech', badgeColor: 'bg-indigo-100 text-indigo-800', bgColor: 'bg-white', textColor: 'text-indigo-900', preview: <TemplateProductManager />, colors: { primary: '#4f46e5', secondary: '#e0e7ff' } },
  { id: 'researcher', name: 'Researcher', description: 'Data-driven, formal, and publication-ready.', badge: 'Academic', badgeColor: 'bg-slate-100 text-slate-800', bgColor: 'bg-slate-50', textColor: 'text-slate-900', preview: <TemplateResearcher />, colors: { primary: '#475569', secondary: '#e2e8f0' } },
  { id: 'chef', name: 'Chef', description: 'Warm, inviting, and perfect for culinary artists.', badge: 'Creative', badgeColor: 'bg-amber-100 text-amber-800', bgColor: 'bg-amber-50', textColor: 'text-amber-900', preview: <TemplateChef />, colors: { primary: '#f59e0b', secondary: '#fef3c7' } },
  { id: 'fitness-coach', name: 'Fitness Coach', description: 'High-energy, bold, and motivational.', badge: 'Versatile', badgeColor: 'bg-red-100 text-red-800', bgColor: 'bg-gray-800', textColor: 'text-white', preview: <TemplateFitnessCoach />, colors: { primary: '#ef4444', secondary: '#f87171' } },
  { id: 'travel-blogger', name: 'Travel Blogger', description: 'Adventurous, photo-centric, and worldly.', badge: 'Community', badgeColor: 'bg-sky-100 text-sky-800', bgColor: 'bg-sky-100', textColor: 'text-sky-900', preview: <TemplateTravelBlogger />, colors: { primary: '#0ea5e9', secondary: '#bae6fd' } },
];


export function PortfolioTemplate({ template, isSelected }) {
    return (
        <Card className={cn(
            "group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full",
            isSelected && "ring-2 ring-primary neon-glow"
        )}>
            <div className={cn("h-48 flex items-center justify-center p-2 relative", template.bgColor)}>
                {template.preview}
                 {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                )}
            </div>
            <CardContent className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-bold">{template.name}</h3>
                <p className="text-sm text-muted-foreground flex-grow">{template.description}</p>
                {template.badge && <Badge className={cn("mt-4 self-start font-semibold", template.badgeColor)}>{template.badge}</Badge>}
            </CardContent>
        </Card>
    )
}
