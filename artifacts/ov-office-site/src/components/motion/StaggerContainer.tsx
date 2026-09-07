import { HTMLMotionProps, motion } from 'framer-motion';
import { ReactNode } from 'react';
import { staggerContainerVariant } from './variants';

interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
}

export function StaggerContainer({ children, delay, ...props }: StaggerContainerProps) {
  const variants = {
    ...staggerContainerVariant,
    visible: {
      ...staggerContainerVariant.visible,
      transition: {
        ...(staggerContainerVariant.visible as any).transition,
        delayChildren: delay !== undefined ? delay : 0.1,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
}
