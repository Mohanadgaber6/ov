import { HTMLMotionProps, motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, keyof ButtonProps>, ButtonProps {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
}

const MotionButton = motion.create(Button);

export function AnimatedButton({ children, className, asChild, ...props }: AnimatedButtonProps) {
  return (
    <MotionButton
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className={cn('relative overflow-hidden', className)}
      asChild={asChild}
      {...props as any}
    >
      {children}
    </MotionButton>
  );
}
