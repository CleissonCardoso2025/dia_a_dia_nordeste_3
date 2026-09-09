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
        className="w-full bg-brand-surface border border-brand-border border-t-2 border-t-red-600 p-4 sm:p-6 rounded-2xl shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 text-red-600 dark:text-red-400 border border-red-600/20">
              <Mic size={20} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-titulo font-extrabold text-brand-creme text-base sm:text-lg tracking-wide">
                  Canabrava Podcast
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white tracking-wider uppercase">
                  Vídeos & Cortes
                </span>
              </div>
              <p className="text-xs text-brand-muted mt-0.5">
                Cortes em vídeo, entrevistas e os melhores momentos do nosso canal
              </p>
            </div>
          </div>

          {/* Controles de Navegação e Canal */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <a
              href="https://www.youtube.com/channel/UC8_1EAnJTnrn78GFTTMrY6Q"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-full transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>Canal no YouTube</span>
              <ExternalLink size={12} />
            </a>
            <button
              onClick={() => scroll('left')}
              aria-label="Rolar episódios para esquerda"
              className="h-8 w-8 flex items-center justify-center rounded-full bg-brand-grafite border border-brand-border text-brand-creme hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Rolar episódios para direita"
              className="h-8 w-8 flex items-center justify-center rounded-full bg-brand-grafite border border-brand-border text-brand-creme hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Container Carrossel Deslizante */}
        <div className="relative group">
          {/* Scroll Area */}
          <div
            ref={scrollRef}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-2 scrollbar-none scroll-smooth snap-x"
          >
            {loading ? (
              // Shimmer Loading Skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col shrink-0 w-72 sm:w-80 rounded-2xl bg-brand-grafite/40 border border-brand-border overflow-hidden animate-pulse"
                >
                  <div className="aspect-video w-full bg-brand-border" />
                  <div className="p-4 space-y-2">
                    <div className="h-3.5 bg-brand-border rounded w-1/3" />
                    <div className="h-4 bg-brand-border rounded w-4/5" />
                    <div className="h-3 bg-brand-border rounded w-full" />
                  </div>
                </div>
              ))
            ) : (
              episodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => setVideoModal(ep)}
                  className="group/item flex flex-col shrink-0 w-72 sm:w-80 rounded-2xl text-left bg-brand-grafite/50 hover:bg-brand-grafite border border-brand-border hover:border-red-600/40 transition-all duration-300 cursor-pointer snap-start overflow-hidden shadow-xs hover:shadow-card hover:-translate-y-0.5"
                >
                  {/* Thumbnail 16:9 Ampla com Play no Canto (Não tampa o rosto) */}
                  <div className="relative aspect-video w-full overflow-hidden bg-brand-surface shrink-0">
                    <img
                      src={ep.thumbnail}
                      alt={ep.title}
                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    {/* Gradiente suave inferior para contraste */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-70 group-hover/item:opacity-90 transition-opacity" />

                    {/* Tag de Vídeo no canto inferior esquerdo */}
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-[10px] font-bold text-white shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                        Corte
                      </span>
                    </div>

                    {/* Botão Play elegante no canto inferior direito - Rosto 100% desobstruído */}
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-lg group-hover/item:bg-red-500 group-hover/item:scale-110 transition-all">
                        <Play size={13} className="fill-white translate-x-0.5" />
                      </span>
                    </div>
                  </div>

                  {/* Informações: Orador / Convidado + Título + CTA */}
                  <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-500 line-clamp-1 block">
                        {ep.speaker || 'Canabrava Podcast'}
                      </span>
                      <h3 className="font-titulo font-bold text-brand-creme text-sm sm:text-base leading-snug line-clamp-2 mt-1 group-hover/item:text-red-400 transition-colors">
                        {ep.summary || ep.title}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-muted">
                      <span className="text-red-500 font-semibold flex items-center gap-1 group-hover/item:underline">
                        Assistir corte <Play size={10} className="fill-red-500" />
                      </span>
                      <span className="text-[11px] text-brand-muted">YouTube</span>
                    </div>
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
