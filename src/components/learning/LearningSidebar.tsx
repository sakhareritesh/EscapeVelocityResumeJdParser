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
    ChevronLeft,
    Gamepad2,
    Wrench,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LearningSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const sidebarSections = [
    {
        items: [
            { href: '/learning', label: 'Home', icon: Home },
        ],
    },
    {
        title: 'My Career',
        items: [
            { href: '/learning/career-paths', label: 'Career Paths', icon: Compass },
            { href: '/learning/my-career-plan', label: 'My Career Plan', icon: Map },
        ],
    },
    {
        title: 'Library',
        items: [
            { href: '/learning/my-content', label: 'My Content', icon: BookOpen },
            { href: '/learning/browse', label: 'Browse', icon: Search },
        ],
    },
    {
        title: 'AI Tools',
        items: [
            { href: '/learning/ai-coaching', label: 'AI Coaching', icon: Sparkles },
        ],
    },
    {
        title: 'Practice',
        items: [
            { href: '/learning/certifications', label: 'Certifications', icon: Award },
        ],
    },
];

export function LearningSidebar({ isOpen, onClose }: LearningSidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/learning') return pathname === '/learning';
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
                    'fixed top-0 left-0 z-50 h-full w-[220px] bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Mobile close button */}
                <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200 lg:hidden">
                    <span className="font-semibold text-sm text-gray-800">Menu</span>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Logo area on desktop */}
                <div className="hidden lg:flex items-center gap-2 px-5 h-14 border-b border-gray-200 shrink-0">
                    <div className="w-7 h-7 bg-[#0a66c2] rounded flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-[15px] text-gray-900">Learning</span>
                </div>

                {/* Nav items */}
                <nav className="flex-1 overflow-y-auto py-2">
                    {sidebarSections.map((section, sectionIdx) => (
                        <div key={sectionIdx}>
                            {section.title && (
                                <div className="px-5 pt-4 pb-1">
                                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
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
                                                ? 'text-[#0a66c2] bg-[#e8f1fd] font-semibold'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        )}
                                    >
                                        {active && (
                                            <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-[#0a66c2] rounded-r" />
                                        )}
                                        <Icon className={cn('w-[18px] h-[18px] shrink-0', active ? 'text-[#0a66c2]' : 'text-gray-500')} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Bottom help link */}
                <div className="border-t border-gray-200 p-3 shrink-0">
                    <Link
                        href="#"
                        className="flex items-center gap-3 px-2 py-2 text-[13px] text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <HelpCircle className="w-[18px] h-[18px]" />
                        <span>Help</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
