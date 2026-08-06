'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FileText, Copyright, Scale, ChevronRight } from 'lucide-react';
import SEOHead from '@/components/ui/SEOHead';
import { pageVariants } from '@/animations/variants';

export default function TermosPage() {
  return (
    <>
      <SEOHead
        title="Termos de Uso — Dia a Dia Nordeste"
        description="Termos e condições de uso, direitos autorais e regras de navegação do portal Dia a Dia Nordeste."
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
          <Link href="/" className="hover:text-brand-laranja">Início</Link>
          <ChevronRight size={12} />
          <span className="text-brand-creme">Termos de Uso</span>
        </nav>

        {/* Hero */}
        <div className="rounded-2xl bg-brand-surface border border-brand-border p-8 space-y-3">
          <div className="flex items-center gap-2 text-brand-laranja">
            <FileText size={24} />
            <span className="text-xs font-bold uppercase tracking-wider">Regras de Acesso</span>
          </div>
          <h1 className="font-titulo font-black text-brand-creme text-3xl">
            Termos de Uso
          </h1>
          <p className="text-brand-muted text-sm leading-relaxed">
            Ao acessar e utilizar o portal <strong className="text-brand-creme">Dia a Dia Nordeste</strong>, você concorda expressamente com os termos e condições descritos abaixo.
          </p>
        </div>

        {/* Cláusulas */}
        <div className="space-y-6">
          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-creme font-titulo font-bold text-lg">
              <Copyright size={20} className="text-brand-laranja shrink-0" />
              1. Propriedade Intelectual
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">
              Todo o conteúdo publicado neste portal — incluindo textos, fotografias, artes, logotipos e layout — é protegido pela legislação de direitos autorais. É proibida a reprodução total ou parcial sem autorização prévia por escrito ou citação expressa com link ativo para a fonte original.
            </p>
          </div>

          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-creme font-titulo font-bold text-lg">
              <Scale size={20} className="text-brand-laranja shrink-0" />
              2. Responsabilidade sobre Links Externos
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">
              O portal pode conter links para sites de terceiros ou parceiros comerciais. O Dia a Dia Nordeste não se responsabiliza pelo conteúdo, políticas de privacidade ou práticas de portais externos.
            </p>
          </div>

          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <h3 className="font-titulo font-bold text-brand-creme text-lg">
              3. Modificações nos Termos
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Reservamo-nos o direito de alterar estes Termos de Uso a qualquer momento para adequação legislativa ou melhoria dos serviços. Recomendamos a consulta periódica desta página.
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

