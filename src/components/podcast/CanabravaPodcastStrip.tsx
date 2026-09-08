'use client';

import { useEffect, useState, useRef } from 'react';
import { Play, ChevronLeft, ChevronRight, X, Mic, ExternalLink } from 'lucide-react';

interface Episode {
  id: string;
  videoId: string;
  title: string;
  speaker: string;
  summary: string;
  link: string;
  thumbnail: string;
  published: string;
  views?: string;
}

export default function CanabravaPodcastStrip() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoModal, setVideoModal] = useState<Episode | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/podcast')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.episodes && data.episodes.length > 0) {
          setEpisodes(data.episodes);
        }
      })
      .catch(err => console.error('Erro ao buscar episódios do podcast:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!loading && episodes.length === 0) {
    return null;
  }

  return (
    <>
      <section 
        aria-label="Últimos Episódios - Canabrava Podcast"
        className="w-full bg-brand-surface border border-brand-border border-t-2 border-t-red-700 dark:border-t-red-600 py-4 px-3 sm:px-4 rounded-xl shadow-xs"
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600/10 text-red-600 dark:text-red-400">
              <Mic size={16} />
            </span>
            <div className="flex items-center gap-2">
              <h2 className="font-titulo font-extrabold text-brand-creme text-sm sm:text-base tracking-wide">
                Canabrava Podcast
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white tracking-wider uppercase">
                Vídeos & Cortes
              </span>
            </div>
          </div>

          {/* Controles de Navegação */}
          <div className="flex items-center gap-1">
            <a
              href="https://www.youtube.com/channel/UC8_1EAnJTnrn78GFTTMrY6Q"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold text-brand-muted hover:text-red-600 transition-colors mr-2 hidden sm:inline-flex items-center gap-1"
            >
              <span>Canal no YouTube</span>
              <ExternalLink size={12} />
            </a>
            <button
              onClick={() => scroll('left')}
              aria-label="Rolar episódios para esquerda"
              className="h-7 w-7 flex items-center justify-center rounded-full bg-brand-grafite border border-brand-border text-brand-creme hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Rolar episódios para direita"
              className="h-7 w-7 flex items-center justify-center rounded-full bg-brand-grafite border border-brand-border text-brand-creme hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {/* Container Carrossel Deslizante */}
        <div className="relative group">
          {/* Scroll Area */}
          <div
            ref={scrollRef}
            className="flex items-center gap-5 overflow-x-auto pb-1 scrollbar-none scroll-smooth snap-x"
          >
            {loading ? (
              // Shimmer Loading Skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 shrink-0 w-72 sm:w-80 p-2 rounded-lg bg-brand-grafite/50 animate-pulse"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-brand-border shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-brand-border rounded w-2/3" />
                    <div className="h-3 bg-brand-border rounded w-full" />
                  </div>
                </div>
              ))
            ) : (
              episodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => setVideoModal(ep)}
                  className="group/item flex items-center gap-3 shrink-0 w-72 sm:w-84 p-2 rounded-xl text-left bg-brand-grafite/40 hover:bg-brand-grafite border border-transparent hover:border-red-600/30 transition-all duration-200 cursor-pointer snap-start"
                >
                  {/* Thumbnail / Avatar com Botão Play */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-brand-grafite shrink-0 shadow-xs border border-brand-border/60">
                    <img
                      src={ep.thumbnail}
                      alt={ep.title}
                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover/item:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md transform group-hover/item:scale-110 transition-transform">
                        <Play size={10} className="fill-white translate-x-0.5" />
                      </span>
                    </div>
                  </div>

                  {/* Informações: Título/Orador em vermelho + Descrição */}
                  <div className="flex-1 min-w-0 pr-1">
                    <span className="font-bold text-xs sm:text-sm text-red-700 dark:text-red-400 line-clamp-1 block group-hover/item:text-red-500 transition-colors">
                      {ep.speaker || 'Canabrava Podcast'}
                    </span>
                    <p className="text-xs text-brand-creme leading-tight line-clamp-2 mt-0.5 font-normal">
                      {ep.summary || ep.title}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── MODAL PLAYER DE VÍDEO ── */}
      {videoModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setVideoModal(null)}
        >
          <div 
            className="relative w-full max-w-3xl bg-brand-surface rounded-2xl overflow-hidden border border-brand-border shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Topbar do Modal */}
            <div className="flex items-center justify-between p-4 border-b border-brand-border bg-brand-grafite">
              <div className="flex items-center gap-2 pr-4 min-w-0">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-600 text-white text-xs">
                  <Play size={12} className="fill-white translate-x-0.5" />
                </span>
                <h3 className="font-titulo font-bold text-brand-creme text-sm sm:text-base line-clamp-1">
                  {videoModal.title}
                </h3>
              </div>
              <button
                onClick={() => setVideoModal(null)}
                className="h-8 w-8 flex items-center justify-center rounded-full text-brand-muted hover:text-brand-creme hover:bg-brand-surface transition-colors cursor-pointer shrink-0"
                aria-label="Fechar vídeo"
              >
                <X size={18} />
              </button>
            </div>

            {/* Iframe do Vídeo do YouTube */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoModal.videoId}?autoplay=1`}
                title={videoModal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>

            {/* Rodapé do Modal com Ações */}
            <div className="p-3.5 bg-brand-grafite flex items-center justify-between text-xs text-brand-muted">
              <span className="line-clamp-1">Canabrava Podcast Oficial</span>
              <a
                href={videoModal.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-red-500 font-semibold hover:underline"
              >
                Assistir no YouTube <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
