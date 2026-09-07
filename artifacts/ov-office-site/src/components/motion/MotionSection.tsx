import { HTMLMotionProps, motion } from 'framer-motion';
import { ReactNode } from 'react';
import { fadeUpVariant } from './variants';

interface MotionSectionProps extends HTMLMotionProps<'section'> {
  children: ReactNode;
  delay?: number;
}

export function MotionSection({ children, delay = 0, ...props }: MotionSectionProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay } },
      }}
      {...props}
    >
      {children}
    </motion.section>
  );
}
