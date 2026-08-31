import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600; // Revalida o sitemap no máximo a cada 1 hora (ISR)

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://diaadianordeste.com.br';

interface NoticiaItem {
  slug: string;
  data_publicacao: string | null;
  categorias: { slug: string } | null;
}

interface CategoriaItem {
  slug: string;
}

/**
 * Busca todas as notícias publicadas com paginação para evitar limites de API
 */
async function fetchAllNoticias(): Promise<NoticiaItem[]> {
  const PAGE_SIZE = 500;
  let allNoticias: NoticiaItem[] = [];
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('noticias')
      .select('slug, data_publicacao, categorias(slug)')
      .order('data_publicacao', { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (error || !data || data.length === 0) {
      hasMore = false;
      break;
    }

    allNoticias = allNoticias.concat(data as unknown as NoticiaItem[]);

    if (data.length < PAGE_SIZE) {
      hasMore = false;
    } else {
      from += PAGE_SIZE;
    }
  }

  return allNoticias;
}

/**
 * Busca todas as categorias cadastradas
 */
async function fetchAllCategorias(): Promise<CategoriaItem[]> {
  const { data, error } = await supabase
    .from('categorias')
    .select('slug')
    .order('nome');

  if (error || !data) return [];
  return data as CategoriaItem[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [noticias, categorias] = await Promise.all([
    fetchAllNoticias(),
    fetchAllCategorias(),
  ]);

  // 1. Rotas estáticas principais
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/busca`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/privacidade`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/termos`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/politica-editorial`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/anuncie`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/rss`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // 2. Rotas de categorias
  const categoryRoutes: MetadataRoute.Sitemap = categorias
    .filter((cat) => Boolean(cat.slug && cat.slug.trim()))
    .map((cat) => ({
      url: `${BASE_URL}/categoria/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    }));

  // 3. Rotas de notícias publicadas
  const noticiaRoutes: MetadataRoute.Sitemap = noticias
    .filter((n) => Boolean(n.slug && n.slug.trim()))
    .map((n) => {
      const catSlug = n.categorias?.slug || 'geral';
      return {
        url: `${BASE_URL}/noticia/${catSlug}/${n.slug}`,
        lastModified: n.data_publicacao ? new Date(n.data_publicacao) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      };
    });

  return [...staticRoutes, ...categoryRoutes, ...noticiaRoutes];
}
