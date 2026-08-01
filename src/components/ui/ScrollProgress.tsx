import { motion } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollProgress';

export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <motion.div
      className="fixed top-0 left-0 z-100 h-0.75 bg-brand-laranja origin-left rounded-r-full"
      style={{ scaleX: progress / 100, transformOrigin: '0%' }}
      initial={{ scaleX: 0 }}
    />
  );
}
