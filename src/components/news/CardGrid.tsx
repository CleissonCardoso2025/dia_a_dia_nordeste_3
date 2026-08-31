'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NewsCard from './NewsCard';
import type { Noticia, Categoria } from '@/types';
import { getNoticias, getNoticiasByCategoria } from '@/lib/supabase';
import { ChevronRight, Loader2, Plus, ExternalLink } from 'lucide-react';

interface CardGridProps {
  categoria?: Categoria;
  titulo?: string;
  limite?: number;
  expandable?: boolean;
}

export default function CardGrid({ categoria, titulo, limite = 9, expandable = false }: CardGridProps) {
  const [noticias, setNoticias] = useState<Partial<Noticia>[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Zera estados ao mudar de categoria
  useEffect(() => {
    setNoticias([]);
    setHasMore(true);
    setLoading(true);
  }, [categoria?.id, categoria?.slug]);

  useEffect(() => {
    if (!loading) return;

    let isMounted = true;
    const fetchInitial = async () => {
      try {
        const fetchPromise = categoria
          ? getNoticiasByCategoria(categoria.slug, limite, 0)
          : getNoticias(limite, 0);

        const { data } = await fetchPromise;

        if (!isMounted) return;

        if (data && data.length > 0) {
          setNoticias(data as Noticia[]);
          setHasMore(data.length >= limite);
        } else {
          setNoticias([]);
          setHasMore(false);
        }
      } catch (err) {
        console.error('Erro ao buscar notícias:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInitial();
    return () => { isMounted = false; };
  }, [categoria?.slug, limite, loading]);

  const carregarMais = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const qtyToFetch = 12;
    const currentOffset = noticias.length;

    try {
      const fetchPromise = categoria
        ? getNoticiasByCategoria(categoria.slug, qtyToFetch, currentOffset)
        : getNoticias(qtyToFetch, currentOffset);

      const { data } = await fetchPromise;

      if (data && data.length > 0) {
        setNoticias(prev => [...prev, ...(data as Noticia[])]);
        setHasMore(data.length >= qtyToFetch);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Erro ao carregar mais notícias:', err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: limite }).map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-xl bg-brand-surface border border-brand-border overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-shimmer-gradient bg-size-[200%_100%] animate-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section>
      {titulo && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {categoria && (
              <span
                className="block w-1.5 h-6 rounded-full"
                style={{ backgroundColor: categoria.cor_hex || '#D9491F' }}
              />
            )}
            <h2 className="font-titulo font-bold text-brand-creme text-xl">
              {titulo}
            </h2>
          </div>
          {categoria && (
            <Link
              href={`/categoria/${categoria.slug}`}
              className="flex items-center gap-1 text-xs text-brand-laranja hover:underline font-semibold"
            >
              Ver página completa <ChevronRight size={14} />
            </Link>
          )}
        </div>
      )}

      {noticias.length === 0 ? (
        <div className="rounded-xl bg-brand-surface border border-brand-border p-8 text-center text-brand-muted text-sm">
          Nenhuma notícia encontrada para esta seção no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {noticias.map((noticia, i) => (
            <NewsCard
              key={`${noticia.id || noticia.slug}-${i}`}
              noticia={noticia}
              destaque={i === 0 && !categoria}
            />
          ))}
        </div>
      )}

      {expandable && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {hasMore && (
            <button
              onClick={carregarMais}
              disabled={loadingMore}
              className="flex items-center gap-2 rounded-full border border-brand-laranja bg-transparent px-8 py-3 text-sm font-bold text-brand-laranja transition-all hover:bg-brand-laranja hover:text-white disabled:opacity-50 cursor-pointer shadow-lg shadow-brand-laranja/10"
            >
              {loadingMore ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Carregando notícias...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Carregar mais notícias
                </>
              )}
            </button>
          )}

          {categoria && (
            <Link
              href={`/categoria/${categoria.slug}`}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-brand-grafite border border-brand-border text-xs font-semibold text-brand-creme hover:text-brand-laranja hover:border-brand-laranja transition-colors"
            >
              <span>Ver todas as notícias de {categoria.nome}</span>
              <ExternalLink size={14} />
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
