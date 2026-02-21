"use client";

import { useState } from "react";

interface SignalColor {
  badge: string;
  text: string;
  bg: string;
  border: string;
  cardBorder: string;
  sectionBg: string;
}

interface Signal {
  id: string;
  phrase: string;
  phaseName: string;
  phaseNumber: number;
  color: SignalColor;
  interpretation: string;
  hiddenRisk: string;
  insight: string;
  question: string;
}

const COLORS: Record<number, SignalColor> = {
  1: {
    badge: "bg-violet-500",
    text: "text-violet-400",
    bg: "bg-violet-950",
    border: "border-violet-500",
    cardBorder: "border-violet-500/40",
    sectionBg: "bg-violet-900/20",
  },
  2: {
    badge: "bg-blue-500",
    text: "text-blue-400",
    bg: "bg-blue-950",
    border: "border-blue-500",
    cardBorder: "border-blue-500/40",
    sectionBg: "bg-blue-900/20",
  },
  3: {
    badge: "bg-teal-500",
    text: "text-teal-400",
    bg: "bg-teal-950",
    border: "border-teal-500",
    cardBorder: "border-teal-500/40",
    sectionBg: "bg-teal-900/20",
  },
  4: {
    badge: "bg-orange-500",
    text: "text-orange-400",
    bg: "bg-orange-950",
    border: "border-orange-500",
    cardBorder: "border-orange-500/40",
    sectionBg: "bg-orange-900/20",
  },
  5: {
    badge: "bg-emerald-500",
    text: "text-emerald-400",
    bg: "bg-emerald-950",
    border: "border-emerald-500",
    cardBorder: "border-emerald-500/40",
    sectionBg: "bg-emerald-900/20",
  },
};

const PHASE_NAMES: Record<number, string> = {
  1: "Diagnóstico",
  2: "Comunicação",
  3: "Capacitação",
  4: "Adoção",
  5: "Sustentação",
};

const SIGNALS: Signal[] = [
  {
    id: "not-using",
    phrase: "O time não está usando",
    phaseName: "Adoção",
    phaseNumber: 4,
    color: COLORS[4],
    interpretation:
      "Adoção não aconteceu. O sistema chegou, mas a mudança de comportamento — não. Existe uma lacuna entre o go-live técnico e a transformação real da operação. As pessoas encontraram formas de contornar o novo sem declará-lo abertamente.",
    hiddenRisk:
      "O cliente vai atribuir o problema à tecnologia, não à ausência de gestão de mudança. A próxima solução técnica terá o mesmo destino — e o relacionamento começa a ser questionado internamente.",
    insight:
      "Baixa adoção é sintoma de GMO ausente. A pergunta certa não é 'por que o time não usa?' — é 'o que foi feito para garantir a adoção antes e depois do go-live?'",
    question:
      "Como vocês mediram se o time está usando da forma esperada? Existia algum benchmark de adoção definido antes do go-live?",
  },
  {
    id: "resistance",
    phrase: "As pessoas resistem",
    phaseName: "Comunicação",
    phaseNumber: 2,
    color: COLORS[2],
    interpretation:
      "Resistência é uma resposta racional à mudança mal comunicada ou mal gerenciada. As pessoas não resistem à mudança em si — resistem à incerteza, ao que não foi explicado e ao que ameaça seu senso de competência.",
    hiddenRisk:
      "A resistência vai se organizar e criar narrativas paralelas que contaminam quem ainda estava neutro. Em semanas, o projeto inteiro pode estar na defensiva — e o patrocinador começa a questionar o investimento.",
    insight:
      "Resistência não é o problema — é o sinal de que algo na jornada de mudança não foi endereçado. Atacar a resistência sem entender a causa é como tratar febre sem diagnóstico.",
    question:
      "Quando a resistência começou a aparecer — foi antes ou depois do go-live? Houve algum evento específico que gerou o tensionamento?",
  },
  {
    id: "good-but",
    phrase: "O sistema é bom, mas...",
    phaseName: "Capacitação",
    phaseNumber: 3,
    color: COLORS[3],
    interpretation:
      "O 'mas' é onde mora o GMO. O problema não é a solução técnica — é o contexto humano ao redor dela. A tecnologia funciona; a organização ao redor dela, não foi preparada para absorver a mudança.",
    hiddenRisk:
      "O cliente está prestes a investir em uma segunda solução técnica para resolver um problema que não é técnico. Sem GMO, o ciclo se repete com mais custo, menos confiança — e um fornecedor sendo responsabilizado.",
    insight:
      "Quando ouvir 'o sistema é bom, mas...' — acenda o alerta. O próximo orçamento está em risco. E existe espaço claro para posicionar GMO como a solução que faltou.",
    question:
      "O que vem depois do 'mas'? Já mapearam o que especificamente impede o uso pleno — é processo, é falta de treinamento, ou é comportamento de liderança?",
  },
  {
    id: "leadership",
    phrase: "A liderança não comprou",
    phaseName: "Diagnóstico",
    phaseNumber: 1,
    color: COLORS[1],
    interpretation:
      "Sem patrocínio ativo da liderança, qualquer transformação perde legitimidade operacional. O time olha para cima antes de decidir se adere ou resiste. Liderança ausente é um sinal verde para resistência organizada.",
    hiddenRisk:
      "O projeto avança tecnicamente enquanto a organização cria anticorpos. No go-live, a liderança vai culpar a solução — não o próprio desengajamento. O fornecedor paga a conta e perde o relacionamento.",
    insight:
      "Liderança que não comprou não vende para o time. E time sem liderança comprometida não muda. O patrocínio ativo não é detalhe — é pré-requisito estrutural do GMO.",
    question:
      "Como a liderança sênior está sendo envolvida nas decisões do projeto? Eles participaram das definições de escopo ou apenas da aprovação do orçamento?",
  },
  {
    id: "rework",
    phrase: "Estamos com retrabalho",
    phaseName: "Capacitação",
    phaseNumber: 3,
    color: COLORS[3],
    interpretation:
      "O processo novo não foi internalizado. As pessoas operam com um pé no velho e outro no novo, gerando duplicidade — e um custo operacional invisível que ninguém contabilizou no projeto.",
    hiddenRisk:
      "O retrabalho cria um argumento poderoso contra a mudança: 'antes era mais simples.' Esse argumento cresce e justifica o retrocesso para o estado anterior — lento, silencioso e difícil de reverter.",
    insight:
      "Retrabalho é o preço do treinamento que não aconteceu a tempo e da adoção que não foi monitorada. É um custo direto e mensurável de GMO ausente — e isso pode ser apresentado ao cliente.",
    question:
      "Onde exatamente está o retrabalho — é na transição entre sistemas, na validação manual, ou na falta de clareza sobre quem decide o quê no novo processo?",
  },
  {
    id: "no-change",
    phrase: "O projeto foi entregue, mas não mudou nada",
    phaseName: "Sustentação",
    phaseNumber: 5,
    color: COLORS[5],
    interpretation:
      "Entrega técnica sem mudança comportamental. O projeto existiu no cronograma — mas não na operação. A organização absorveu o investimento sem alterar sua forma real de funcionar.",
    hiddenRisk:
      "A percepção de fracasso vai contaminar os próximos projetos de transformação. O cliente vai resistir mais na próxima vez, exigir mais garantias, investir menos — e o fornecedor entra numa posição defensiva difícil de sair.",
    insight:
      "'Entregamos' e 'mudamos' são verbos diferentes. GMO é o que transforma entrega técnica em mudança real. Sem isso, você vende implementação — não transformação. E o cliente sente a diferença.",
    question:
      "O que vocês esperavam que fosse diferente hoje em relação ao início do projeto? Quem definiu o critério de sucesso — e esse critério incluía comportamento ou só tecnologia entregue?",
  },
];

const PHASE_EMOJIS: Record<number, string> = {
  1: "🔍",
  2: "📣",
  3: "🎓",
  4: "🚀",
  5: "🏛️",
};

interface DetailRowProps {
  icon: string;
  label: string;
  content: string;
  variant?: "default" | "risk" | "insight" | "question";
  color?: SignalColor;
}

function DetailRow({ icon, label, content, variant = "default", color }: DetailRowProps) {
  const containerClass =
    variant === "risk"
      ? "border-red-500/20 bg-red-950/25"
      : variant === "insight"
      ? `${color?.sectionBg ?? ""} ${color?.cardBorder ?? "border-white/10"}`
      : variant === "question"
      ? "border-amber-500/20 bg-amber-950/20"
      : "border-white/5 bg-black/20";

  const labelClass =
    variant === "risk"
      ? "text-red-400"
      : variant === "insight"
      ? color?.text ?? "text-gray-300"
      : variant === "question"
      ? "text-amber-400"
      : "text-gray-400";

  const textClass =
    variant === "insight"
      ? `font-medium ${color?.text ?? "text-gray-200"}`
      : variant === "question"
      ? "text-amber-100 font-medium italic"
      : "text-gray-200";

  return (
    <div className={`rounded-xl p-4 border ${containerClass}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base leading-none">{icon}</span>
        <span className={`text-[11px] font-bold uppercase tracking-widest ${labelClass}`}>
          {label}
        </span>
      </div>
      <p className={`text-sm leading-relaxed ${textClass}`}>{content}</p>
    </div>
  );
}

export default function SignalLibrary() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterPhase, setFilterPhase] = useState<number | null>(null);

  const selected = SIGNALS.find((s) => s.id === selectedId) ?? null;

  const filteredSignals = filterPhase
    ? SIGNALS.filter((s) => s.phaseNumber === filterPhase)
    : SIGNALS;

  // Phases that have signals
  const availablePhases = [...new Set(SIGNALS.map((s) => s.phaseNumber))].sort();

  return (
    <div>
      {/* Intro */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Biblioteca de Sinais do Cliente
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
          Frases reais que você ouve do cliente — e o que elas revelam sobre a
          necessidade de GMO. Clique em cada card para interpretar o sinal.
        </p>
      </div>

      {/* Phase filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => { setFilterPhase(null); setSelectedId(null); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            filterPhase === null
              ? "bg-white text-gray-900 border-white"
              : "bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-500"
          }`}
        >
          Todos os sinais
        </button>
        {availablePhases.map((phase) => {
          const color = COLORS[phase];
          const isActive = filterPhase === phase;
          return (
            <button
              key={phase}
              onClick={() => { setFilterPhase(isActive ? null : phase); setSelectedId(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isActive
                  ? `${color.badge} text-white border-transparent`
                  : "bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-500"
              }`}
            >
              <span>{PHASE_EMOJIS[phase]}</span>
              <span>{PHASE_NAMES[phase]}</span>
            </button>
          );
        })}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredSignals.map((signal) => {
          const isSelected = selectedId === signal.id;
          return (
            <button
              key={signal.id}
              onClick={() => setSelectedId(isSelected ? null : signal.id)}
              className={`text-left rounded-2xl border-2 p-5 transition-all duration-300 group relative ${
                isSelected
                  ? `${signal.color.bg} ${signal.color.border} shadow-xl`
                  : "bg-gray-900 border-gray-800 hover:border-gray-600 hover:bg-gray-800/80"
              }`}
            >
              {/* Phase badge */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isSelected
                      ? `${signal.color.badge} text-white`
                      : "bg-gray-800 text-gray-500"
                  }`}
                >
                  <span>{PHASE_EMOJIS[signal.phaseNumber]}</span>
                  <span>{signal.phaseName}</span>
                </div>
                <span
                  className={`text-xs transition-all ${
                    isSelected ? signal.color.text : "text-gray-700"
                  }`}
                >
                  {isSelected ? "↑ fechar" : "↓ explorar"}
                </span>
              </div>

              {/* Quote */}
              <div className="relative">
                <span
                  className={`absolute -top-1 -left-0.5 text-3xl leading-none font-serif ${
                    isSelected ? signal.color.text : "text-gray-700"
                  } opacity-60`}
                >
                  "
                </span>
                <p
                  className={`text-base font-semibold pl-4 leading-snug transition-colors ${
                    isSelected ? "text-white" : "text-gray-300 group-hover:text-white"
                  }`}
                >
                  {signal.phrase}
                </p>
              </div>

              {/* Hover hint */}
              {!isSelected && (
                <p className="text-xs text-gray-600 mt-3 group-hover:text-gray-500 transition-colors">
                  Clique para interpretar este sinal →
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Detail Panel */}
      {selected && (
        <div
          className={`rounded-2xl border-2 ${selected.color.border} ${selected.color.bg} p-6 md:p-8 shadow-2xl animate-fade-in`}
        >
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-xl text-2xl flex-shrink-0 ${selected.color.badge}`}
            >
              {PHASE_EMOJIS[selected.phaseNumber]}
            </div>
            <div>
              <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${selected.color.text}`}>
                Sinal do cliente · Fase {selected.phaseNumber} — {selected.phaseName}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                &ldquo;{selected.phrase}&rdquo;
              </h3>
            </div>
          </div>

          {/* Detail Sections — 2-col grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow
              icon="🔎"
              label="O que isso significa"
              content={selected.interpretation}
            />
            <DetailRow
              icon="⚠️"
              label="Risco oculto"
              content={selected.hiddenRisk}
              variant="risk"
            />
            <DetailRow
              icon="💡"
              label="Insight de GMO"
              content={selected.insight}
              variant="insight"
              color={selected.color}
            />
            <DetailRow
              icon="💬"
              label="Pergunta que o comercial pode fazer"
              content={selected.question}
              variant="question"
            />
          </div>

          {/* Phase link hint */}
          <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Este sinal aparece principalmente na fase{" "}
              <span className={`font-semibold ${selected.color.text}`}>
                {selected.phaseNumber} — {selected.phaseName}
              </span>{" "}
              da jornada.
            </p>
            <button
              onClick={() => setSelectedId(null)}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              ↑ Fechar
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredSignals.length === 0 && (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-14 text-center">
          <div className="text-4xl mb-4 opacity-60">📭</div>
          <p className="text-gray-500 text-sm">Nenhum sinal encontrado para esta fase</p>
        </div>
      )}
    </div>
  );
}
