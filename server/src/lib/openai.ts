import "../env.js";
import OpenAI from "openai";
import { ZodError, type ZodType } from "zod";

if (!process.env.OPENAI_API_KEY) {
  console.error("ERROR: OPENAI_API_KEY is not set. Copy .env.example to server/.env and add your key.");
  process.exit(1);
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export function formatAgentError(err: unknown): string {
  if (err instanceof ZodError) {
    const fields = err.errors.map((e) => e.path.join(".")).join(", ");
    return `AI response validation failed (missing/invalid fields: ${fields}). Retrying...`;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "Agent call failed";
}

export async function callAgent<T>(
  systemPrompt: string,
  userPrompt: string,
  schema: ZodType<T>,
  jsonSchema: Record<string, unknown>,
  schemaName: string,
  retries = 2
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: `${systemPrompt}\n\nRespond with JSON matching the provided schema exactly. Use the exact field names specified.`,
          },
          { role: "user", content: userPrompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: schemaName,
            strict: true,
            schema: jsonSchema,
          },
        },
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("Empty response from OpenAI");
      }

      const parsed = JSON.parse(content);
      return schema.parse(parsed);
    } catch (err) {
      lastError = new Error(formatAgentError(err));
      console.error(`[${schemaName}] attempt ${attempt + 1} failed:`, err);
      if (attempt < retries) continue;
    }
  }

  throw lastError ?? new Error("Agent call failed");
}
