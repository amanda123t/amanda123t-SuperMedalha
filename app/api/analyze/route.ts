import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Extend the Vercel serverless function timeout (requires Pro plan for full 60s)
export const maxDuration = 60;

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert business process analyst specializing in process automation, risk assessment, and technology selection.

Analyze the provided business process and rule, then respond with ONLY a valid JSON object — no markdown fences, no text outside the JSON. Use this exact structure:

{
  "rule_clarity": {
    "score": "Clear | Partially Clear | Unclear",
    "analysis": "Detailed explanation of the rule's clarity, ambiguities, or gaps."
  },
  "operational_risks": {
    "summary": "High-level overview of the risk landscape for this process.",
    "items": ["Specific risk 1", "Specific risk 2", "Specific risk 3"]
  },
  "automation_opportunities": {
    "summary": "High-level overview of automation potential.",
    "items": ["Specific opportunity 1", "Specific opportunity 2", "Specific opportunity 3"]
  },
  "recommended_technology": {
    "technologies": ["One or more of: RPA, AI, Workflow, OCR"],
    "rationale": "Explanation of why each recommended technology fits this process."
  },
  "complexity_level": {
    "level": "Low | Medium | High",
    "explanation": "Explanation of what drives the complexity assessment."
  }
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { processDescription, businessRule, volumeSla } = body;

    if (!processDescription?.trim() || !businessRule?.trim()) {
      return NextResponse.json(
        { error: "Process description and business rule are required." },
        { status: 400 }
      );
    }

    const userContent = [
      `Process Description:\n${processDescription.trim()}`,
      `Business Rule:\n${businessRule.trim()}`,
      volumeSla?.trim() ? `Volume / SLA:\n${volumeSla.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    const stream = client.messages.stream({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    const response = await stream.finalMessage();

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response received from model.");
    }

    const raw = textBlock.text
      .trim()
      .replace(/^```(?:json)?\s*/m, "")
      .replace(/\s*```\s*$/m, "");

    const analysis = JSON.parse(raw);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse model response. Please try again." },
        { status: 500 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Analysis failed. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
