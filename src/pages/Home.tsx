import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/news/Hero';
import CityTabsSection from '@/components/news/CityTabsSection';
import WebStoriesSection from '@/components/stories/WebStoriesSection';
import Sidebar from '@/components/layout/Sidebar';
import SEOHead from '@/components/ui/SEOHead';
import { BannerPlaceholder } from '@/components/ui/Banner';
import { pageVariants } from '@/animations/variants';

export default function Home() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <>
      <SEOHead />

      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="mx-auto max-w-7xl px-4 py-6 space-y-10"
      >
        {/* ── 1ª SEÇÃO: HERO DE DESTAQUES (Apenas matérias marcadas com destaque = true pelo admin) ── */}
        <section aria-label="Notícias em Destaque" id="destaques">
          <Hero />
        </section>

        {/* Banner publicitário de topo */}
        <BannerPlaceholder posicao="header" />

        {/* Layout Principal: Conteúdo + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Coluna principal */}
          <div className="flex-1 min-w-0 space-y-10">

            {/* ── 2ª SEÇÃO: SEÇÃO SECUNDÁRIA COM ABAS DOS MUNICÍPIOS DO SEMIÁRIDO NORDESTE II ── */}
            <div id="municipios">
              <CityTabsSection />
            </div>

            {/* ── 3ª SEÇÃO: WEB STORIES POR CATEGORIAS (Saúde, Educação, Esportes, Cultura, Economia, Tecnologia) ── */}
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
    </>
  );
}
