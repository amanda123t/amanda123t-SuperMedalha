import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET /api/projects/:id/analyses — lista análises de um projeto em ordem decrescente
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT
        id,
        process_description,
        business_rule,
        volume_sla,
        result,
        created_at
      FROM analyses
      WHERE project_id = ${params.id}
      ORDER BY created_at DESC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erro ao listar análises:", error);
    return NextResponse.json(
      { error: "Erro ao buscar análises." },
      { status: 500 }
    );
  }
}
