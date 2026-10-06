'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Eye, 
  ChevronRight as ArrowIcon,
  Sparkles
} from 'lucide-react';
import { supabase, getCategorias } from '@/lib/supabase';
import type { Noticia, Categoria } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function GeralSection() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todas');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [resCat, resNoticias] = await Promise.all([
          getCategorias(),
          supabase
            .from('noticias')
            .select('*, categorias(id,nome,slug,cor_hex,tipo), autores(id,nome,foto_url:avatar_url)')
            .order('data_publicacao', { ascending: false })
            .limit(30)
        ]);

        if (resCat.data) {
          // Apenas categorias editoriais
          const editoriais = (resCat.data as Categoria[]).filter(
            c => c.tipo === 'editorial' &&
                 c.slug.toLowerCase() !== 'bahia' &&
                 c.slug.toLowerCase() !== 'brasil'
          );
          setCategorias(editoriais);
        }

        if (resNoticias.data) {
          setNoticias(resNoticias.data as Noticia[]);
        }
      } catch (err) {
        console.error('Erro ao carregar notícias da seção Geral:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filtragem das notícias conforme categoria selecionada
  const noticiasFiltradas = categoriaSelecionada === 'Todas'
    ? noticias
    : noticias.filter(
        n => n.categorias?.nome?.toLowerCase() === categoriaSelecionada.toLowerCase() ||
             n.categorias?.slug?.toLowerCase() === categoriaSelecionada.toLowerCase()
      );

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const distance = 420;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-[#151926] via-[#11141e] to-[#0d1017] border border-white/10 p-5 sm:p-8 shadow-2xl">
      {/* Efeitos de Iluminação Ambiente no Fundo */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-laranja/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 space-y-6">
        {/* ── CABEÇALHO DA SEÇÃO GERAL ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-tr from-brand-laranja to-amber-400 text-white shadow-lg shadow-brand-laranja/25 shrink-0">
              <Layers size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-titulo font-black text-white text-2xl sm:text-3xl tracking-tight">
                  Geral
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-laranja/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-brand-laranja border border-brand-laranja/30">
                  <Sparkles size={10} />
                  Panorama
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                Acontecimentos, variedades e destaques informativos em tempo real
              </p>
            </div>
          </div>

          {/* Botões de Navegação Horizontal */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-brand-laranja border border-white/10 hover:border-brand-laranja text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
              aria-label="Rolar notícias para a esquerda"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-brand-laranja border border-white/10 hover:border-brand-laranja text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
              aria-label="Rolar notícias para a direita"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ── FILTROS DE CATEGORIA (Pills Estilizados) ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          <button
            onClick={() => setCategoriaSelecionada('Todas')}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              categoriaSelecionada === 'Todas'
                ? 'bg-brand-laranja text-white shadow-md shadow-brand-laranja/30 scale-105'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            Todas
          </button>
          {categorias.map(cat => {
            const active = categoriaSelecionada.toLowerCase() === cat.nome.toLowerCase();
            return (
              <button
                key={cat.id || cat.slug}
                onClick={() => setCategoriaSelecionada(cat.nome)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? 'text-white shadow-md scale-105'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
                style={active ? { backgroundColor: cat.cor_hex || '#D9491F' } : {}}
              >
                {cat.nome}
              </button>
            );
          })}
        </div>

        {/* ── ESTADO DE CARREGAMENTO (SKELETONS) ── */}
        {loading ? (
          <div className="grid grid-rows-2 grid-flow-col auto-cols-[300px] sm:auto-cols-[380px] gap-4 overflow-x-auto pb-4 scrollbar-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-white/5 border border-white/10 animate-shimmer"
              />
            ))}
          </div>
        ) : noticiasFiltradas.length === 0 ? (
          /* Estado Vazio */
          <div className="flex flex-col items-center justify-center p-10 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center">
            <p className="text-sm text-zinc-400 mb-3">
              Nenhuma notícia cadastrada na categoria &quot;{categoriaSelecionada}&quot; no momento.
            </p>
            <button
              onClick={() => setCategoriaSelecionada('Todas')}
              className="text-xs font-bold text-brand-laranja hover:underline cursor-pointer"
            >
              Ver todas as notícias
            </button>
          </div>
        ) : (
          /* ── CARROSSEL DE CARDS HORIZONTAIS EM BENTO (2 LINHAS) ── */
          <div
            ref={scrollRef}
            className="grid grid-rows-2 grid-flow-col auto-cols-[300px] sm:auto-cols-[380px] lg:auto-cols-[400px] gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none scroll-smooth"
          >
            {noticiasFiltradas.map((noticia, idx) => {
              const href = `/noticia/${noticia.categorias?.slug || 'geral'}/${noticia.slug}`;
              const corCat = noticia.categorias?.cor_hex || '#D9491F';

              return (
                <motion.article
                  key={noticia.id || idx}
                  whileHover={{ y: -3 }}
                  className="group relative flex gap-3.5 p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-brand-laranja/50 backdrop-blur-md shadow-lg transition-all duration-300 cursor-pointer overflow-hidden h-[126px] sm:h-[136px]"
                >
                  {/* Link invisível de cobertura total */}
                  <Link
                    href={href}
                    className="absolute inset-0 z-20"
                    aria-label={noticia.titulo}
                  />

                  {/* Thumbnail Lateral com Tag de Categoria */}
                  <div className="relative w-28 sm:w-34 h-full rounded-xl overflow-hidden shrink-0 bg-brand-grafite border border-white/5 pointer-events-none">
                    {noticia.imagem_url ? (
                      <img
                        src={noticia.imagem_url}
                        alt={noticia.titulo}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500 text-[10px]">
                        Sem foto
                      </div>
                    )}
                    {/* Badge sobreposto na foto */}
                    <span
                      className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase text-white shadow-xs tracking-wider"
                      style={{ backgroundColor: corCat }}
                    >
                      {noticia.categorias?.nome || 'Geral'}
                    </span>
                  </div>

                  {/* Informações da Notícia */}
                  <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5 pointer-events-none">
                    <div>
                      {/* Linha de Tempo */}
                      <div className="flex items-center gap-1 text-[11px] text-zinc-400 mb-1">
                        <Clock size={11} className="text-zinc-500 shrink-0" />
                        <span className="truncate">
                          {noticia.data_publicacao
                            ? formatDistanceToNow(new Date(noticia.data_publicacao), {
                                locale: ptBR,
                                addSuffix: true,
                              })
                            : 'Recente'}
                        </span>
                      </div>

                      {/* Título */}
                      <h3 className="font-titulo font-bold text-white text-xs sm:text-[13px] leading-snug line-clamp-2 sm:line-clamp-3 group-hover:text-brand-laranja transition-colors">
                        {noticia.titulo}
                      </h3>
                    </div>

                    {/* Rodapé do Card */}
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-white/5">
                      <span className="truncate max-w-[110px] sm:max-w-[130px] text-[10px] text-zinc-400">
                        {noticia.autores?.nome || 'Redação'}
                      </span>

                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-brand-laranja group-hover:translate-x-0.5 transition-transform shrink-0">
                        Ler <ArrowIcon size={11} />
                      </span>
                    </div>
                  </div>

                  {/* Borda decorativa inferior animada */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    style={{ backgroundColor: corCat }}
                  />
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
