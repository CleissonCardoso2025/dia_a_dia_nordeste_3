import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { FileText, Eye, PlusCircle, LogOut, TrendingUp } from 'lucide-react';
import type { Noticia } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Tv, QrCode, ExternalLink, Copy, Check, Settings, Monitor, Webhook, Zap, Loader2, Megaphone } from 'lucide-react';
import { getWebhookUrl, setWebhookUrl, sendWebhookPayload, getNewsWebhookUrl, setNewsWebhookUrl, sendNewsWebhookPayload } from '@/lib/webhook';
import BannerManagerModal from '@/components/admin/BannerManagerModal';

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [noticias, setNoticias] = useState<Partial<Noticia>[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

  // Configurações do Digital Signage (Modo TV)
  const savedConfigRaw = localStorage.getItem('tv_signage_config');
  const savedConfig = savedConfigRaw ? JSON.parse(savedConfigRaw) : {};

  const [tempoPorSlide, setTempoPorSlide] = useState<number>(savedConfig.tempoPorSlide ?? 10);
  const [mostrarQrCode, setMostrarQrCode] = useState<boolean>(savedConfig.mostrarQrCode ?? true);
  const [fonteNoticias, setFonteNoticias] = useState<string>(savedConfig.fonteNoticias ?? 'destaques');
  const [copiadoSlug, setCopiadoSlug] = useState<string | null>(null);
  const [salvoSucesso, setSalvoSucesso] = useState(false);

  // Estado dos Webhooks n8n (Formulários + Notícias/Redes)
  const [webhookUrlInput, setWebhookUrlInput] = useState(getWebhookUrl());
  const [newsWebhookUrlInput, setNewsWebhookUrlInput] = useState(getNewsWebhookUrl());
  const [webhookSalvoSucesso, setWebhookSalvoSucesso] = useState(false);
  const [testandoWebhook, setTestandoWebhook] = useState(false);
  const [webhookResultadoTeste, setWebhookResultadoTeste] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    supabase
      .from('noticias')
      .select('id,titulo,slug,data_publicacao,views,categorias(nome,cor_hex)')
      .order('data_publicacao', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setNoticias(data as unknown as Partial<Noticia>[]);
        setLoading(false);
      });
  }, []);

  const salvarConfiguracoesTV = () => {
    const config = { tempoPorSlide, mostrarQrCode, fonteNoticias };
    localStorage.setItem('tv_signage_config', JSON.stringify(config));
    setSalvoSucesso(true);
    setTimeout(() => setSalvoSucesso(false), 3000);
  };

  const copiarLinkTV = (caminho: string, id: string) => {
    const fullUrl = `${window.location.origin}${caminho}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiadoSlug(id);
    setTimeout(() => setCopiadoSlug(null), 2500);
  };

  const salvarWebhook = () => {
    setWebhookUrl(webhookUrlInput);
    setNewsWebhookUrl(newsWebhookUrlInput);
    setWebhookSalvoSucesso(true);
    setTimeout(() => setWebhookSalvoSucesso(false), 3000);
  };

  const testarWebhook = async () => {
    if (!webhookUrlInput.trim()) {
      alert('Por favor, informe a URL do Webhook de Formulários do n8n.');
      return;
    }

    setWebhookUrl(webhookUrlInput);
    setTestandoWebhook(true);
    setWebhookResultadoTeste(null);

    const res = await sendWebhookPayload('teste', {
      mensagem: 'Teste de integração de formulários enviado pelo Painel Admin',
      data_teste: new Date().toLocaleString('pt-BR'),
      status: 'sucesso',
    });

    setTestandoWebhook(false);
    if (res.success) {
      setWebhookResultadoTeste({ ok: true, msg: 'Payload de teste de formulários disparado com sucesso para o n8n!' });
    } else {
      setWebhookResultadoTeste({ ok: false, msg: `Erro: ${res.error || 'Falha de conexão com o n8n'}` });
    }
  };

  const testarNewsWebhook = async () => {
    const targetUrl = newsWebhookUrlInput.trim() || webhookUrlInput.trim();
    if (!targetUrl) {
      alert('Por favor, informe a URL do Webhook de Notícias do n8n.');
      return;
    }

    setNewsWebhookUrl(targetUrl);
    setTestandoWebhook(true);
    setWebhookResultadoTeste(null);

    const res = await sendNewsWebhookPayload(
      ['instagram', 'x', 'whatsapp', 'facebook'],
      {
        manchete: 'Grande Seca Impacta Mais de 10 Milhões no Nordeste',
        resumo: 'Especialistas alertam para o maior período de estiagem dos últimos anos...',
        corpo: '<p>Matéria completa de teste de publicação de notícia para redes sociais...</p>',
        slug: 'seca-impacta-nordeste-teste',
        url_materia: `${window.location.origin}/noticia/ambiente/seca-impacta-nordeste-teste`,
        categoria: 'Meio Ambiente',
        imagem_url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1400&q=80',
        data_publicacao: new Date().toISOString(),
      },
      'teste_noticia'
    );

    setTestandoWebhook(false);
    if (res.success) {
      setWebhookResultadoTeste({ ok: true, msg: 'Payload de TESTE DE NOTÍCIA disparado com sucesso para o n8n!' });
    } else {
      setWebhookResultadoTeste({ ok: false, msg: `Erro no Webhook de Notícia: ${res.error || 'Falha de conexão'}` });
    }
  };

  const testarBannerExpiradoWebhook = async () => {
    if (!webhookUrlInput.trim()) {
      alert('Por favor, informe a URL do Webhook do n8n.');
      return;
    }

    setWebhookUrl(webhookUrlInput);
    setTestandoWebhook(true);
    setWebhookResultadoTeste(null);

    const res = await sendWebhookPayload('banner_expirado', {
      id: 'sample-banner-uuid-12345',
      titulo: 'Campanha Supermercado Arco-Íris - Ofertas de Verão',
      anunciante: 'Grupo Arco-Íris Ltda',
      posicao: 'sidebar',
      link_destino: 'https://supermercadoarcoiris.com.br/promocao',
      data_inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      data_fim: new Date().toISOString(),
      visualizacoes: 14850,
      cliques: 842,
      ctr: '5.67%',
      mensagem: 'ATENÇÃO: O banner publicitário "Campanha Supermercado Arco-Íris - Ofertas de Verão" atingiu a data de término e foi removido da exibição pública.'
    });

    setTestandoWebhook(false);
    if (res.success) {
      setWebhookResultadoTeste({ ok: true, msg: 'Payload de TESTE DE BANNER EXPIRADO disparado com sucesso para o n8n!' });
    } else {
      setWebhookResultadoTeste({ ok: false, msg: `Erro ao testar Webhook: ${res.error || 'Falha de conexão'}` });
    }
  };

  const testarBannerPreExpiracaoWebhook = async () => {
    if (!webhookUrlInput.trim()) {
      alert('Por favor, informe a URL do Webhook do n8n.');
      return;
    }

    setWebhookUrl(webhookUrlInput);
    setTestandoWebhook(true);
    setWebhookResultadoTeste(null);

    const dataFimAmanha = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const res = await sendWebhookPayload('banner_pre_expiracao', {
      id: 'sample-banner-uuid-99999',
      titulo: 'Campanha Concessionária - Ofertas Especiais',
      anunciante: 'Auto Bahia Veículos',
      posicao: 'header',
      link_destino: 'https://autobahia.com.br',
      data_inicio: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      data_fim: dataFimAmanha,
      horas_restantes: 24,
      visualizacoes: 28400,
      cliques: 1250,
      ctr: '4.40%',
      mensagem: '⚠️ AVISO PRÉVIO DE VEICULAÇÃO: O banner "Campanha Concessionária - Ofertas Especiais" do cliente Auto Bahia Veículos vencerá em 24h. Acesse o portal para tirar a prova de veiculação (print) antes que saia do ar.'
    });

    setTestandoWebhook(false);
    if (res.success) {
      setWebhookResultadoTeste({ ok: true, msg: 'Payload de TESTE PRÉVIO (24h ANTES DO VENCIMENTO) disparado com sucesso para o n8n!' });
    } else {
      setWebhookResultadoTeste({ ok: false, msg: `Erro ao testar Webhook: ${res.error || 'Falha de conexão'}` });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) return;
    await supabase.from('noticias').delete().eq('id', id);
    setNoticias(prev => prev.filter(n => n.id !== id));
  };

  const canaisTV = [
    { nome: '📺 Geral / Destaques Principal', slug: 'geral', path: '/tv', cor: '#D9491F' },
    { nome: '⚽ Esporte', slug: 'esportes', path: '/tv/esportes', cor: '#059669' },
    { nome: '🏥 Saúde', slug: 'saude', path: '/tv/saude', cor: '#0284C7' },
    { nome: '💼 Economia', slug: 'economia', path: '/tv/economia', cor: '#1E5C4E' },
    { nome: '🎭 Cultura', slug: 'cultura', path: '/tv/cultura', cor: '#8B5CF6' },
    { nome: '🎓 Educação', slug: 'educacao', path: '/tv/educacao', cor: '#D97706' },
    { nome: '💻 Tecnologia', slug: 'tecnologia', path: '/tv/tecnologia', cor: '#6366F1' },
  ];

  return (
    <div className="min-h-screen bg-brand-grafite text-brand-creme">
      {/* Header admin */}
      <header className="bg-brand-surface border-b border-brand-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/logo/logo_%20diaadia.png"
            alt="Dia a Dia Nordeste"
            className="h-8 w-auto object-contain"
          />
          <span className="font-titulo font-bold text-brand-creme">Painel Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xs text-brand-muted hover:text-brand-creme transition-colors">Ver site</Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-brand-muted hover:text-red-400 transition-colors"
          >
            <LogOut size={14} />
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total de Notícias', value: noticias.length, icon: <FileText size={20} />, color: '#D9491F' },
            { label: 'Visualizações totais', value: noticias.reduce((acc, n) => acc + (n.views ?? 0), 0).toLocaleString('pt-BR'), icon: <Eye size={20} />, color: '#1E5C4E' },
            { label: 'Mais acessada hoje', value: '—', icon: <TrendingUp size={20} />, color: '#8B5CF6' },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl bg-brand-surface border border-brand-border p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: stat.color + '20', color: stat.color }}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs text-brand-muted">{stat.label}</p>
                <p className="font-titulo font-bold text-brand-creme text-lg">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── SEÇÃO DIGITAL SIGNAGE / MODO TV ── */}
        <section className="rounded-2xl bg-brand-surface border border-brand-border p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-laranja/15 text-brand-laranja">
                <Tv size={22} />
              </div>
              <div>
                <h2 className="font-titulo font-bold text-brand-creme text-lg">
                  Digital Signage / Modo TV & Canais
                </h2>
                <p className="text-xs text-brand-muted">
                  Configure o modo de exibição contínua para Smart TVs, recepções e monitores da instituição
                </p>
              </div>
            </div>

            <Link
              to="/tv"
              target="_blank"
              className="flex items-center gap-2 rounded-full bg-brand-laranja px-4 py-2 text-xs font-bold text-white hover:bg-brand-laranja-dark transition-colors shadow-md"
            >
              <Monitor size={15} />
              Abrir TV em Tela Cheia →
            </Link>
          </div>

          {/* Form de Configurações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-brand-grafite/50 p-4 rounded-xl border border-brand-border">
            {/* Config 1: Tempo */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-creme flex items-center gap-1.5">
                <Settings size={14} className="text-brand-laranja" />
                1. Tempo por Notícia
              </label>
              <select
                value={tempoPorSlide}
                onChange={(e) => setTempoPorSlide(Number(e.target.value))}
                className="w-full rounded-lg bg-brand-surface border border-brand-border px-3 py-2 text-xs font-medium text-brand-creme focus:border-brand-laranja outline-none"
              >
                <option value={5}>5 Segundos (Rápido)</option>
                <option value={8}>8 Segundos</option>
                <option value={10}>10 Segundos (Recomendado)</option>
                <option value={15}>15 Segundos</option>
                <option value={20}>20 Segundos</option>
                <option value={30}>30 Segundos (Leitura longa)</option>
              </select>
            </div>

            {/* Config 2: QR Code */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-creme flex items-center gap-1.5">
                <QrCode size={14} className="text-brand-laranja" />
                2. Exibir QR Code na TV
              </label>
              <select
                value={mostrarQrCode ? 'true' : 'false'}
                onChange={(e) => setMostrarQrCode(e.target.value === 'true')}
                className="w-full rounded-lg bg-brand-surface border border-brand-border px-3 py-2 text-xs font-medium text-brand-creme focus:border-brand-laranja outline-none"
              >
                <option value="true">Sim - Exibir QR Code para celular</option>
                <option value="false">Não - Ocultar QR Code</option>
              </select>
            </div>

            {/* Config 3: Fonte de Dados */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-creme flex items-center gap-1.5">
                <Monitor size={14} className="text-brand-laranja" />
                3. Fonte de Notícias Padrão
              </label>
              <select
                value={fonteNoticias}
                onChange={(e) => setFonteNoticias(e.target.value)}
                className="w-full rounded-lg bg-brand-surface border border-brand-border px-3 py-2 text-xs font-medium text-brand-creme focus:border-brand-laranja outline-none"
              >
                <option value="destaques">Apenas Matérias em Destaque</option>
                <option value="ultimas">Últimas Notícias Publicadas</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-brand-muted">
              {salvoSucesso ? '✅ Configurações salvas com sucesso!' : 'Salva as preferências no navegador da TV.'}
            </span>
            <button
              onClick={salvarConfiguracoesTV}
              className="rounded-lg bg-brand-verde px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity cursor-pointer"
            >
              Salvar Preferências da TV
            </button>
          </div>

          {/* Gerador de Canais / Feeds Personalizados por TV */}
          <div className="space-y-3 pt-4 border-t border-brand-border">
            <h3 className="text-sm font-bold text-brand-creme">
              📺 Links de Canais por Seção / Departamento (Para Smart TVs específicas):
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {canaisTV.map((canal) => {
                const urlCompleta = `/tv${canal.slug === 'geral' ? '' : '/' + canal.slug}`;
                const foiCopiado = copiadoSlug === canal.slug;

                return (
                  <div
                    key={canal.slug}
                    className="flex flex-col justify-between rounded-xl bg-brand-grafite/40 border border-brand-border p-3 space-y-2 hover:border-brand-laranja/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-creme">{canal.nome}</span>
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: canal.cor }}
                      />
                    </div>
                    <p className="text-[11px] text-brand-muted font-mono truncate">
                      {urlCompleta}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => copiarLinkTV(urlCompleta, canal.slug)}
                        className="flex-1 flex items-center justify-center gap-1 rounded-md bg-brand-surface border border-brand-border py-1.5 text-[11px] font-semibold text-brand-creme hover:border-brand-laranja hover:text-brand-laranja transition-colors cursor-pointer"
                      >
                        {foiCopiado ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                        {foiCopiado ? 'Copiado!' : 'Copiar Link'}
                      </button>

                      <Link
                        to={urlCompleta}
                        target="_blank"
                        className="flex items-center justify-center p-1.5 rounded-md bg-brand-surface border border-brand-border text-brand-muted hover:text-brand-creme transition-colors"
                        title="Abrir canal em nova guia"
                      >
                        <ExternalLink size={13} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SEÇÃO INTEGRACAO N8N / WEBHOOK ── */}
        <section className="rounded-2xl bg-brand-surface border border-brand-border p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
                <Webhook size={22} />
              </div>
              <div>
                <h2 className="font-titulo font-bold text-brand-creme text-lg">
                  Automação & Webhooks n8n
                </h2>
                <p className="text-xs text-brand-muted">
                  Configure o envio automático de contatos, pautas e publicação de notícias diretamente para o n8n
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={salvarWebhook}
              className="rounded-full bg-brand-verde px-5 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity cursor-pointer shadow-md"
            >
              Salvar Webhooks
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Webhook 1: Formulários */}
            <div className="rounded-xl bg-brand-grafite/50 p-4 border border-brand-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-creme flex items-center gap-1.5">
                  📩 Webhook de Formulários (Fale Conosco / Anuncie)
                </span>
              </div>
              <input
                type="url"
                value={webhookUrlInput}
                onChange={(e) => setWebhookUrlInput(e.target.value)}
                placeholder="https://n8n.seudominio.com/webhook/diaadia-contatos"
                className="w-full rounded-lg bg-brand-surface border border-brand-border px-3 py-2 text-xs text-brand-creme font-mono focus:border-brand-laranja outline-none"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={testarWebhook}
                  disabled={testandoWebhook}
                  className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-purple-600/30 border border-purple-500/30 py-2 text-[11px] font-bold text-purple-300 hover:bg-purple-600 hover:text-white transition-colors cursor-pointer"
                >
                  {testandoWebhook ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />}
                  Formulários
                </button>

                <button
                  type="button"
                  onClick={testarBannerPreExpiracaoWebhook}
                  disabled={testandoWebhook}
                  className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-yellow-600/20 border border-yellow-500/30 py-2 text-[11px] font-bold text-yellow-300 hover:bg-yellow-600 hover:text-white transition-colors cursor-pointer"
                  title="Alerta 24 horas antes da expiração"
                >
                  {testandoWebhook ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />}
                  Alerta Prévio 24h
                </button>

                <button
                  type="button"
                  onClick={testarBannerExpiradoWebhook}
                  disabled={testandoWebhook}
                  className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-red-600/20 border border-red-500/30 py-2 text-[11px] font-bold text-red-300 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                >
                  {testandoWebhook ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />}
                  Banner Expirado
                </button>
              </div>
            </div>

            {/* Webhook 2: Notícias & Redes Sociais */}
            <div className="rounded-xl bg-brand-grafite/50 p-4 border border-brand-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-creme flex items-center gap-1.5">
                  🚀 Webhook de Notícias & Redes Sociais (n8n)
                </span>
              </div>
              <input
                type="url"
                value={newsWebhookUrlInput}
                onChange={(e) => setNewsWebhookUrlInput(e.target.value)}
                placeholder="https://n8n.seudominio.com/webhook/diaadia-redes-sociais"
                className="w-full rounded-lg bg-brand-surface border border-brand-border px-3 py-2 text-xs text-brand-creme font-mono focus:border-brand-laranja outline-none"
              />
              <button
                type="button"
                onClick={testarNewsWebhook}
                disabled={testandoWebhook}
                className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-brand-laranja/20 border border-brand-laranja/40 py-2 text-xs font-bold text-brand-laranja hover:bg-brand-laranja hover:text-white transition-colors cursor-pointer"
              >
                {testandoWebhook ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />}
                Testar Webhook de Notícia (Sample)
              </button>
            </div>
          </div>

          {webhookSalvoSucesso && (
            <p className="text-xs text-green-400 font-semibold">
              ✅ Configurações de Webhook salvas com sucesso!
            </p>
          )}

          {webhookResultadoTeste && (
            <div
              className={`p-3 rounded-lg text-xs font-medium border ${
                webhookResultadoTeste.ok
                  ? 'bg-green-500/10 border-green-500/30 text-green-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              {webhookResultadoTeste.msg}
            </div>
          )}
        </section>

        {/* Ações das Notícias */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-titulo font-bold text-brand-creme text-lg">Notícias do Portal</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBannerModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-brand-surface border border-brand-border px-4 py-2 text-xs font-bold text-brand-creme hover:border-brand-laranja hover:text-brand-laranja transition-colors shadow-sm cursor-pointer"
            >
              <Megaphone size={15} className="text-brand-laranja" />
              Gestão de Banners (GIF) & Relatórios
            </button>

            <Link
              to="/admin/nova"
              className="flex items-center gap-1.5 rounded-full bg-brand-laranja px-4 py-2 text-xs font-bold text-white hover:bg-brand-laranja-dark transition-colors shadow-md"
            >
              <PlusCircle size={15} />
              Nova Notícia
            </Link>
          </div>
        </div>

        {/* Tabela */}
        <div className="rounded-xl bg-brand-surface border border-brand-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-brand-muted text-sm">Carregando...</div>
          ) : noticias.length === 0 ? (
            <div className="p-8 text-center text-brand-muted text-sm">
              Nenhuma notícia publicada ainda.
              <br />
              <Link to="/admin/nova" className="text-brand-laranja hover:underline mt-2 inline-block">Publicar primeira notícia →</Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-brand-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted">Título</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted hidden sm:table-cell">Categoria</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted hidden md:table-cell">Data</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-brand-muted hidden md:table-cell">Views</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-brand-muted">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {noticias.map(noticia => (
                  <tr key={noticia.id} className="hover:bg-brand-grafite/40 transition-colors">
                    <td className="px-4 py-3 text-brand-creme font-medium line-clamp-1 max-w-xs">
                      {noticia.titulo}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {noticia.categorias && (
                        <span
                          className="inline-block rounded-full px-2 py-0.5 text-xs font-bold text-white"
                          style={{ backgroundColor: (noticia.categorias as { cor_hex: string }).cor_hex }}
                        >
                          {(noticia.categorias as { nome: string }).nome}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-brand-muted text-xs hidden md:table-cell">
                      {noticia.data_publicacao
                        ? format(new Date(noticia.data_publicacao), "dd/MM/yyyy", { locale: ptBR })
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-brand-muted text-xs text-right hidden md:table-cell">
                      {noticia.views?.toLocaleString('pt-BR') ?? 0}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/editar/${noticia.id}`}
                          className="text-xs text-brand-laranja hover:underline"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => noticia.id && handleDelete(noticia.id)}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal de Gestão de Banners & Relatório de Audiência */}
      <BannerManagerModal
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
      />
    </div>
  );
}
