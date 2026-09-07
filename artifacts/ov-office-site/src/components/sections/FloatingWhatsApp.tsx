import { globalData } from '@/data/content';
import { FaWhatsapp } from 'react-icons/fa';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';

export function FloatingWhatsApp() {
  const [location] = useLocation();

  return (
    <div className={cn(
      "fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-[calc(1rem+env(safe-area-inset-left))] z-50 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-1000 fill-mode-both sm:bottom-6 sm:left-6",
      location === '/contact' && "max-lg:hidden"
    )}>
      <a
        href={globalData.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        data-conversion="whatsapp-click"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
        aria-label="تواصل معنا عبر واتساب"
        data-testid="floating-whatsapp"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
        <FaWhatsapp className="w-7 h-7 relative z-10" />

        {/* Tooltip */}
        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white text-secondary text-sm font-bold rounded-lg shadow-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
          تواصل معنا الآن
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-white"></div>
        </div>
      </a>
    </div>
  );
}
