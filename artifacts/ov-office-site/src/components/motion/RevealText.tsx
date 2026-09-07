import { HTMLMotionProps, motion } from 'framer-motion';
import { ReactNode } from 'react';
import { fadeUpVariant } from './variants';

interface RevealTextProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  as?: any;
}

export function RevealText({ children, delay = 0, as: Component = motion.div, ...props }: RevealTextProps) {
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay } },
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
