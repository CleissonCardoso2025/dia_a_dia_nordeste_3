import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';
import { getNoticiasByCategoria } from '@/lib/supabase';
import type { Noticia } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CityCarouselProps {
  categoriaSlug: string;
  categoriaNome: string;
  corHex?: string;
  noticiaAtualId?: string;
}

export default function CityCarousel({
  categoriaSlug,
  categoriaNome,
  corHex = '#D9491F',
  noticiaAtualId,
}: CityCarouselProps) {
  const [noticias, setNoticias] = useState<Partial<Noticia>[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!categoriaSlug) return;
    setLoading(true);
    getNoticiasByCategoria(categoriaSlug, 10).then(({ data }) => {
      if (data) {
        // Filtra para remover a notícia que o usuário já está lendo
        const filtradas = (data as unknown as Partial<Noticia>[]).filter(
          n => n.id !== noticiaAtualId
        );
        setNoticias(filtradas);
      }
      setLoading(false);
    });
  }, [categoriaSlug, noticiaAtualId]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const distance = 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  if (!loading && noticias.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t border-brand-border">
      {/* Cabeçalho do Carrossel */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-white shrink-0"
            style={{ backgroundColor: corHex }}
          >
            <MapPin size={16} />
          </div>
          <div>
            <h3 className="font-titulo font-bold text-brand-creme text-xl">
              Mais de {categoriaNome}
            </h3>
            <p className="text-xs text-brand-muted">
              Últimas publicações do município
            </p>
          </div>
        </div>

        {/* Botões de navegação */}
        {noticias.length > 2 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-surface border border-brand-border text-brand-creme hover:border-brand-laranja hover:text-brand-laranja transition-colors"
              aria-label="Notícias anteriores"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-surface border border-brand-border text-brand-creme hover:border-brand-laranja hover:text-brand-laranja transition-colors"
              aria-label="Próximas notícias"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Trilha do Carrossel */}
      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-72 shrink-0 h-64 rounded-xl bg-brand-surface border border-brand-border animate-shimmer"
            />
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-none scroll-smooth"
        >
          {noticias.map(noticia => (
            <motion.div
              key={noticia.id}
              whileHover={{ y: -4 }}
              className="w-72 shrink-0 rounded-xl bg-brand-surface border border-brand-border overflow-hidden flex flex-col group hover:border-brand-laranja/50 transition-all"
            >
              <Link to={`/noticia/${categoriaSlug}/${noticia.slug}`} className="block relative h-40 overflow-hidden bg-brand-grafite">
                {noticia.imagem_url ? (
                  <img
                    src={noticia.imagem_url}
                    alt={noticia.titulo ?? ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-muted text-xs">
                    Sem imagem
                  </div>
                )}
                <span
                  className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-md"
                  style={{ backgroundColor: corHex }}
                >
                  {categoriaNome}
                </span>
              </Link>

              <div className="p-4 flex flex-col flex-1 justify-between gap-2">
                <Link to={`/noticia/${categoriaSlug}/${noticia.slug}`}>
                  <h4 className="font-titulo font-bold text-brand-creme text-sm line-clamp-2 group-hover:text-brand-laranja transition-colors leading-snug">
                    {noticia.titulo}
                  </h4>
                </Link>

                <div className="flex items-center gap-1 text-[11px] text-brand-muted">
                  <Clock size={11} />
                  <span>
                    {noticia.data_publicacao
                      ? format(new Date(noticia.data_publicacao), "d 'de' MMM", { locale: ptBR })
                      : ''}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
