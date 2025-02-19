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
    const { messages, model, systemPrompt, temperature, maxTokens } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return new Response("Missing OpenAI API Key", { status: 500 });
    }
    if (!messages || !Array.isArray(messages)) {
      return new Response("Missing messages", { status: 400 });
    }
    if (!model) {
      return new Response("Missing model parameter", { status: 400 });
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

    // Create completion options based on model
    const completionOptions: any = {
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((msg: Message) => ({ role: msg.role, content: msg.content })),
      ],
      stream: true,
    };

    // Only add temperature and max_completion_tokens for supported models
    if (!model.includes('o3-mini')) {
      completionOptions.temperature = temperature;
      completionOptions.max_completion_tokens = maxTokens;
    }

    // Create streaming chat
    const completion = await openai.chat.completions.create(completionOptions) as unknown as AsyncIterable<OpenAI.Chat.ChatCompletionChunk>;

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    (async () => {
      try {
        for await (const chunk of completion) {
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
