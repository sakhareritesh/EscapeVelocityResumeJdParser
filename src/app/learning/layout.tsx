'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { LearningSidebar } from '@/components/learning/LearningSidebar';
import { LearningNavbar } from '@/components/learning/LearningNavbar';
import { Loader2 } from 'lucide-react';

export default function LearningLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f3f2ef]">
                <Loader2 className="w-8 h-8 text-[#0a66c2] animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex h-screen bg-[#f3f2ef] overflow-hidden">
            <LearningSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <LearningNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
