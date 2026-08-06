'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, MessageCircle, Send, MapPin, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import SEOHead from '@/components/ui/SEOHead';
import { pageVariants } from '@/animations/variants';
import { sendWebhookPayload } from '@/lib/webhook';

const MUNICIPIOS = [
  'Adustina', 'Antas', 'BanzaÃª', 'CÃ­cero Dantas', 'CipÃ³',
  'Coronel JoÃ£o SÃ¡', 'Euclides da Cunha', 'FÃ¡tima', 'HeliÃ³polis', 'Jeremoabo',
  'Nova Soure', 'Novo Triunfo', 'Paripiranga', 'Pedro Alexandre', 'Ribeira do Amparo',
  'Ribeira do Pombal', 'Santa BrÃ­gida', 'SÃ­tio do Quinto', 'Outro municÃ­pio'
];

export default function ContatoPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cidade, setCidade] = useState('');
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    const tipoWebhook = assunto.toLowerCase().includes('pauta') ? 'envie_pauta' : 'fale_conosco';

    await sendWebhookPayload(tipoWebhook, {
      nome,
      email,
      cidade,
      assunto,
      mensagem,
    });

    setEnviando(false);
    setEnviado(true);
  };

  return (
    <>
      <SEOHead
        title="Fale Conosco â€” Dia a Dia Nordeste"
        description="Entre em contato com a redaÃ§Ã£o do Dia a Dia Nordeste. Envie sugestÃµes de pauta, fotos, informaÃ§Ãµes e dÃºvidas."
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
          <span className="text-brand-creme">Fale Conosco</span>
        </nav>

        {/* Hero */}
        <div className="rounded-2xl bg-brand-surface border border-brand-border p-8 space-y-3">
          <div className="flex items-center gap-2 text-brand-laranja">
            <Mail size={24} />
            <span className="text-xs font-bold uppercase tracking-wider">Canais Diretos</span>
          </div>
          <h1 className="font-titulo font-black text-brand-creme text-3xl">
            Fale Conosco & Envie Sua Pauta
          </h1>
          <p className="text-brand-muted text-sm leading-relaxed">
            Tem uma notÃ­cia, denÃºncia ou sugestÃ£o de matÃ©ria da sua cidade no SemiÃ¡rido Nordeste II? Fale diretamente com a nossa equipe de redaÃ§Ã£o!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* InformaÃ§Ãµes de Contato Direto */}
          <div className="space-y-4 md:col-span-1">
            <div className="rounded-xl bg-brand-surface border border-brand-border p-5 space-y-3">
              <div className="flex items-center gap-2 text-brand-laranja">
                <MessageCircle size={18} />
                <h3 className="font-titulo font-bold text-brand-creme text-sm">WhatsApp da RedaÃ§Ã£o</h3>
              </div>
              <p className="text-xs text-brand-muted">
                Atendimento rÃ¡pido para envio de pautas, fotos e vÃ­deos.
              </p>
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-[#25D366] py-2.5 text-xs font-bold text-white hover:opacity-90 transition-opacity"
              >
                (00) 00000-0000
              </a>
            </div>

            <div className="rounded-xl bg-brand-surface border border-brand-border p-5 space-y-3">
              <div className="flex items-center gap-2 text-brand-laranja">
                <Mail size={18} />
                <h3 className="font-titulo font-bold text-brand-creme text-sm">E-mail Institucional</h3>
              </div>
              <p className="text-xs text-brand-muted">
                Para comunicados oficiais, assessorias e pautas estruturadas.
              </p>
              <a
                href="mailto:redacao@diaadianordeste.com.br"
                className="text-xs font-semibold text-brand-laranja hover:underline block break-all"
              >
                redacao@diaadianordeste.com.br
              </a>
            </div>

            <div className="rounded-xl bg-brand-surface border border-brand-border p-5 space-y-2">
              <div className="flex items-center gap-2 text-brand-laranja">
                <MapPin size={18} />
                <h3 className="font-titulo font-bold text-brand-creme text-sm">RegiÃ£o de AtuaÃ§Ã£o</h3>
              </div>
              <p className="text-xs text-brand-muted leading-relaxed">
                SemiÃ¡rido Nordeste II â€” Estado da Bahia.
              </p>
            </div>
          </div>

          {/* FormulÃ¡rio de Mensagem */}
          <div className="md:col-span-2 rounded-2xl bg-brand-surface border border-brand-border p-6 space-y-4">
            <h2 className="font-titulo font-bold text-brand-creme text-xl">
              Envie uma Mensagem
            </h2>

            {enviado ? (
              <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-6 text-center space-y-3">
                <CheckCircle2 size={40} className="text-green-400 mx-auto" />
                <h3 className="font-titulo font-bold text-white text-lg">Mensagem Enviada!</h3>
                <p className="text-xs text-brand-muted">
                  Obrigado pelo contato! Nossa equipe de redaÃ§Ã£o analisarÃ¡ sua mensagem em breve.
                </p>
                <button
                  onClick={() => setEnviado(false)}
                  className="text-xs text-brand-laranja hover:underline"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-creme mb-1">Seu Nome *</label>
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={e => setNome(e.target.value)}
                      placeholder="Nome completo"
                      className="w-full rounded-lg bg-brand-grafite border border-brand-border px-3 py-2 text-sm text-brand-creme focus:border-brand-laranja outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-creme mb-1">Seu E-mail *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full rounded-lg bg-brand-grafite border border-brand-border px-3 py-2 text-sm text-brand-creme focus:border-brand-laranja outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-creme mb-1">MunicÃ­pio</label>
                    <select
                      value={cidade}
                      onChange={e => setCidade(e.target.value)}
                      className="w-full rounded-lg bg-brand-grafite border border-brand-border px-3 py-2 text-sm text-brand-creme focus:border-brand-laranja outline-none"
                    >
                      <option value="">Selecione sua cidade...</option>
                      {MUNICIPIOS.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-creme mb-1">Assunto *</label>
                    <input
                      type="text"
                      required
                      value={assunto}
                      onChange={e => setAssunto(e.target.value)}
                      placeholder="SugestÃ£o de pauta, denÃºncia..."
                      className="w-full rounded-lg bg-brand-grafite border border-brand-border px-3 py-2 text-sm text-brand-creme focus:border-brand-laranja outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-creme mb-1">Mensagem *</label>
                  <textarea
                    required
                    rows={4}
                    value={mensagem}
                    onChange={e => setMensagem(e.target.value)}
                    placeholder="Descreva detalhes da pauta ou mensagem..."
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
                      Enviando para a redaÃ§Ã£o...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Enviar mensagem
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

