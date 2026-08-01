-- ============================================================
-- Dia a Dia Nordeste — Schema Supabase
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================================

-- Extensões
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- Tabela: categorias
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categorias (
  id        UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nome      TEXT NOT NULL,
  slug      TEXT NOT NULL UNIQUE,
  cor_hex   TEXT NOT NULL DEFAULT '#D9491F',
  criado_em TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────
-- Tabela: autores
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS autores (
  id       UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nome     TEXT NOT NULL,
  foto_url TEXT,
  bio      TEXT,
  criado_em TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────
-- Tabela: noticias
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS noticias (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  titulo           TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  resumo           TEXT NOT NULL,
  conteudo         TEXT NOT NULL DEFAULT '',
  imagem_url       TEXT,
  categoria_id     UUID REFERENCES categorias(id) ON DELETE SET NULL,
  autor_id         UUID REFERENCES autores(id) ON DELETE SET NULL,
  data_publicacao  TIMESTAMPTZ DEFAULT now(),
  views            BIGINT DEFAULT 0,
  destaque         BOOLEAN DEFAULT false,
  meta_title       TEXT,
  meta_description TEXT,
  -- Coluna de full-text search (português)
  fts              TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('portuguese',
      coalesce(titulo, '') || ' ' ||
      coalesce(resumo, '') || ' ' ||
      coalesce(conteudo, '')
    )
  ) STORED
);

CREATE INDEX IF NOT EXISTS idx_noticias_fts      ON noticias USING GIN(fts);
CREATE INDEX IF NOT EXISTS idx_noticias_slug     ON noticias(slug);
CREATE INDEX IF NOT EXISTS idx_noticias_destaque ON noticias(destaque) WHERE destaque = true;
CREATE INDEX IF NOT EXISTS idx_noticias_views    ON noticias(views DESC);
CREATE INDEX IF NOT EXISTS idx_noticias_pub      ON noticias(data_publicacao DESC);

-- ─────────────────────────────────────────────
-- Tabela: banners_ads
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS banners_ads (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  posicao      TEXT NOT NULL CHECK (posicao IN ('header','sidebar','footer','middle')),
  imagem_url   TEXT NOT NULL,
  link_destino TEXT NOT NULL,
  ativo        BOOLEAN DEFAULT true,
  criado_em    TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────
-- Função: increment_views (RPC)
-- Incrementa views atomicamente sem race condition
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION increment_views(noticia_id UUID)
RETURNS VOID AS $$
  UPDATE noticias SET views = views + 1 WHERE id = noticia_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- ─────────────────────────────────────────────
-- RLS (Row Level Security)
-- ─────────────────────────────────────────────
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE autores    ENABLE ROW LEVEL SECURITY;
ALTER TABLE noticias   ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners_ads ENABLE ROW LEVEL SECURITY;

-- Leitura pública (sem autenticação)
CREATE POLICY "leitura_publica_categorias" ON categorias FOR SELECT USING (true);
CREATE POLICY "leitura_publica_autores"    ON autores    FOR SELECT USING (true);
CREATE POLICY "leitura_publica_noticias"   ON noticias   FOR SELECT USING (true);
CREATE POLICY "leitura_publica_banners"    ON banners_ads FOR SELECT USING (ativo = true);

-- Escrita apenas para usuários autenticados (admin)
CREATE POLICY "admin_noticias_insert"  ON noticias FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_noticias_update"  ON noticias FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "admin_noticias_delete"  ON noticias FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "admin_categorias_all"   ON categorias FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_autores_all"      ON autores    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_banners_all"      ON banners_ads FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- Dados iniciais de exemplo
-- ─────────────────────────────────────────────
INSERT INTO categorias (nome, slug, cor_hex) VALUES
  ('Adustina',           'adustina',           '#D9491F'),
  ('Antas',              'antas',              '#1E5C4E'),
  ('Banzaê',             'banzae',             '#8B5CF6'),
  ('Cícero Dantas',      'cicero-dantas',      '#2563EB'),
  ('Cipó',               'cipo',               '#059669'),
  ('Coronel João Sá',    'coronel-joao-sa',    '#DC2626'),
  ('Euclides da Cunha',  'euclides-da-cunha',  '#D97706'),
  ('Fátima',             'fatima',             '#10B981'),
  ('Heliópolis',         'heliopolis',         '#7C3AED'),
  ('Jeremoabo',          'jeremoabo',          '#E11D48'),
  ('Nova Soure',         'nova-soure',         '#0284C7'),
  ('Novo Triunfo',       'novo-triunfo',       '#F59E0B'),
  ('Paripiranga',        'paripiranga',        '#6366F1'),
  ('Pedro Alexandre',    'pedro-alexandre',    '#EC4899'),
  ('Ribeira do Amparo',  'ribeira-do-amparo',  '#14B8A6'),
  ('Ribeira do Pombal',  'ribeira-do-pombal',  '#84CC16'),
  ('Santa Brígida',      'santa-brigida',      '#06B6D4'),
  ('Sítio do Quinto',    'sitio-do-quinto',    '#A855F7')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO autores (nome, bio) VALUES
  ('Redação Dia a Dia Nordeste', 'Equipe de jornalismo do portal Dia a Dia Nordeste.')
ON CONFLICT DO NOTHING;
