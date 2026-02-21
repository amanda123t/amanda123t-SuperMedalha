import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET /api/projects — lista todos os projetos com contagem de análises
export async function GET() {
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
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erro ao listar projetos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar projetos." },
      { status: 500 }
    );
  }
}

// POST /api/projects — cria um novo projeto
export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Nome do projeto é obrigatório." },
        { status: 400 }
      );
    }

    const sql = getDb();
    const [project] = await sql`
      INSERT INTO projects (name, description)
      VALUES (${name.trim()}, ${description?.trim() || null})
      RETURNING id, name, description, created_at
    `;

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar projeto:", error);
    return NextResponse.json(
      { error: "Erro ao criar projeto." },
      { status: 500 }
    );
  }
}
