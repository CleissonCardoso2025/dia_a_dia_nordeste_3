import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, LogIn } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    });
    if (error) {
      setErro('E-mail ou senha inválidos.');
    } else {
      onLogin();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-grafite flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/logo/logo_%20diaadia.png"
            alt="Dia a Dia Nordeste"
            className="h-16 w-auto object-contain mb-3"
          />
          <h1 className="font-titulo font-bold text-brand-creme text-xl">Painel Admin</h1>
        </div>

        <form onSubmit={handleLogin} className="bg-brand-surface rounded-2xl border border-brand-border p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-lg bg-brand-grafite border border-brand-border px-3 py-2.5 text-sm text-brand-creme focus:outline-none focus:border-brand-laranja transition-colors"
              placeholder="admin@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-1">Senha</label>
            <div className="relative">
              <input
                type={showSenha ? 'text' : 'password'}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
                className="w-full rounded-lg bg-brand-grafite border border-brand-border px-3 py-2.5 pr-10 text-sm text-brand-creme focus:outline-none focus:border-brand-laranja transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowSenha(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted"
                aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showSenha ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {erro && (
            <p className="text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{erro}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-laranja py-2.5 text-sm font-bold text-white hover:bg-brand-laranja-dark transition-colors disabled:opacity-60"
          >
            {loading ? (
              <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <>
                <LogIn size={15} />
                Entrar
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
