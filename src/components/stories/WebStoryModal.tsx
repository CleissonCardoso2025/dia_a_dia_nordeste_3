import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, ChevronLeft, ChevronRight, ExternalLink, Check, Copy } from 'lucide-react';
import type { WebStory } from '@/types';

interface WebStoryModalProps {
  story: WebStory | null;
  onClose: () => void;
}

const SLIDE_DURATION = 5000; // 5 segundos por slide

export default function WebStoryModal({ story, onClose }: WebStoryModalProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [shareMenuAberto, setShareMenuAberto] = useState(false);

  const isPausedRef = useRef(paused);
  isPausedRef.current = paused;

  // Reseta estado ao abrir nova story
  useEffect(() => {
    setSlideIndex(0);
    setProgress(0);
    setPaused(false);
    setShareMenuAberto(false);
  }, [story]);

  const proximoSlide = useCallback(() => {
    if (!story) return;
    if (slideIndex < story.slides.length - 1) {
      setSlideIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [slideIndex, story, onClose]);

  const slideAnterior = useCallback(() => {
    if (slideIndex > 0) {
      setSlideIndex(prev => prev - 1);
      setProgress(0);
    }
  }, [slideIndex]);

  // Timer do slide com barra de progresso
  useEffect(() => {
    if (!story || paused || shareMenuAberto) return;

    const step = 50; // atualiza a cada 50ms
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          proximoSlide();
          return 0;
        }
        return prev + (step / SLIDE_DURATION) * 100;
      });
    }, step);

    return () => clearInterval(timer);
  }, [story, slideIndex, paused, shareMenuAberto, proximoSlide]);

  if (!story) return null;

  const currentSlide = story.slides[slideIndex];

  // Compartilhamento
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = window.location.href;
    const shareText = `Confira esse Web Story: ${story.titulo} no Dia a Dia Nordeste!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: story.titulo,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback se o usuário cancelar ou o navegador não der suporte
      }
    }
    setShareMenuAberto(v => !v);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`*${story.titulo}*\n${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-0 sm:p-4 select-none"
        onClick={onClose}
      >
        {/* Container do Story (Estilo Smartphone 9:16) */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm h-full sm:h-[90vh] sm:max-h-195 sm:rounded-3xl overflow-hidden bg-brand-grafite shadow-2xl flex flex-col"
          onClick={e => e.stopPropagation()}
          onMouseDown={() => setPaused(true)}
          onMouseUp={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          {/* Imagem de Fundo do Slide */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <img
                src={currentSlide.imagemUrl}
                alt={currentSlide.titulo}
                className="w-full h-full object-cover"
              />
              {/* Overlay Escuro para Contraste */}
              <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/30 to-black/60" />
            </motion.div>
          </AnimatePresence>

          {/* Topo: Barras de Progresso + Header */}
          <div className="relative z-20 p-4 space-y-3">
            {/* Segmentos de Progresso */}
            <div className="flex gap-1.5 w-full">
              {story.slides.map((_, idx) => {
                let barWidth = '0%';
                if (idx < slideIndex) barWidth = '100%';
                else if (idx === slideIndex) barWidth = `${progress}%`;

                return (
                  <div
                    key={idx}
                    className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full bg-white transition-all duration-75"
                      style={{ width: barWidth }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Top Bar: Categoria, Título e Ações */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider"
                  style={{ backgroundColor: story.corCategoria }}
                >
                  {story.categoria}
                </span>
                <span className="text-white/80 text-xs font-semibold line-clamp-1 max-w-35">
                  {story.titulo}
                </span>
              </div>

              {/* Botões de Ação Topo */}
              <div className="flex items-center gap-2">
                {/* Botão Compartilhar */}
                <button
                  onClick={handleShare}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/70 transition-colors border border-white/20"
                  title="Compartilhar Web Story"
                >
                  <Share2 size={15} />
                </button>

                {/* Botão Fechar */}
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/70 transition-colors border border-white/20"
                  title="Fechar"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Áreas de toque / cliques invisíveis para Navegação */}
          <div className="absolute inset-0 z-10 flex">
            <div
              className="w-1/3 h-full cursor-pointer"
              onClick={slideAnterior}
            />
            <div
              className="w-2/3 h-full cursor-pointer"
              onClick={proximoSlide}
            />
          </div>

          {/* Seta Esquerda / Direita no Desktop */}
          {slideIndex > 0 && (
            <button
              onClick={slideAnterior}
              className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white border border-white/20 hover:bg-black/70"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {slideIndex < story.slides.length - 1 && (
            <button
              onClick={proximoSlide}
              className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white border border-white/20 hover:bg-black/70"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Rodapé do Slide: Texto + CTA Saiba Mais */}
          <div className="relative z-20 mt-auto p-6 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <h2 className="font-titulo font-black text-white text-xl sm:text-2xl leading-tight">
                  {currentSlide.titulo}
                </h2>
                <p className="text-white/90 text-sm leading-relaxed">
                  {currentSlide.texto}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Link Saiba Mais */}
            {currentSlide.linkSaibaMais && (
              <a
                href={currentSlide.linkSaibaMais}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-full bg-brand-laranja py-3 text-sm font-bold text-white hover:bg-brand-laranja-dark transition-all shadow-lg active:scale-98"
              >
                <span>Ver matéria completa</span>
                <ExternalLink size={15} />
              </a>
            )}
          </div>

          {/* Popover de Compartilhamento Rápido */}
          <AnimatePresence>
            {shareMenuAberto && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 right-4 z-30 bg-brand-surface border border-brand-border rounded-2xl p-4 shadow-2xl space-y-3"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-brand-border pb-2">
                  <span className="text-xs font-bold text-brand-creme">Compartilhar Story</span>
                  <button onClick={() => setShareMenuAberto(false)}>
                    <X size={14} className="text-brand-muted hover:text-white" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleShareWhatsApp}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-xs font-bold text-white hover:opacity-90 transition-opacity"
                  >
                    WhatsApp
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 rounded-xl bg-brand-grafite border border-brand-border py-2.5 text-xs font-bold text-brand-creme hover:border-brand-laranja transition-colors"
                  >
                    {copiado ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    {copiado ? 'Copiado!' : 'Copiar Link'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
