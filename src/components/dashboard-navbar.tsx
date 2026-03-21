
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Wand2, LogOut, Gift, UserCog, User, Star } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';

export function DashboardNavbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <Wand2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-lg">SkillMapr Pro</span>
            <p className="text-xs text-muted-foreground -mt-1">SkillMapr-Powered Dashboard</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {user && (
            <>
              <Button variant="ghost" asChild>
                <Link href="/user/profile"><User className="mr-2 h-4 w-4" /> My Profile</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/admin/recruitment"><UserCog className="mr-2 h-4 w-4" /> AI Matcher</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/spin"><Star className="mr-2 h-4 w-4" /> Spin to Win</Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
