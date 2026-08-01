import { motion, AnimatePresence } from 'framer-motion';
import { splashContainerVariants, splashLogoVariants } from '@/animations/variants';

interface PreloaderProps {
  visible: boolean;
}

export default function Preloader({ visible }: PreloaderProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          variants={splashContainerVariants}
          initial="initial"
          animate="initial"
          exit="exit"
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-brand-grafite"
          aria-hidden="true"
        >
          {/* Logo animada */}
          <motion.div
            variants={splashLogoVariants}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center gap-3"
          >
            {/* Logo oficial */}
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img
                src="https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/logo/logo_%20diaadia.png"
                alt="Dia a Dia Nordeste"
                className="h-20 w-auto object-contain"
              />
            </motion.div>
          </motion.div>

          {/* Barra de carregamento */}
          <motion.div
            className="mt-8 h-0.5 w-32 rounded-full bg-brand-border overflow-hidden"
          >
            <motion.div
              className="h-full bg-brand-laranja rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
