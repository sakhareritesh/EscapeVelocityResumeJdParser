
'use server';

import { generateTheme, type GenerateThemeInput } from '@/ai/flows/generate-theme';
import { extractUserInfo, type UserData, type UserInfo } from '@/ai/flows/extract-user-info-flow';
import { generateImage, type GenerateImageInput } from '@/ai/flows/generate-image-flow';
import { createPaymentOrder, type CreatePaymentOrderInput } from '@/ai/flows/create-payment-order-flow';
import { chatbot, type ChatbotInput } from '@/ai/flows/chatbot-flow';
import { deployToVercel, type DeployToVercelInput } from '@/ai/flows/deploy-to-vercel-flow';
import { recruitmentMatcher, type RecruitmentMatcherInput, type RecruitmentMatcherOutput } from '@/ai/flows/recruitment-matcher-flow';
import { scorePortfolio, type ScorePortfolioOutput } from '@/ai/flows/score-portfolio-flow';
import { get, ref, update } from 'firebase/database';
import { db } from '@/lib/firebase';
import { generatePortfolioHtmlAction } from './generate-html-action';
import JSZip from 'jszip';

type UsageType = 'analysis' | 'downloads' | 'generations';

async function checkAndDecrementUsage(uid: string, type: UsageType): Promise<{ success: boolean; error?: string }> {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
        return { success: false, error: 'User not found.' };
    }

    const userProfile = snapshot.val();
    const currentUsage = userProfile.usage?.[type] ?? 0;

    if (currentUsage <= 0) {
        return { success: false, error: `You have no ${type} attempts left. Please upgrade to Pro.` };
    }

    const newUsageCount = currentUsage - 1;
    const updates = {};
    updates[`/users/${uid}/usage/${type}`] = newUsageCount;
    
    try {
        await update(ref(db), updates);
        return { success: true };
    } catch (dbError) {
        console.error("Firebase update failed:", dbError);
        return { success: false, error: 'Could not update usage count in database.' };
    }
}


export async function generateThemeAction(input: GenerateThemeInput) {
  try {
    const output = await generateTheme(input);
    return { success: true, data: output };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate theme.' };
  }
}

export async function extractUserInfoAction(uid: string, input: UserData) {
  try {
    const usageResult = await checkAndDecrementUsage(uid, 'generations');
    if (!usageResult.success) {
        return usageResult;
    }
    const output = await extractUserInfo(input);
    return { success: true, data: output };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: 'Failed to extract user info.' };
  }
}

export async function scorePortfolioAction(userInfo: UserInfo): Promise<{ success: boolean; data?: ScorePortfolioOutput; error?: string }> {
    if (!userInfo) {
        return { success: false, error: "User info is required to score a portfolio." };
    }
    try {
        const output = await scorePortfolio(userInfo);
        return { success: true, data: output };
    } catch (error) {
        console.error("Portfolio Scoring Action Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during scoring.';
        return { success: false, error: errorMessage };
    }
}

export async function generateImageAction(input: GenerateImageInput) {
  try {
    const output = await generateImage(input);
    return { success: true, data: output };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate image.' };
  }
}

export async function generateAvatarAction(input: { prompt: string; gender?: 'man' | 'woman' }) {
    try {
      const result = await generateImage({
        prompt: `A Ghibli-style anime portrait of a ${input.gender ? input.gender + ' ' : ''}${input.prompt}, capturing their professional essence in an artistic way.`,
      });
      if (!result.imageUrl) {
        throw new Error("The AI failed to return an image URL.");
      }
      return { success: true, data: result };
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, error: errorMessage };
    }
}


export async function createPaymentOrderAction(input: CreatePaymentOrderInput) {
  try {
    const output = await createPaymentOrder(input);
    return { success: true, data: output };
  } catch (error)
 {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
}

export async function chatbotAction(input: ChatbotInput) {
  try {
    const output = await chatbot(input);
    return { success: true, data: output };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
}


export async function deployToVercelAction(input: DeployToVercelInput) {
    try {
        const output = await deployToVercel(input);
        return { success: true, data: output };
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, error: errorMessage };
    }
}

export async function recruitmentMatcherAction(uid: string, input: RecruitmentMatcherInput): Promise<{ success: boolean; data?: RecruitmentMatcherOutput; error?: string }> {
    try {
        const usageResult = await checkAndDecrementUsage(uid, 'analysis');
        if (!usageResult.success) {
            return usageResult;
        }
        
        const output = await recruitmentMatcher(input);
        return { success: true, data: output };
    } catch (error) {
        console.error("Recruitment Matcher Action Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during analysis.';
        return { success: false, error: errorMessage };
    }
}

export async function downloadPortfolioAction(uid: string, staticMarkup: string, name: string, activeCustomizations: any): Promise<{ success: true; data: Blob; error?: never } | { success: false; error: string; data?: never }> {
    try {
        const usageResult = await checkAndDecrementUsage(uid, 'downloads');
        if (!usageResult.success) {
            return { success: false, error: usageResult.error };
        }

        const zip = new JSZip();

        const htmlResult = await generatePortfolioHtmlAction({
            staticMarkup,
            name: name,
            includeScripts: false,
        });
        
        if (!htmlResult.success || !htmlResult.data) {
             return { success: false, error: 'Could not generate portfolio HTML for download.' };
        }
        zip.file('index.html', htmlResult.data.html);

        const cssContent = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Space+Mono:wght@400;700&family=Libre+Baskerville:wght@400;700&family=Source+Code+Pro:wght@400;700&family=Montserrat&family=Lora&display=swap');
body, h1, h2, h3, p, div, section, header, footer, main, nav, ul, li, a, button, img, span, time { margin: 0; padding: 0; box-sizing: border-box; font-family: '${activeCustomizations.fontFamily}', sans-serif; }
a { text-decoration: none; color: inherit; }
button { background: none; border: none; cursor: pointer; }
:root {
  --preview-primary: ${activeCustomizations.primaryColor};
  --preview-secondary: ${activeCustomizations.secondaryColor};
  --primary-foreground: #ffffff;
}
.preview-bg-primary { background-color: var(--preview-primary); }
.preview-bg-secondary { background-color: var(--preview-secondary); }
.preview-text-primary { color: var(--preview-primary); }
.preview-border-primary { border-color: var(--preview-primary); }
.text-primary-foreground { color: var(--primary-foreground); }
.animated-gradient {
    background: linear-gradient(90deg, var(--preview-primary), var(--preview-secondary), var(--preview-primary));
    background-size: 200% auto;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: text-pan 5s linear infinite;
}
@keyframes text-pan { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
.neon-glow { box-shadow: 0 0 5px var(--preview-primary), 0 0 10px var(--preview-primary), 0 0 15px var(--preview-primary); }
.container { max-width: 1200px; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem; }
.text-center { text-align: center; }
.font-bold { font-weight: 700; }
.mb-8 { margin-bottom: 2rem; } .mb-12 { margin-bottom: 3rem; } .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
.grid { display: grid; } .gap-8 { gap: 2rem; } .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
@media (min-width: 768px) { .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.relative { position: relative; } .flex { display: flex; } .items-center { align-items: center; } .justify-center { justify-content: center; }
.w-full { width: 100%; } .h-full { height: 100%; } .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); }
.rounded-lg { border-radius: 0.5rem; } .overflow-hidden { overflow: hidden; } .p-6 { padding: 1.5rem; }
.bg-background { background-color: #fff; } .text-foreground { color: #000; } .text-muted-foreground { color: #666; }
.bg-muted\\/40 { background-color: rgba(241, 245, 249, 0.4); } .bg-background\\/50 { background-color: rgba(255,255,255,0.5); }
.border-border\\/10 { border-color: rgba(226,232,240,0.1); } .backdrop-blur-lg { backdrop-filter: blur(16px); }
.shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); } .hover\\:-translate-y-2:hover { transform: translateY(-0.5rem); }
.transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 300ms; }
.duration-300 { transition-duration: 300ms; } .group:hover .group-hover\\:scale-110 { transform: scale(1.1); }
.transition-transform { transition-property: transform; } .duration-500 { transition-duration: 500ms; }
`;
        zip.file('style.css', cssContent);

        const jsContent = `
console.log("Portfolio loaded!");
document.addEventListener('DOMContentLoaded', () => {
    console.log("Portfolio interactivity can be added here.");
});
        `;
        zip.file('script.js', jsContent);

        const blob = await zip.generateAsync({ type: 'blob' });
        return { success: true, data: blob };

    } catch (error) {
        console.error("Download Portfolio Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during download.';
        return { success: false, error: errorMessage };
    }
}

export async function spinTheWheelAction(uid: string): Promise<{ success: boolean; prize?: number; segmentIndex?: number; error?: string }> {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
        return { success: false, error: 'User not found.' };
    }

    const userProfile = snapshot.val();
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    let spinData = userProfile.spinData || { date: '', count: 0 };

    if (spinData.date !== today) {
        spinData = { date: today, count: 0 };
    }

    if (spinData.count >= 2) {
        return { success: false, error: 'You have already used your 2 spins for today.' };
    }
    
    const segments = [
      { value: 10, label: '10 PP' },
      { value: 0, label: 'Try Again' },
      { value: 20, label: '20 PP' },
      { value: 5, label: '5 PP' },
      { value: 50, label: '50 PP' },
      { value: 30, label: '30 PP' },
      { value: 40, label: '40 PP' },
    ];
    
    const winningSegmentIndex = Math.floor(Math.random() * segments.length);
    const prizeWon = segments[winningSegmentIndex].value;

    const newPpTokens = (userProfile.ppTokens || 0) + prizeWon;
    const newSpinCount = spinData.count + 1;

    try {
        await update(userRef, {
            ppTokens: newPpTokens,
            spinData: {
                date: today,
                count: newSpinCount,
            },
        });
        return { success: true, prize: prizeWon, segmentIndex: winningSegmentIndex };
    } catch (dbError) {
        console.error("Firebase update failed:", dbError);
        return { success: false, error: 'Could not update your token balance.' };
    }
}
