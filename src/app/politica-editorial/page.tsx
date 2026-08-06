'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, ChevronRight } from 'lucide-react';
import SEOHead from '@/components/ui/SEOHead';
import { pageVariants } from '@/animations/variants';

export default function PoliticaEditorialPage() {
  return (
    <>
      <SEOHead
        title="PolÃ­tica Editorial â€” Dia a Dia Nordeste"
        description="Diretrizes Ã©ticas, compromisso com a verdade, checagem de fatos e conduta jornalÃ­stica do portal Dia a Dia Nordeste."
      />

      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="mx-auto max-w-4xl px-4 py-8 space-y-8"
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-brand-muted">
          <Link href="/" className="hover:text-brand-laranja">InÃ­cio</Link>
          <ChevronRight size={12} />
          <span className="text-brand-creme">PolÃ­tica Editorial</span>
        </nav>

        {/* Hero */}
        <div className="rounded-2xl bg-brand-surface border border-brand-border p-8 space-y-3">
          <div className="flex items-center gap-2 text-brand-laranja">
            <ShieldCheck size={24} />
            <span className="text-xs font-bold uppercase tracking-wider">CÃ³digo de Ã‰tica</span>
          </div>
          <h1 className="font-titulo font-black text-brand-creme text-3xl">
            PolÃ­tica Editorial
          </h1>
          <p className="text-brand-muted text-sm leading-relaxed">
            O portal <strong className="text-brand-creme">Dia a Dia Nordeste</strong> pauta sua atuaÃ§Ã£o na independÃªncia, na precisÃ£o dos fatos e no respeito intransigente ao pÃºblico leitor do SemiÃ¡rido Baiano.
          </p>
        </div>

        {/* Pilares da AtuaÃ§Ã£o */}
        <div className="space-y-6">
          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-creme font-titulo font-bold text-lg">
              <CheckCircle2 size={20} className="text-brand-laranja shrink-0" />
              1. Veracidade e Checagem de Fatos (Fact-Checking)
            </div>
            <p className="text-xs text-brand-muted leading-relaxed pl-7">
              Toda notÃ­cia publicada passa por processo prÃ©vio de verificaÃ§Ã£o e cruzamento de fontes oficiais. NÃ£o publicamos rumores, boatos ou especulaÃ§Ãµes sem confirmaÃ§Ã£o documental ou apuraÃ§Ã£o direta de campo.
            </p>
          </div>

          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-creme font-titulo font-bold text-lg">
              <CheckCircle2 size={20} className="text-brand-laranja shrink-0" />
              2. IndependÃªncia PartidÃ¡ria e IsenÃ§Ã£o
            </div>
            <p className="text-xs text-brand-muted leading-relaxed pl-7">
              O portal nÃ£o mantÃ©m vÃ­nculos subordinados a partidos polÃ­ticos, coligaÃ§Ãµes ou grupos de interesse econÃ´mico. A cobertura polÃ­tica Ã© pautada pelo interesse pÃºblico e pela equidade de tratamento entre os atores envolvidos.
            </p>
          </div>

          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-creme font-titulo font-bold text-lg">
              <CheckCircle2 size={20} className="text-brand-laranja shrink-0" />
              3. Direito de Resposta e CorreÃ§Ãµes
            </div>
            <p className="text-xs text-brand-muted leading-relaxed pl-7">
              Garantimos o direito de resposta a pessoas ou entidades citadas em nossas matÃ©rias. Eventuais incorreÃ§Ãµes fÃ¡ticas serÃ£o corrigidas com transparÃªncia e rapidez no prÃ³prio texto com aviso ostensivo ao leitor.
            </p>
          </div>

          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-creme font-titulo font-bold text-lg">
              <AlertTriangle size={20} className="text-brand-laranja shrink-0" />
              4. TransparÃªncia na Publicidade
            </div>
            <p className="text-xs text-brand-muted leading-relaxed pl-7">
              ConteÃºdos patrocinados, publieditoriais e banners de anunciantes sÃ£o claramente identificados como "Publicidade" ou "Patrocinado", mantendo separaÃ§Ã£o estrita da redaÃ§Ã£o jornalÃ­stica.
            </p>
          </div>

          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-creme font-titulo font-bold text-lg">
              <FileText size={20} className="text-brand-laranja shrink-0" />
              5. ProteÃ§Ã£o Ã s Fontes
            </div>
            <p className="text-xs text-brand-muted leading-relaxed pl-7">
              Respeitamos o sigilo da fonte garantido pela ConstituiÃ§Ã£o Federal quando a seguranÃ§a ou integridade do informante exigir sigilo sob relevante interesse pÃºblico.
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

