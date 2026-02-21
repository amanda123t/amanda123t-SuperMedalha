"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AnalyzeFormProps {
  projectId: string;
}

// Formulário de nova análise dentro de um projeto (Client Component)
export default function AnalyzeForm({ projectId }: AnalyzeFormProps) {
  const [open, setOpen] = useState(false);
  const [processDescription, setProcessDescription] = useState("");
  const [businessRule, setBusinessRule] = useState("");
  const [volumeSla, setVolumeSla] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!processDescription.trim() || !businessRule.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Envia project_id para que a análise seja persistida no banco
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          processDescription,
          businessRule,
          volumeSla,
          project_id: projectId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Análise falhou. Tente novamente.");

      // Redireciona para a página de resultado se o ID foi retornado
      if (data.analysis_id) {
        router.push(`/projects/${projectId}/analyses/${data.analysis_id}`);
      } else {
        // Fallback: recarrega a timeline (análise salva sem ID retornado)
        router.refresh();
        setOpen(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border-2 border-dashed border-gray-300 p-5 text-sm font-medium text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        + Nova Análise
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      {/* Cabeçalho do formulário */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-gray-900">Nova Análise</h3>
        <button
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          aria-label="Fechar formulário"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        {/* Descrição do processo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Descrição do Processo <span className="text-red-500">*</span>
          </label>
          <textarea
            value={processDescription}
            onChange={(e) => setProcessDescription(e.target.value)}
            rows={3}
            placeholder="Descreva o processo de negócio do início ao fim…"
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Regra de negócio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Regra de Negócio <span className="text-red-500">*</span>
          </label>
          <textarea
            value={businessRule}
            onChange={(e) => setBusinessRule(e.target.value)}
            rows={3}
            placeholder="Defina a regra de negócio específica a ser validada…"
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Volume / SLA */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Volume / SLA{" "}
            <span className="text-xs text-gray-400 font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            value={volumeSla}
            onChange={(e) => setVolumeSla(e.target.value)}
            placeholder="Ex: 500 faturas/dia, prazo de 24h"
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Erro */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Indicador de carregamento */}
        {loading && (
          <div className="space-y-2 py-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-2.5 bg-gray-200 rounded-full animate-pulse" />
            ))}
            <p className="text-xs text-center text-gray-400 pt-1">
              Analisando com IA… pode levar até 30 segundos
            </p>
          </div>
        )}

        {/* Botão de ação */}
        <button
          onClick={handleAnalyze}
          disabled={loading || !processDescription.trim() || !businessRule.trim()}
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Analisando…" : "Analisar"}
        </button>
      </div>
    </div>
  );
}
