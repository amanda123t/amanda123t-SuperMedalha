import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET /api/projects/:id — retorna um projeto pelo ID
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getDb();
    const [project] = await sql`
      SELECT id, name, description, created_at
      FROM projects
      WHERE id = ${params.id}
    `;

    if (!project) {
      return NextResponse.json(
        { error: "Projeto não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Erro ao buscar projeto:", error);
    return NextResponse.json(
      { error: "Erro ao buscar projeto." },
      { status: 500 }
    );
  }
}
