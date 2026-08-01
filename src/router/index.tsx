import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollProgress from '@/components/ui/ScrollProgress';
import Preloader from '@/components/ui/Preloader';
import Home from '@/pages/Home';
import CategoryPage from '@/pages/CategoryPage';
import ArticlePage from '@/pages/ArticlePage';
import SearchPage from '@/pages/SearchPage';
import RssPage from '@/pages/RssPage';
import SobrePage from '@/pages/institutional/SobrePage';
import PoliticaEditorialPage from '@/pages/institutional/PoliticaEditorialPage';
import PrivacidadePage from '@/pages/institutional/PrivacidadePage';
import TermosPage from '@/pages/institutional/TermosPage';
import ContatoPage from '@/pages/institutional/ContatoPage';
import AnunciePage from '@/pages/institutional/AnunciePage';
import AdminLogin from '@/pages/admin/AdminLogin';
import Dashboard from '@/pages/admin/Dashboard';
import ArticleEditor from '@/pages/admin/ArticleEditor';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

import TVDisplayPage from '@/pages/TVDisplayPage';

// Detecta preferência por menos animações
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function AdminGuard({ children, user, onLogin, onLogout }: {
  children: React.ReactNode;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}) {
  if (!user) return <AdminLogin onLogin={onLogin} />;
  return <>{children}</>;
}

export default function AppRouter() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isTvRoute = location.pathname.startsWith('/tv');

  const [preloaderVisible, setPreloaderVisible] = useState(!prefersReducedMotion);
  const [adminUser, setAdminUser] = useState<User | null>(null);

  // Rola a pagina para o topo automaticamente a cada mudanca de rota (ex: links do rodape)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Preloader: desaparece após 1.5s
  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setTimeout(() => setPreloaderVisible(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Auth state para admin
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setAdminUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (isTvRoute) {
    return (
      <Routes location={location} key={location.pathname}>
        <Route path="/tv" element={<TVDisplayPage />} />
        <Route path="/tv/:categoria" element={<TVDisplayPage />} />
      </Routes>
    );
  }

  return (
    <>
      <Preloader visible={preloaderVisible} />
      {!isAdmin && <ScrollProgress />}

      {isAdmin ? (
        // Layout admin (sem header/footer público)
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/admin"
              element={
                <AdminGuard user={adminUser} onLogin={() => {}} onLogout={() => setAdminUser(null)}>
                  <Dashboard onLogout={() => setAdminUser(null)} />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/nova"
              element={
                <AdminGuard user={adminUser} onLogin={() => {}} onLogout={() => setAdminUser(null)}>
                  <ArticleEditor />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/editar/:id"
              element={
                <AdminGuard user={adminUser} onLogin={() => {}} onLogout={() => setAdminUser(null)}>
                  <ArticleEditor />
                </AdminGuard>
              }
            />
          </Routes>
        </AnimatePresence>
      ) : (
        // Layout público
        <div className="min-h-screen bg-brand-grafite flex flex-col">
          <Header />
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/categoria/:slug" element={<CategoryPage />} />
                <Route path="/noticia/:categoriaSlug/:slugNoticia" element={<ArticlePage />} />
                <Route path="/busca" element={<SearchPage />} />
                <Route path="/rss" element={<RssPage />} />
                <Route path="/sobre" element={<SobrePage />} />
                <Route path="/politica-editorial" element={<PoliticaEditorialPage />} />
                <Route path="/privacidade" element={<PrivacidadePage />} />
                <Route path="/termos" element={<TermosPage />} />
                <Route path="/contato" element={<ContatoPage />} />
                <Route path="/anuncie" element={<AnunciePage />} />
                <Route
                  path="*"
                  element={
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                      <p className="text-8xl font-titulo font-black text-brand-laranja mb-4">404</p>
                      <p className="text-brand-creme text-xl mb-2">Página não encontrada</p>
                      <a href="/" className="text-brand-laranja hover:underline text-sm">← Voltar ao início</a>
                    </div>
                  }
                />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}
