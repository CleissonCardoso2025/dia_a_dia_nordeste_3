import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Eye } from 'lucide-react';
import { cardItemVariants } from '@/animations/variants';
import type { Noticia } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NewsCardProps {
  noticia: Partial<Noticia>;
  destaque?: boolean;
}

export default function NewsCard({ noticia, destaque = false }: NewsCardProps) {
  const href = `/noticia/${noticia.categorias?.slug ?? 'geral'}/${noticia.slug}`;
  const corCategoria = noticia.categorias?.cor_hex ?? '#D9491F';

  return (
    <motion.article
      variants={cardItemVariants}
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-brand-border bg-brand-surface shadow-card hover:shadow-card-hover transition-shadow duration-300 ${destaque ? 'lg:col-span-2 lg:row-span-2' : ''}`}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      layoutId={`card-${noticia.id}`}
    >
      {/* Imagem */}
      <Link to={href} className="block overflow-hidden" tabIndex={-1} aria-hidden>
        <div className={`relative overflow-hidden ${destaque ? 'h-60' : 'h-44'} bg-brand-grafite`}>
          {noticia.imagem_url ? (
            <img
              src={noticia.imagem_url}
              alt={noticia.titulo ?? ''}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-muted text-xs">
              Sem imagem
            </div>
          )}

          {/* Badge de categoria — desliza no hover */}
          {noticia.categorias && (
            <div className="absolute top-3 left-3">
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-md"
                style={{ backgroundColor: corCategoria }}
              >
                {noticia.categorias.nome}
              </span>
            </div>
          )}

          {/* Overlay tarja — revela resumo no hover */}
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out p-3">
            <p className="text-xs text-white/90 line-clamp-2">{noticia.resumo}</p>
          </div>
        </div>
      </Link>

      {/* Conteúdo textual */}
      <div className="flex flex-col flex-1 p-4">
        <Link to={href}>
          <h2
            className={`font-titulo font-bold text-brand-creme leading-snug mb-2 hover:text-brand-laranja transition-colors ${
              destaque ? 'text-xl' : 'text-base'
            } line-clamp-3`}
          >
            {noticia.titulo}
          </h2>
        </Link>

        {!destaque && noticia.resumo && (
          <p className="text-sm text-brand-muted leading-relaxed line-clamp-2 mb-3">
            {noticia.resumo}
          </p>
        )}

        {/* Meta */}
        <div className="mt-auto flex items-center justify-between text-xs text-brand-muted">
          <div className="flex items-center gap-1">
            <Clock size={11} />
            <span>
              {noticia.data_publicacao
                ? format(new Date(noticia.data_publicacao), "d MMM yyyy", { locale: ptBR })
                : '—'}
            </span>
          </div>
          {noticia.views !== undefined && (
            <div className="flex items-center gap-1">
              <Eye size={11} />
              <span>{noticia.views.toLocaleString('pt-BR')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Borda laranja no hover */}
      <div
        className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-xl"
        style={{ backgroundColor: corCategoria }}
      />
    </motion.article>
  );
}
