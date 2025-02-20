// app/api/grok/route.ts
import { NextRequest } from "next/server";
import OpenAI from "openai";
import { getApiKey } from "@/lib/get-api-key"

export const runtime = "nodejs";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt, temperature, maxTokens } = await req.json();

    const apiKey = getApiKey("XAI_API_KEY", req);
    if (!apiKey) {
      return new Response("Missing xAI API Key", { status: 500 });
    }
    if (!messages || !Array.isArray(messages)) {
      return new Response("Missing messages", { status: 400 });
    }
    if (!systemPrompt) {
      return new Response("Missing systemPrompt parameter", { status: 400 });
    }
    if (temperature < 0 || temperature > 2) {
      return new Response("Invalid temperature", { status: 400 });
    }
    if (maxTokens < 1 || maxTokens > 4000) {
      return new Response("Invalid maxTokens", { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://api.x.ai/v1",
    });

    // Streaming chat
    const stream = await openai.chat.completions.create({
      model: "grok-2-latest",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages.map((msg: Message) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature,
      max_tokens: maxTokens,
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