'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import NewsCard from '@/components/news/NewsCard';
import Sidebar from '@/components/layout/Sidebar';
import type { Categoria, Noticia } from '@/types';
import { pageVariants, gridContainerVariants } from '@/animations/variants';
import { Newspaper, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { getNoticiasByCategoria } from '@/lib/supabase';
import Link from 'next/link';

export default function CategoryClient({ 
  slug, 
  categoria,
  noticiasIniciais = []
}: { 
  slug: string; 
  categoria?: Categoria; 
  noticiasIniciais?: Noticia[];
}) {
  const [noticias, setNoticias] = useState<Noticia[]>(noticiasIniciais);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(noticiasIniciais.length >= 100);

  const carregarMais = async () => {
    if (loadingMore || !categoria) return;
    setLoadingMore(true);
    const { data } = await getNoticiasByCategoria(categoria.slug, 50, noticias.length);
    if (data && data.length > 0) {
      setNoticias(prev => [...prev, ...(data as Noticia[])]);
      setHasMore(data.length >= 50);
    } else {
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="mx-auto max-w-7xl px-4 py-6"
    >
      {/* Breadcrumb */}
      <nav aria-label="Navegação estrutural" className="flex items-center gap-1 text-xs text-brand-muted mb-6">
        <Link href="/" className="hover:text-brand-laranja">Início</Link>
        <ChevronRight size={12} />
        <span className="text-brand-muted">Categorias</span>
        <ChevronRight size={12} />
        <span className="text-brand-laranja font-medium">{categoria?.nome ?? slug}</span>
      </nav>

      {/* Cabeçalho de categoria */}
      <div className="mb-8 pb-6 border-b border-brand-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {categoria && (
              <span
                className="block w-2.5 h-8 rounded-full shadow-sm"
                style={{ backgroundColor: categoria.cor_hex || '#D9491F' }}
              />
            )}
            <h1 className="font-titulo font-black text-brand-creme text-3xl md:text-4xl">
              {categoria?.nome ?? slug}
            </h1>
          </div>
          <p className="text-brand-muted text-sm md:text-base ml-5.5">
            Cobertura completa e notícias atualizadas sobre {categoria?.nome ?? slug} e região.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-xl bg-brand-surface border border-brand-border text-xs text-brand-muted font-medium">
          <Newspaper size={16} className="text-brand-laranja" />
          <span><strong className="text-brand-creme">{noticias.length}</strong> {noticias.length === 1 ? 'matéria publicada' : 'matérias publicadas'}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          {noticias.length === 0 ? (
            <div className="rounded-2xl bg-brand-surface border border-brand-border p-12 text-center text-brand-muted">
              Nenhuma notícia cadastrada nesta categoria no momento.
            </div>
          ) : (
            <>
              <motion.div
                variants={gridContainerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {noticias.map((noticia, i) => (
                  <NewsCard
                    key={`${noticia.id}-${i}`}
                    noticia={noticia}
                  />
                ))}
              </motion.div>

              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={carregarMais}
                    disabled={loadingMore}
                    className="flex items-center gap-2 rounded-full border border-brand-laranja bg-transparent px-8 py-3 text-sm font-bold text-brand-laranja transition-colors hover:bg-brand-laranja hover:text-white disabled:opacity-50 cursor-pointer shadow-lg shadow-brand-laranja/10"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Carregando mais notícias...
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Carregar mais notícias
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="w-full lg:w-72 shrink-0 mt-8 lg:mt-0">
          <div className="sticky top-20">
            <Sidebar />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
