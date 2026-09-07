import { HTMLMotionProps, motion } from 'framer-motion';
import { ReactNode } from 'react';
import { scaleRevealVariant } from './variants';
import { cn } from '@/lib/utils';

interface RevealImageProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  className?: string;
  effect?: 'scale' | 'mask' | 'clip';
}

export function RevealImage({ children, delay = 0, effect = 'scale', className, ...props }: RevealImageProps) {
  let variants: any;

  if (effect === 'scale') {
    variants = {
      hidden: { opacity: 0, scale: 1.05 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay } }
    };
  } else if (effect === 'clip') {
    variants = {
      hidden: { opacity: 0, clipPath: 'inset(10% 10% 10% 10%)' },
      visible: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay } }
    };
  } else {
    variants = {
      hidden: { opacity: 0, filter: 'blur(10px)' },
      visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay } }
    };
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={variants}
      className={cn('overflow-hidden', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
