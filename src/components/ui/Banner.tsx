import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BannerAd } from '@/types';
import { getBanners, registrarVisualizacaoBanner, registrarCliqueBanner } from '@/lib/supabase';

interface BannerProps {
  banner: BannerAd;
  className?: string;
}

export default function Banner({ banner, className = '' }: BannerProps) {
  const handleClick = () => {
    if (banner.id) {
      registrarCliqueBanner(banner.id).catch(() => {});
    }
  };

  return (
    <div className={`overflow-hidden rounded-xl border border-brand-border bg-black/40 ${className}`}>
      <a
        href={banner.link_destino}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        aria-label={banner.titulo || 'Publicidade'}
        className="block relative group"
      >
        <img
          src={banner.imagem_url}
          alt={banner.titulo || 'Publicidade'}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.01]"
        />
        <span className="absolute bottom-1 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white/70 uppercase backdrop-blur-xs">
          Publicidade
        </span>
      </a>
    </div>
  );
}

// Componente inteligente de rotação de banners sem sobrepor
export function BannerPlaceholder({ posicao }: { posicao: 'header' | 'sidebar' | 'footer' | 'middle' | string }) {
  const [banners, setBanners] = useState<BannerAd[]>([]);
  const [indexAtual, setIndexAtual] = useState(0);

  useEffect(() => {
    getBanners(posicao).then(({ data }) => {
      if (data && data.length > 0) {
        setBanners(data as BannerAd[]);
      }
    });
  }, [posicao]);

  // Rotação automática caso existam múltiplos banners na mesma posição
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setIndexAtual((i) => (i + 1) % banners.length);
    }, 6000); // 6 segundos por banner GIF

    return () => clearInterval(timer);
  }, [banners.length]);

  // Registrar visualização do banner atual
  useEffect(() => {
    const bannerAtual = banners[indexAtual];
    if (bannerAtual?.id) {
      registrarVisualizacaoBanner(bannerAtual.id).catch(() => {});
    }
  }, [banners, indexAtual]);

  const sizes: Record<string, string> = {
    header: 'min-h-22.5',
    sidebar: 'min-h-[300px]',
    footer: 'min-h-22.5',
    middle: 'min-h-22.5',
  };

  // Se não houver nenhum banner cadastrado ativo na posição, exibe o espaço reservado
  if (banners.length === 0) {
    return (
      <div
        className={`w-full ${sizes[posicao] || 'min-h-22.5'} flex flex-col items-center justify-center rounded-xl border border-dashed border-brand-border bg-brand-surface/50 p-4 text-brand-muted text-xs text-center space-y-1`}
        aria-label="Espaço publicitário"
      >
        <span className="font-semibold text-brand-creme/70">Anuncie Aqui — Espaço Publicitário</span>
        <span className="text-[10px] text-brand-muted">
          {posicao === 'sidebar' ? 'Formato Sidebar 300x300 GIF' : `Formato Banner ${posicao.toUpperCase()} GIF`}
        </span>
      </div>
    );
  }

  const bannerExibido = banners[indexAtual];

  return (
    <div className={`w-full relative overflow-hidden rounded-xl ${sizes[posicao] || ''}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={bannerExibido.id ?? indexAtual}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Banner banner={bannerExibido} />
        </motion.div>
      </AnimatePresence>

      {/* Indicador sutil de rotação caso haja mais de 1 banner */}
      {banners.length > 1 && (
        <div className="absolute bottom-2 left-3 flex items-center gap-1 z-10 pointer-events-none">
          {banners.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === indexAtual ? 'w-4 bg-brand-laranja' : 'w-1 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
