'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Eye, ChevronRight, Globe, Radio } from 'lucide-react';
import { getCategorias, getNoticiasByCategoria } from '@/lib/supabase';
import type { Noticia, Categoria } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function BrasilSection() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function carregarNoticiasBrasil() {
      try {
        setLoading(true);
        const { data: categoriasData } = await getCategorias();

        let catBrasil: Categoria | undefined;
        if (categoriasData && categoriasData.length > 0) {
          catBrasil = (categoriasData as Categoria[]).find(
            c => c.slug.toLowerCase() === 'brasil' ||
                 c.nome.toLowerCase() === 'brasil' ||
                 c.slug.toLowerCase().includes('brasil')
          );
        }

        const slugAlvo = catBrasil?.slug || 'brasil';
        if (catBrasil && isMounted) {
          setCategoria(catBrasil);
        }

        const { data: noticiasData } = await getNoticiasByCategoria(slugAlvo, 4, 0);

        if (isMounted) {
          if (noticiasData && noticiasData.length > 0) {
            setNoticias(noticiasData as Noticia[]);
          } else {
            setNoticias([]);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar notícias do Brasil:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    carregarNoticiasBrasil();
    return () => {
      isMounted = false;
    };
  }, []);

  // Se não estiver carregando e não houver notícias cadastradas para Brasil, não exibe a seção vazia
  if (!loading && noticias.length === 0) {
    return null;
  }

  const linkCategoria = `/categoria/${categoria?.slug || 'brasil'}`;

  return (
    <section 
      aria-label="Panorama Brasil"
      className="rounded-2xl bg-brand-surface border border-brand-border p-4 sm:p-6 space-y-5 shadow-sm"
    >
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <Globe size={20} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-titulo font-bold text-brand-creme text-xl sm:text-2xl leading-none">
                Panorama Brasil
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                <Radio size={10} className="text-emerald-400 animate-pulse" />
                Nacional
              </span>
            </div>
            <p className="text-xs text-brand-muted mt-0.5">
              Fatos, política, economia e as principais manchetes de relevância nacional
            </p>
          </div>
        </div>

        <Link
          href={linkCategoria}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors self-start sm:self-auto group"
        >
          <span>Acompanhe todo o Brasil</span>
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="h-64 rounded-xl bg-brand-grafite border border-brand-border overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-shimmer-gradient bg-size-[200%_100%] animate-shimmer" />
            </div>
          ))}
        </div>
      )}

      {/* Grid de 4 Cards Expressos */}
      {!loading && noticias.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {noticias.map((noticia, idx) => {
            const href = `/noticia/${noticia.categorias?.slug || 'brasil'}/${noticia.slug}`;
            return (
              <article
                key={noticia.id || idx}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-brand-grafite/60 hover:bg-brand-grafite border border-brand-border hover:border-emerald-500/40 shadow-sm hover:shadow-card transition-all duration-300 cursor-pointer"
              >
                <Link href={href} className="absolute inset-0 z-20" aria-label={noticia.titulo} />

                {/* Imagem Superior */}
                <div className="relative h-38 sm:h-36 w-full overflow-hidden bg-brand-surface shrink-0 pointer-events-none">
                  {noticia.imagem_url ? (
                    <img
                      src={noticia.imagem_url}
                      alt={noticia.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-muted text-xs">
                      Brasil
                    </div>
                  )}

                  {/* Badge de tempo flutuante */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-black/75 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      <Clock size={10} className="text-emerald-400" />
                      {noticia.data_publicacao
                        ? formatDistanceToNow(new Date(noticia.data_publicacao), {
                            locale: ptBR,
                            addSuffix: true,
                          })
                        : 'Recente'}
                    </span>
                  </div>
                </div>

                {/* Corpo do Card */}
                <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between pointer-events-none">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500 block mb-1">
                      {noticia.categorias?.nome || 'Brasil'}
                    </span>
                    <h3 className="font-titulo font-bold text-brand-creme text-sm sm:text-base leading-snug line-clamp-3 group-hover:text-emerald-400 transition-colors">
                      {noticia.titulo}
                    </h3>
                    {noticia.resumo && (
                      <p className="text-xs text-brand-muted line-clamp-2 mt-2 leading-relaxed">
                        {noticia.resumo}
                      </p>
                    )}
                  </div>

                  {/* Rodapé do Card */}
                  <div className="mt-3 pt-3 border-t border-brand-border/60 flex items-center justify-between text-[11px] text-brand-muted">
                    <span className="font-medium text-emerald-400/90 flex items-center gap-0.5 group-hover:underline">
                      Leia mais <ChevronRight size={12} />
                    </span>
                    {noticia.views !== undefined && (
                      <span className="flex items-center gap-1">
                        <Eye size={11} />
                        {noticia.views.toLocaleString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Borda decorativa inferior no hover */}
                <div className="h-0.5 w-full bg-linear-to-r from-emerald-500 to-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
