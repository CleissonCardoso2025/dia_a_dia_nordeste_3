'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import NewsCard from './NewsCard';
import { gridContainerVariants } from '@/animations/variants';
import type { Noticia, Categoria } from '@/types';
import { getNoticias } from '@/lib/supabase';
import { ChevronRight } from 'lucide-react';

// Mock data para desenvolvimento
const MOCK_NOTICIAS: Partial<Noticia>[] = Array.from({ length: 9 }, (_, i) => ({
  id: String(i + 10),
  titulo: [
    'Prefeito anuncia novo plano de mobilidade urbana para capital nordestina',
    'Chuvas intensas causam alagamentos em bairros de Recife',
    'Universidade federal lança programa de bolsas para estudantes carentes',
    'Time nordestino avança na Copa do Brasil e sonha com título inédito',
    'Produtores rurais do semiárido apostam na caprinocultura como renda alternativa',
    'Novo corredor gastronômico impulsiona turismo em cidade histórica',
    'Hospital público nordestino se destaca em cirurgias cardíacas complexas',
    'Jovens empreendedores nordestinos recebem prêmio nacional de inovação',
    'Projeto social transforma vidas através da música no interior do Ceará',
  ][i],
  slug: `noticia-mock-${i + 10}`,
  resumo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  imagem_url: `https://images.unsplash.com/photo-${1500000000 + i * 10000}?w=600&q=75`,
  data_publicacao: new Date(Date.now() - i * 3600000 * 2).toISOString(),
  views: Math.floor(Math.random() * 5000) + 200,
  categorias: [
    { id: '1', nome: 'Política', slug: 'politica', cor_hex: '#D9491F' },
    { id: '2', nome: 'Ambiente', slug: 'ambiente', cor_hex: '#059669' },
    { id: '3', nome: 'Educação', slug: 'educacao', cor_hex: '#2563EB' },
    { id: '4', nome: 'Esportes', slug: 'esportes', cor_hex: '#D97706' },
    { id: '5', nome: 'Agro', slug: 'agro', cor_hex: '#15803D' },
    { id: '6', nome: 'Turismo', slug: 'turismo', cor_hex: '#7C3AED' },
    { id: '7', nome: 'Saúde', slug: 'saude', cor_hex: '#DB2777' },
    { id: '8', nome: 'Empreendedorismo', slug: 'empreendedorismo', cor_hex: '#1E5C4E' },
    { id: '9', nome: 'Cultura', slug: 'cultura', cor_hex: '#8B5CF6' },
  ][i],
}));

interface CardGridProps {
  categoria?: Categoria;
  titulo?: string;
  limite?: number;
}

export default function CardGrid({ categoria, titulo, limite = 9 }: CardGridProps) {
  const [noticias, setNoticias] = useState<Partial<Noticia>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getNoticias(limite).then(({ data }) => {
      if (data && data.length > 0) {
        setNoticias(
          categoria
            ? (data as Noticia[]).filter(n => n.categoria_id === categoria.id)
            : (data as Noticia[])
        );
      } else {
        setNoticias(MOCK_NOTICIAS.slice(0, limite));
      }
      setLoading(false);
    });
  }, [categoria, limite]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: limite }).map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-xl bg-brand-surface border border-brand-border overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-shimmer-gradient bg-size-[200%_100%] animate-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section>
      {titulo && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {categoria && (
              <span
                className="block w-1 h-6 rounded-full"
                style={{ backgroundColor: categoria.cor_hex }}
              />
            )}
            <h2 className="font-titulo font-bold text-brand-creme text-xl">
              {titulo}
            </h2>
          </div>
          {categoria && (
            <Link
              href={`/categoria/${categoria.slug}`}
              className="flex items-center gap-1 text-xs text-brand-laranja hover:underline font-semibold"
            >
              Ver tudo <ChevronRight size={14} />
            </Link>
          )}
        </div>
      )}

      <motion.div
        variants={gridContainerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {noticias.map((noticia, i) => (
          <NewsCard
            key={noticia.id}
            noticia={noticia}
            destaque={i === 0 && !categoria}
          />
        ))}
      </motion.div>
    </section>
  );
}
