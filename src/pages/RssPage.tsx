import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rss, Copy, Download, Code, Eye, Check, MapPin, Sparkles, ChevronRight, ExternalLink, Zap } from 'lucide-react';
import SEOHead from '@/components/ui/SEOHead';
import { getCategorias, getNoticias } from '@/lib/supabase';
import { gerarRssXml } from '@/lib/rss';
import { MOCK_STORIES } from '@/data/mockStories';
import type { Categoria, Noticia } from '@/types';
import { pageVariants } from '@/animations/variants';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function RssPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria | null>(null);
  const [isWebStories, setIsWebStories] = useState(false);
  const [noticias, setNoticias] = useState<Partial<Noticia>[]>([]);
  const [copiado, setCopiado] = useState(false);
  const [modoXml, setModoXml] = useState(false);

  useEffect(() => {
    // Carrega categorias dos municipios
    getCategorias().then(({ data }) => {
      if (data) setCategorias(data as Categoria[]);
    });

    // Carrega todas as noticias
    getNoticias(40).then(({ data }) => {
      if (data) setNoticias(data as unknown as Partial<Noticia>[]);
    });
  }, []);

  // Notícias das Web Stories quando selecionado
  const noticiasWebStories: Partial<Noticia>[] = MOCK_STORIES.map(s => ({
    id: s.id,
    titulo: `[Web Story] ${s.titulo}`,
    slug: s.id,
    data_publicacao: s.criadoEm,
    resumo: `Web Story com ${s.slides.length} slides interativos na categoria ${s.categoria}.`,
    conteudo: s.slides
      .map(slide => `<h3>${slide.titulo}</h3><p>${slide.texto}</p>${slide.imagemUrl ? `<p><img src="${slide.imagemUrl}" alt="${slide.titulo}" /></p>` : ''}`)
      .join('<hr/>'),
    imagem_url: s.capaUrl,
    categorias: { id: s.id, nome: `Web Story — ${s.categoria}`, slug: 'web-stories', cor_hex: s.corCategoria },
  }));

  // Notícias filtradas por cidade/categoria ou Web Stories
  const noticiasFiltradas = isWebStories
    ? noticiasWebStories
    : categoriaSelecionada
    ? noticias.filter(n => n.categorias?.slug === categoriaSelecionada.slug)
    : noticias;

  // XML Gerado em Tempo Real
  const xmlConteudo = gerarRssXml(
    noticiasFiltradas,
    isWebStories ? ({ id: 'web-stories', nome: 'Web Stories ⚡', slug: 'web-stories', cor_hex: '#D9491F' } as Categoria) : categoriaSelecionada
  );

  // Link do arquivo RSS
  const rssLinkFile = isWebStories
    ? `${window.location.origin}/rss-web-stories.xml`
    : categoriaSelecionada
    ? `${window.location.origin}/rss-${categoriaSelecionada.slug}.xml`
    : `${window.location.origin}/rss.xml`;

  const handleCopiarLink = () => {
    navigator.clipboard.writeText(rssLinkFile);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleDownloadXml = () => {
    const blob = new Blob([xmlConteudo], { type: 'application/rss+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = categoriaSelecionada ? `rss-${categoriaSelecionada.slug}.xml` : 'rss-diaadianordeste.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <SEOHead
        title="Central de Feeds RSS 2.0 — Dia a Dia Nordeste"
        description="Feeds RSS 2.0 com notícias completas, títulos, imagens e opção de seleção por município do Semiárido Nordeste II."
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
          <span className="text-brand-creme">Feed RSS</span>
        </nav>

        {/* Header do RSS */}
        <div className="rounded-2xl bg-linear-to-r from-brand-surface to-brand-grafite border border-brand-border p-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Rss size={15} />
              RSS 2.0 Feed Completo
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModoXml(!modoXml)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-grafite border border-brand-border text-xs font-semibold text-brand-creme hover:border-brand-laranja transition-colors"
              >
                {modoXml ? <Eye size={14} /> : <Code size={14} />}
                {modoXml ? 'Ver Leitor de Notícias' : 'Ver Código XML'}
              </button>
            </div>
          </div>

          <h1 className="font-titulo font-black text-brand-creme text-3xl">
            Central de Feeds RSS por Município
          </h1>
          <p className="text-brand-muted text-sm leading-relaxed">
            Acompanhe as matérias do <strong className="text-brand-creme">Dia a Dia Nordeste</strong> em qualquer leitor de RSS (Feedly, Inoreader, Thunderbird). O feed inclui <strong className="text-brand-creme">título, imagem em alta resolução e o texto completo da notícia</strong>.
          </p>
        </div>

        {/* Seletor de Municípios / Seção do RSS */}
        <div className="rounded-2xl bg-brand-surface border border-brand-border p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3">
            <MapPin size={20} className="text-brand-laranja shrink-0" />
            <h2 className="font-titulo font-bold text-brand-creme text-lg">
              Escolha a Seção ou Município do Feed
            </h2>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => {
                setCategoriaSelecionada(null);
                setIsWebStories(false);
              }}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                categoriaSelecionada === null && !isWebStories
                  ? 'bg-brand-laranja text-white shadow-lg scale-105'
                  : 'bg-brand-grafite text-brand-muted hover:text-brand-creme border border-brand-border'
              }`}
            >
              🌐 Todas as Notícias
            </button>

            {/* Opção do Feed de Web Stories */}
            <button
              onClick={() => {
                setCategoriaSelecionada(null);
                setIsWebStories(true);
              }}
              className={`shrink-0 flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                isWebStories
                  ? 'bg-brand-laranja text-white shadow-lg scale-105'
                  : 'bg-brand-grafite text-brand-muted hover:text-brand-creme border border-brand-border'
              }`}
            >
              <Zap size={14} className="text-yellow-400" />
              Feed Web Stories
            </button>

            {categorias.map(cat => {
              const selected = categoriaSelecionada?.id === cat.id && !isWebStories;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategoriaSelecionada(cat);
                    setIsWebStories(false);
                  }}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    selected
                      ? 'text-white shadow-lg scale-105'
                      : 'bg-brand-grafite text-brand-muted hover:text-brand-creme border border-brand-border'
                  }`}
                  style={selected ? { backgroundColor: cat.cor_hex } : {}}
                >
                  {cat.nome}
                </button>
              );
            })}
          </div>

          {/* Barra de Ações do Feed Selecionado */}
          <div className="mt-4 p-4 rounded-xl bg-brand-grafite border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
              <Sparkles size={16} className="text-brand-laranja shrink-0" />
              <span className="text-xs font-mono text-brand-creme truncate">
                {rssLinkFile}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
              <button
                onClick={handleCopiarLink}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-brand-surface border border-brand-border text-xs font-bold text-brand-creme hover:border-brand-laranja transition-colors"
              >
                {copiado ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                {copiado ? 'Copiado!' : 'Copiar URL'}
              </button>

              <button
                onClick={handleDownloadXml}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-brand-laranja text-xs font-bold text-white hover:bg-brand-laranja-dark transition-colors"
              >
                <Download size={14} />
                Baixar RSS XML
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo do Feed: Código XML ou Pré-visualização das Notícias */}
        {modoXml ? (
          <div className="rounded-2xl bg-brand-surface border border-brand-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-titulo font-bold text-brand-creme text-base flex items-center gap-2">
                <Code size={18} className="text-brand-laranja" />
                Código XML do Feed RSS 2.0
              </h3>
              <span className="text-xs text-brand-muted font-mono">application/rss+xml</span>
            </div>
            <pre className="p-4 rounded-xl bg-black/60 text-green-400 font-mono text-xs overflow-x-auto max-h-125 border border-brand-border leading-relaxed">
              {xmlConteudo}
            </pre>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="font-titulo font-bold text-brand-creme text-xl">
                {categoriaSelecionada
                  ? `Matérias do Feed: ${categoriaSelecionada.nome}`
                  : 'Todas as Matérias do Feed RSS'}
              </h3>
              <span className="text-xs text-brand-muted">
                {noticiasFiltradas.length} matérias no feed
              </span>
            </div>

            <div className="space-y-6">
              {noticiasFiltradas.map(noticia => (
                <article
                  key={noticia.id}
                  className="rounded-2xl bg-brand-surface border border-brand-border p-6 space-y-4 hover:border-brand-laranja/50 transition-all"
                >
                  {/* Topo da Notícia */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {noticia.categorias && (
                      <span
                        className="rounded-full px-3 py-0.5 text-xs font-bold text-white"
                        style={{ backgroundColor: noticia.categorias.cor_hex }}
                      >
                        {noticia.categorias.nome}
                      </span>
                    )}
                    <span className="text-xs text-brand-muted">
                      {noticia.data_publicacao
                        ? format(new Date(noticia.data_publicacao), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
                        : ''}
                    </span>
                  </div>

                  {/* Título */}
                  <h2 className="font-titulo font-bold text-brand-creme text-2xl leading-snug">
                    <Link
                      to={`/noticia/${noticia.categorias?.slug ?? 'geral'}/${noticia.slug}`}
                      className="hover:text-brand-laranja transition-colors"
                    >
                      {noticia.titulo}
                    </Link>
                  </h2>

                  {/* Imagem Completa */}
                  {noticia.imagem_url && (
                    <div className="rounded-xl overflow-hidden aspect-video max-h-96 bg-brand-grafite">
                      <img
                        src={noticia.imagem_url}
                        alt={noticia.titulo || ''}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Resumo / Conteúdo Integral */}
                  <div className="text-sm text-brand-muted leading-relaxed border-l-2 border-brand-laranja pl-4">
                    <p className="font-medium text-brand-creme mb-2">{noticia.resumo}</p>
                    <div
                      className="line-clamp-4 font-corpo text-brand-muted text-xs"
                      dangerouslySetInnerHTML={{ __html: noticia.conteudo || '' }}
                    />
                  </div>

                  {/* Link Direto */}
                  <div className="pt-2">
                    <Link
                      to={`/noticia/${noticia.categorias?.slug ?? 'geral'}/${noticia.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-laranja hover:underline"
                    >
                      <span>Ler notícia completa no portal</span>
                      <ExternalLink size={13} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}
