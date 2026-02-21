import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Extend the Vercel serverless function timeout (requires Pro plan for full 60s)
export const maxDuration = 60;

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Você é um especialista em análise de processos de negócio, automação, transformação de BPO, avaliação de riscos e recomendação tecnológica (OCR, IA, RPA, Workflow).

Responda SOMENTE em português do Brasil, com linguagem executiva, clara e objetiva.

Analise o processo e a regra fornecidos e responda APENAS com um JSON válido — sem markdown e sem texto fora do JSON — usando exatamente esta estrutura (respeite os nomes dos campos):

{
  "qualidade_input": {
    "score_0a100": 0,
    "resumo": "Texto curto explicando se as informações são suficientes ou não.",
    "lacunas": ["Lista do que falta (ex: SLA, volume, regras)"],
    "perguntas_essenciais": ["No máximo 5 perguntas objetivas para destravar a análise"],
    "assuncoes": ["Se precisar assumir algo, declare aqui (no máximo 5)"]
  },
  "clareza_regra": {
    "score": "Clara | Parcialmente clara | Não clara",
    "analise": "Explicação detalhada sobre a clareza da regra, ambiguidades ou lacunas."
  },
  "riscos_operacionais": {
    "resumo": "Visão geral do cenário de riscos do processo.",
    "itens": ["Risco específico 1", "Risco específico 2", "Risco específico 3"]
  },
  "oportunidades_automacao": {
    "resumo": "Visão geral do potencial de automação.",
    "itens": ["Oportunidade 1", "Oportunidade 2", "Oportunidade 3"]
  },
  "tecnologia_recomendada": {
    "tecnologias": ["Uma ou mais entre: RPA, IA, Workflow, OCR"],
    "justificativa": "Explicação de por que cada tecnologia é adequada."
  },
  "nivel_complexidade": {
    "nivel": "Baixa | Média | Alta",
    "explicacao": "Explicação do que direciona a avaliação de complexidade."
  },
  "dimensionamento_entrega": {
    "prazo_semanas": {
      "min": 0,
      "max": 0,
      "observacao": "Explique o que está dentro/fora do escopo e por que o prazo varia."
    },
    "squad_recomendado": {
      "tamanho": 0,
      "papeis": ["Tech Lead/Arquiteto", "Dev IA/IDP", "Dev RPA", "Analista de Negócio", "QA"],
      "observacao": "Racional do sizing e principal gargalo."
    },
    "dependencias": ["Sistemas, acessos, ambientes, amostras de documentos, etc"],
    "riscos_de_entrega": ["Risco 1", "Risco 2", "Risco 3"]
  },
  "estimativa_roi": {
    "confianca": "Baixa | Média | Alta",
    "assuncoes_calculo": [
      "Declare as assunções usadas para calcular ROI (ex: volume/mês, TMA, custo FTE)."
    ],
    "baseline": {
      "volume_mes": 0,
      "tma_minutos": 0,
      "custo_fte_mensal_brl": 0
    },
    "automacao": {
      "percentual_automacao_0a100": 0,
      "reducao_tma_percentual_0a100": 0
    },
    "resultado": {
      "horas_economizadas_mes": 0,
      "economia_mensal_brl": 0,
      "payback_meses": 0
    }
  },
  "prioridade": {
    "categoria": "Quick win | Médio prazo | Estratégico | Discovery necessário",
    "racional": "Por que esta prioridade faz sentido.",
    "proximos_passos": ["Passo 1", "Passo 2", "Passo 3"]
  }
}

Regras importantes:
- Se o input estiver fraco, ainda assim preencha o JSON completo, mas reduza a confiança e deixe claras as lacunas.
- Não invente números: se não houver valores, use 0 e descreva as assunções.
- Mantenha as listas com 3 itens quando possível (exceto perguntas essenciais: no máximo 5).
`;

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

    const stream = client.messages.stream({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    const response = await stream.finalMessage();

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Nenhuma resposta textual recebida do modelo.");
    }

    const raw = textBlock.text
      .trim()
      // Caso o modelo ignore e devolva em fence, limpamos:
      .replace(/^```(?:json)?\s*/m, "")
      .replace(/\s*```\s*$/m, "");

    const analysis = JSON.parse(raw);

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
