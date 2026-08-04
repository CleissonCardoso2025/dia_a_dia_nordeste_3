import { useEffect, useState } from 'react';
import { supabase, verificarEAlertarBannersExpirados } from '@/lib/supabase';
import { convertToWebP } from '@/lib/imageProcessor';
import type { BannerAd } from '@/types';
import { Plus, Trash2, Eye, MousePointerClick, Printer, Upload, X, BarChart3, Loader2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BannerManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BannerManagerModal({ isOpen, onClose }: BannerManagerModalProps) {
  const [banners, setBanners] = useState<BannerAd[]>([]);
  const [loading, setLoading] = useState(true);

  // Form de novo banner
  const [mostrarForm, setMostrarForm] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modoImagem, setModoImagem] = useState<'upload' | 'url'>('upload');

  const [form, setForm] = useState<{
    titulo: string;
    anunciante: string;
    posicao: 'header' | 'sidebar' | 'middle' | 'footer';
    imagem_url: string;
    link_destino: string;
    ativo: boolean;
    data_inicio: string;
    data_fim: string;
  }>({
    titulo: '',
    anunciante: '',
    posicao: 'header',
    imagem_url: '',
    link_destino: '',
    ativo: true,
    data_inicio: '',
    data_fim: '',
  });

  // Estado para visualização de relatório
  const [bannerRelatorio, setBannerRelatorio] = useState<BannerAd | null>(null);

  const carregarBanners = async () => {
    setLoading(true);
    // Dispara checagem de banners expirados
    verificarEAlertarBannersExpirados().catch(err => console.error(err));

    const { data } = await supabase
      .from('banners_ads')
      .select('*')
      .order('criado_em', { ascending: false });

    if (data) setBanners(data as BannerAd[]);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) carregarBanners();
  }, [isOpen]);

  if (!isOpen) return null;

  // Upload direto do GIF para o Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      file = await convertToWebP(file);
      const fileExt = file.name.split('.').pop() || 'webp';
      const fileName = `banners/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('imagens')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('imagens')
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        setForm(prev => ({ ...prev, imagem_url: publicUrlData.publicUrl }));
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      alert('Erro ao enviar imagem GIF: ' + (errorObj.message || 'Falha no upload'));
    } finally {
      setUploading(false);
    }
  };

  const handleSalvarBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imagem_url) {
      alert('Por favor, informe ou envie uma imagem GIF para o banner.');
      return;
    }

    setSalvando(true);
    const { error } = await supabase.from('banners_ads').insert({
      titulo: form.titulo || 'Banner Publicitário',
      anunciante: form.anunciante || 'Anunciante',
      posicao: form.posicao,
      imagem_url: form.imagem_url,
      link_destino: form.link_destino || '#',
      ativo: form.ativo,
      data_inicio: form.data_inicio ? new Date(form.data_inicio).toISOString() : null,
      data_fim: form.data_fim ? new Date(form.data_fim).toISOString() : null,
      criado_em: new Date().toISOString(),
    });

    setSalvando(false);
    if (error) {
      alert('Erro ao cadastrar banner: ' + error.message);
    } else {
      setForm({
        titulo: '',
        anunciante: '',
        posicao: 'header',
        imagem_url: '',
        link_destino: '',
        ativo: true,
        data_inicio: '',
        data_fim: '',
      });
      setMostrarForm(false);
      carregarBanners();
    }
  };

  const toggleStatusBanner = async (banner: BannerAd) => {
    await supabase.from('banners_ads').update({ ativo: !banner.ativo }).eq('id', banner.id);
    setBanners(prev => prev.map(b => (b.id === banner.id ? { ...b, ativo: !b.ativo } : b)));
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Deseja realmente excluir este banner publicitário do sistema?')) return;
    await supabase.from('banners_ads').delete().eq('id', id);
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const getStatusBadge = (banner: BannerAd) => {
    if (!banner.ativo) {
      return (
        <span className="rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30 px-2 py-0.5 text-[10px] font-bold">
          ⚪ Inativo
        </span>
      );
    }
    const agora = Date.now();
    if (banner.data_inicio && new Date(banner.data_inicio).getTime() > agora) {
      return (
        <span className="rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 text-[10px] font-bold">
          ⏳ Programado
        </span>
      );
    }
    if (banner.data_fim && new Date(banner.data_fim).getTime() < agora) {
      return (
        <span className="rounded-full bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold">
          🔴 Expirado
        </span>
      );
    }
    return (
      <span className="rounded-full bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 text-[10px] font-bold">
        🟢 Em Veiculação
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      {/* ── MODAL RELATÓRIO IMPRESSO DE AUDIÊNCIA ── */}
      {bannerRelatorio ? (
        <div className="w-full max-w-2xl bg-white text-gray-900 rounded-3xl p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
          <button
            onClick={() => setBannerRelatorio(null)}
            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors print:hidden"
          >
            <X size={20} />
          </button>

          {/* Cabeçalho do Relatório */}
          <div className="border-b border-gray-200 pb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/logo/logo_%20diaadia.png"
                alt="Dia a Dia Nordeste"
                className="h-10 w-auto object-contain"
              />
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Relatório Oficial de Audiência</h2>
                <p className="text-xs text-gray-500">Mídia & Performance Publicitária</p>
              </div>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p className="font-semibold text-gray-700">Dia a Dia Nordeste</p>
              <p>{format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
            </div>
          </div>

          {/* Dados do Cliente e Anúncio */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl text-xs border border-gray-100">
            <div>
              <span className="text-gray-400 font-medium">Anunciante / Cliente:</span>
              <p className="font-bold text-gray-800 text-sm mt-0.5">{bannerRelatorio.anunciante || 'Anunciante'}</p>
            </div>
            <div>
              <span className="text-gray-400 font-medium">Campanha / Banner:</span>
              <p className="font-bold text-gray-800 text-sm mt-0.5">{bannerRelatorio.titulo || 'Banner GIF'}</p>
            </div>
            <div>
              <span className="text-gray-400 font-medium">Posição no Portal:</span>
              <p className="font-semibold text-brand-laranja uppercase mt-0.5">{bannerRelatorio.posicao}</p>
            </div>
            <div>
              <span className="text-gray-400 font-medium">Período de Programação:</span>
              <p className="font-medium text-gray-700 mt-0.5">
                {bannerRelatorio.data_inicio ? format(new Date(bannerRelatorio.data_inicio), "dd/MM/yy HH:mm", { locale: ptBR }) : 'Início imediato'}{' '}
                até{' '}
                {bannerRelatorio.data_fim ? format(new Date(bannerRelatorio.data_fim), "dd/MM/yy HH:mm", { locale: ptBR }) : 'Contínuo'}
              </p>
            </div>
          </div>

          {/* Preview da Imagem GIF */}
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-900 max-h-48 flex items-center justify-center">
            <img src={bannerRelatorio.imagem_url} alt="Preview" className="max-h-48 w-auto object-contain" />
          </div>

          {/* Métricas Principais */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-center">
              <div className="flex justify-center text-blue-600 mb-1">
                <Eye size={20} />
              </div>
              <p className="text-xs text-blue-600 font-semibold uppercase">Impressões (Views)</p>
              <p className="text-2xl font-black text-blue-950 mt-1">
                {(bannerRelatorio.visualizacoes ?? 0).toLocaleString('pt-BR')}
              </p>
            </div>

            <div className="rounded-2xl bg-green-50 border border-green-100 p-4 text-center">
              <div className="flex justify-center text-green-600 mb-1">
                <MousePointerClick size={20} />
              </div>
              <p className="text-xs text-green-600 font-semibold uppercase">Cliques Confirmados</p>
              <p className="text-2xl font-black text-green-950 mt-1">
                {(bannerRelatorio.cliques ?? 0).toLocaleString('pt-BR')}
              </p>
            </div>

            <div className="rounded-2xl bg-purple-50 border border-purple-100 p-4 text-center">
              <div className="flex justify-center text-purple-600 mb-1">
                <BarChart3 size={20} />
              </div>
              <p className="text-xs text-purple-600 font-semibold uppercase">Taxa de Engajamento (CTR)</p>
              <p className="text-2xl font-black text-purple-950 mt-1">
                {bannerRelatorio.visualizacoes
                  ? (((bannerRelatorio.cliques ?? 0) / bannerRelatorio.visualizacoes) * 100).toFixed(2) + '%'
                  : '0.00%'}
              </p>
            </div>
          </div>

          {/* Botões do Relatório */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 print:hidden">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-full bg-brand-laranja px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-laranja-dark transition-colors shadow-lg cursor-pointer"
            >
              <Printer size={16} />
              Imprimir / Exportar Relatório em PDF
            </button>
          </div>
        </div>
      ) : (
        /* ── PAINEL PRINCIPAL DE GESTÃO DE BANNERS ── */
        <div className="w-full max-w-4xl bg-brand-surface border border-brand-border text-brand-creme rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-brand-muted hover:text-brand-creme transition-colors"
          >
            <X size={22} />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
            <div>
              <h2 className="font-titulo font-bold text-brand-creme text-xl">
                Gestão & Programação de Banners (GIF)
              </h2>
              <p className="text-xs text-brand-muted">
                Agende datas de início/término para ocultar da tela sem excluir do histórico do Admin.
              </p>
            </div>

            <button
              onClick={() => setMostrarForm(!mostrarForm)}
              className="flex items-center gap-1.5 rounded-full bg-brand-laranja px-4 py-2 text-xs font-bold text-white hover:bg-brand-laranja-dark transition-colors"
            >
              <Plus size={16} />
              {mostrarForm ? 'Cancelar Cadastro' : 'Novo Banner GIF'}
            </button>
          </div>

          {/* FORMULÁRIO DE CADASTRO */}
          {mostrarForm && (
            <form onSubmit={handleSalvarBanner} className="rounded-2xl bg-brand-grafite border border-brand-border p-5 space-y-4 animate-in fade-in">
              <h3 className="font-bold text-sm text-brand-creme border-b border-brand-border pb-2">
                Cadastrar Novo Anúncio GIF com Programação
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-muted mb-1">Título do Anúncio *</label>
                  <input
                    type="text"
                    required
                    value={form.titulo}
                    onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))}
                    placeholder="Ex: Campanha Supermercado - Ofertas de Verão"
                    className="w-full rounded-lg bg-brand-surface border border-brand-border px-3 py-2 text-xs text-brand-creme focus:border-brand-laranja outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-muted mb-1">Nome do Anunciante / Cliente *</label>
                  <input
                    type="text"
                    required
                    value={form.anunciante}
                    onChange={e => setForm(p => ({ ...p, anunciante: e.target.value }))}
                    placeholder="Ex: Grupo Arco-Íris"
                    className="w-full rounded-lg bg-brand-surface border border-brand-border px-3 py-2 text-xs text-brand-creme focus:border-brand-laranja outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-muted mb-1">Posição no Site *</label>
                  <select
                    value={form.posicao}
                    onChange={e => setForm(p => ({ ...p, posicao: e.target.value as any }))}
                    className="w-full rounded-lg bg-brand-surface border border-brand-border px-3 py-2 text-xs text-brand-creme focus:border-brand-laranja outline-none"
                  >
                    <option value="header">📌 Banner Topo (Header - Rotação)</option>
                    <option value="sidebar">📌 Banner Lateral (Sidebar 300x300 - Rotação)</option>
                    <option value="middle">📌 Banner Meio da Página (Middle - Rotação)</option>
                    <option value="footer">📌 Banner Rodapé (Footer - Rotação)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-muted mb-1">Link de Destino ao Clicar *</label>
                  <input
                    type="url"
                    required
                    value={form.link_destino}
                    onChange={e => setForm(p => ({ ...p, link_destino: e.target.value }))}
                    placeholder="https://wa.me/55759... ou https://site.com"
                    className="w-full rounded-lg bg-brand-surface border border-brand-border px-3 py-2 text-xs text-brand-creme focus:border-brand-laranja outline-none"
                  />
                </div>
              </div>

              {/* PROGRAMAÇÃO DE DATAS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-brand-surface/40 p-3 rounded-xl border border-brand-border">
                <div>
                  <label className="text-xs font-semibold text-brand-creme mb-1 flex items-center gap-1.5">
                    <Calendar size={13} className="text-brand-laranja" />
                    Data/Hora de Início (Entrada)
                  </label>
                  <input
                    type="datetime-local"
                    value={form.data_inicio}
                    onChange={e => setForm(p => ({ ...p, data_inicio: e.target.value }))}
                    className="w-full rounded-lg bg-brand-surface border border-brand-border px-3 py-2 text-xs text-brand-creme focus:border-brand-laranja outline-none"
                  />
                  <span className="text-[10px] text-brand-muted mt-0.5 block">Deixe em branco para exibição imediata</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-brand-creme mb-1 flex items-center gap-1.5">
                    <Calendar size={13} className="text-brand-laranja" />
                    Data/Hora de Término (Saída)
                  </label>
                  <input
                    type="datetime-local"
                    value={form.data_fim}
                    onChange={e => setForm(p => ({ ...p, data_fim: e.target.value }))}
                    className="w-full rounded-lg bg-brand-surface border border-brand-border px-3 py-2 text-xs text-brand-creme focus:border-brand-laranja outline-none"
                  />
                  <span className="text-[10px] text-brand-muted mt-0.5 block">Ao expirar, sai da tela mas continua salvo no Admin</span>
                </div>
              </div>

              {/* Upload de GIF */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-brand-creme">Imagem Animada (GIF)</label>
                  <div className="flex bg-brand-surface rounded-lg p-0.5 border border-brand-border text-[11px]">
                    <button
                      type="button"
                      onClick={() => setModoImagem('upload')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${modoImagem === 'upload' ? 'bg-brand-laranja text-white font-bold' : 'text-brand-muted'}`}
                    >
                      Upload Arquivo GIF
                    </button>
                    <button
                      type="button"
                      onClick={() => setModoImagem('url')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${modoImagem === 'url' ? 'bg-brand-laranja text-white font-bold' : 'text-brand-muted'}`}
                    >
                      URL Externa
                    </button>
                  </div>
                </div>

                {modoImagem === 'upload' ? (
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-brand-border hover:border-brand-laranja rounded-xl cursor-pointer bg-brand-surface/40 transition-all">
                    <input type="file" accept="image/gif,image/*" onChange={handleFileUpload} className="hidden" />
                    {uploading ? (
                      <Loader2 className="h-6 w-6 text-brand-laranja animate-spin" />
                    ) : (
                      <div className="flex flex-col items-center text-xs text-brand-muted">
                        <Upload className="h-6 w-6 text-brand-muted mb-1" />
                        <span>Clique para enviar a arte GIF do anúncio</span>
                      </div>
                    )}
                  </label>
                ) : (
                  <input
                    type="url"
                    value={form.imagem_url}
                    onChange={e => setForm(p => ({ ...p, imagem_url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full rounded-lg bg-brand-surface border border-brand-border px-3 py-2 text-xs text-brand-creme focus:border-brand-laranja outline-none"
                  />
                )}

                {form.imagem_url && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-brand-border max-h-32 bg-black/40 p-2">
                    <img src={form.imagem_url} alt="Preview GIF" className="max-h-28 w-auto mx-auto object-contain" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  disabled={salvando || uploading}
                  className="rounded-full bg-brand-verde px-5 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {salvando ? 'Salvar...' : 'Salvar e Agendar Banner'}
                </button>
              </div>
            </form>
          )}

          {/* LISTA DE BANNERS CADASTRADOS */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-brand-creme">Histórico & Agendamento de Banners</h3>

            {loading ? (
              <div className="p-8 text-center text-brand-muted text-xs">Carregando banners...</div>
            ) : banners.length === 0 ? (
              <div className="p-8 text-center text-brand-muted text-xs rounded-xl bg-brand-grafite/40 border border-brand-border">
                Nenhum banner publicitário cadastrado ainda.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {banners.map((banner) => {
                  const ctr = banner.visualizacoes
                    ? (((banner.cliques ?? 0) / banner.visualizacoes) * 100).toFixed(2) + '%'
                    : '0.00%';

                  return (
                    <div
                      key={banner.id}
                      className="rounded-2xl bg-brand-grafite/60 border border-brand-border p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-brand-laranja/50 transition-colors"
                    >
                      {/* Miniatura do GIF + Info */}
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="h-16 w-24 rounded-lg bg-black/50 overflow-hidden border border-brand-border shrink-0 flex items-center justify-center">
                          <img src={banner.imagem_url} alt={banner.titulo} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-brand-creme text-sm truncate">{banner.titulo || 'Banner GIF'}</span>
                            <span className="rounded-full bg-brand-surface px-2 py-0.5 text-[10px] font-bold text-brand-laranja uppercase border border-brand-border">
                              {banner.posicao}
                            </span>
                            {getStatusBadge(banner)}
                          </div>
                          <p className="text-xs text-brand-muted truncate">Anunciante: {banner.anunciante || 'Cliente'}</p>
                          <p className="text-[10px] text-brand-muted font-mono">
                            Programação:{' '}
                            {banner.data_inicio ? format(new Date(banner.data_inicio), 'dd/MM/yy HH:mm') : 'Imediata'}{' '}
                            →{' '}
                            {banner.data_fim ? format(new Date(banner.data_fim), 'dd/MM/yy HH:mm') : 'Sem expiração'}
                          </p>
                        </div>
                      </div>

                      {/* Métricas de Performance */}
                      <div className="flex items-center gap-4 bg-brand-surface px-4 py-2 rounded-xl border border-brand-border w-full sm:w-auto justify-around">
                        <div className="text-center">
                          <span className="text-[10px] text-brand-muted block">Impressões</span>
                          <span className="font-bold text-brand-creme text-xs flex items-center gap-1">
                            <Eye size={12} className="text-blue-400" />
                            {(banner.visualizacoes ?? 0).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <div className="h-6 w-px bg-brand-border" />
                        <div className="text-center">
                          <span className="text-[10px] text-brand-muted block">Cliques</span>
                          <span className="font-bold text-brand-creme text-xs flex items-center gap-1">
                            <MousePointerClick size={12} className="text-green-400" />
                            {(banner.cliques ?? 0).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <div className="h-6 w-px bg-brand-border" />
                        <div className="text-center">
                          <span className="text-[10px] text-brand-muted block">CTR</span>
                          <span className="font-bold text-purple-400 text-xs">{ctr}</span>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => setBannerRelatorio(banner)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors text-xs font-semibold cursor-pointer"
                          title="Emitir Relatório de Audiência em PDF"
                        >
                          <BarChart3 size={14} />
                          Relatório
                        </button>

                        <button
                          onClick={() => toggleStatusBanner(banner)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            banner.ativo
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white'
                              : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500 hover:text-white'
                          }`}
                        >
                          {banner.ativo ? 'Ativado' : 'Desativado'}
                        </button>

                        <button
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Excluir do Painel"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
