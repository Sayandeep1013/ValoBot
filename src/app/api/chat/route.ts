import { NextRequest, NextResponse } from "next/server";
import { streamChatResponse, ChatMessage } from "@/lib/gemini";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, userMessage } = body as {
      messages: ChatMessage[];
      userMessage: string;
    };

    if (!userMessage?.trim()) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    const stream = await streamChatResponse(messages ?? [], userMessage.trim());

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: unknown) {
    const errObj = err as { status?: number; message?: string };
    console.error("[/api/chat]", err);
    if (errObj?.status === 429) {
      return NextResponse.json(
        { error: "AI provider quota exceeded. Check your Groq API key quota." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
