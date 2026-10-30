import { getNoticias, getCategorias } from '@/lib/supabase';
import { gerarRssXml } from '@/lib/rss';
import type { Noticia, Categoria } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS, HEAD',
  'Access-Control-Allow-Headers': 'Content-Type, User-Agent, Accept',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    let noticias: Partial<Noticia>[] = [];
    let categoriaSelecionada: Categoria | null = null;

    if (slug === 'geral') {
      // Busca as ultimas noticias gerais
      const { data } = await getNoticias(25);
      if (data) {
        noticias = data as unknown as Partial<Noticia>[];
      }
    } else {
      // Busca categorias para encontrar o municipio
      const { data: categorias } = await getCategorias();
      if (categorias) {
        categoriaSelecionada = (categorias as Categoria[]).find(c => c.slug === slug) || null;
        if (categoriaSelecionada) {
          const { data } = await getNoticias(50);
          if (data) {
            noticias = (data as unknown as Partial<Noticia>[]).filter(n => n.categorias?.slug === slug).slice(0, 20);
          }
        } else {
          return new Response('Categoria não encontrada', {
            status: 404,
            headers: corsHeaders,
          });
        }
      }
    }

    const xml = gerarRssXml(noticias, categoriaSelecionada);

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('[RSS Error]', error);
    // Em caso de erro inesperado, devolve feed XML válido vazio em vez de 500
    const emptyXml = gerarRssXml([], null);
    return new Response(emptyXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        ...corsHeaders,
      },
    });
  }
}
