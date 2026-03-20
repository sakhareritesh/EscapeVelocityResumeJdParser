
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Coins, Loader2, Star, ShoppingBag, Laptop, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { spinTheWheelAction } from '@/app/actions/portfolio-actions';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DashboardNavbar } from '@/components/dashboard-navbar';

const segments = [
  { value: 10, label: '10 PP', color: 'hsl(142 71% 45%)' },
  { value: 0, label: 'Try Again', color: 'hsl(215 20% 65%)' },
  { value: 20, label: '20 PP', color: 'hsl(48 96% 58%)' },
  { value: 5, label: '5 PP', color: 'hsl(347 77% 68%)' },
  { value: 50, label: '50 PP', color: 'hsl(262 83% 58%)' },
  { value: 30, label: '30 PP', color: 'hsl(24 95% 53%)' },
  { value: 40, label: '40 PP', color: 'hsl(217 91% 60%)' },
  { value: 0, label: 'Try Again', color: 'hsl(215 20% 65%)' },
];

const goodies = [
    { name: 'Parichay Mug', cost: 500, icon: <ShoppingBag className="w-12 h-12 text-primary"/> },
    { name: 'Parichay Hoodie', cost: 1000, icon: <ShoppingBag className="w-12 h-12 text-primary"/> },
    { name: 'Sponsored Trip Voucher', cost: 5000, icon: <Gift className="w-12 h-12 text-primary"/> },
    { name: 'Laptop', cost: 10000, icon: <Laptop className="w-12 h-12 text-primary"/> },
]

export default function SpinTheWheelPage() {
    const { user, userProfile, loading, fetchUserProfile } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [spinsLeft, setSpinsLeft] = useState(2);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

     useEffect(() => {
        if (userProfile) {
            const today = new Date().toISOString().split('T')[0];
            const spinData = userProfile.spinData || { date: '', count: 0 };
            
            if(spinData.date === today) {
                setSpinsLeft(Math.max(0, 2 - spinData.count));
            } else {
                setSpinsLeft(2);
            }
        }
    }, [userProfile]);

    const canSpin = spinsLeft > 0 && !isSpinning;

    const handleSpin = async () => {
        if (!canSpin || !user) {
            toast({ variant: 'destructive', title: 'Cannot Spin', description: canSpin ? 'You must be logged in to spin.' : 'You have no spins left today.'});
            return;
        }
        setIsSpinning(true);

        const result = await spinTheWheelAction(user.uid);
        
        if (result.success && typeof result.segmentIndex !== 'undefined') {
            const segmentAngle = 360 / segments.length;
            const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.8;
            const finalRotation = (rotation + 360 * 5) - (result.segmentIndex * segmentAngle) - randomOffset;
            setRotation(finalRotation);

            setTimeout(async () => {
                setIsSpinning(false);
                if (result.prize && result.prize > 0) {
                     toast({ title: `Congratulations!`, description: `You won ${result.prize} PP Tokens!`});
                } else {
                     toast({ title: `Better luck next time!`, variant: 'destructive' });
                }
                if (user) {
                  await fetchUserProfile(user);
                }
            }, 5000); // 5-second spin animation
        } else {
            toast({ variant: 'destructive', title: 'Spin Failed', description: result.error });
            setIsSpinning(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
            <DashboardNavbar />
             <div className="absolute inset-0 z-0 opacity-5 dark:opacity-[0.02]">
                <Coins className="absolute top-[10%] left-[15%] w-16 h-16 animate-float text-muted-foreground" />
                <Coins className="absolute top-[70%] left-[5%] w-8 h-8 animate-float animation-delay-2000 text-muted-foreground" />
                <Star className="absolute top-[50%] right-[10%] w-24 h-24 animate-float animation-delay-4000 text-muted-foreground" />
            </div>
            
            <main className="container mx-auto px-4 py-8 relative z-10 flex-grow">
                <div className="text-center my-12">
                    <h1 className="text-5xl font-extrabold tracking-tight animated-gradient">Spin To Win</h1>
                    <p className="text-muted-foreground mt-2">You have <span className="font-bold text-foreground">{spinsLeft}</span> spin{spinsLeft !== 1 && 's'} left today. Win exclusive PP Tokens!</p>
                </div>
                
                 <Card className="max-w-2xl mx-auto shadow-lg mb-8 bg-background/50 backdrop-blur-sm border-border">
                    <CardHeader className="text-center">
                       <CardTitle className="text-muted-foreground">Your PP Token Balance</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center gap-4">
                        <Coins className="w-10 h-10 text-yellow-400" />
                         <p className="text-5xl font-bold text-foreground">{userProfile?.ppTokens ?? 0}</p>
                    </CardContent>
                 </Card>

                <div className="flex flex-col items-center justify-center gap-10">
                    <div className="relative w-80 h-80 md:w-96 md:h-96">
                        {/* Pointer */}
                        <div 
                          className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-16 z-20"
                          style={{
                            clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                          }}
                        >
                          <div className="w-full h-full bg-primary shadow-lg"></div>
                        </div>
                        
                        {/* Wheel */}
                        <div 
                            className="absolute inset-0 rounded-full transition-transform duration-[5000ms] ease-[cubic-bezier(0.25,1,0.5,1)] shadow-2xl border-8 border-background/50 dark:border-foreground/10"
                            style={{ 
                                transform: `rotate(${rotation}deg)`,
                            }}
                        >
                            <svg viewBox="0 0 200 200" className="w-full h-full">
                                <defs>
                                    <path id="text-path" d="M 25 100 A 75 75 0 1 1 175 100" />
                                </defs>
                                {segments.map((segment, index) => {
                                    const angle = 360 / segments.length;
                                    const startAngle = angle * index;
                                    const endAngle = startAngle + angle;
                                    const largeArcFlag = angle > 180 ? 1 : 0;
                                    const x1 = 100 + 100 * Math.cos(Math.PI * startAngle / 180);
                                    const y1 = 100 + 100 * Math.sin(Math.PI * startAngle / 180);
                                    const x2 = 100 + 100 * Math.cos(Math.PI * endAngle / 180);
                                    const y2 = 100 + 100 * Math.sin(Math.PI * endAngle / 180);

                                    return (
                                        <g key={index}>
                                          <path d={`M100,100 L${x1},${y1} A100,100 0 ${largeArcFlag},1 ${x2},${y2} Z`} fill={segment.color} />
                                          <path d={`M100,100 L${x1},${y1} A100,100 0 ${largeArcFlag},1 ${x2},${y2} Z`} fill="black" opacity="0.1"/>
                                        </g>
                                    );
                                })}
                                {segments.map((segment, index) => {
                                     const angle = 360 / segments.length;
                                     const textAngle = angle * index + angle / 2;
                                     const iconTranslateX = 100 + 60 * Math.cos(Math.PI * textAngle / 180);
                                     const iconTranslateY = 100 + 60 * Math.sin(Math.PI * textAngle / 180);
                                     const labelTranslateX = 100 + 80 * Math.cos(Math.PI * textAngle / 180);
                                     const labelTranslateY = 100 + 80 * Math.sin(Math.PI * textAngle / 180);

                                     return (
                                        <g key={`text-${index}`} className={cn("transition-opacity duration-300", isSpinning && "opacity-0")}>
                                          <g transform={`translate(${iconTranslateX}, ${iconTranslateY}) rotate(${textAngle + 90})`}>
                                              {segment.value > 0 ? (
                                                  <Coins className="w-5 h-5 text-white/80" x="-10" y="-10"/>
                                              ) : (
                                                  <Star className="w-5 h-5 text-white/80" x="-10" y="-10"/>
                                              )}
                                          </g>
                                          <g transform={`translate(${labelTranslateX}, ${labelTranslateY}) rotate(${textAngle + 90})`}>
                                            <text 
                                                textAnchor="middle" 
                                                dominantBaseline="middle"
                                                className="fill-white font-bold text-[10px] tracking-wider uppercase"
                                                style={{textShadow: '0 1px 2px rgba(0,0,0,0.5)'}}
                                            >
                                                {segment.label}
                                            </text>
                                          </g>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                         {/* Center Hub */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-background rounded-full border-4 border-muted shadow-inner flex items-center justify-center">
                            <Star className="w-8 h-8 text-yellow-400"/>
                        </div>
                    </div>

                    <Button 
                        size="lg" 
                        className="text-xl py-7 px-16 rounded-full font-bold shadow-lg neon-glow transition-transform hover:scale-105"
                        onClick={handleSpin}
                        disabled={!canSpin}
                    >
                        {isSpinning ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Star className="mr-2 h-6 w-6" />}
                        {isSpinning ? 'Spinning...' : (canSpin ? 'Spin the Wheel!' : 'No Spins Left')}
                    </Button>
                </div>
                
                <section id="goodies" className="mt-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight animated-gradient">Redeem Goodies</h2>
                        <p className="text-muted-foreground mt-2">Use your PP Tokens to get exclusive merchandise.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {goodies.map((goodie, index) => (
                             <Card key={index} className="shadow-lg text-center bg-background/50 backdrop-blur-sm border-border">
                                <CardHeader>
                                    <div className="w-24 h-24 mx-auto rounded-lg bg-muted flex items-center justify-center mb-4">
                                        {goodie.icon}
                                    </div>
                                    <CardTitle className="text-foreground">{goodie.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold flex items-center justify-center gap-2 mb-4 text-foreground">{goodie.cost.toLocaleString()} <Coins className="w-6 h-6 text-yellow-400"/></p>
                                    
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                           <Button className="w-full" disabled={(userProfile?.ppTokens ?? 0) < goodie.cost}>Redeem</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Confirm Redemption</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to spend {goodie.cost.toLocaleString()} PP Tokens on a {goodie.name}? This action cannot be undone.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction>Confirm</AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
