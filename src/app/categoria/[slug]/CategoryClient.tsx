'use client';

import { motion } from 'framer-motion';
import CardGrid from '@/components/news/CardGrid';
import Sidebar from '@/components/layout/Sidebar';
import type { Categoria } from '@/types';
import { pageVariants } from '@/animations/variants';

export default function CategoryClient({ 
  slug, 
  categoria 
}: { 
  slug: string; 
  categoria?: Categoria; 
}) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="mx-auto max-w-7xl px-4 py-6"
    >
      {/* Cabeçalho de categoria */}
      <div className="mb-8 pb-4 border-b border-brand-border">
        <div className="flex items-center gap-3 mb-1">
          {categoria && (
            <span
              className="block w-2 h-8 rounded-full"
              style={{ backgroundColor: categoria.cor_hex }}
            />
          )}
          <h1 className="font-titulo font-black text-brand-creme text-3xl">
            {categoria?.nome ?? slug}
          </h1>
        </div>
        <p className="text-brand-muted text-sm ml-5">
          Todas as notícias sobre {categoria?.nome ?? slug} no Nordeste Brasileiro
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <CardGrid
            categoria={categoria}
            limite={12}
          />
        </div>
        <div className="w-full lg:w-72 shrink-0 mt-8 lg:mt-0">
          <div className="sticky top-20">
            <Sidebar />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
