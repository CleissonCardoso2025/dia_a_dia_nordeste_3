import { getCategorias } from '@/lib/supabase';
import type { Categoria } from '@/types';
import CategoryClient from './CategoryClient';
import type { Metadata } from 'next';

export const revalidate = 3600; // revalidate at most every hour

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const { data } = await getCategorias();
  const categoria = data?.find((c: Categoria) => c.slug === params.slug);

  return {
    title: categoria?.nome ?? 'Categoria',
    description: `Notícias sobre ${categoria?.nome ?? params.slug} no Nordeste Brasileiro.`,
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { data } = await getCategorias();
  const categoria = data?.find((c: Categoria) => c.slug === params.slug);

  return <CategoryClient slug={params.slug} categoria={categoria as Categoria | undefined} />;
}
