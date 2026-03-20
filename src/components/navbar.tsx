
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Hide navbar on these routes (they have their own navigation)
  const hideNavbar =
    pathname.startsWith('/create') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/spin') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/user/') ||
    pathname.startsWith('/learning') ||
    pathname.startsWith('/career-paths') ||
    pathname.startsWith('/my-career-plan') ||
    pathname.startsWith('/my-content') ||
    pathname.startsWith('/browse') ||
    pathname.startsWith('/ai-coaching') ||
    pathname.startsWith('/certifications') ||
    pathname.startsWith('/create') ||
    pathname.startsWith('/spin') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/ai-matcher');

  // Also hide when user is logged in and on home page (dashboard shown)
  if (hideNavbar || (user && pathname === '/')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <Wand2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg">Parichay</span>
            <span className="text-xs text-muted-foreground -mt-1">Powered by Advanced AI</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/#features" className="text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="/#templates" className="text-muted-foreground transition-colors hover:text-foreground">
            Templates
          </Link>
          <Link href="/#how-it-works" className="text-muted-foreground transition-colors hover:text-foreground">
            How it Works
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : user ? (
            <Button asChild>
              <Link href="/">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </>
          )
          }
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
