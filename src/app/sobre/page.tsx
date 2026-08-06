'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Target, Eye, Shield, Users, Sparkles, ChevronRight } from 'lucide-react';
import SEOHead from '@/components/ui/SEOHead';
import { pageVariants } from '@/animations/variants';

const MUNICIPIOS_SEMIARIDO = [
  'Adustina', 'Antas', 'Banzaê', 'Cícero Dantas', 'Cipó',
  'Coronel João Sá', 'Euclides da Cunha', 'Fátima', 'Heliópolis', 'Jeremoabo',
  'Nova Soure', 'Novo Triunfo', 'Paripiranga', 'Pedro Alexandre', 'Ribeira do Amparo',
  'Ribeira do Pombal', 'Santa Brígida', 'Sítio do Quinto'
];

export default function SobrePage() {
  return (
    <>
      <SEOHead
        title="Sobre o Portal — Dia a Dia Nordeste"
        description="Conheça o portal Dia a Dia Nordeste: jornalismo regional focado no território do Semiárido Nordeste II da Bahia. Conectando o Semiárido."
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
          <Link href="/" className="hover:text-brand-laranja">Início</Link>
          <ChevronRight size={12} />
          <span className="text-brand-creme">Sobre o Portal</span>
        </nav>

        {/* Hero da Página */}
        <div className="rounded-2xl bg-linear-to-r from-brand-surface to-brand-grafite border border-brand-border p-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-laranja/15 text-brand-laranja text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} />
            Conectando o Semiárido
          </span>
          <h1 className="font-titulo font-black text-brand-creme text-3xl sm:text-4xl">
            Sobre o Dia a Dia Nordeste
          </h1>
          <p className="text-brand-muted text-base max-w-2xl mx-auto leading-relaxed">
            O veículo de comunicação independente totalmente dedicado às notícias, cultura, economia e acontecimentos dos 18 municípios do território do <strong className="text-brand-creme">Semiárido Nordeste II da Bahia</strong>.
          </p>
        </div>

        {/* Nossa Missão, Visão e Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-brand-laranja/20 text-brand-laranja flex items-center justify-center">
              <Target size={22} />
            </div>
            <h3 className="font-titulo font-bold text-brand-creme text-lg">Nossa Missão</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Levar informação ágil, precisa e imparcial para a população sertaneja, dando voz às demandas e conquistas do nosso território.
            </p>
          </div>

          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-brand-laranja/20 text-brand-laranja flex items-center justify-center">
              <Eye size={22} />
            </div>
            <h3 className="font-titulo font-bold text-brand-creme text-lg">Nossa Visão</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Ser o principal portal de referência jornalística do Semiárido Baiano, integrando tecnologia, transparência e valorização cultural.
            </p>
          </div>

          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-brand-laranja/20 text-brand-laranja flex items-center justify-center">
              <Shield size={22} />
            </div>
            <h3 className="font-titulo font-bold text-brand-creme text-lg">Nossos Valores</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Compromisso com a verdade, independência editorial, respeito ao leitor, combate às fake news e valorização da identidade nordestina.
            </p>
          </div>
        </div>

        {/* Cobertura Territorial */}
        <div className="rounded-2xl bg-brand-surface border border-brand-border p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-brand-border pb-4">
            <MapPin size={22} className="text-brand-laranja" />
            <div>
              <h2 className="font-titulo font-bold text-brand-creme text-xl">
                Cobertura no Semiárido Nordeste II
              </h2>
              <p className="text-xs text-brand-muted">
                Marcando presença diária em 18 municípios baianos
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
            Nossa equipe trabalha com checagem rigorosa de informações para garantir que cada matéria retrate com precisão o dia a dia das nossas cidades. Acreditamos que o acesso à informação de qualidade é um direito fundamental para o desenvolvimento social e econômico do Semiárido.
          </p>
        </div>
      </motion.div>
    </>
  );
}

