import Link from "next/link";
import { getDb } from "@/lib/db";
import CreateProjectForm from "./_components/CreateProjectForm";

// Tipo local para projeto com contagem de análises
type ProjectRow = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  analysis_count: number;
};

// Página de listagem de projetos — Server Component
export default async function ProjectsPage() {
  let projects: ProjectRow[] = [];

  try {
    const sql = getDb();
    const rows = await sql`
      SELECT
        p.id,
        p.name,
        p.description,
        p.created_at,
        COUNT(a.id)::int AS analysis_count
      FROM projects p
      LEFT JOIN analyses a ON a.project_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;
    projects = rows as unknown as ProjectRow[];
  } catch {
    // Renderiza página mesmo com banco indisponível durante build/preview
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projetos</h1>
            <p className="mt-1 text-sm text-gray-500">
              Organize suas análises de processos por projeto.
            </p>
          </div>
          <CreateProjectForm />
        </div>

        {/* Estado vazio */}
        {projects.length === 0 && (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-400 text-sm font-medium">
              Nenhum projeto criado ainda.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Clique em &quot;+ Novo Projeto&quot; para começar.
            </p>
          </div>
        )}

        {/* Lista de projetos */}
        {projects.length > 0 && (
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-5 py-4 shadow-sm hover:border-blue-300 hover:shadow transition-all group"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {project.name}
                  </p>
                  {project.description && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {project.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className="text-xs text-gray-400">
                    {project.analysis_count}{" "}
                    {project.analysis_count === 1 ? "análise" : "análises"}
                  </span>
                  <span className="text-gray-300">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
