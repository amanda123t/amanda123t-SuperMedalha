import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 60;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// Mantém o seu prompt em PT-BR e exigindo JSON
const SYSTEM_PROMPT = `Você é um especialista em análise de processos de negócio, automação, transformação de BPO, avaliação de riscos e recomendação tecnológica (OCR, IA, RPA, Workflow).

Responda SOMENTE em português do Brasil, com linguagem executiva, clara e objetiva.

Responda APENAS com um JSON válido — sem markdown e sem texto fora do JSON — usando exatamente a estrutura combinada no meu produto.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { processDescription, businessRule, volumeSla } = body;

    if (!processDescription?.trim() || !businessRule?.trim()) {
      return NextResponse.json(
        { error: "Descrição do processo e regra de negócio são obrigatórias." },
        { status: 400 }
      );
    }

    const userContent = [
      `Descrição do processo:\n${processDescription.trim()}`,
      `Regra de negócio:\n${businessRule.trim()}`,
      volumeSla?.trim() ? `Volume / SLA:\n${volumeSla.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    // ⚠️ Modelo: comece com Flash (bem mais barato).
    // Se der “model not found”, troque pelo modelo disponível na sua conta/região.
    const model = "gemini-2.0-flash";

    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [{ text: `${SYSTEM_PROMPT}\n\n${userContent}` }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 4096,
        // Ajuda muito a forçar JSON “limpo”
        responseMimeType: "application/json",
      },
    });

    const raw = (response.text ?? "").trim();

    if (!raw) {
      throw new Error("Nenhuma resposta textual recebida do modelo.");
    }

    // Segurança extra: remove fences se vierem
    const cleaned = raw
      .replace(/^```(?:json)?\s*/m, "")
      .replace(/\s*```\s*$/m, "");

    const analysis = JSON.parse(cleaned);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Falha ao interpretar a resposta do modelo. Tente novamente." },
        { status: 500 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Falha na análise. Tente novamente.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
