
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Rocket } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

interface StepperProps {
  currentStep: number;
}

const steps = [
  { step: 1, label: 'Data Extraction', href: '/create' },
  { step: 2, label: 'Content Management', href: '/create/editor' },
  { step: 3, label: 'Pick Template & Deploy', href: '/create/templates' },
];

export function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="w-full flex items-center justify-center">
        <div className="flex items-center justify-center gap-2 md:gap-4">
        {steps.map((item, index) => {
            const isActive = item.step === currentStep;
            const isCompleted = item.step < currentStep;

            return (
            <React.Fragment key={item.step}>
                <Link href={isCompleted ? item.href : '#'} className="flex items-center gap-2 md:gap-3 text-center flex-col md:flex-row">
                <div
                    className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-bold text-base transition-colors shrink-0',
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-500',
                    isCompleted ? 'bg-green-500 text-white' : ''
                    )}
                >
                    {isCompleted ? <Check className="w-5 h-5"/> : item.step}
                </div>
                <span className={cn(
                    'font-semibold transition-colors text-sm', 
                    isActive ? 'text-primary' : 'text-muted-foreground',
                    isCompleted ? 'text-foreground' : ''
                    )}>
                    {item.label}
                </span>
                </Link>
                {index < steps.length - 1 && (
                <div className="h-0.5 w-12 md:w-16 bg-gray-200 rounded-full hidden md:block"></div>
                )}
            </React.Fragment>
            );
        })}
        </div>
    </div>
  );
}
