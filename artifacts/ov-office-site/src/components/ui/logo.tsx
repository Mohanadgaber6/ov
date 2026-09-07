import { cn } from '@/lib/utils';
import logoImage from '@assets/logo-web-trimmed.png';

interface LogoProps {
  className?: string;
  isLight?: boolean;
}

export function Logo({ className, isLight = false }: LogoProps) {
  return (
    <div className={cn("flex h-11 w-28 sm:h-14 sm:w-36 items-center", className)}>
      <img
        src={logoImage}
        alt="شعار أوفي الذكية الرسمي"
        className={cn("h-full w-full object-contain")}
      />
    </div>
  );
}
