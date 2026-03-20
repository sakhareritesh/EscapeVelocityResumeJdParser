
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { DashboardNavbar } from '@/components/dashboard-navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, Star, Download, BarChart2, Edit, RefreshCw, Layers, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';


export default function UserProfilePage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  if (loading || !userProfile || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const getPlanDisplayName = () => {
    if (userProfile.planStatus === 'pro') {
      return `Pro (${userProfile.plan === 'monthly' ? 'Monthly' : 'Yearly'})`;
    }
    return 'Free';
  }

  const getResetDateInfo = () => {
    if (userProfile.planStatus === 'pro' && userProfile.usageResetDate) {
        return `Resets on ${format(new Date(userProfile.usageResetDate), 'PPP')}`;
    }
    return 'One-time credits';
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
            <p className="text-muted-foreground">Manage your account, plan, and portfolio.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Profile & Actions */}
            <div className="md:col-span-1 space-y-8">
                <Card className="shadow-lg">
                    <CardHeader className="items-center text-center">
                        <Avatar className="w-24 h-24 mb-4">
                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                            <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{user.displayName}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
                    </CardContent>
                </Card>
                 <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Portfolio Actions</CardTitle>
                        <CardDescription>Continue where you left off.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button asChild className="w-full">
                            <Link href="/create">Go to Creator Studio</Link>
                        </Button>
                        <Button asChild className="w-full" variant="outline">
                            <Link href="/spin"><Star className="mr-2 h-4 w-4"/> Spin for Tokens</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
            
            {/* Right Column: Plan & Usage */}
             <Card className="md:col-span-2 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Star className="w-6 h-6 text-yellow-500" /> Your Plan & Usage</CardTitle>
                    <CardDescription>View your current subscription status and usage limits.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                        <div>
                            <p className="font-semibold text-lg">Current Plan</p>
                            <p className="text-muted-foreground text-sm">Your active subscription tier.</p>
                        </div>
                        <Badge variant={userProfile.planStatus === 'pro' ? 'default' : 'secondary'} className="capitalize text-base px-4 py-1">
                            {getPlanDisplayName()}
                        </Badge>
                   </div>
                   
                   <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-lg">Usage Credits</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <RefreshCw className="w-3 h-3" />
                                <span>{getResetDateInfo()}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-4 border rounded-lg">
                           <div className="flex items-center gap-3">
                                <Layers className="w-6 h-6 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">AI Portfolio Generations</p>
                                    <p className="text-xs text-muted-foreground">For creating new portfolios</p>
                                </div>
                           </div>
                           <p className="font-bold text-lg">{userProfile.usage?.generations ?? 0} remaining</p>
                        </div>
                        <div className="flex justify-between items-center p-4 border rounded-lg">
                           <div className="flex items-center gap-3">
                                <BarChart2 className="w-6 h-6 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">AI Analysis</p>
                                    <p className="text-xs text-muted-foreground">For AI Job Matcher</p>
                                </div>
                           </div>
                           <p className="font-bold text-lg">{userProfile.usage?.analysis ?? 0} remaining</p>
                        </div>
                        <div className="flex justify-between items-center p-4 border rounded-lg">
                           <div className="flex items-center gap-3">
                                <Download className="w-6 h-6 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Source Code Downloads</p>
                                    <p className="text-xs text-muted-foreground">For your portfolio</p>
                                </div>
                           </div>
                           <p className="font-bold text-lg">{userProfile.usage?.downloads ?? 0} remaining</p>
                        </div>
                   </div>
                   
                   {userProfile.planStatus === 'free' && (
                        <Button className="w-full text-lg py-6" asChild>
                            <Link href="/#pricing">Upgrade to Pro</Link>
                        </Button>
                   )}
                </CardContent>
            </Card>
        </div>

      </main>
    </div>
  );
}
