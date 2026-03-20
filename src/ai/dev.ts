import { config } from 'dotenv';
config();

import '@/ai/flows/generate-theme.ts';
import '@/ai/flows/extract-user-info-flow.ts';
import '@/ai/flows/generate-image-flow.ts';
import '@/ai/flows/create-payment-order-flow.ts';
import '@/ai/flows/chatbot-flow.ts';
import '@/ai/flows/deploy-to-vercel-flow.ts';
import '@/ai/flows/recruitment-matcher-flow.ts';
import '@/ai/flows/score-portfolio-flow.ts';
