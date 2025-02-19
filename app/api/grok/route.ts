// app/api/grok/route.ts
/* eslint-disable no-console */
import { NextRequest } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.XAI_API_KEY) {
      return new Response("Missing xAI API Key", { status: 500 });
    }
    if (!messages || !Array.isArray(messages)) {
      return new Response("Missing messages", { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.XAI_API_KEY!,
      baseURL: "https://api.x.ai/v1",
    });

    // Streaming chat
    const stream = await openai.chat.completions.create({
      model: "grok-2-latest",
      messages: [
        {
          role: "system",
          content: "You are Grok, a chatbot inspired by The Hitchhiker's Guide to the Galaxy.",
        },
        ...messages.map((msg: Message) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      stream: true,
    });

    // SSE
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    (async () => {
      try {
        for await (const chunk of stream) {
          if (chunk.choices[0]?.delta?.content) {
            const content = chunk.choices[0].delta.content;
            await writer.write(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
          }
        }
      } catch (error) {
        console.error("Error processing Grok stream:", error);
      } finally {
        writer.close();
      }
    })();

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error calling Grok:", error);
    return new Response("Error", { status: 500 });
  }
}