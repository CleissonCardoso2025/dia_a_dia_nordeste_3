'use client';

import { motion } from 'framer-motion';
import Hero from '@/components/news/Hero';
import CityTabsSection from '@/components/news/CityTabsSection';
import WebStoriesSection from '@/components/stories/WebStoriesSection';
import Sidebar from '@/components/layout/Sidebar';
import { BannerPlaceholder } from '@/components/ui/Banner';
import { pageVariants } from '@/animations/variants';

export default function Home() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="mx-auto max-w-7xl px-4 py-6 space-y-10"
    >
      <h1 className="sr-only">Dia a Dia Nordeste - Portal de Notícias</h1>

      {/* ── 1ª SEÇÍO: HERO DE DESTAQUES ── */}
      <section aria-label="Notícias em Destaque" id="destaques">
        <Hero />
      </section>

      {/* Banner publicitário de topo */}
      <BannerPlaceholder posicao="header" />

      {/* Layout Principal: Conteúdo + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Coluna principal */}
        <div className="flex-1 min-w-0 space-y-10">
          
          {/* ── 2ª SEÇÍO: SEÇÍO SECUNDÁRIA COM ABAS DOS MUNICÍPIOS DO SEMIÁRIDO NORDESTE II ── */}
          <div id="municipios">
            <CityTabsSection />
          </div>

          {/* ── 3ª SEÇÍO: WEB STORIES POR CATEGORIAS ── */}
          <div id="stories">
            <WebStoriesSection />
          </div>

          {/* Banner publicitário de meio */}
          <BannerPlaceholder posicao="middle" />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-72 shrink-0 mt-8 lg:mt-0" id="mais-acessadas">
          <div className="sticky top-20">
            <Sidebar />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
