import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import type { WebStory } from '@/types';
import { MOCK_STORIES } from '@/data/mockStories';
import WebStoryModal from './WebStoryModal';

const CATEGORIAS_STORIES = ['Todas', 'Saúde', 'Educação', 'Esportes', 'Cultura', 'Economia', 'Tecnologia'];

export default function WebStoriesSection() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todas');
  const [storyModal, setStoryModal] = useState<WebStory | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const storiesFiltradas = categoriaSelecionada === 'Todas'
    ? MOCK_STORIES
    : MOCK_STORIES.filter(s => s.categoria === categoriaSelecionada);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const distance = 280;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  return (
    <section className="rounded-2xl bg-brand-surface border border-brand-border p-6 space-y-6">
      {/* Topo da Seção: Título e Navegação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-laranja/15 text-brand-laranja">
            <Zap size={20} />
          </div>
          <div>
            <h2 className="font-titulo font-bold text-brand-creme text-xl">
              Web Stories
            </h2>
            <p className="text-xs text-brand-muted">
              Fatos e destaques em formato visual e rápido
            </p>
          </div>
        </div>

        {/* Botões de scroll desktop */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-grafite border border-brand-border text-brand-creme hover:border-brand-laranja hover:text-brand-laranja transition-colors"
            aria-label="Stories anteriores"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-grafite border border-brand-border text-brand-creme hover:border-brand-laranja hover:text-brand-laranja transition-colors"
            aria-label="Próximos stories"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Filtro por Categorias de Editoriais */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIAS_STORIES.map(cat => {
          const active = categoriaSelecionada === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoriaSelecionada(cat)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                active
                  ? 'bg-brand-laranja text-white shadow-md'
                  : 'bg-brand-grafite text-brand-muted hover:text-brand-creme border border-brand-border'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Trilha de Cards Vertical 9:16 dos Stories */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-none scroll-smooth"
      >
        {storiesFiltradas.map(story => (
          <motion.div
            key={story.id}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={() => setStoryModal(story)}
            className="relative w-44 h-72 shrink-0 rounded-2xl overflow-hidden cursor-pointer shadow-lg group border border-brand-border"
          >
            {/* Imagem de Capa 9:16 */}
            <img
              src={story.capaUrl}
              alt={story.titulo}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              loading="lazy"
            />

            {/* Overlay Gradiente */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/40 group-hover:from-black/95 transition-colors" />

            {/* Anel Estilo Story Animado */}
            <div
              className="absolute top-3 left-3 flex h-7 w-7 items-center justify-center rounded-full p-0.5 shadow-md"
              style={{ backgroundColor: story.corCategoria }}
            >
              <div className="w-full h-full rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
                <Sparkles size={12} className="text-white" />
              </div>
            </div>

            {/* Badge de Categoria */}
            <span
              className="absolute top-3 right-3 rounded-full px-2 py-0.5 text-[9px] font-extrabold text-white uppercase tracking-wider"
              style={{ backgroundColor: story.corCategoria }}
            >
              {story.categoria}
            </span>

            {/* Conteúdo da Capa */}
            <div className="absolute bottom-0 inset-x-0 p-3 space-y-1">
              <h3 className="font-titulo font-bold text-white text-xs leading-snug line-clamp-3 group-hover:text-brand-creme transition-colors">
                {story.titulo}
              </h3>
              <p className="text-[10px] text-white/70 font-medium">
                Toque para ver story →
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal / Viewer Fullscreen dos Stories */}
      <WebStoryModal
        story={storyModal}
        onClose={() => setStoryModal(null)}
      />
    </section>
  );
}
