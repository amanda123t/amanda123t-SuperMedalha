-- ============================================================
-- Schema do banco de dados — AI Process Rule Validator
-- Execute este script no Console SQL do Neon para criar as tabelas.
-- ============================================================

-- Extensão para geração de UUIDs (já habilitada no Neon por padrão)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------
-- Tabela de projetos (entidade pai)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------
-- Tabela de análises (filhas de um projeto)
-- Armazena os inputs originais + resultado JSON do Claude
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS analyses (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id          UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  process_description TEXT        NOT NULL,
  business_rule       TEXT        NOT NULL,
  volume_sla          TEXT,
  result              JSONB       NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------
-- Índices para performance nas consultas mais comuns
-- ----------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_analyses_project_id
  ON analyses(project_id);

CREATE INDEX IF NOT EXISTS idx_analyses_created_at
  ON analyses(created_at DESC);

-- Índice GIN para buscas dentro do JSONB (opcional, para uso futuro)
CREATE INDEX IF NOT EXISTS idx_analyses_result_gin
  ON analyses USING gin(result);
