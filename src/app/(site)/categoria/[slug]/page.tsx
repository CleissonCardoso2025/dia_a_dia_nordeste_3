import { getCategorias } from '@/lib/supabase';
import type { Categoria } from '@/types';
import CategoryClient from './CategoryClient';
import type { Metadata } from 'next';

export const revalidate = 3600; // revalidate at most every hour

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const { data } = await getCategorias();
  const categoria = data?.find((c: Categoria) => c.slug === resolvedParams.slug);

  return {
    title: categoria?.nome ?? 'Categoria',
    description: `Notícias sobre ${categoria?.nome ?? resolvedParams.slug} no Nordeste Brasileiro.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { data } = await getCategorias();
  const categoria = data?.find((c: Categoria) => c.slug === resolvedParams.slug);

  return <CategoryClient slug={resolvedParams.slug} categoria={categoria as Categoria | undefined} />;
}
