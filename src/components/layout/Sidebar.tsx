import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, TrendingUp, Clock, MessageCircle } from 'lucide-react';
import { BannerPlaceholder } from '@/components/ui/Banner';
import { getMaisAcessadas, getNoticias } from '@/lib/supabase';
import { sidebarContainerVariants, sidebarItemVariants } from '@/animations/variants';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import type { Noticia } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Dados mock
const MOCK_MAIS_ACESSADAS: Partial<Noticia>[] = [
  { id: '1', titulo: 'Seca no Nordeste bate recorde histórico em 2025', slug: 'seca-nordeste-recorde', views: 12450, categorias: { id: '1', nome: 'Ambiente', slug: 'ambiente', cor_hex: '#059669' } },
  { id: '2', titulo: 'Projeto de lei beneficia agricultores da região semiárida', slug: 'projeto-lei-agricultores', views: 9830, categorias: { id: '2', nome: 'Política', slug: 'politica', cor_hex: '#D9491F' } },
  { id: '3', titulo: 'Festival de cultura nordestina reúne milhares em Fortaleza', slug: 'festival-cultura-nordestina', views: 7210, categorias: { id: '3', nome: 'Cultura', slug: 'cultura', cor_hex: '#8B5CF6' } },
  { id: '4', titulo: 'Economia do Nordeste cresce 4,2% no primeiro semestre', slug: 'economia-nordeste-cresce', views: 5990, categorias: { id: '4', nome: 'Economia', slug: 'economia', cor_hex: '#1E5C4E' } },
  { id: '5', titulo: 'Ceará investe em energia eólica e cria empregos no interior', slug: 'ceara-energia-eolica', views: 4730, categorias: { id: '5', nome: 'Energia', slug: 'energia', cor_hex: '#D97706' } },
];

interface CounterItemProps {
  value: number;
  trigger: boolean;
}

function CounterItem({ value, trigger }: CounterItemProps) {
  const count = useAnimatedCounter(value, 1200, trigger);
  return <span className="text-brand-muted text-xs font-mono">{count.toLocaleString('pt-BR')}</span>;
}

export default function Sidebar() {
  const [maisAcessadas, setMaisAcessadas] = useState<Partial<Noticia>[]>(MOCK_MAIS_ACESSADAS);
  const [recentes, setRecentes] = useState<Partial<Noticia>[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sidebarRef, { once: true, margin: '-80px' });

  useEffect(() => {
    getMaisAcessadas(5).then(({ data }) => {
      if (data && data.length > 0) setMaisAcessadas(data as unknown as Partial<Noticia>[]);
    });
    getNoticias(4).then(({ data }) => {
      if (data && data.length > 0) setRecentes(data as unknown as Partial<Noticia>[]);
    });
  }, []);

  return (
    <aside className="space-y-6" ref={sidebarRef}>
      {/* ── Mais Acessadas ── */}
      <div className="rounded-xl bg-brand-surface border border-brand-border overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-brand-border">
          <TrendingUp size={16} className="text-brand-laranja" />
          <h2 className="font-titulo font-bold text-brand-creme text-sm uppercase tracking-wide">
            Mais Acessadas
          </h2>
        </div>

        <motion.ol
          variants={sidebarContainerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="divide-y divide-brand-border"
        >
          {maisAcessadas.map((noticia, i) => (
            <motion.li
              key={noticia.id}
              variants={sidebarItemVariants}
              className="group"
            >
              <Link
                to={`/noticia/${noticia.categorias?.slug ?? 'geral'}/${noticia.slug}`}
                className="flex items-start gap-3 px-4 py-3 hover:bg-brand-grafite/50 transition-colors"
              >
                {/* Número */}
                <span
                  className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-xs font-black"
                  style={{
                    backgroundColor: i === 0 ? '#D9491F' : 'transparent',
                    color: i === 0 ? '#fff' : '#8896A5',
                    border: i > 0 ? '1px solid #2E3547' : 'none',
                  }}
                >
                  {i + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-brand-creme font-medium leading-snug line-clamp-2 group-hover:text-brand-laranja transition-colors">
                    {noticia.titulo}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <Eye size={11} className="text-brand-muted" />
                    <CounterItem value={noticia.views ?? 0} trigger={inView} />
                    <span className="text-brand-muted text-xs">views</span>
                  </div>
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ol>
      </div>

      {/* ── CTA WhatsApp ── */}
      <motion.div
        animate={{ scale: [1, 1.015, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="rounded-xl bg-linear-to-br from-[#128C7E] to-[#25D366] p-4 text-white"
      >
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle size={20} />
          <span className="font-titulo font-bold text-base">Grupo do WhatsApp</span>
        </div>
        <p className="text-sm text-white/85 mb-3">
          Receba as principais notícias em primeira mão no seu WhatsApp.
        </p>
        <a
          href="https://chat.whatsapp.com/Ko4YLTu3q1a0rctFu3ki08"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-full bg-white py-2 text-center text-sm font-bold text-[#128C7E] hover:bg-white/90 transition-colors"
        >
          Entrar no Grupo →
        </a>
      </motion.div>

      {/* ── CTA Instagram ── */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="rounded-xl bg-linear-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] p-4 text-white shadow-lg border border-white/10"
      >
        <div className="flex items-center gap-2 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
          <span className="font-titulo font-bold text-base">Siga no Instagram</span>
        </div>
        <p className="text-sm text-white/90 mb-3">
          Acompanhe nossos bastidores e notícias exclusivas no nosso perfil.
        </p>
        <a
          href="https://instagram.com/diaadianordeste.ba"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-full bg-white py-2 text-center text-sm font-bold text-[#E1306C] hover:bg-white/90 transition-colors"
        >
          @diaadianordeste.ba →
        </a>
      </motion.div>

      {/* ── Banner 300x300 ── */}
      <BannerPlaceholder posicao="sidebar" />

      {/* ── Recentes ── */}
      <div className="rounded-xl bg-brand-surface border border-brand-border overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-brand-border">
          <Clock size={16} className="text-brand-laranja" />
          <h2 className="font-titulo font-bold text-brand-creme text-sm uppercase tracking-wide">
            Recentes
          </h2>
        </div>
        <ul className="divide-y divide-brand-border">
          {(recentes.length > 0 ? recentes : MOCK_MAIS_ACESSADAS.slice(0, 4)).map(noticia => (
            <li key={noticia.id}>
              <Link
                to={`/noticia/${noticia.categorias?.slug ?? 'geral'}/${noticia.slug}`}
                className="block px-4 py-3 hover:bg-brand-grafite/50 transition-colors group"
              >
                <p className="text-sm text-brand-creme leading-snug line-clamp-2 group-hover:text-brand-laranja transition-colors">
                  {noticia.titulo}
                </p>
                <span className="text-xs text-brand-muted mt-1 block">
                  {noticia.data_publicacao 
                    ? formatDistanceToNow(new Date(noticia.data_publicacao), { locale: ptBR, addSuffix: true }) 
                    : 'Recentemente'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
