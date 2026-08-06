import { Metadata } from 'next';
import Link from 'next/link';
import { Search, Clock } from 'lucide-react';
import { buscarNoticias } from '@/lib/supabase';
import type { SearchResult } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BuscaPageProps {
  searchParams: { q?: string };
}

export async function generateMetadata({ searchParams }: BuscaPageProps): Promise<Metadata> {
  const query = searchParams.q ?? '';
  return {
    title: query ? `Busca: ${query}` : 'Busca',
    description: `Resultados para "${query}" no Dia a Dia Nordeste.`,
  };
}

export default async function SearchPage({ searchParams }: BuscaPageProps) {
  const query = searchParams.q ?? '';
  let resultados: SearchResult[] = [];

  if (query) {
    const { data } = await buscarNoticias(query);
    if (data) {
      resultados = data as unknown as SearchResult[];
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <Search size={22} className="text-brand-laranja" />
        <h1 className="font-titulo font-black text-brand-creme text-2xl">
          {query ? `Resultados para "${query}"` : 'Buscar Notícias'}
        </h1>
      </div>
      <p className="text-brand-muted text-sm mb-8">
        {query ? `${resultados.length} resultado(s) encontrado(s)` : 'Digite algo para buscar'}
      </p>

      {query && resultados.length === 0 && (
        <div className="text-center py-16 text-brand-muted">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">Nenhuma notícia encontrada para "{query}"</p>
          <p className="text-sm mt-2">
            Tente outros termos ou{' '}
            <Link href="/" className="text-brand-laranja hover:underline">
              volte para o início
            </Link>
          </p>
        </div>
      )}

      {resultados.length > 0 && (
        <ul className="space-y-4">
          {resultados.map(noticia => (
            <li key={noticia.id}>
              <Link
                href={`/noticia/${noticia.categorias?.slug ?? 'geral'}/${noticia.slug}`}
                className="flex gap-4 p-4 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-laranja/50 transition-colors group"
              >
                {noticia.imagem_url && (
                  <img
                    src={noticia.imagem_url}
                    alt={noticia.titulo}
                    loading="lazy"
                    className="w-24 h-20 object-cover rounded-lg shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  {noticia.categorias && (
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-xs font-bold text-white mb-1"
                      style={{ backgroundColor: noticia.categorias.cor_hex }}
                    >
                      {noticia.categorias.nome}
                    </span>
                  )}
                  <h2 className="font-titulo font-bold text-brand-creme group-hover:text-brand-laranja transition-colors leading-snug line-clamp-2">
                    {noticia.titulo}
                  </h2>
                  <p className="text-sm text-brand-muted line-clamp-1 mt-1">{noticia.resumo}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-brand-muted">
                    <Clock size={11} />
                    {format(new Date(noticia.data_publicacao), "d 'de' MMMM", { locale: ptBR })}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
