import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, ChevronRight } from 'lucide-react';
import SEOHead from '@/components/ui/SEOHead';
import { pageVariants } from '@/animations/variants';

export default function PoliticaEditorialPage() {
  return (
    <>
      <SEOHead
        title="Política Editorial — Dia a Dia Nordeste"
        description="Diretrizes éticas, compromisso com a verdade, checagem de fatos e conduta jornalística do portal Dia a Dia Nordeste."
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
          <Link to="/" className="hover:text-brand-laranja">Início</Link>
          <ChevronRight size={12} />
          <span className="text-brand-creme">Política Editorial</span>
        </nav>

        {/* Hero */}
        <div className="rounded-2xl bg-brand-surface border border-brand-border p-8 space-y-3">
          <div className="flex items-center gap-2 text-brand-laranja">
            <ShieldCheck size={24} />
            <span className="text-xs font-bold uppercase tracking-wider">Código de Ética</span>
          </div>
          <h1 className="font-titulo font-black text-brand-creme text-3xl">
            Política Editorial
          </h1>
          <p className="text-brand-muted text-sm leading-relaxed">
            O portal <strong className="text-brand-creme">Dia a Dia Nordeste</strong> pauta sua atuação na independência, na precisão dos fatos e no respeito intransigente ao público leitor do Semiárido Baiano.
          </p>
        </div>

        {/* Pilares da Atuação */}
        <div className="space-y-6">
          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-creme font-titulo font-bold text-lg">
              <CheckCircle2 size={20} className="text-brand-laranja shrink-0" />
              1. Veracidade e Checagem de Fatos (Fact-Checking)
            </div>
            <p className="text-xs text-brand-muted leading-relaxed pl-7">
              Toda notícia publicada passa por processo prévio de verificação e cruzamento de fontes oficiais. Não publicamos rumores, boatos ou especulações sem confirmação documental ou apuração direta de campo.
            </p>
          </div>

          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-creme font-titulo font-bold text-lg">
              <CheckCircle2 size={20} className="text-brand-laranja shrink-0" />
              2. Independência Partidária e Isenção
            </div>
            <p className="text-xs text-brand-muted leading-relaxed pl-7">
              O portal não mantém vínculos subordinados a partidos políticos, coligações ou grupos de interesse econômico. A cobertura política é pautada pelo interesse público e pela equidade de tratamento entre os atores envolvidos.
            </p>
          </div>

          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-creme font-titulo font-bold text-lg">
              <CheckCircle2 size={20} className="text-brand-laranja shrink-0" />
              3. Direito de Resposta e Correções
            </div>
            <p className="text-xs text-brand-muted leading-relaxed pl-7">
              Garantimos o direito de resposta a pessoas ou entidades citadas em nossas matérias. Eventuais incorreções fáticas serão corrigidas com transparência e rapidez no próprio texto com aviso ostensivo ao leitor.
            </p>
          </div>

          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-creme font-titulo font-bold text-lg">
              <AlertTriangle size={20} className="text-brand-laranja shrink-0" />
              4. Transparência na Publicidade
            </div>
            <p className="text-xs text-brand-muted leading-relaxed pl-7">
              Conteúdos patrocinados, publieditoriais e banners de anunciantes são claramente identificados como "Publicidade" ou "Patrocinado", mantendo separação estrita da redação jornalística.
            </p>
          </div>

          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-creme font-titulo font-bold text-lg">
              <FileText size={20} className="text-brand-laranja shrink-0" />
              5. Proteção às Fontes
            </div>
            <p className="text-xs text-brand-muted leading-relaxed pl-7">
              Respeitamos o sigilo da fonte garantido pela Constituição Federal quando a segurança ou integridade do informante exigir sigilo sob relevante interesse público.
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
