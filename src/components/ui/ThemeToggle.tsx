import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      className="relative flex h-8 w-8 items-center justify-center rounded-full border border-brand-border bg-brand-surface text-brand-creme transition-colors hover:border-brand-laranja"
    >
      <motion.span
        key={theme}
        initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
        transition={{ duration: 0.25 }}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </motion.span>
    </motion.button>
  );
}
