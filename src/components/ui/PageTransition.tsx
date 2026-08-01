import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { pageVariants } from '@/animations/variants';

interface PageTransitionProps {
  children: React.ReactNode;
  keyId: string;
}

export default function PageTransition({ children, keyId }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyId}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
