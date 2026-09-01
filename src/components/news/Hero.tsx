'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { heroContainerVariants, heroWordVariants, heroOverlayVariants } from '@/animations/variants';
import { getNoticiasDestaque } from '@/lib/supabase';
import type { Noticia } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock removido

export default function Hero() {
  const [destaques, setDestaques] = useState<Partial<Noticia>[]>([]);
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    getNoticiasDestaque(5).then(({ data }) => {
      if (data && data.length > 0) {
        setDestaques(data as unknown as Partial<Noticia>[]);
      }

    });
  }, []);

  // Auto-avançar
  useEffect(() => {
    const timer = setInterval(() => {
      setAtual(i => (i + 1) % destaques.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [destaques.length]);

  if (destaques.length === 0) return null;

  const noticia = destaques[atual];

  const words = (noticia?.titulo ?? '').split(' ');

  return (
    <section
      className="relative h-[55vh] min-h-105 sm:h-[70vh] sm:min-h-120 max-h-170 overflow-hidden rounded-2xl"
      aria-label="Destaque principal"
    >
      {/* Ken Burns Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={noticia.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center animate-ken-burns"
            style={{ backgroundImage: `url('${noticia.imagem_url}')` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay gradiente */}
      <motion.div
        variants={heroOverlayVariants}
        initial="hidden"
        animate="show"
        className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"
      />

      {/* Conteúdo */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
        {/* Badge de categoria */}
        {noticia.categorias && (
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-bold text-white mb-3"
            style={{ backgroundColor: noticia.categorias.cor_hex }}
          >
            {noticia.categorias.nome}
          </span>
        )}

        {/* Título com reveal stagger */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${atual}`}
            variants={heroContainerVariants}
            initial="hidden"
            animate="show"
            className="font-titulo font-black text-white text-2xl sm:text-4xl lg:text-5xl leading-tight max-w-4xl mb-3"
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                variants={heroWordVariants}
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
        </AnimatePresence>

        {/* Resumo */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`desc-${atual}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="text-white/80 text-sm sm:text-base max-w-2xl line-clamp-2 mb-4"
          >
            {noticia.resumo}
          </motion.p>
        </AnimatePresence>

        {/* Meta + CTA */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1 text-white/60 text-xs">
            <Clock size={12} />
            <span>
              {noticia.data_publicacao
                ? format(new Date(noticia.data_publicacao), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
                : ''}
            </span>
          </div>

          <Link
            href={`/noticia/${noticia.categorias?.slug ?? 'geral'}/${noticia.slug}`}
            className="rounded-full bg-brand-laranja px-5 py-2 text-sm font-bold text-white hover:bg-brand-laranja-dark transition-colors"
          >
            Ler matéria completa →
          </Link>
        </div>
      </div>

      {/* Controles de navegação */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4">
        <button
          onClick={() => setAtual(i => (i - 1 + destaques.length) % destaques.length)}
          className="h-9 w-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white hover:bg-black/60 transition-colors flex items-center justify-center"
          aria-label="Anterior"
        >
          <ChevronLeft size={18} />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-4">
        <button
          onClick={() => setAtual(i => (i + 1) % destaques.length)}
          className="h-9 w-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white hover:bg-black/60 transition-colors flex items-center justify-center"
          aria-label="Próximo"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Indicadores (dots) */}
      <div className="absolute bottom-4 right-6 flex items-center gap-1.5">
        {destaques.map((_, i) => (
          <button
            key={i}
            onClick={() => setAtual(i)}
            aria-label={`Ir para slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === atual ? 'w-6 h-1.5 bg-brand-laranja' : 'w-1.5 h-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
