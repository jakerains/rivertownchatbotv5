import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Message } from '@/lib/llm/types';

const openai = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_BASE_URL,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: process.env.LLM_MODEL || 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      stream: false,
    });

    return NextResponse.json({
      role: 'assistant',
      content: response.choices[0].message.content
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Chat API is running' });
} 