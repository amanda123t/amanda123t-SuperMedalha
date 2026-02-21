import { neon } from "@neondatabase/serverless";

/**
 * Retorna um cliente SQL do Neon usando a variável de ambiente DATABASE_URL.
 * Usa inicialização lazy para evitar erros de build quando a variável não está definida.
 * Configure DATABASE_URL no painel do Vercel: Settings → Environment Variables.
 */
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "Variável de ambiente DATABASE_URL não está definida. " +
        "Configure em .env.local (desenvolvimento) ou no painel do Vercel (produção)."
    );
  }
  return neon(url);
}
