import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Eye, Share2, ChevronRight } from 'lucide-react';
import SEOHead from '@/components/ui/SEOHead';
import ScrollProgress from '@/components/ui/ScrollProgress';
import CityTabsSection from '@/components/news/CityTabsSection';
import WebStoriesSection from '@/components/stories/WebStoriesSection';
import { getNoticiaBySlug, incrementarViews } from '@/lib/supabase';
import { pageVariants } from '@/animations/variants';
import type { Noticia } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MOCK_NOTICIA: Partial<Noticia> = {
  id: '1',
  titulo: 'Grande Seca Impacta Mais de 10 Milhões de Nordestinos em 2025',
  resumo: 'Especialistas alertam para o maior período de estiagem dos últimos 50 anos.',
  conteudo: `
    <p>A região Nordeste do Brasil enfrenta em 2025 o maior período de estiagem dos últimos 50 anos, afetando diretamente mais de 10 milhões de pessoas em estados como Ceará, Rio Grande do Norte, Paraíba, Pernambuco e Bahia.</p>
    <p>De acordo com dados da Agência Nacional de Águas (ANA), os reservatórios da região estão operando com apenas 22% da capacidade total, o menor índice desde 1998. A situação tem gerado desabastecimento de água em centenas de municípios.</p>
    <h2>Resposta do Governo Federal</h2>
    <p>O Ministério da Integração Regional anunciou um pacote emergencial de R$ 2 bilhões para combater os efeitos da crise hídrica. Os recursos serão destinados à construção de cisternas, perfuração de poços artesianos e distribuição de água por caminhão-pipa.</p>
    <blockquote>
      "Estamos mobilizando todos os recursos disponíveis para garantir que nenhuma família nordestina fique sem acesso à água", afirmou o ministro durante coletiva de imprensa.
    </blockquote>
    <h2>Impacto na Agricultura</h2>
    <p>A seca também está devastando a produção agrícola da região. Pequenos agricultores relatam perdas de até 80% nas suas colheitas de milho, feijão e algodão. A pecuária também é duramente afetada, com milhares de cabeças de gado morrendo por falta de pastagem e água.</p>
  `,
  imagem_url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80',
  data_publicacao: new Date().toISOString(),
  views: 12450,
  categorias: { id: '1', nome: 'Ambiente', slug: 'ambiente', cor_hex: '#059669' },
  autores: { id: '1', nome: 'Redação Dia a Dia Nordeste', foto_url: null, bio: null },
  meta_title: 'Grande Seca Impacta Nordestinos em 2025 — Dia a Dia Nordeste',
  meta_description: 'Especialistas alertam para o maior período de estiagem dos últimos 50 anos no Nordeste Brasileiro.',
};

export default function NewsArticle() {
  const { slugNoticia } = useParams<{ slugNoticia: string }>();
  const [noticia, setNoticia] = useState<Partial<Noticia>>(MOCK_NOTICIA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slugNoticia) return;
    setLoading(true);
    getNoticiaBySlug(slugNoticia).then(({ data }) => {
      if (data) {
        setNoticia(data as Noticia);
        incrementarViews(data.id);
      }
      setLoading(false);
    });
  }, [slugNoticia]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: noticia.titulo,
    description: noticia.resumo,
    image: noticia.imagem_url,
    datePublished: noticia.data_publicacao,
    author: {
      '@type': 'Person',
      name: noticia.autores?.nome,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dia a Dia Nordeste',
      logo: {
        '@type': 'ImageObject',
        url: `${import.meta.env.VITE_BASE_URL || 'https://diaadianordeste.com.br'}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': window.location.href,
    },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: import.meta.env.VITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: noticia.categorias?.nome, item: `${import.meta.env.VITE_BASE_URL}/categoria/${noticia.categorias?.slug}` },
      { '@type': 'ListItem', position: 3, name: noticia.titulo },
    ],
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: noticia.titulo, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado!');
    }
  };

  return (
    <>
      <SEOHead
        title={noticia.meta_title ?? noticia.titulo}
        description={noticia.meta_description ?? noticia.resumo}
        ogImage={noticia.imagem_url ?? undefined}
        ogType="article"
        jsonLd={[jsonLd, breadcrumb] as unknown as object}
      />
      <ScrollProgress />

      <motion.article
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-3xl mx-auto"
      >
        {/* Breadcrumb */}
        <nav aria-label="Navegação estrutural" className="flex items-center gap-1 text-xs text-brand-muted mb-6">
          <Link to="/" className="hover:text-brand-laranja">Início</Link>
          <ChevronRight size={12} />
          {noticia.categorias && (
            <>
              <Link to={`/categoria/${noticia.categorias.slug}`} className="hover:text-brand-laranja">
                {noticia.categorias.nome}
              </Link>
              <ChevronRight size={12} />
            </>
          )}
          <span className="text-brand-creme line-clamp-1">{noticia.titulo}</span>
        </nav>

        {/* Badge de categoria */}
        {noticia.categorias && (
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-bold text-white mb-4"
            style={{ backgroundColor: noticia.categorias.cor_hex }}
          >
            {noticia.categorias.nome}
          </span>
        )}

        {/* Título */}
        <h1 className="font-titulo font-black text-brand-creme text-3xl sm:text-4xl leading-tight mb-4">
          {noticia.titulo}
        </h1>

        {/* Resumo (linha de apoio) */}
        {noticia.resumo && (
          <p className="text-brand-muted text-lg leading-relaxed mb-6 border-l-4 border-brand-laranja pl-4">
            {noticia.resumo}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-brand-border">
          <div className="flex items-center gap-4">
            {noticia.autores && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-brand-laranja flex items-center justify-center text-white text-xs font-bold">
                  {noticia.autores.nome.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-creme">{noticia.autores.nome}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-brand-muted">
              <Clock size={12} />
              <time dateTime={noticia.data_publicacao}>
                {noticia.data_publicacao
                  ? format(new Date(noticia.data_publicacao), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
                  : ''}
              </time>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-brand-muted">
            {noticia.views !== undefined && (
              <div className="flex items-center gap-1">
                <Eye size={12} />
                <span>{noticia.views.toLocaleString('pt-BR')} leituras</span>
              </div>
            )}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-brand-laranja hover:underline"
            >
              <Share2 size={12} />
              Compartilhar
            </button>
          </div>
        </div>

        {/* Imagem principal com layoutId (shared element) */}
        {noticia.imagem_url && (
          <motion.div
            layoutId={`card-${noticia.id}`}
            className="relative mb-8 rounded-xl overflow-hidden aspect-video bg-brand-surface"
          >
            <img
              src={noticia.imagem_url}
              alt={noticia.titulo ?? ''}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </motion.div>
        )}

        {/* Conteúdo */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`h-4 rounded bg-brand-surface animate-shimmer ${i % 3 === 0 ? 'w-4/5' : 'w-full'}`} />
            ))}
          </div>
        ) : (
          <div
            className="article-content font-corpo text-brand-creme"
            dangerouslySetInnerHTML={{ __html: noticia.conteudo ?? '' }}
          />
        )}

        {/* Compartilhar */}
        <div className="mt-10 p-5 rounded-xl bg-brand-surface border border-brand-border text-center">
          <p className="font-titulo font-bold text-brand-creme mb-3">Gostou dessa matéria? Compartilhe!</p>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full bg-brand-laranja px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-laranja-dark transition-colors"
          >
            <Share2 size={15} />
            Compartilhar agora
          </button>
        </div>

        {/* Seção com abas dos municípios abaixo da matéria */}
        <CityTabsSection categoriaInicialSlug={noticia.categorias?.slug} />

        {/* Seção de Web Stories por categorias */}
        <WebStoriesSection />
      </motion.article>
    </>
  );
}
