import { NextRequest, NextResponse } from 'next/server';
import { mockResumeParseResult } from '@/lib/learning-data';

export async function POST(req: NextRequest) {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production, you would parse the actual FormData file here
    // const formData = await req.formData();
    // const file = formData.get('resume') as File;
    // Then send to an LLM or parser

    return NextResponse.json(mockResumeParseResult);
}
