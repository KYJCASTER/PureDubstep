import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

// Comic slam effect - scale bounce
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 1.1,
    rotate: 1,
  },
  animate: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.4,
      ease: [0.68, -0.55, 0.265, 1.55] as const,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    rotate: -1,
    transition: {
      duration: 0.25,
      ease: [0.68, -0.55, 0.265, 1.55] as const,
    },
  },
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Comic animation variants
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 40, rotate: -2 },
  animate: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.5, ease: [0.68, -0.55, 0.265, 1.55] as const }
  }
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  }
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.5, rotate: -3 },
  animate: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] as const }
  }
};

// Card hover with comic shake
export const cardHover = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.03,
    rotate: -1,
    transition: { duration: 0.15 }
  }
};

// Slide from sides
export const slideFromLeft: Variants = {
  initial: { opacity: 0, x: -100, rotate: -5 },
  animate: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] as const }
  }
};

export const slideFromRight: Variants = {
  initial: { opacity: 0, x: 100, rotate: 5 },
  animate: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] as const }
  }
};
