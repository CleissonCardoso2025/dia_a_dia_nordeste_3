import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Modo TV Signage — Dia a Dia Nordeste',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TVLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
