'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    Home,
    Compass,
    Map,
    BookOpen,
    Search,
    Sparkles,
    Award,
    HelpCircle,
    X,
    Wand2,
    BriefcaseBusiness,
    Palette,
    Star,
    User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LearningSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const sidebarSections = [
    {
        items: [
            { href: '/', label: 'Home', icon: Home },
        ],
    },
    {
        title: 'My Career',
        items: [
            { href: '/career-paths', label: 'Career Paths', icon: Compass },
            { href: '/my-career-plan', label: 'My Career Plan', icon: Map },
        ],
    },
    {
        title: 'Library',
        items: [
            { href: '/my-content', label: 'My Content', icon: BookOpen },
            { href: '/browse', label: 'Browse', icon: Search },
        ],
    },
    {
        title: 'AI Tools',
        items: [
            { href: '/ai-coaching', label: 'AI Coaching', icon: Sparkles },
            { href: '/ai-matcher', label: 'AI Job Matcher', icon: BriefcaseBusiness },
        ],
    },
    {
        title: 'Practice',
        items: [
            { href: '/certifications', label: 'Certifications', icon: Award },
        ],
    },
    {
        title: 'Create',
        items: [
            { href: '/create', label: 'Portfolio Builder', icon: Palette },
        ],
    },
    {
        title: 'Rewards',
        items: [
            { href: '/spin', label: 'Spin to Win', icon: Star },
        ],
    },
    {
        title: 'Account',
        items: [
            { href: '/profile', label: 'My Profile', icon: User },
        ],
    },
];

export function LearningSidebar({ isOpen, onClose }: LearningSidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-50 h-full w-[220px] bg-white dark:bg-card border-r border-gray-200 dark:border-border flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Mobile close button */}
                <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-border lg:hidden">
                    <span className="font-semibold text-sm text-gray-800 dark:text-foreground">Menu</span>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Logo area on desktop */}
                <div className="hidden lg:flex items-center gap-2 px-5 h-14 border-b border-gray-200 dark:border-border shrink-0">
                    <div className="w-7 h-7 bg-primary rounded flex items-center justify-center">
                        <Wand2 className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="font-semibold text-[15px] text-gray-900 dark:text-foreground">Parichay</span>
                </div>

                {/* Nav items */}
                <nav className="flex-1 overflow-y-auto py-2">
                    {sidebarSections.map((section, sectionIdx) => (
                        <div key={sectionIdx}>
                            {section.title && (
                                <div className="px-5 pt-4 pb-1">
                                    <span className="text-[11px] font-semibold text-gray-500 dark:text-muted-foreground uppercase tracking-wider">
                                        {section.title}
                                    </span>
                                </div>
                            )}
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={cn(
                                            'flex items-center gap-3 px-5 py-2.5 text-[13px] font-medium transition-colors relative',
                                            active
                                                ? 'text-primary bg-primary/10 font-semibold'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-muted hover:text-gray-900 dark:hover:text-foreground'
                                        )}
                                    >
                                        {active && (
                                            <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-primary rounded-r" />
                                        )}
                                        <Icon className={cn('w-[18px] h-[18px] shrink-0', active ? 'text-primary' : 'text-gray-500 dark:text-gray-400')} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Bottom help link */}
                <div className="border-t border-gray-200 dark:border-border p-3 shrink-0">
                    <Link
                        href="#"
                        className="flex items-center gap-3 px-2 py-2 text-[13px] text-gray-500 dark:text-muted-foreground hover:text-gray-700 dark:hover:text-foreground transition-colors"
                    >
                        <HelpCircle className="w-[18px] h-[18px]" />
                        <span>Help</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
