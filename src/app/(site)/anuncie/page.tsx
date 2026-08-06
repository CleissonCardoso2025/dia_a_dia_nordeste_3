'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Megaphone, BarChart3, Target, Send, CheckCircle2, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import SEOHead from '@/components/ui/SEOHead';
import { pageVariants } from '@/animations/variants';
import { sendWebhookPayload } from '@/lib/webhook';

export default function AnunciePage() {
  const [empresa, setEmpresa] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [formato, setFormato] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    await sendWebhookPayload('anuncie_conosco', {
      empresa,
      responsavel,
      email,
      telefone,
      formato,
      mensagem,
    });

    setEnviando(false);
    setEnviado(true);
  };

  return (
    <>
      <SEOHead
        title="Anuncie no Portal — Dia a Dia Nordeste"
        description="Divulgue sua empresa ou marca para milhares de leitores no território do Semiárido Nordeste II da Bahia. Mídia kit e soluções publicitárias."
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
          <span className="text-brand-creme">Anuncie no Portal</span>
        </nav>

        {/* Hero Banner */}
        <div className="rounded-2xl bg-linear-to-r from-brand-surface to-brand-grafite border border-brand-border p-8 space-y-4 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-laranja/15 text-brand-laranja text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} />
            Mídia & Publicidade Regional
          </span>
          <h1 className="font-titulo font-black text-brand-creme text-3xl sm:text-4xl">
            Conecte sua marca a 18 municípios do Semiárido Baiano
          </h1>
          <p className="text-brand-muted text-sm max-w-2xl mx-auto leading-relaxed">
            Alcance diariamente milhares de leitores qualificados nos municípios de Ribeira do Pombal, Euclides da Cunha, Jeremoabo, Cícero Dantas e toda a região.
          </p>
        </div>

        {/* Vantagens de Anunciar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-brand-laranja/20 text-brand-laranja flex items-center justify-center">
              <Target size={22} />
            </div>
            <h3 className="font-titulo font-bold text-brand-creme text-lg">Público Hiperlocalizado</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Audiência engajada e focada diretamente nos moradores e consumidores do Semiárido Nordeste II.
            </p>
          </div>

          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-brand-laranja/20 text-brand-laranja flex items-center justify-center">
              <Megaphone size={22} />
            </div>
            <h3 className="font-titulo font-bold text-brand-creme text-lg">Múltiplos Formatos</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Banners de alta visibilidade (Header, Sidebar 300x300), Web Stories de marca e matérias patrocinadas.
            </p>
          </div>

          <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-brand-laranja/20 text-brand-laranja flex items-center justify-center">
              <BarChart3 size={22} />
            </div>
            <h3 className="font-titulo font-bold text-brand-creme text-lg">Métricas e Transparência</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Relatórios de impressões e cliques para você acompanhar o retorno real do seu investimento publicitário.
            </p>
          </div>
        </div>

        {/* Formatos Publicitários */}
        <div className="rounded-2xl bg-brand-surface border border-brand-border p-6 space-y-6">
          <h2 className="font-titulo font-bold text-brand-creme text-xl border-b border-brand-border pb-4">
            Formatos Publicitários Disponíveis
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-brand-grafite border border-brand-border p-4 space-y-2">
              <span className="text-xs font-bold text-brand-laranja uppercase">Banner Topo (Header)</span>
              <h4 className="font-titulo font-bold text-brand-creme text-sm">Super Banner 728x90 / Responsivo</h4>
              <p className="text-xs text-brand-muted">Exibição no topo de todas as páginas do portal com impacto visual imediato.</p>
            </div>

            <div className="rounded-xl bg-brand-grafite border border-brand-border p-4 space-y-2">
              <span className="text-xs font-bold text-brand-laranja uppercase">Banner Lateral (Sidebar)</span>
              <h4 className="font-titulo font-bold text-brand-creme text-sm">Quadrado 300x300 / Médio</h4>
              <p className="text-xs text-brand-muted">Posicionado na barra lateral ao lado das matérias mais lidas e grupos de WhatsApp.</p>
            </div>

            <div className="rounded-xl bg-brand-grafite border border-brand-border p-4 space-y-2">
              <span className="text-xs font-bold text-brand-laranja uppercase">Publieditorial / Matéria Patrocinada</span>
              <h4 className="font-titulo font-bold text-brand-creme text-sm">Artigo Exclusivo no Portal</h4>
              <p className="text-xs text-brand-muted">Texto dedicado sobre sua empresa, produto ou serviço publicado nas abas das cidades.</p>
            </div>

            <div className="rounded-xl bg-brand-grafite border border-brand-border p-4 space-y-2">
              <span className="text-xs font-bold text-brand-laranja uppercase">Web Stories Patrocinados</span>
              <h4 className="font-titulo font-bold text-brand-creme text-sm">Story Visual 9:16 Interativo</h4>
              <p className="text-xs text-brand-muted">Destaque dinâmico na seção de Web Stories do portal com link direto de conversão.</p>
            </div>
          </div>
        </div>

        {/* Formulário de Anúncio / Proposta Comercial */}
        <div className="rounded-2xl bg-brand-surface border border-brand-border p-6 space-y-4">
          <h2 className="font-titulo font-bold text-brand-creme text-xl">
            Solicite uma Proposta ou Mídia Kit
          </h2>

          {enviado ? (
            <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-6 text-center space-y-3">
              <CheckCircle2 size={40} className="text-green-400 mx-auto" />
              <h3 className="font-titulo font-bold text-white text-lg">Solicitação Enviada!</h3>
              <p className="text-xs text-brand-muted">
                Nossa equipe comercial entrará em contato em até 24 horas úteis para apresentar o Mídia Kit completo.
              </p>
              <button
                onClick={() => setEnviado(false)}
                className="text-xs text-brand-laranja hover:underline"
              >
                Enviar nova solicitação
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-creme mb-1">Nome da Empresa / Marca *</label>
                  <input
                    type="text"
                    required
                    value={empresa}
                    onChange={e => setEmpresa(e.target.value)}
                    placeholder="Sua empresa ou órgão"
                    className="w-full rounded-lg bg-brand-grafite border border-brand-border px-3 py-2 text-sm text-brand-creme focus:border-brand-laranja outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-creme mb-1">Nome do Responsável *</label>
                  <input
                    type="text"
                    required
                    value={responsavel}
                    onChange={e => setResponsavel(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full rounded-lg bg-brand-grafite border border-brand-border px-3 py-2 text-sm text-brand-creme focus:border-brand-laranja outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-creme mb-1">E-mail Comercial *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="comercial@suaempresa.com"
                    className="w-full rounded-lg bg-brand-grafite border border-brand-border px-3 py-2 text-sm text-brand-creme focus:border-brand-laranja outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-creme mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={telefone}
                    onChange={e => setTelefone(e.target.value)}
                    placeholder="(75) 90000-0000"
                    className="w-full rounded-lg bg-brand-grafite border border-brand-border px-3 py-2 text-sm text-brand-creme focus:border-brand-laranja outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-creme mb-1">Formato Desejado</label>
                  <select
                    value={formato}
                    onChange={e => setFormato(e.target.value)}
                    className="w-full rounded-lg bg-brand-grafite border border-brand-border px-3 py-2 text-sm text-brand-creme focus:border-brand-laranja outline-none"
                  >
                    <option value="">Selecione...</option>
                    <option value="banner-topo">Banner Topo</option>
                    <option value="banner-sidebar">Banner Sidebar (300x300)</option>
                    <option value="publieditorial">Publieditorial</option>
                    <option value="web-stories">Web Stories</option>
                    <option value="pacote-completo">Pacote Mensal Completo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-creme mb-1">Detalhes do Projeto ou Dúvidas</label>
                <textarea
                  rows={3}
                  value={mensagem}
                  onChange={e => setMensagem(e.target.value)}
                  placeholder="Conte-nos brevemente o objetivo da campanha..."
                  className="w-full rounded-lg bg-brand-grafite border border-brand-border px-3 py-2 text-sm text-brand-creme focus:border-brand-laranja outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-full bg-brand-laranja px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-laranja-dark transition-colors disabled:opacity-60 cursor-pointer"
              >
                {enviando ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Enviando solicitação...
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Solicitar Proposta Comercial
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </>
  );
}

