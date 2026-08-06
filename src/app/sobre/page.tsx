'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Target, Eye, Shield, Users, Sparkles, ChevronRight } from 'lucide-react';
import SEOHead from '@/components/ui/SEOHead';
import { pageVariants } from '@/animations/variants';

const MUNICIPIOS_SEMIARIDO = [
  'Adustina', 'Antas', 'BanzaÃª', 'CÃ­cero Dantas', 'CipÃ³',
  'Coronel JoÃ£o SÃ¡', 'Euclides da Cunha', 'FÃ¡tima', 'HeliÃ³polis', 'Jeremoabo',
  'Nova Soure', 'Novo Triunfo', 'Paripiranga', 'Pedro Alexandre', 'Ribeira do Amparo',
  'Ribeira do Pombal', 'Santa BrÃ­gida', 'SÃ­tio do Quinto'
];

export default function SobrePage() {
  return (
    <>
      <SEOHead
        title="Sobre o Portal â€” Dia a Dia Nordeste"
        description="ConheÃ§a o portal Dia a Dia Nordeste: jornalismo regional focado no territÃ³rio do SemiÃ¡rido Nordeste II da Bahia. Conectando o SemiÃ¡rido."
      />

      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="mx-auto max-w-4xl px-4 py-8 space-y-10"
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-brand-muted">
          <Link href="/" className="hover:text-brand-laranja">InÃ­cio</Link>
          <ChevronRight size={12} />
          <span className="text-brand-creme">Sobre o Portal</span>
        </nav>

        {/* Hero da PÃ¡gina */}
        <div className="rounded-2xl bg-linear-to-r from-brand-surface to-brand-grafite border border-brand-border p-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-laranja/15 text-brand-laranja text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} />
            Conectando o SemiÃ¡rido
          </span>
          <h1 className="font-titulo font-black text-brand-creme text-3xl sm:text-4xl">
            Sobre o Dia a Dia Nordeste
          </h1>
          <p className="text-brand-muted text-base max-w-2xl mx-auto leading-relaxed">
            O veÃ­culo de comunicaÃ§Ã£o independente totalmente dedicado Ã s notÃ­cias, cultura, economia e acontecimentos dos 18 municÃ­pios do territÃ³rio do <strong className="text-brand-creme">SemiÃ¡rido Nordeste II da Bahia</strong>.
          </p>
        </div>

        {/* Nossa MissÃ£o, VisÃ£o e Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-brand-laranja/20 text-brand-laranja flex items-center justify-center">
              <Target size={22} />
            </div>
            <h3 className="font-titulo font-bold text-brand-creme text-lg">Nossa MissÃ£o</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Levar informaÃ§Ã£o Ã¡gil, precisa e imparcial para a populaÃ§Ã£o sertaneja, dando voz Ã s demandas e conquistas do nosso territÃ³rio.
            </p>
          </div>

          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-brand-laranja/20 text-brand-laranja flex items-center justify-center">
              <Eye size={22} />
            </div>
            <h3 className="font-titulo font-bold text-brand-creme text-lg">Nossa VisÃ£o</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Ser o principal portal de referÃªncia jornalÃ­stica do SemiÃ¡rido Baiano, integrando tecnologia, transparÃªncia e valorizaÃ§Ã£o cultural.
            </p>
          </div>

          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-brand-laranja/20 text-brand-laranja flex items-center justify-center">
              <Shield size={22} />
            </div>
            <h3 className="font-titulo font-bold text-brand-creme text-lg">Nossos Valores</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Compromisso com a verdade, independÃªncia editorial, respeito ao leitor, combate Ã s fake news e valorizaÃ§Ã£o da identidade nordestina.
            </p>
          </div>
        </div>

        {/* Cobertura Territorial */}
        <div className="rounded-2xl bg-brand-surface border border-brand-border p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-brand-border pb-4">
            <MapPin size={22} className="text-brand-laranja" />
            <div>
              <h2 className="font-titulo font-bold text-brand-creme text-xl">
                Cobertura no SemiÃ¡rido Nordeste II
              </h2>
              <p className="text-xs text-brand-muted">
                Marcando presenÃ§a diÃ¡ria em 18 municÃ­pios baianos
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {MUNICIPIOS_SEMIARIDO.map(cidade => (
              <div
                key={cidade}
                className="rounded-lg bg-brand-grafite border border-brand-border p-2.5 text-center text-xs font-semibold text-brand-creme hover:border-brand-laranja transition-colors"
              >
                {cidade}
              </div>
            ))}
          </div>
        </div>

        {/* Compromisso com o Leitor */}
        <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-brand-laranja" />
            <h2 className="font-titulo font-bold text-brand-creme text-lg">
              Jornalismo Feito por Quem Vive no Nordeste
            </h2>
          </div>
          <p className="text-sm text-brand-muted leading-relaxed">
            Nossa equipe trabalha com checagem rigorosa de informaÃ§Ãµes para garantir que cada matÃ©ria retrate com precisÃ£o o dia a dia das nossas cidades. Acreditamos que o acesso Ã  informaÃ§Ã£o de qualidade Ã© um direito fundamental para o desenvolvimento social e econÃ´mico do SemiÃ¡rido.
          </p>
        </div>
      </motion.div>
    </>
  );
}

