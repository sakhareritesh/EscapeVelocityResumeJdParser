
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return; 
    }

    if (!user) {
      router.push('/login');
      return;
    }

    // Always redirect to the user profile page now
    router.push('/user/profile');
    
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="ml-4 text-muted-foreground">Redirecting to your profile...</p>
    </div>
  );
}
