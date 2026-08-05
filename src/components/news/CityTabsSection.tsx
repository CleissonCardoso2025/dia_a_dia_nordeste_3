import { useEffect, useState, useRef } from 'react';
import { MapPin, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import CardGrid from '@/components/news/CardGrid';
import { getCategorias } from '@/lib/supabase';
import type { Categoria } from '@/types';

interface CityTabsSectionProps {
  categoriaInicialSlug?: string;
  tituloSecao?: string;
}

export default function CityTabsSection({
  categoriaInicialSlug,
  tituloSecao = 'Semiárido Nordeste II — Notícias por Município',
}: CityTabsSectionProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<Categoria | null>(null);

  useEffect(() => {
    getCategorias().then(({ data }) => {
      if (data && data.length > 0) {
        const cats = (data as Categoria[]).filter(c => c.tipo !== 'editorial');
        setCategorias(cats);

        // Se uma categoria especifica foi solicitada (ex: a cidade da materia atual), seleciona ela.
        // Senao, seleciona a primeira (que e a cidade com a publicacao mais recente).
        if (categoriaInicialSlug) {
          const encontrada = cats.find(c => c.slug === categoriaInicialSlug);
          setAbaAtiva(encontrada ?? cats[0]);
        } else {
          setAbaAtiva(cats[0]);
        }
      }
    });
  }, [categoriaInicialSlug]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (categorias.length === 0) return null;

  return (
    <section className="mt-10 rounded-2xl bg-brand-surface border border-brand-border p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-4">
        <div className="flex items-center gap-2">
          <MapPin className="text-brand-laranja shrink-0" size={20} />
          <h2 className="font-titulo font-bold text-brand-creme text-xl">
            {tituloSecao}
          </h2>
        </div>
        <span className="text-xs text-brand-muted flex items-center gap-1.5 bg-brand-grafite px-3 py-1.5 rounded-full border border-brand-border self-start sm:self-auto">
          <Sparkles size={13} className="text-brand-laranja" />
          Selecione o município
        </span>
      </div>

      {/* Abas dos 18 Municípios com scroll customizado */}
      <div className="relative group">
        {/* Sombra Esquerda */}
        <div className="absolute left-0 top-0 bottom-2 w-12 bg-linear-to-r from-brand-surface to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
        
        {/* Botão Esquerda */}
        <button 
          onClick={() => scroll('left')}
          aria-label="Rolar para esquerda"
          className="absolute left-0 top-1/2 -translate-y-1/2 -mt-1 z-20 h-8 w-8 flex items-center justify-center rounded-full bg-brand-grafite border border-brand-border text-brand-creme shadow-lg opacity-0 group-hover:opacity-100 transition-all hidden sm:flex hover:bg-brand-laranja hover:text-white hover:border-brand-laranja cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Scroll Container */}
        <div 
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:px-6"
        >
          {categorias.map((cat, index) => {
            const isSelected = abaAtiva?.id === cat.id;
            const isNewest = index === 0;
            return (
              <button
                key={cat.id}
                onClick={() => setAbaAtiva(cat)}
                className={`relative shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'text-white shadow-lg scale-105'
                    : 'text-brand-muted hover:text-brand-creme bg-brand-grafite border border-brand-border'
                }`}
                style={isSelected ? { backgroundColor: cat.cor_hex } : {}}
              >
                {cat.nome}
                {isNewest && (
                  <span
                    className="flex h-2 w-2 rounded-full bg-red-400 animate-ping"
                    title="Município com publicação mais recente"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Botão Direita */}
        <button 
          onClick={() => scroll('right')}
          aria-label="Rolar para direita"
          className="absolute right-0 top-1/2 -translate-y-1/2 -mt-1 z-20 h-8 w-8 flex items-center justify-center rounded-full bg-brand-grafite border border-brand-border text-brand-creme shadow-lg opacity-0 group-hover:opacity-100 transition-all hidden sm:flex hover:bg-brand-laranja hover:text-white hover:border-brand-laranja cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>

        {/* Sombra Direita */}
        <div className="absolute right-0 top-0 bottom-2 w-12 bg-linear-to-l from-brand-surface to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
      </div>

      {/* Notícias do Município Selecionado */}
      {abaAtiva && (
        <div className="pt-2">
          <CardGrid
            key={abaAtiva.id}
            titulo={`Notícias de ${abaAtiva.nome}`}
            categoria={abaAtiva}
            limite={6}
          />
        </div>
      )}
    </section>
  );
}
