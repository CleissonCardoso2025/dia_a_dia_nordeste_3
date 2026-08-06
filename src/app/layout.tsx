import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/index.css';

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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
