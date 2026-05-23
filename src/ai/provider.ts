import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { z, type ZodType } from "zod";
import { PROMPTS } from "./prompts";
import { SCHEMAS, type SchemaName } from "./schemas";

/**
 * Stage 6 — provider-agnostic LLM interface.
 *
 * `runStructured()` is the single entry point every Inngest worker uses. It:
 *   1. Pulls the prompt + Zod schema from the registry.
 *   2. Calls the chosen provider via Vercel AI SDK `generateObject`.
 *   3. Returns the parsed object — Zod errors propagate so the worker can
 *      record `safety_flags: ['schema_violation']`.
 *
 * Without `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` the function throws a
 * `LLMUnconfiguredError` that workers translate into a row with
 * `requires_human_review: true` so the patient never sees an unreviewed
 * draft and the dietitian queue gets the meal anyway.
 */
export class LLMUnconfiguredError extends Error {
  constructor() {
    super(
      "No LLM provider configured (set OPENAI_API_KEY or ANTHROPIC_API_KEY).",
    );
    this.name = "LLMUnconfiguredError";
  }
}

export type ProviderId = "openai" | "anthropic";

export interface RunStructuredArgs<TName extends SchemaName> {
  schemaName: TName;
  variables: Record<string, string>;
  preferred?: ProviderId;
}

function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(
    /\{\{(\w+)\}\}/g,
    (_, k) => vars[k] ?? `[missing:${k}]`,
  );
}

function pickProvider(preferred?: ProviderId): ProviderId {
  if (preferred === "openai" && process.env.OPENAI_API_KEY) return "openai";
  if (preferred === "anthropic" && process.env.ANTHROPIC_API_KEY)
    return "anthropic";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  throw new LLMUnconfiguredError();
}

export async function runStructured<TName extends SchemaName>(
  args: RunStructuredArgs<TName>,
): Promise<z.infer<(typeof SCHEMAS)[TName]>> {
  const promptDef = PROMPTS[args.schemaName];
  if (!promptDef) throw new Error(`Unknown prompt ${args.schemaName}`);
  const schema = SCHEMAS[args.schemaName] as ZodType;
  const provider = pickProvider(args.preferred);
  const model =
    provider === "openai"
      ? openai("gpt-4o-mini")
      : anthropic("claude-3-5-sonnet-latest");

  const result = await generateObject({
    model,
    schema,
    system: promptDef.systemPrompt,
    prompt: fillTemplate(promptDef.userTemplate, args.variables),
  });
  return result.object as z.infer<(typeof SCHEMAS)[TName]>;
}
