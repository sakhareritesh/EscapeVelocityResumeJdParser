'use server';
/**
 * @fileOverview Creates a Razorpay payment order.
 * 
 * - createPaymentOrder - A function that creates a payment order.
 * - CreatePaymentOrderInput - The input type for the createPaymentOrder function.
 * - CreatePaymentOrderOutput - The return type for the createPaymentOrder function.
 */
import { config } from 'dotenv';
config();

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import Razorpay from 'razorpay';
import shortid from 'shortid';

const CreatePaymentOrderInputSchema = z.object({
  amount: z.number().describe('The amount for the order in the smallest currency unit (e.g., paise for INR).'),
});
export type CreatePaymentOrderInput = z.infer<typeof CreatePaymentOrderInputSchema>;

const CreatePaymentOrderOutputSchema = z.object({
  id: z.string(),
  currency: z.string(),
  amount: z.number(),
});
export type CreatePaymentOrderOutput = z.infer<typeof CreatePaymentOrderOutputSchema>;

export async function createPaymentOrder(input: CreatePaymentOrderInput): Promise<CreatePaymentOrderOutput> {
  return createPaymentOrderFlow(input);
}

const createPaymentOrderFlow = ai.defineFlow(
  {
    name: 'createPaymentOrderFlow',
    inputSchema: CreatePaymentOrderInputSchema,
    outputSchema: CreatePaymentOrderOutputSchema,
  },
  async ({ amount }) => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials are not configured in environment variables.');
    }
    
    const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });

    const payment_capture = 1;
    const currency = 'INR';
    const options = {
        amount: amount,
        currency,
        receipt: shortid.generate(),
        payment_capture,
    };

    try {
        const response = await razorpay.orders.create(options);
        return {
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        };
    } catch (error) {
        console.error('Razorpay order creation failed:', error);
        throw new Error('Failed to create payment order with Razorpay.');
    }
  }
);
