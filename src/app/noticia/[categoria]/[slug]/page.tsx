import { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Eye, ChevronRight } from 'lucide-react';
import { getNoticiaBySlug, incrementarViews } from '@/lib/supabase';
import type { Noticia } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CityTabsSection from '@/components/news/CityTabsSection';
import WebStoriesSection from '@/components/stories/WebStoriesSection';
import ScrollProgress from '@/components/ui/ScrollProgress';
import ShareButton from './ShareButton';
import ArticleViewTracker from './ArticleViewTracker';

interface NoticiaPageProps {
  params: { categoria: string; slug: string };
}

export async function generateMetadata({ params }: NoticiaPageProps): Promise<Metadata> {
  const { data } = await getNoticiaBySlug(params.slug);
  const noticia = data as Noticia;

  if (!noticia) {
    return { title: 'Notícia não encontrada' };
  }

  return {
    title: noticia.meta_title ?? noticia.titulo,
    description: noticia.meta_description ?? noticia.resumo,
    openGraph: {
      title: noticia.titulo,
      description: noticia.resumo,
      type: 'article',
      images: noticia.imagem_url ? [noticia.imagem_url] : [],
    }
  };
}

export default async function NoticiaPage({ params }: NoticiaPageProps) {
  const { data } = await getNoticiaBySlug(params.slug);
  const noticia = data as Noticia;

  if (!noticia) {
    return <div className="py-20 text-center text-brand-muted">Notícia não encontrada.</div>;
  }

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
    },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://diaadianordeste.com.br' },
      { '@type': 'ListItem', position: 2, name: noticia.categorias?.nome, item: `https://diaadianordeste.com.br/categoria/${noticia.categorias?.slug}` },
      { '@type': 'ListItem', position: 3, name: noticia.titulo },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumb]) }}
      />
      <ScrollProgress />
      {/* Tracker Client Component for views */}
      <ArticleViewTracker noticiaId={noticia.id} />
      
      <article className="max-w-3xl mx-auto mt-6">
        {/* Breadcrumb */}
        <nav aria-label="Navegação estrutural" className="flex items-center gap-1 text-xs text-brand-muted mb-6">
          <Link href="/" className="hover:text-brand-laranja">Início</Link>
          <ChevronRight size={12} />
          {noticia.categorias && (
            <>
              <Link href={`/categoria/${noticia.categorias.slug}`} className="hover:text-brand-laranja">
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

        {/* Resumo */}
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
            <ShareButton title={noticia.titulo} />
          </div>
        </div>

        {/* Imagem principal */}
        {noticia.imagem_url && (
          <div className="relative mb-8 rounded-xl overflow-hidden aspect-video bg-brand-surface">
            <img
              src={noticia.imagem_url}
              alt={noticia.titulo ?? ''}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        )}

        {/* Conteúdo */}
        <div
          className="article-content font-corpo text-brand-creme"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo ?? '' }}
        />

        {/* Seção com abas dos municípios abaixo da matéria */}
        <CityTabsSection categoriaInicialSlug={noticia.categorias?.slug} />

        {/* Seção de Web Stories por categorias */}
        <WebStoriesSection />
      </article>
    </>
  );
}
