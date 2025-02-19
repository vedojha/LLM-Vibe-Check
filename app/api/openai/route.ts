// app/api/openai/route.ts
import { NextRequest } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return new Response("Missing OpenAI API Key", { status: 500 });
    }
    if (!messages || !Array.isArray(messages)) {
      return new Response("Missing messages", { status: 400 });
    }
    if (!model) {
      return new Response("Missing model parameter", { status: 400 });
    }

    // Create streaming chat
    const stream = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...messages.map((msg: Message) => ({ role: msg.role, content: msg.content })),
      ],
      stream: true,
    });

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    (async () => {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            await writer.write(
              encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
            );
          }
        }
      } catch (error) {
        console.error("Error processing OpenAI stream:", error);
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
    console.error("Error calling OpenAI:", error);
    return new Response("Error", { status: 500 });
  }
}
