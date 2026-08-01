import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lock, Eye, Database, ShieldAlert, ChevronRight } from 'lucide-react';
import SEOHead from '@/components/ui/SEOHead';
import { pageVariants } from '@/animations/variants';

export default function PrivacidadePage() {
  return (
    <>
      <SEOHead
        title="Política de Privacidade — Dia a Dia Nordeste"
        description="Informações sobre privacidade, cookies e conformidade com a LGPD (Lei Geral de Proteção de Dados) no Dia a Dia Nordeste."
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
          <span className="text-brand-creme">Política de Privacidade</span>
        </nav>

        {/* Hero */}
        <div className="rounded-2xl bg-brand-surface border border-brand-border p-8 space-y-3">
          <div className="flex items-center gap-2 text-brand-laranja">
            <Lock size={24} />
            <span className="text-xs font-bold uppercase tracking-wider">Conformidade LGPD</span>
          </div>
          <h1 className="font-titulo font-black text-brand-creme text-3xl">
            Política de Privacidade
          </h1>
          <p className="text-brand-muted text-sm leading-relaxed">
            Esta política explica como o portal <strong className="text-brand-creme">Dia a Dia Nordeste</strong> coleta, utiliza e protege os seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
          </p>
        </div>

        {/* Seções da Política */}
        <div className="space-y-6">
          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-creme font-titulo font-bold text-lg">
              <Eye size={20} className="text-brand-laranja shrink-0" />
              1. Coleta de Dados
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">
              Coletamos informações estatísticas anônimas de navegação (ex: visualizações de página, tipo de navegador, localização aproximada por cidade) para aprimorar a experiência de leitura. Dados pessoais como nome e e-mail só são armazenados quando você preenche voluntariamente nossos formulários de contato ou pauta.
            </p>
          </div>

          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-creme font-titulo font-bold text-lg">
              <Database size={20} className="text-brand-laranja shrink-0" />
              2. Uso de Cookies
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">
              Utilizamos cookies estritamente necessários e analíticos para lembrar preferências de navegação e gerar relatórios agregados. Você pode desativar o uso de cookies a qualquer momento nas configurações do seu navegador.
            </p>
          </div>

          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-creme font-titulo font-bold text-lg">
              <ShieldAlert size={20} className="text-brand-laranja shrink-0" />
              3. Seus Direitos (LGPD)
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">
              De acordo com a LGPD, você tem o direito de solicitar a confirmação do tratamento de seus dados, acesso aos dados armazenados, correção de dados incompletos ou a eliminação dos seus dados cadastrais de nossos sistemas.
            </p>
          </div>

          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <h3 className="font-titulo font-bold text-brand-creme text-lg">
              4. Contato do Encarregado de Dados (DPO)
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Para exercer seus direitos ou esclarecer dúvidas sobre tratamento de dados, envie uma mensagem para{' '}
              <a href="mailto:redacao@diaadianordeste.com.br" className="text-brand-laranja underline">
                redacao@diaadianordeste.com.br
              </a>.
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
