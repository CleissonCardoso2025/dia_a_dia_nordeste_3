import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, MessageCircle } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { mobileMenuVariants, pillHoverVariants } from '@/animations/variants';
import { getCategorias } from '@/lib/supabase';
import type { Categoria } from '@/types';

// Dados mock para desenvolvimento (sem Supabase configurado)
const MOCK_CATEGORIAS: Categoria[] = [
  { id: '1', nome: 'Ribeira do Pombal', slug: 'ribeira-do-pombal', cor_hex: '#84CC16' },
  { id: '2', nome: 'Euclides da Cunha', slug: 'euclides-da-cunha', cor_hex: '#D97706' },
  { id: '3', nome: 'Jeremoabo', slug: 'jeremoabo', cor_hex: '#E11D48' },
  { id: '4', nome: 'Cícero Dantas', slug: 'cicero-dantas', cor_hex: '#2563EB' },
  { id: '5', nome: 'Paripiranga', slug: 'paripiranga', cor_hex: '#6366F1' },
  { id: '6', nome: 'Cipó', slug: 'cipo', cor_hex: '#059669' },
  { id: '7', nome: 'Banzaê', slug: 'banzae', cor_hex: '#8B5CF6' },
  { id: '8', nome: 'Adustina', slug: 'adustina', cor_hex: '#D9491F' },
];

export default function Header() {
  const [categorias, setCategorias] = useState<Categoria[]>(MOCK_CATEGORIAS);
  const [menuAberto, setMenuAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getCategorias().then(({ data }) => {
      if (data && data.length > 0) setCategorias(data as Categoria[]);
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault();
    if (busca.trim()) {
      navigate(`/busca?q=${encodeURIComponent(busca.trim())}`);
      setBusca('');
      setMenuAberto(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 bg-brand-grafite ${
        scrolled
          ? 'shadow-lg border-b border-brand-border'
          : ''
      }`}
    >
      {/* Topo: logo + busca + ações */}
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0 group">
          <img
            src="https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/logo/logo_%20diaadia.png"
            alt="Dia a Dia Nordeste"
            className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Busca */}
        <form onSubmit={handleBusca} className="flex-1 max-w-md hidden md:flex">
          <div className="relative w-full">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
            />
            <input
              type="search"
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar notícias..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-brand-surface border border-brand-border text-sm text-brand-creme placeholder-brand-muted focus:outline-none focus:border-brand-laranja transition-colors"
            />
          </div>
        </form>

        {/* Ações */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {/* CTA Fale Conosco */}
          <motion.button
            onClick={() => navigate('/contato')}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden sm:flex items-center gap-1.5 rounded-full bg-brand-laranja px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-laranja-light transition-colors cursor-pointer border-none"
            aria-label="Envie sua pauta através do Fale Conosco"
          >
            <MessageCircle size={14} />
            Envie sua pauta
          </motion.button>

          {/* Menu mobile toggle */}
          <button
            onClick={() => setMenuAberto(v => !v)}
            className="lg:hidden flex items-center justify-center h-10 w-10 rounded-full border border-brand-border text-brand-creme hover:border-brand-laranja transition-colors"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          >
            {menuAberto ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>



      {/* Menu mobile overlay */}
      <AnimatePresence>
        {menuAberto && (
          <>
            {/* Backdrop blur */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuAberto(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer lateral */}
            <motion.div
              key="drawer"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="exit"
              className="fixed top-0 right-0 z-50 h-full w-72 bg-brand-grafite border-l border-brand-border shadow-2xl flex flex-col p-6 gap-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-titulo font-bold text-brand-creme">Menu</span>
                <button onClick={() => setMenuAberto(false)} aria-label="Fechar menu">
                  <X size={20} className="text-brand-muted" />
                </button>
              </div>

              {/* Busca mobile */}
              <form onSubmit={handleBusca}>
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                  <input
                    type="search"
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full pl-9 pr-4 py-2 rounded-full bg-brand-surface border border-brand-border text-sm text-brand-creme placeholder-brand-muted focus:outline-none focus:border-brand-laranja"
                  />
                </div>
              </form>

              {/* Links de categoria */}
              <nav className="flex flex-col gap-1">
                <NavLink
                  to="/"
                  end
                  onClick={() => setMenuAberto(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      isActive ? 'bg-brand-laranja text-white' : 'text-brand-muted hover:text-brand-creme hover:bg-brand-surface'
                    }`
                  }
                >
                  🏠 Início
                </NavLink>
                {categorias.map(cat => (
                  <NavLink
                    key={cat.id}
                    to={`/categoria/${cat.slug}`}
                    onClick={() => setMenuAberto(false)}
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                        isActive ? 'text-white' : 'text-brand-muted hover:text-brand-creme hover:bg-brand-surface'
                      }`
                    }
                    style={({ isActive }) =>
                      isActive ? { backgroundColor: cat.cor_hex } : {}
                    }
                  >
                    {cat.nome}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-auto">
                <a
                  href="https://wa.me/5500000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-full bg-[#25D366] py-2.5 text-sm font-semibold text-white"
                >
                  <MessageCircle size={16} />
                  Envie sua pauta
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
