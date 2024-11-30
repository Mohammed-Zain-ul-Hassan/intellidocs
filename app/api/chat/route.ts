import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('Missing Gemini API key');
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();
    
    if (!context) {
      return NextResponse.json({ 
        message: "I need the document content to answer your question." 
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      You are an AI assistant helping with document analysis.
      
      Document content:
      ${context}

      User question: ${message}

      Please provide a detailed answer based on the document content above.
      If the answer cannot be found in the document, please say so clearly.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
