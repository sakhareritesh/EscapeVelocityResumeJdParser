'use client';

import { Search, Bell, Menu, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LearningNavbarProps {
    onMenuToggle: () => void;
}

export function LearningNavbar({ onMenuToggle }: LearningNavbarProps) {
    const { user, userProfile, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const initials = userProfile?.name
        ? userProfile.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : 'U';

    return (
        <header className="sticky top-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4 shrink-0">
            {/* Mobile menu button */}
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 text-gray-600"
                onClick={onMenuToggle}
            >
                <Menu className="h-5 w-5" />
            </Button>

            {/* Search */}
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search for skills, courses, or topics..."
                        className="pl-10 h-9 bg-gray-50 border-gray-200 text-sm rounded-lg focus-visible:ring-[#0a66c2] focus-visible:ring-1 focus-visible:border-[#0a66c2]"
                    />
                </div>
            </div>

            <div className="flex items-center gap-1">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 relative">
                    <Bell className="h-[18px] w-[18px]" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Button>

                {/* Profile dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-9 px-2 gap-2">
                            <Avatar className="h-7 w-7">
                                <AvatarFallback className="bg-[#0a66c2] text-white text-xs font-semibold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                {userProfile?.name || 'User'}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <div className="px-3 py-2">
                            <p className="text-sm font-medium">{userProfile?.name}</p>
                            <p className="text-xs text-gray-500">{userProfile?.email}</p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/user/profile" className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                My Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/create" className="cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" />
                                Portfolio Builder
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
