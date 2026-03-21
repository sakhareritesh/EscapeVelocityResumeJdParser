
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from '@/components/navbar';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/auth-context';
import Script from 'next/script';
import { Chatbot } from '@/components/chatbot';
import { ThemeProvider } from '@/components/theme-provider';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SkillMapr',
  description: 'AI-Adaptive Learning Platform — Parse resumes, identify skill gaps, generate personalized learning pathways, and build stunning portfolios.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            {children}
            <Toaster />
          </AuthProvider>
          <Script
            id="razorpay-checkout-js"
            src="https://checkout.razorpay.com/v1/checkout.js"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
