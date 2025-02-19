// app/api/claude/route.ts
import { NextRequest } from "next/server";
import { getApiKey } from "@/lib/get-api-key"

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();

    const apiKey = getApiKey("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response("Missing Anthropic API Key", { status: 500 });
    }
    if (!messages || !Array.isArray(messages)) {
      return new Response("Messages must be an array", { status: 400 });
    }
    if (!model) {
      return new Response("Missing model parameter", { status: 400 });
    }

    // Format messages
    const formattedMessages = messages.map((msg: Message) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    if (formattedMessages.length === 0) {
      return new Response(JSON.stringify({ error: "At least one message is required" }), {
        status: 400,
      });
    }
    if (formattedMessages[0].role !== "user") {
      console.error("First message must be from user:", formattedMessages);
      return new Response(JSON.stringify({ error: "First message must be from user" }), {
        status: 400,
      });
    }

    const requestBody = {
      model,
      messages: formattedMessages,
      max_tokens: 2048,
      stream: true,
    };

    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      headers: {
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    if (!anthropicResponse.ok) {
      const err = await anthropicResponse.text();
      console.error("Claude API Error:", { status: anthropicResponse.status, error: err });
      return new Response(err, { status: anthropicResponse.status });
    }

    // SSE streaming
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const reader = anthropicResponse.body!.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    (async () => {
      let buffer = "";
      try {
        let isReading = true;
        while (isReading) {
          const { done, value } = await reader.read();
          if (done) {
            isReading = false;
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");

          // Process complete lines
          while (lines.length > 1) {
            const line = lines.shift()!.trim();
            if (!line) continue;

            if (line.startsWith("event: content_block_delta")) {
              // Next line should be `data: ...`
              const dataLine = lines.shift();
              if (!dataLine?.startsWith("data: ")) continue;

              try {
                const data = JSON.parse(dataLine.slice(6));
                if (
                  data.type === "content_block_delta" &&
                  data.delta?.type === "text_delta" &&
                  data.delta?.text
                ) {
                  await writer.write(
                    encoder.encode(
                      `data: ${JSON.stringify({ content: data.delta.text })}\n\n`
                    )
                  );
                }
              } catch (e) {
                console.error("Error parsing JSON from Claude:", e);
              }
            }
          }
          buffer = lines[0] || "";
        }
      } catch (error) {
        console.error("Error processing Claude stream:", error);
      } finally {
        await writer.close();
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
    console.error("Error calling Claude:", error);
    return new Response("Error", { status: 500 });
  }
}