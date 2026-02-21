import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import AnalyzeForm from "./_components/AnalyzeForm";

// Mapeamento de complexidade para PT-BR e estilos visuais
const COMPLEXITY_MAP: Record<string, { label: string; style: string }> = {
  Low: { label: "Baixa", style: "bg-green-100 text-green-800" },
  Medium: { label: "Média", style: "bg-amber-100 text-amber-800" },
  High: { label: "Alta", style: "bg-red-100 text-red-800" },
};

type AnalysisRow = {
  id: string;
  process_description: string;
  business_rule: string;
  result: Record<string, unknown>;
  created_at: string;
};

// Página de detalhes do projeto com timeline de análises — Server Component
export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const sql = getDb();

  // Busca projeto e análises em paralelo
  const [[project], analyses] = await Promise.all([
    sql`SELECT id, name, description FROM projects WHERE id = ${params.id}`,
    sql`
      SELECT id, process_description, business_rule, result, created_at
      FROM analyses
      WHERE project_id = ${params.id}
      ORDER BY created_at DESC
    `,
  ]);

  if (!project) notFound();

  const typedAnalyses = analyses as unknown as AnalysisRow[];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4">
        {/* Navegação em breadcrumb */}
        <div className="mb-6">
          <Link href="/projects" className="text-sm text-blue-600 hover:underline">
            ← Projetos
          </Link>
        </div>

        {/* Cabeçalho do projeto */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {project.name as string}
          </h1>
          {project.description && (
            <p className="text-sm text-gray-500 mt-1">
              {project.description as string}
            </p>
          )}
        </div>

        {/* Formulário de nova análise */}
        <AnalyzeForm projectId={params.id} />

        {/* Timeline de análises */}
        <div className="mt-10">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
            Histórico de Análises
          </h2>

          {/* Estado vazio */}
          {typedAnalyses.length === 0 && (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center">
              <p className="text-gray-400 text-sm font-medium">
                Nenhuma análise realizada ainda.
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Preencha o formulário acima para iniciar a primeira análise.
              </p>
            </div>
          )}

          {/* Lista em formato timeline */}
          {typedAnalyses.length > 0 && (
            <div className="relative">
              {/* Linha vertical da timeline */}
              <div className="absolute left-[13px] top-2 bottom-2 w-px bg-gray-200" />

              <ol className="space-y-4">
                {typedAnalyses.map((analysis) => {
                  const complexity = (
                    analysis.result as { complexity_level?: { level?: string } }
                  )?.complexity_level?.level;
                  const complexityInfo = complexity
                    ? COMPLEXITY_MAP[complexity]
                    : undefined;

                  const date = new Date(analysis.created_at);
                  const dateLabel = date.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  const timeLabel = date.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <li key={analysis.id} className="relative flex gap-5 pl-8">
                      {/* Marcador da timeline */}
                      <div className="absolute left-2 top-4 h-3 w-3 rounded-full border-2 border-blue-500 bg-white" />

                      <Link
                        href={`/projects/${params.id}/analyses/${analysis.id}`}
                        className="flex-1 bg-white rounded-xl border border-gray-200 px-5 py-4 shadow-sm hover:border-blue-300 hover:shadow transition-all group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            {/* Descrição resumida do processo */}
                            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                              {analysis.process_description}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {dateLabel} às {timeLabel}
                            </p>
                          </div>

                          {/* Badge de complexidade */}
                          {complexityInfo && (
                            <span
                              className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${complexityInfo.style}`}
                            >
                              {complexityInfo.label}
                            </span>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
