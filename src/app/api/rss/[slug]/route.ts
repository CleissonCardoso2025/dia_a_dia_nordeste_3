import { getNoticias, getCategorias, getWebStories } from '@/lib/supabase';
import { gerarRssXml } from '@/lib/rss';
import type { Noticia, Categoria } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let noticias: Partial<Noticia>[] = [];
  let categoriaSelecionada: Categoria | null = null;
  let isWebStories = false;

  if (slug === 'geral') {
    // Busca as ultimas noticias gerais
    const { data } = await getNoticias(15);
    if (data) {
      noticias = data as unknown as Partial<Noticia>[];
    }
  } else if (slug === 'web-stories') {
    // Busca web stories
    isWebStories = true;
    const { data: webStories } = await getWebStories();
    if (webStories) {
      noticias = webStories.map(s => ({
        id: s.id,
        titulo: `[Web Story] ${s.titulo}`,
        slug: s.id, // O ID é usado no lugar do slug pois Web Stories não tem página individual
        data_publicacao: s.criadoEm,
        resumo: s.corpo || 'Confira nosso Web Story.',
        conteudo: `<p><img src="${s.capaUrl}" /></p><p>${s.corpo || ''}</p>`,
        imagem_url: s.capaUrl,
        categorias: { id: s.id, nome: s.categoria || 'Web Stories', slug: 'web-stories', cor_hex: s.corCategoria || '#D9491F' },
      })) as Partial<Noticia>[];
    }
  } else {
    // Busca categorias para encontrar o municipio
    const { data: categorias } = await getCategorias();
    if (categorias) {
      categoriaSelecionada = (categorias as Categoria[]).find(c => c.slug === slug) || null;
      if (categoriaSelecionada) {
        // Busca apenas as noticias da categoria
        // Uma abordagem melhor seria ter uma função `getNoticiasPorCategoria(slug, 15)` no supabase.ts
        // Mas podemos buscar mais e filtrar ou buscar tudo. A implementacao original do RssPage buscava getNoticias(40) e filtrava
        const { data } = await getNoticias(50);
        if (data) {
          noticias = (data as unknown as Partial<Noticia>[]).filter(n => n.categorias?.slug === slug).slice(0, 15);
        }
      } else {
        return new Response('Categoria não encontrada', { status: 404 });
      }
    }
  }

  if (isWebStories) {
    categoriaSelecionada = { id: 'web-stories', nome: 'Web Stories ⚡', slug: 'web-stories', cor_hex: '#D9491F' } as Categoria;
  }

  const xml = gerarRssXml(noticias, categoriaSelecionada);

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
