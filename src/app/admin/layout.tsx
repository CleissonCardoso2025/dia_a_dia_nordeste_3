'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import AdminLogin from './login/page';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-brand-grafite flex items-center justify-center text-brand-creme">Carregando...</div>;
  }

  // Se não estiver logado, exibe a página de login independentemente da rota admin
  if (!user) {
    return <AdminLogin />;
  }

  return <>{children}</>;
}
