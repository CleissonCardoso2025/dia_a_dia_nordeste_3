import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/index.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dia a Dia Nordeste',
  description: 'Portal de notícias do Nordeste brasileiro. Cobertura completa de política, economia, cultura e muito mais.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://diaadianordeste.com.br'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100`}>
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
