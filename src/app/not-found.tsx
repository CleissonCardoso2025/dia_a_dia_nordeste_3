import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Home, Search, ArrowLeft, AlertCircle, Compass } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página Não Encontrada (404) | Dia a Dia Nordeste',
  description: 'A página que você está procurando não existe ou foi removida.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  const categoriasPrincipais = [
    { nome: 'Ribeira do Pombal', slug: 'ribeira-do-pombal' },
    { nome: 'Cícero Dantas', slug: 'cicero-dantas' },
    { nome: 'Euclides da Cunha', slug: 'euclides-da-cunha' },
    { nome: 'Policial', slug: 'policial' },
    { nome: 'Política', slug: 'politica' },
    { nome: 'Esportes', slug: 'esportes' },
  ];

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 md:py-20 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Badge e Código 404 */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-laranja/10 border border-brand-laranja/20 text-brand-laranja text-sm font-semibold">
            <AlertCircle size={16} />
            <span>Erro 404</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-titulo font-black text-6xl md:text-8xl text-brand-laranja tracking-tight">
              404
            </h1>
            <h2 className="font-titulo font-bold text-2xl md:text-3xl text-brand-creme">
              Página não encontrada
            </h2>
            <p className="text-brand-muted text-base md:text-lg max-w-lg mx-auto leading-relaxed">
              O endereço solicitado não existe, foi movido ou não está mais disponível no portal Dia a Dia Nordeste.
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-laranja hover:bg-brand-laranja/90 text-white font-bold text-sm shadow-lg shadow-brand-laranja/20 transition-all hover:scale-[1.02]"
            >
              <Home size={18} />
              <span>Página Inicial</span>
            </Link>

            <Link
              href="/busca"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-surface hover:bg-brand-border text-brand-creme font-medium text-sm border border-brand-border transition-all"
            >
              <Search size={18} />
              <span>Buscar Notícias</span>
            </Link>
          </div>

          {/* Atalhos para categorias populares */}
          <div className="pt-6 border-t border-brand-border/60">
            <p className="text-xs uppercase tracking-wider text-brand-muted font-semibold mb-4 flex items-center justify-center gap-1.5">
              <Compass size={14} className="text-brand-laranja" />
              <span>Ou explore as seções populares</span>
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {categoriasPrincipais.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  className="px-3.5 py-1.5 text-xs rounded-lg bg-brand-surface/70 hover:bg-brand-laranja/10 hover:text-brand-laranja hover:border-brand-laranja/30 text-brand-muted border border-brand-border transition-colors font-medium"
                >
                  {cat.nome}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
