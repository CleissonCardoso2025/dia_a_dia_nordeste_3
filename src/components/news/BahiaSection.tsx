'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Eye, ChevronRight, Compass, Flame } from 'lucide-react';
import { getCategorias, getNoticiasByCategoria } from '@/lib/supabase';
import type { Noticia, Categoria } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function BahiaSection() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function carregarNoticiasBahia() {
      try {
        setLoading(true);
        const { data: categoriasData } = await getCategorias();
        
        let catBahia: Categoria | undefined;
        if (categoriasData && categoriasData.length > 0) {
          catBahia = (categoriasData as Categoria[]).find(
            c => c.slug.toLowerCase() === 'bahia' || 
                 c.nome.toLowerCase() === 'bahia' ||
                 c.slug.toLowerCase().includes('bahia')
          );
        }

        const slugAlvo = catBahia?.slug || 'bahia';
        if (catBahia && isMounted) {
          setCategoria(catBahia);
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
        console.error('Erro ao carregar notícias da Bahia:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    carregarNoticiasBahia();
    return () => {
      isMounted = false;
    };
  }, []);

  // Se não estiver carregando e não houver notícias cadastradas para Bahia, não exibe a seção vazia
  if (!loading && noticias.length === 0) {
    return null;
  }

  const noticiaPrincipal = noticias[0];
  const noticiasSecundarias = noticias.slice(1, 4);
  const linkCategoria = `/categoria/${categoria?.slug || 'bahia'}`;

  return (
    <section 
      aria-label="Notícias da Bahia"
      className="rounded-2xl bg-brand-surface border border-brand-border p-4 sm:p-6 space-y-5 shadow-sm"
    >
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-laranja/10 text-brand-laranja border border-brand-laranja/20">
            <Compass size={20} className="animate-spin-slow" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-titulo font-bold text-brand-creme text-xl sm:text-2xl leading-none">
                Bahia em Pauta
              </h2>
              <span className="hidden xs:inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                <Flame size={10} className="text-blue-400" />
                Estadual
              </span>
            </div>
            <p className="text-xs text-brand-muted mt-0.5">
              Cobertura dos principais acontecimentos em todo o estado da Bahia
            </p>
          </div>
        </div>

        <Link
          href={linkCategoria}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-laranja hover:text-brand-laranja-light transition-colors self-start sm:self-auto group"
        >
          <span>Ver todas da Bahia</span>
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Esqueleto de Carregamento (Loading Skeleton) */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Skeleton Principal */}
          <div className="lg:col-span-7 h-80 sm:h-96 rounded-xl bg-brand-grafite border border-brand-border overflow-hidden relative">
            <div className="absolute inset-0 bg-shimmer-gradient bg-size-[200%_100%] animate-shimmer" />
          </div>
          {/* Skeleton Secundárias */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 rounded-xl bg-brand-grafite border border-brand-border overflow-hidden relative">
                <div className="absolute inset-0 bg-shimmer-gradient bg-size-[200%_100%] animate-shimmer" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conteúdo Carregado */}
      {!loading && noticiaPrincipal && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* ── CARD PRINCIPAL EM DESTAQUE (Lado Esquerdo - 7 Colunas) ── */}
          <div className="lg:col-span-7 flex">
            <article className="group relative flex flex-col justify-end w-full overflow-hidden rounded-xl bg-brand-grafite border border-brand-border shadow-card hover:shadow-card-hover transition-all duration-300 min-h-80 sm:min-h-100 cursor-pointer">
              <Link 
                href={`/noticia/${noticiaPrincipal.categorias?.slug || 'bahia'}/${noticiaPrincipal.slug}`}
                className="absolute inset-0 z-30"
                aria-label={noticiaPrincipal.titulo}
              />
              
              {/* Imagem de Fundo com Zoom Suave */}
              <div className="absolute inset-0 overflow-hidden bg-brand-grafite">
                {noticiaPrincipal.imagem_url ? (
                  <img
                    src={noticiaPrincipal.imagem_url}
                    alt={noticiaPrincipal.titulo}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-muted text-sm">
                    Bahia Notícias
                  </div>
                )}
                {/* Gradiente de Leitura */}
                <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-transparent" />
              </div>

              {/* Informações Sobrepostas */}
              <div className="relative z-20 p-4 sm:p-6 flex flex-col justify-end pointer-events-none">
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span className="inline-flex items-center rounded-md bg-blue-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                    {noticiaPrincipal.categorias?.nome || 'Bahia'}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-300">
                    <Clock size={12} />
                    <span>
                      {noticiaPrincipal.data_publicacao
                        ? formatDistanceToNow(new Date(noticiaPrincipal.data_publicacao), {
                            locale: ptBR,
                            addSuffix: true,
                          })
                        : 'Hoje'}
                    </span>
                  </div>
                </div>

                <h3 className="font-titulo font-black text-white text-lg sm:text-2xl lg:text-3xl leading-snug line-clamp-3 group-hover:text-brand-laranja-light transition-colors mb-2">
                  {noticiaPrincipal.titulo}
                </h3>

                {noticiaPrincipal.resumo && (
                  <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed">
                    {noticiaPrincipal.resumo}
                  </p>
                )}

                <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-medium text-brand-laranja flex items-center gap-1 group-hover:underline">
                    Ler matéria completa <ChevronRight size={13} />
                  </span>
                  {noticiaPrincipal.views !== undefined && (
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {noticiaPrincipal.views.toLocaleString('pt-BR')} visualizações
                    </span>
                  )}
                </div>
              </div>

              {/* Linha de acento decorativa */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-blue-500 via-brand-laranja to-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </article>
          </div>

          {/* ── LISTA DE SECUNDÁRIAS COMPACTAS (Lado Direito - 5 Colunas) ── */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3.5">
            {noticiasSecundarias.map((noticia, idx) => {
              const href = `/noticia/${noticia.categorias?.slug || 'bahia'}/${noticia.slug}`;
              return (
                <article
                  key={noticia.id || idx}
                  className="group relative flex items-center gap-3 sm:gap-4 p-3 rounded-xl bg-brand-grafite/50 hover:bg-brand-grafite border border-brand-border hover:border-brand-laranja/40 transition-all duration-300 shadow-sm flex-1 cursor-pointer"
                >
                  <Link href={href} className="absolute inset-0 z-20" aria-label={noticia.titulo} />

                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-24 rounded-lg overflow-hidden bg-brand-surface shrink-0 border border-brand-border pointer-events-none">
                    {noticia.imagem_url ? (
                      <img
                        src={noticia.imagem_url}
                        alt={noticia.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-muted text-[10px]">
                        Sem foto
                      </div>
                    )}
                  </div>

                  {/* Detalhes do Card */}
                  <div className="flex flex-col justify-center flex-1 min-w-0 pr-1 pointer-events-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-1">
                      {noticia.categorias?.nome || 'Bahia'}
                    </span>

                    <h4 className="font-titulo font-bold text-brand-creme text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-brand-laranja transition-colors">
                      {noticia.titulo}
                    </h4>

                    <div className="mt-2 flex items-center gap-3 text-[11px] text-brand-muted">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {noticia.data_publicacao
                          ? format(new Date(noticia.data_publicacao), "d 'de' MMM", { locale: ptBR })
                          : 'Hoje'}
                      </span>
                      {noticia.views !== undefined && (
                        <span className="flex items-center gap-1">
                          <Eye size={11} />
                          {noticia.views.toLocaleString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}

            {/* Se houver apenas 1 notícia na Bahia, preenche espaço com convite editorial */}
            {noticiasSecundarias.length === 0 && (
              <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-brand-grafite/30 border border-dashed border-brand-border text-center h-full">
                <p className="text-xs text-brand-muted">
                  Mais notícias do território baiano serão publicadas em breve.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
