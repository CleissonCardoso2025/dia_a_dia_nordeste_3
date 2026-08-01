import type { Variants } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────
// SPLASH / PRELOADER
// ─────────────────────────────────────────────────────────────────
export const splashContainerVariants: Variants = {
  initial: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
};

export const splashLogoVariants: Variants = {
  initial: { opacity: 0, scale: 0.7 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─────────────────────────────────────────────────────────────────
// HERO — TITLE WORD REVEAL (stagger)
// ─────────────────────────────────────────────────────────────────
export const heroContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.3,
    },
  },
};

export const heroWordVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export const heroOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

// ─────────────────────────────────────────────────────────────────
// CARDS — CASCATA (whileInView + stagger)
// ─────────────────────────────────────────────────────────────────
export const gridContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─────────────────────────────────────────────────────────────────
// PAGE TRANSITIONS
// ─────────────────────────────────────────────────────────────────
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

// ─────────────────────────────────────────────────────────────────
// SIDEBAR ITEMS — fade + slide em sequência
// ─────────────────────────────────────────────────────────────────
export const sidebarContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

export const sidebarItemVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// ─────────────────────────────────────────────────────────────────
// MENU MOBILE
// ─────────────────────────────────────────────────────────────────
export const mobileMenuVariants: Variants = {
  closed: { x: '100%', opacity: 0 },
  open: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// ─────────────────────────────────────────────────────────────────
// CATEGORY PILL (spring hover)
// Sem type Variants para preservar literais de tipo no transition
// ─────────────────────────────────────────────────────────────────
export const pillHoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.06,
    transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
  },
};

// ─────────────────────────────────────────────────────────────────
// FADE IN (genérico)
// ─────────────────────────────────────────────────────────────────
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// ─────────────────────────────────────────────────────────────────
// DRAWER / TOAST (slide-up)
// ─────────────────────────────────────────────────────────────────
export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};
