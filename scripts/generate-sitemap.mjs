#!/usr/bin/env node
/**
 * Script de geração de sitemap.xml
 * Consulta o Supabase e gera public/sitemap.xml antes do deploy.
 *
 * Como usar:
 *   node scripts/generate-sitemap.mjs
 *
 * Adicione ao package.json:
 *   "build": "node scripts/generate-sitemap.mjs && vite build"
 *
 * Requer as variáveis de ambiente (sem prefixo VITE_):
 *   SUPABASE_URL, SUPABASE_ANON_KEY, BASE_URL
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { loadEnv } from 'vite';

const env = loadEnv('', process.cwd(), '');

const SUPABASE_URL  = process.env.SUPABASE_URL  || process.env.VITE_SUPABASE_URL || env.SUPABASE_URL  || env.VITE_SUPABASE_URL;
const SUPABASE_KEY  = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;
const BASE_URL      = process.env.BASE_URL      || process.env.VITE_BASE_URL || env.BASE_URL      || env.VITE_BASE_URL || 'https://diaadianordeste.com.br';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('[sitemap] Supabase não configurado — gerando sitemap apenas com rotas estáticas.');
}

const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_KEY || 'placeholder'
);

// Rotas estáticas do site
const ROTAS_ESTATICAS = [
  { loc: '/',               changefreq: 'hourly',  priority: '1.0' },
  { loc: '/busca',          changefreq: 'monthly', priority: '0.3' },
  { loc: '/sobre',          changefreq: 'monthly', priority: '0.4' },
  { loc: '/contato',        changefreq: 'monthly', priority: '0.4' },
  { loc: '/privacidade',    changefreq: 'yearly',  priority: '0.2' },
];

function xmlEscape(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function gerarSitemap(urls) {
  const urlTags = urls
    .map(({ loc, lastmod, changefreq, priority }) => `
  <url>
    <loc>${xmlEscape(BASE_URL + loc)}</loc>
    ${lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlTags}
</urlset>`;
}

async function main() {
  console.log('[sitemap] Gerando sitemap.xml...');

  const urls = [...ROTAS_ESTATICAS];

  try {
    // Categorias
    const { data: categorias } = await supabase
      .from('categorias')
      .select('slug');

    if (categorias) {
      categorias.forEach(cat => {
        urls.push({
          loc: `/categoria/${cat.slug}`,
          changefreq: 'hourly',
          priority: '0.8',
        });
      });
    }

    // Notícias
    const { data: noticias } = await supabase
      .from('noticias')
      .select('slug,categorias(slug),data_publicacao')
      .order('data_publicacao', { ascending: false });

    if (noticias) {
      noticias.forEach(n => {
        const catSlug = n.categorias?.slug ?? 'geral';
        urls.push({
          loc: `/noticia/${catSlug}/${n.slug}`,
          lastmod: n.data_publicacao,
          changefreq: 'weekly',
          priority: '0.7',
        });
      });
    }
  } catch (err) {
    console.warn('[sitemap] Aviso: não foi possível consultar o Supabase.', err.message);
  }

  const xml = gerarSitemap(urls);
  const outPath = resolve(__dirname, '../public/sitemap.xml');
  writeFileSync(outPath, xml, 'utf-8');

  console.log(`[sitemap] ✅ Gerado com ${urls.length} URLs em ${outPath}`);
}

main();
