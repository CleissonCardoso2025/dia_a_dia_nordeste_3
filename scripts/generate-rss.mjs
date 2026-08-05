#!/usr/bin/env node
/**
 * Script de geração de feeds RSS 2.0 (rss.xml)
 * Consulta o Supabase e gera public/rss.xml e feeds por município antes do deploy.
 *
 * Como usar:
 *   node scripts/generate-rss.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Carrega .env se necessário
if (!process.env.SUPABASE_URL && !process.env.VITE_SUPABASE_URL) {
  const envPath = resolve(__dirname, '../.env');
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
      if (match) {
        const key = match[1];
        const val = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) process.env[key] = val;
      }
    });
  }
}

const SUPABASE_URL  = process.env.SUPABASE_URL  || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY  = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const BASE_URL      = process.env.BASE_URL      || process.env.VITE_BASE_URL || 'https://diaadianordeste.com.br';

const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_KEY || 'placeholder'
);

function xmlEscape(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatRfc822Date(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toUTCString();
  } catch (e) {
    return new Date().toUTCString();
  }
}

function gerarRssFeed(noticias, tituloCanal = 'Dia a Dia Nordeste', descricaoCanal = 'Notícias do Semiárido Nordeste II da Bahia') {
  const itemsXml = noticias.map(n => {
    const catNome = n.categorias?.nome || 'Geral';
    const catSlug = n.categorias?.slug || 'geral';
    const linkNoticia = `${BASE_URL}/noticia/${catSlug}/${n.slug}`;
    const imagem = n.imagem_url || '';
    const pubDate = formatRfc822Date(n.data_publicacao);
    const conteudoCompleto = n.conteudo || n.resumo || '';

    return `
    <item>
      <title>${xmlEscape(n.titulo)}</title>
      <link>${xmlEscape(linkNoticia)}</link>
      <guid isPermaLink="true">${xmlEscape(linkNoticia)}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${xmlEscape(catNome)}</category>
      <description><![CDATA[${imagem ? `<p><img src="${imagem}" alt="${xmlEscape(n.titulo)}" /></p>` : ''}<p>${n.resumo || ''}</p>]]></description>
      <content:encoded><![CDATA[${imagem ? `<p><img src="${imagem}" alt="${xmlEscape(n.titulo)}" /></p>` : ''}${conteudoCompleto}]]></content:encoded>
      ${imagem ? `<enclosure url="${xmlEscape(imagem)}" type="image/jpeg" length="0" />` : ''}
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(tituloCanal)}</title>
    <link>${xmlEscape(BASE_URL)}</link>
    <atom:link href="${xmlEscape(BASE_URL)}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${xmlEscape(descricaoCanal)} — Conectando o Semiárido</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;
}

async function main() {
  console.log('[rss] Gerando feeds RSS 2.0 com notícias completas e imagens...');

  try {
    // 1. Busca todas as notícias com categorias
    const { data: noticias } = await supabase
      .from('noticias')
      .select('*, categorias(id,nome,slug,cor_hex)')
      .order('data_publicacao', { ascending: false })
      .limit(50);

    const listaNoticias = noticias || [];

    // 2. RSS Geral (Últimas 10 de todas as categorias combinadas)
    const rssGeral = gerarRssFeed(listaNoticias.slice(0, 10), 'Dia a Dia Nordeste — Feed Completo');
    const outGeral = resolve(__dirname, '../public/rss.xml');
    writeFileSync(outGeral, rssGeral, 'utf-8');
    console.log(`[rss] ✅ Feed geral gerado em ${outGeral}`);

    // 3. Feeds individuais por município/categoria
    const { data: categorias } = await supabase.from('categorias').select('*');
    if (categorias && categorias.length > 0) {
      for (const cat of categorias) {
        const noticiasCat = listaNoticias.filter(n => n.categorias?.slug === cat.slug).slice(0, 10);
        const rssCat = gerarRssFeed(
          noticiasCat,
          `Dia a Dia Nordeste — Notícias de ${cat.nome}`,
          `Feed RSS exclusivo de matérias de ${cat.nome} no Semiárido Nordeste II`
        );
        const outCat = resolve(__dirname, `../public/rss-${cat.slug}.xml`);
        writeFileSync(outCat, rssCat, 'utf-8');
      }
      console.log(`[rss] ✅ Feeds de ${categorias.length} municípios gerados em public/rss-[municipio].xml`);
    }

    // 4. Feed de Web Stories
    const MOCK_STORIES = [
      {
        titulo: 'Avanços na Saúde do Nordeste: Novas Unidades Móveis',
        categoria: 'Saúde',
        capaUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
        slug: 'avancos-saude-nordeste',
        data_publicacao: '2026-08-01T14:00:00Z',
        resumo: 'Caravanas de Saúde Chegam ao Sertão e Telemedicina Integrada no SUS.',
        conteudo: '<h2>Caravanas de Saúde Chegam ao Sertão</h2><p>Novos veículos equipados oferecem exames e consultas especializadas diretamente nas comunidades rurais do Semiárido.</p><h2>Telemedicina Integrada no SUS</h2><p>Pacientes agora contam com atendimento médico especializado via videoconferência em postos de saúde de todo o interior.</p>',
      },
      {
        titulo: 'Escolas em Tempo Integral Batem Recordes de Matrículas',
        categoria: 'Educação',
        capaUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
        slug: 'escolas-tempo-integral-recorde',
        data_publicacao: '2026-08-01T12:30:00Z',
        resumo: 'Revolução no Ensino Público e Laboratórios Digitais de Robótica.',
        conteudo: '<h2>Revolução no Ensino Público</h2><p>O modelo de escola em tempo integral expande e já atende 65% dos estudantes da rede pública no Semiárido.</p><h2>Laboratórios Digitais e Robótica</h2><p>Estudantes desenvolvem projetos tecnológicos para solucionar desafios do clima e da agricultura regional.</p>',
      },
      {
        titulo: 'Atletas do Nordeste Conquistam Ouros em Campeonatos Nacionais',
        categoria: 'Esportes',
        capaUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
        slug: 'atletas-nordeste-ouros',
        data_publicacao: '2026-08-01T10:15:00Z',
        resumo: 'Pódio no Atletismo e Artes Martiais no Sertão Baiano.',
        conteudo: '<h2>Pódio no Atletismo e Artes Martiais</h2><p>Jovens promessas do desporto nordestino trazem medalhas de ouro em torneios nacionais de judô e atletismo.</p>',
      },
      {
        titulo: 'Patrimônio Vivo: A Arte do Couro e do Forró no Sertão',
        categoria: 'Cultura',
        capaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        slug: 'patrimonio-vivo-couro-forro',
        data_publicacao: '2026-08-01T09:00:00Z',
        resumo: 'Cultura Sertaneja Rumo ao Reconhecimento Global.',
        conteudo: '<h2>Cultura Sertaneja Rumo ao Reconhecimento Global</h2><p>Mestres da xilogravura, artesanato em couro e repentistas ganham feira de arte internacional.</p>',
      },
    ];

    const noticiasWebStories = MOCK_STORIES.map(s => ({
      titulo: `[Web Story] ${s.titulo}`,
      slug: s.slug,
      data_publicacao: s.data_publicacao,
      resumo: s.resumo,
      conteudo: s.conteudo,
      imagem_url: s.capaUrl,
      categorias: { nome: s.categoria, slug: 'web-stories' },
    }));

    const rssWebStories = gerarRssFeed(
      noticiasWebStories,
      'Dia a Dia Nordeste — Feed de Web Stories ⚡',
      'Feed RSS oficial dos Web Stories em formato visual e rápido'
    );
    const outWebStories = resolve(__dirname, '../public/rss-web-stories.xml');
    writeFileSync(outWebStories, rssWebStories, 'utf-8');
    console.log(`[rss] ✅ Feed de Web Stories gerado em ${outWebStories}`);
  } catch (err) {
    console.warn('[rss] Aviso ao gerar RSS:', err.message);
  }
}

main();
