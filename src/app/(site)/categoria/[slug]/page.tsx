import { notFound } from 'next/navigation';
import { getCategorias, getNoticiasByCategoria } from '@/lib/supabase';
import type { Categoria, Noticia } from '@/types';
import CategoryClient from './CategoryClient';
import type { Metadata } from 'next';

export const revalidate = 60; // Revalidação a cada 60s para manter notícias sempre frescas

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const { data } = await getCategorias();
  const categoria = data?.find((c: Categoria) => c.slug === resolvedParams.slug);

  if (!categoria) {
    return {
      title: 'Categoria não encontrada',
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `https://diaadianordeste.com.br/categoria/${resolvedParams.slug}`;

  return {
    title: `${categoria.nome} — Notícias | Dia a Dia Nordeste`,
    description: `Acompanhe todas as notícias, acontecimentos e novidades de ${categoria.nome} e região no portal Dia a Dia Nordeste.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${categoria.nome} — Notícias | Dia a Dia Nordeste`,
      description: `Notícias sobre ${categoria.nome} no Nordeste Brasileiro.`,
      url: canonicalUrl,
      siteName: 'Dia a Dia Nordeste',
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { data: categorias } = await getCategorias();
  const categoria = categorias?.find((c: Categoria) => c.slug === resolvedParams.slug);

  if (!categoria) {
    notFound();
  }

  // Busca todas as notícias da categoria no servidor (até 100 registros)
  const { data: noticias } = await getNoticiasByCategoria(resolvedParams.slug, 100, 0);

  return (
    <CategoryClient
      slug={resolvedParams.slug}
      categoria={categoria}
      noticiasIniciais={(noticias as Noticia[]) ?? []}
    />
  );
}
