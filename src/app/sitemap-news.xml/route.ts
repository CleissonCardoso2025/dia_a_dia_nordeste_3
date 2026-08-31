import { supabase } from '@/lib/supabase';

export const revalidate = 900; // Revalida o sitemap de notícias a cada 15 minutos

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://diaadianordeste.com.br';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const limite48h = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  // Consulta notícias publicadas nas últimas 48 horas
  const { data: noticias, error } = await supabase
    .from('noticias')
    .select('slug, titulo, data_publicacao, categorias(slug)')
    .gte('data_publicacao', limite48h)
    .order('data_publicacao', { ascending: false })
    .limit(1000);

  if (error) {
    console.error('[Google News Sitemap] Erro ao consultar Supabase:', error);
  }

  const itens = (noticias || [])
    .filter((n) => Boolean(n.slug && n.slug.trim()))
    .map((n) => {
      const catSlug = (n.categorias as any)?.slug || 'geral';
      const loc = `${BASE_URL}/noticia/${catSlug}/${n.slug}`;
      const title = escapeXml(n.titulo || 'Notícia');
      const pubDate = n.data_publicacao
        ? new Date(n.data_publicacao).toISOString()
        : new Date().toISOString();

      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>Dia a Dia Nordeste</news:name>
        <news:language>pt-BR</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${itens}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
    },
  });
}
