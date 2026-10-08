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

import dotenv from 'dotenv';

// Carregar variáveis de ambiente do .env
dotenv.config({ path: resolve(__dirname, '../.env') });
dotenv.config({ path: resolve(__dirname, '../.env.production') });

const SUPABASE_URL  = process.env.SUPABASE_URL  || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY  = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const BASE_URL      = process.env.BASE_URL      || process.env.NEXT_PUBLIC_BASE_URL || process.env.VITE_BASE_URL || 'https://diaadianordeste.com.br';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('[sitemap] Supabase não configurado — gerando sitemap apenas com rotas estáticas.');
}

const SUPABASE_SCHEMA = process.env.SUPABASE_SCHEMA || process.env.NEXT_PUBLIC_SUPABASE_SCHEMA || env.SUPABASE_SCHEMA || env.NEXT_PUBLIC_SUPABASE_SCHEMA || 'dia_a_dia_nordeste';

const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_KEY || 'placeholder',
  { db: { schema: SUPABASE_SCHEMA } }
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
  console.log('[sitemap] O sitemap.xml agora é gerado nativa e dinamicamente pelo Next.js App Router (src/app/sitemap.ts).');
}

main();
