import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";

// Estilos de complexidade reutilizados do layout principal
const COMPLEXITY_STYLES: Record<string, string> = {
  Low: "bg-green-100 text-green-800 border-green-200",
  Medium: "bg-amber-100 text-amber-800 border-amber-200",
  High: "bg-red-100 text-red-800 border-red-200",
};

const COMPLEXITY_LABEL: Record<string, string> = {
  Low: "Baixa",
  Medium: "Média",
  High: "Alta",
};

const TECH_STYLES: Record<string, string> = {
  RPA: "bg-purple-100 text-purple-800",
  AI: "bg-blue-100 text-blue-800",
  Workflow: "bg-teal-100 text-teal-800",
  OCR: "bg-orange-100 text-orange-800",
};

// Card de seção reutilizável
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

// Tipo para o resultado da análise do Claude
type AnalysisResult = {
  rule_clarity?: { score?: string; analysis?: string };
  operational_risks?: { summary?: string; items?: string[] };
  automation_opportunities?: { summary?: string; items?: string[] };
  recommended_technology?: { technologies?: string[]; rationale?: string };
  complexity_level?: { level?: string; explanation?: string };
};

// Página de resultado de uma análise específica — Server Component
export default async function AnalysisPage({
  params,
}: {
  params: { id: string; analysisId: string };
}) {
  const sql = getDb();

  // Garante que a análise pertence ao projeto informado na URL
  const [row] = await sql`
    SELECT
      a.id,
      a.process_description,
      a.business_rule,
      a.volume_sla,
      a.result,
      a.created_at,
      p.name AS project_name
    FROM analyses a
    JOIN projects p ON p.id = a.project_id
    WHERE a.id = ${params.analysisId}
      AND a.project_id = ${params.id}
  `;

  if (!row) notFound();

  const result = row.result as AnalysisResult;
  const complexityLevel = result?.complexity_level?.level ?? "";

  const createdAt = new Date(row.created_at as string).toLocaleDateString(
    "pt-BR",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-7">
          <Link href="/projects" className="hover:text-blue-600 transition-colors">
            Projetos
          </Link>
          <span>/</span>
          <Link
            href={`/projects/${params.id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {row.project_name as string}
          </Link>
          <span>/</span>
          <span className="text-gray-700">Análise</span>
        </nav>

        {/* Cabeçalho */}
        <div className="mb-7">
          <h1 className="text-xl font-bold text-gray-900">Resultado da Análise</h1>
          <p className="text-sm text-gray-500 mt-1 capitalize">{createdAt}</p>
        </div>

        {/* Painel de entradas da análise */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            Dados de Entrada
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs font-medium text-gray-500">Processo</dt>
              <dd className="text-sm text-gray-800 mt-0.5">
                {row.process_description as string}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Regra de Negócio</dt>
              <dd className="text-sm text-gray-800 mt-0.5">
                {row.business_rule as string}
              </dd>
            </div>
            {row.volume_sla && (
              <div>
                <dt className="text-xs font-medium text-gray-500">Volume / SLA</dt>
                <dd className="text-sm text-gray-800 mt-0.5">
                  {row.volume_sla as string}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Cards de resultado */}
        <div className="space-y-4">
          {/* Clareza da Regra */}
          <Card title="Clareza da Regra">
            <p className="text-base font-semibold text-gray-900 mb-2">
              {result.rule_clarity?.score}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {result.rule_clarity?.analysis}
            </p>
          </Card>

          {/* Riscos Operacionais */}
          <Card title="Riscos Operacionais">
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              {result.operational_risks?.summary}
            </p>
            {(result.operational_risks?.items ?? []).length > 0 && (
              <ul className="space-y-2">
                {result.operational_risks!.items!.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Oportunidades de Automação */}
          <Card title="Oportunidades de Automação">
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              {result.automation_opportunities?.summary}
            </p>
            {(result.automation_opportunities?.items ?? []).length > 0 && (
              <ul className="space-y-2">
                {result.automation_opportunities!.items!.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Tecnologia Recomendada */}
          <Card title="Tecnologia Recomendada">
            <div className="flex flex-wrap gap-2 mb-3">
              {(result.recommended_technology?.technologies ?? []).map(
                (tech, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      TECH_STYLES[tech] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {result.recommended_technology?.rationale}
            </p>
          </Card>

          {/* Nível de Complexidade */}
          <Card title="Nível de Complexidade">
            <div className="mb-3">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${
                  COMPLEXITY_STYLES[complexityLevel] ??
                  "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                {COMPLEXITY_LABEL[complexityLevel] ?? complexityLevel}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {result.complexity_level?.explanation}
            </p>
          </Card>
        </div>

        {/* Rodapé de navegação */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            href={`/projects/${params.id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Voltar ao projeto
          </Link>
        </div>
      </div>
    </main>
  );
}
