"use client";

import { useState } from "react";

interface PhaseColor {
  bg: string;
  border: string;
  text: string;
  badge: string;
  dot: string;
  sectionBg: string;
  glow: string;
}

interface Phase {
  id: number;
  name: string;
  emoji: string;
  tagline: string;
  color: PhaseColor;
  what: string;
  risk: string;
  example: string;
  manifestation: string;
  insight: string;
}

const PHASES: Phase[] = [
  {
    id: 1,
    name: "Diagnóstico",
    emoji: "🔍",
    tagline: "Antes de agir, entender",
    color: {
      bg: "bg-violet-950",
      border: "border-violet-500",
      text: "text-violet-400",
      badge: "bg-violet-500",
      dot: "bg-violet-400",
      sectionBg: "bg-violet-900/20",
      glow: "shadow-violet-900/50",
    },
    what: "Mapeamento da situação atual, identificação de todos os stakeholders afetados, análise de impactos por área e perfil, e entrevistas com liderança e times operacionais. É aqui que se entende quem será impactado e como.",
    risk: "A transformação começa sem entender quem será impactado e como — gerando surpresas operacionais, resistências não previstas e retrabalho que poderia ter sido evitado desde o início.",
    example: "Uma empresa implantou um novo ERP sem mapear que o time de faturamento tinha 3 processos manuais críticos fora do sistema. O go-live travou por 2 semanas completas, gerando prejuízo operacional e perda de confiança.",
    manifestation: "Reuniões de levantamento onde ninguém anota nada. Decisões de escopo tomadas sem consultar quem opera no dia a dia. Surpresas constantes durante o projeto. Gestores dizendo 'não sabia que isso existia'.",
    insight: "Sem diagnóstico, você gerencia sintomas. Com diagnóstico, você gerencia causas — e o cliente percebe a diferença no custo do projeto e na qualidade da entrega.",
  },
  {
    id: 2,
    name: "Comunicação",
    emoji: "📣",
    tagline: "O vácuo é sempre preenchido por rumores",
    color: {
      bg: "bg-blue-950",
      border: "border-blue-500",
      text: "text-blue-400",
      badge: "bg-blue-500",
      dot: "bg-blue-400",
      sectionBg: "bg-blue-900/20",
      glow: "shadow-blue-900/50",
    },
    what: "Criação da narrativa da mudança, definição de canais e frequência de comunicação, alinhamento em cascata com liderança, e mensagens segmentadas por público conforme o nível de impacto de cada grupo.",
    risk: "O vácuo de informação é sempre preenchido por rumores. Resistência nasce do que não se sabe — e rumores têm velocidade muito maior do que comunicações oficiais, contaminando até quem estava neutro.",
    example: "A fusão de duas unidades foi anunciada apenas no dia do go-live. Os times descobriram pela intranet, antes de qualquer conversa com seus gestores diretos. O impacto no engajamento durou 6 meses.",
    manifestation: "Perguntas repetidas nas reuniões operacionais. E-mails institucionais sendo ignorados. Lideranças intermediárias contradizendo a mensagem da direção. Corredores cheios de especulação.",
    insight: "Comunicação não é informar. É criar condições para que a mudança faça sentido para quem vai vivê-la. Sem isso, você perde o time antes de começar a operar.",
  },
  {
    id: 3,
    name: "Capacitação",
    emoji: "🎓",
    tagline: "Saber que mudou não é suficiente para operar diferente",
    color: {
      bg: "bg-teal-950",
      border: "border-teal-500",
      text: "text-teal-400",
      badge: "bg-teal-500",
      dot: "bg-teal-400",
      sectionBg: "bg-teal-900/20",
      glow: "shadow-teal-900/50",
    },
    what: "Treinamento técnico e comportamental, criação de ambientes de prática antes do go-live, suporte estruturado no posto de trabalho nos primeiros dias, e materiais de consulta rápida para o cotidiano da operação.",
    risk: "As pessoas sabem que mudou, mas não sabem como operar na nova realidade — gerando erros, retrabalho e retorno silencioso ao método anterior. O sistema foi implantado; a competência, não.",
    example: "Sistema novo implantado com 2 horas de vídeo gravado como único treinamento — para um processo que alterava 70% das atividades diárias de um time de 40 pessoas. O suporte técnico recebeu 300 chamados na primeira semana.",
    manifestation: "'Não fui treinado para isso.' Tickets de suporte explodindo no pós go-live. Supervisores virando suporte informal, perdendo horas de gestão. Times voltando a usar planilhas antigas 'para não errar'.",
    insight: "Treinamento resolve conhecimento. Capacitação resolve comportamento. O cliente normalmente contrata o primeiro — e só percebe que precisava do segundo depois do go-live.",
  },
  {
    id: 4,
    name: "Adoção",
    emoji: "🚀",
    tagline: "Go-live não é o fim. É onde a mudança real começa.",
    color: {
      bg: "bg-orange-950",
      border: "border-orange-500",
      text: "text-orange-400",
      badge: "bg-orange-500",
      dot: "bg-orange-400",
      sectionBg: "bg-orange-900/20",
      glow: "shadow-orange-900/50",
    },
    what: "Monitoramento de uso real nos primeiros 30–90 dias, identificação de bolsões de resistência por área ou perfil, reforço ativo de comportamentos corretos, e suporte estruturado no pós go-live com presença física ou remota.",
    risk: "O projeto é tecnicamente entregue, mas a operação reverte silenciosamente para o método anterior. O ROI desaparece sem que ninguém declare formalmente o fracasso — e o cliente responsabiliza a tecnologia.",
    example: "Nova plataforma de CRM adotada por apenas 20% do time comercial. Os outros 80% continuaram no Excel porque 'funciona melhor e já sabem usar'. O investimento de R$ 400k gerou dados inconsistentes por 8 meses.",
    manifestation: "Métricas de uso sistematicamente baixas. Workarounds e planilhas paralelas surgindo. Liderança começando a questionar o valor do investimento. A solução começa a ter 'mala fama' internamente.",
    insight: "Go-live não é adoção. Adoção é quando o novo vira rotina — não esforço. Essa fase é onde a maioria dos projetos perde silenciosamente o ROI que prometeu ao board.",
  },
  {
    id: 5,
    name: "Sustentação",
    emoji: "🏛️",
    tagline: "Transformação não é evento. É instalação permanente.",
    color: {
      bg: "bg-emerald-950",
      border: "border-emerald-500",
      text: "text-emerald-400",
      badge: "bg-emerald-500",
      dot: "bg-emerald-400",
      sectionBg: "bg-emerald-900/20",
      glow: "shadow-emerald-900/50",
    },
    what: "Institucionalização dos novos comportamentos em políticas e indicadores formais, desenvolvimento de champions internos, ajuste de processos com base no uso real pós go-live, e construção de um plano de continuidade independente de consultores externos.",
    risk: "A mudança acontece, mas não se instala. Em 6 meses, com rotatividade natural ou troca de liderança, a organização retorna ao estado anterior — e o investimento se perde sem que ninguém perceba o momento exato da regressão.",
    example: "Após projeto bem-sucedido, o time não recebeu plano de continuidade. Dois líderes patrocinadores saíram. Em 8 meses, sem referência interna, os ganhos foram completamente revertidos e o projeto foi declarado fracasso.",
    manifestation: "Alta rotatividade desfazendo aprendizados acumulados. Novas lideranças sem contexto da transformação. Processos gradualmente voltando ao estado anterior. Indicadores melhoram e pioram em ciclos sem explicação aparente.",
    insight: "Sustentação é o que separa transformação de projeto. Sem ela, o cliente aluga a mudança — não compra. E você será chamado de volta cobrando menos para refazer o que não se sustentou.",
  },
];

const SECTION_LABELS = [
  { key: "what", icon: "⚙️", label: "O que acontece", style: "default" },
  { key: "risk", icon: "⚠️", label: "Risco de não atuar", style: "risk" },
  { key: "example", icon: "💼", label: "Exemplo real no cliente", style: "default" },
  { key: "manifestation", icon: "👁️", label: "Como se manifesta na prática", style: "default" },
  { key: "insight", icon: "💡", label: "Insight de GMO", style: "insight" },
] as const;

export default function TimelineJourney() {
  const [activePhase, setActivePhase] = useState<number | null>(null);

  const selected = PHASES.find((p) => p.id === activePhase) ?? null;

  return (
    <div>
      {/* Intro */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-2">
          Jornada Visual da Mudança
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
          Clique em cada fase para entender o que acontece, o risco de não atuar,
          e como isso aparece na prática com o cliente.
        </p>
      </div>

      {/* Phase Navigation */}
      <div className="relative mb-8">
        {/* Connector line — desktop only */}
        <div
          className="absolute top-[2.375rem] left-[calc(10%+1.75rem)] right-[calc(10%+1.75rem)] h-px bg-gray-800 hidden md:block"
          aria-hidden
        />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {PHASES.map((phase) => {
            const isActive = activePhase === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => setActivePhase(isActive ? null : phase.id)}
                className={`relative flex flex-col items-center gap-3 px-3 py-5 rounded-2xl border-2 transition-all duration-300 group text-left md:text-center ${
                  isActive
                    ? `${phase.color.bg} ${phase.color.border} shadow-xl ${phase.color.glow}`
                    : "bg-gray-900 border-gray-800 hover:border-gray-600 hover:bg-gray-800/80"
                }`}
              >
                {/* Emoji circle */}
                <div
                  className={`relative z-10 flex items-center justify-center w-14 h-14 rounded-2xl text-2xl transition-all duration-300 flex-shrink-0 ${
                    isActive
                      ? `${phase.color.badge} shadow-lg`
                      : "bg-gray-800 group-hover:bg-gray-700"
                  }`}
                >
                  {phase.emoji}
                </div>

                <div className="flex-1">
                  <div
                    className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 transition-colors ${
                      isActive ? phase.color.text : "text-gray-600"
                    }`}
                  >
                    Fase {phase.id}
                  </div>
                  <div
                    className={`text-sm font-semibold leading-tight transition-colors ${
                      isActive ? "text-white" : "text-gray-400 group-hover:text-gray-200"
                    }`}
                  >
                    {phase.name}
                  </div>
                  {isActive && (
                    <div
                      className={`text-[11px] mt-1.5 leading-tight italic hidden md:block ${phase.color.text} opacity-80`}
                    >
                      {phase.tagline}
                    </div>
                  )}
                </div>

                {/* Active indicator dot */}
                {isActive && (
                  <div
                    className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-gray-950 ${phase.color.badge}`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Phase Detail Panel */}
      {selected ? (
        <div
          className={`rounded-2xl border-2 ${selected.color.border} ${selected.color.bg} p-6 md:p-8 shadow-2xl ${selected.color.glow} animate-fade-in`}
        >
          {/* Panel Header */}
          <div className="flex items-start gap-4 mb-8">
            <div
              className={`flex items-center justify-center w-16 h-16 rounded-2xl text-3xl flex-shrink-0 ${selected.color.badge} shadow-lg`}
            >
              {selected.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={`text-xs font-bold uppercase tracking-widest mb-1 ${selected.color.text}`}
              >
                Fase {selected.id} · Jornada da Mudança
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {selected.name}
              </h3>
              <p className={`text-sm italic ${selected.color.text} opacity-90`}>
                {selected.tagline}
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SECTION_LABELS.map(({ key, icon, label, style }) => {
              const content = selected[key as keyof typeof selected] as string;
              const isInsight = style === "insight";
              const isRisk = style === "risk";

              return (
                <div
                  key={key}
                  className={`rounded-xl p-5 border ${
                    isInsight
                      ? `md:col-span-2 ${selected.color.border} ${selected.color.sectionBg}`
                      : isRisk
                      ? "border-red-500/25 bg-red-950/30"
                      : "border-white/5 bg-black/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base leading-none">{icon}</span>
                    <h4
                      className={`text-[11px] font-bold uppercase tracking-widest ${
                        isInsight
                          ? selected.color.text
                          : isRisk
                          ? "text-red-400"
                          : "text-gray-400"
                      }`}
                    >
                      {label}
                    </h4>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      isInsight
                        ? `font-medium ${selected.color.text}`
                        : "text-gray-200"
                    } ${key === "example" ? "italic" : ""}`}
                  >
                    {content}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Dismiss hint */}
          <div className="mt-5 text-center">
            <button
              onClick={() => setActivePhase(null)}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              ↑ Fechar detalhes
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-14 text-center">
          <div className="text-4xl mb-4 opacity-60">👆</div>
          <p className="text-gray-500 text-sm">
            Selecione uma fase acima para explorar o que acontece nela
          </p>
        </div>
      )}

      {/* Progress indicator */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {PHASES.map((phase) => (
          <button
            key={phase.id}
            onClick={() => setActivePhase(phase.id === activePhase ? null : phase.id)}
            className={`transition-all duration-300 rounded-full ${
              activePhase === phase.id
                ? `w-6 h-2 ${phase.color.badge}`
                : "w-2 h-2 bg-gray-700 hover:bg-gray-500"
            }`}
            aria-label={`Fase ${phase.id}: ${phase.name}`}
          />
        ))}
      </div>
    </div>
  );
}
