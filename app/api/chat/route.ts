import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from 'next/server';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('Missing Gemini API key');
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();
    
    if (!context) {
      return new Response(
        JSON.stringify({ message: "I need the document content to answer your question." }),
        { headers: { 'Content-Type': 'application/json' } }
      );
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

    // Create encoder for converting chunks to text
    const encoder = new TextEncoder();

    // Create a new ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await model.generateContentStream(prompt);
          
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(`${text}`));
            }
          }
          
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An unknown error occurred' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}