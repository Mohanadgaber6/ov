import { useState, useEffect, useRef } from 'react';
import { globalData, navigation, serviceCategories } from '@/data/content';
import {
  BriefcaseBusiness,
  Building2,
  Calculator,
  ChevronDown,
  FileText,
  HeartHandshake,
  Landmark,
  Megaphone,
  Menu,
  Phone,
  Scale,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { Link, useLocation } from 'wouter';
import { getCategoryForService } from '@/lib/service-catalog';
import { motion, AnimatePresence } from 'framer-motion';

const categoryIcons: Record<string, LucideIcon> = {
  'business-setup': Building2,
  'government-services': Landmark,
  investors: BriefcaseBusiness,
  'operations-finance': Calculator,
  'digital-marketing-design': Megaphone,
  hr: Users,
  'insurance-support': HeartHandshake,
  legal: Scale,
  'payroll-finance': FileText,
};

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [location] = useLocation();

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuTriggerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const menuPreview = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('menu')
    : null;
  const forceMenuOpen = menuPreview === 'open';
  const forceMegaMenuOpen = menuPreview === 'mega';
  const showMobileMenu = mobileMenuOpen || forceMenuOpen;
  const showMobileServices = mobileServicesOpen || forceMenuOpen;
  const showMegaMenu = megaMenuOpen || forceMegaMenuOpen;
  const serviceSlug = location.startsWith('/services/') ? location.split('/').filter(Boolean).pop() : undefined;
  const activeCategoryId = serviceCategories.find((category) => location === category.href)?.id
    ?? (serviceSlug ? getCategoryForService(serviceSlug)?.id : undefined);

  const handleNavigation = () => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    setMegaMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    setMegaMenuOpen(false);
  }, [location]);

  // Click outside and Escape key to close mega menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMegaMenu &&
        megaMenuRef.current &&
        !megaMenuRef.current.contains(event.target as Node) &&
        megaMenuTriggerRef.current &&
        !megaMenuTriggerRef.current.contains(event.target as Node)
      ) {
        setMegaMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMegaMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMegaMenu]);

  // Mobile menu focus trap and body lock
  useEffect(() => {
    if (showMobileMenu) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      // Make main and footer inert if they exist
      document.querySelectorAll('main, footer').forEach(el => el.setAttribute('inert', 'true'));

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab' || !mobileMenuRef.current) return;
        const focusable = mobileMenuRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;

        const firstElement = focusable[0] as HTMLElement;
        const lastElement = focusable[focusable.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      };

      // Set initial focus
      setTimeout(() => {
        const firstFocusable = mobileMenuRef.current?.querySelector('a[href], button:not([disabled])') as HTMLElement;
        if (firstFocusable) firstFocusable.focus();
      }, 50);

      document.addEventListener('keydown', handleTab);
      return () => {
        document.removeEventListener('keydown', handleTab);
        document.body.style.overflow = '';
        document.querySelectorAll('main, footer').forEach(el => el.removeAttribute('inert'));
        if (previousFocusRef.current) previousFocusRef.current.focus();
      };
    }
    return undefined;
  }, [showMobileMenu]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b',
        isScrolled || location !== '/' || showMobileMenu
          ? 'bg-secondary/95 backdrop-blur-md shadow-sm py-3 border-white/10'
          : 'bg-transparent py-5 border-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" onClick={handleNavigation} className="flex-shrink-0 group relative z-50 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
            <Logo className="h-11 w-auto sm:h-12" isLight={true} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden h-full items-center gap-4 lg:flex lg:gap-6">
            {navigation.map((item) => (
              item.hasMegaMenu ? (
                <div
                  key={item.href}
                  ref={megaMenuTriggerRef}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setMegaMenuOpen(true)}
                  onMouseLeave={() => setMegaMenuOpen(false)}
                >
                  <button
                    onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                    aria-expanded={showMegaMenu}
                    aria-haspopup="true"
                    className={cn(
                      "flex items-center gap-1 whitespace-nowrap py-4 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 hover:text-primary",
                      location.startsWith('/services') ? "text-primary" : "text-white/90"
                    )}
                  >
                    {item.label}
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", showMegaMenu && "rotate-180")} />
                  </button>

                  {/* Mega Menu Dropdown */}
                  <AnimatePresence>
                    {showMegaMenu && (
                      <motion.div
                        ref={megaMenuRef}
                        role="menu"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full right-0 w-[600px] lg:w-[760px] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-border overflow-hidden origin-top"
                      >
                        <div className="grid grid-cols-2 gap-px bg-border/50 p-px lg:grid-cols-3">
                          {serviceCategories.map(cat => {
                            const Icon = categoryIcons[cat.id] ?? BriefcaseBusiness;
                            return (
                              <Link
                                key={cat.id}
                                href={cat.href}
                                onClick={handleNavigation}
                                role="menuitem"
                                aria-current={activeCategoryId === cat.id ? 'page' : undefined}
                                className={cn(
                                  "group flex items-center gap-4 px-6 py-5 transition-all duration-300 hover:bg-muted/50 relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
                                  activeCategoryId === cat.id ? "bg-primary/5" : "bg-white"
                                )}
                              >
                                {activeCategoryId === cat.id && (
                                  <div className="absolute inset-y-0 right-0 w-1 bg-primary" />
                                )}
                                <div className={cn(
                                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110",
                                  activeCategoryId === cat.id ? "bg-primary text-white" : "bg-primary/10"
                                )}>
                                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                                </div>
                                <span className={cn(
                                  "block text-sm font-bold transition-colors group-hover:text-primary",
                                  activeCategoryId === cat.id ? "text-primary" : "text-secondary"
                                )}>
                                  {cat.title}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                        <div className="bg-muted p-5 text-center border-t border-border/50">
                          <Link href="/services" onClick={handleNavigation} role="menuitem" className="inline-flex items-center gap-2 text-primary font-bold hover:underline transition-all hover:gap-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1">
                            عرض جميع الخدمات وتفاصيلها
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavigation}
                  className={cn(
                    "whitespace-nowrap py-4 px-2 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md hover:text-primary",
                    location === item.href ? "text-primary" : "text-white/90"
                  )}
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden items-center lg:flex">
            <Button asChild className="gap-2 bg-primary hover:bg-primary/90 text-white border-transparent shadow-lg shadow-primary/20 transition-all hover:shadow-xl font-bold h-11 px-6 rounded-lg">
              <Link href="/request-service" onClick={handleNavigation} data-testid="nav-request-service">
                اطلب خدمة
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="z-50 flex items-center lg:hidden">
            <button
              type="button"
              className={cn("p-2 -mr-2 transition-colors text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md")}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={showMobileMenu}
              aria-controls="mobile-navigation"
            >
              <span className="sr-only">{showMobileMenu ? 'إغلاق القائمة' : 'فتح القائمة'}</span>
              {showMobileMenu ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            className="absolute inset-x-0 top-full z-40 h-[calc(100dvh-68px)] overflow-y-auto border-t border-white/10 bg-secondary lg:hidden"
          >
            <div className="px-4 py-8 space-y-2">
              {navigation.map((item) => item.hasMegaMenu ? (
                <div key={item.href}>
                  <div className="flex items-center gap-2">
                    <Link
                      href={item.href}
                      onClick={handleNavigation}
                      className={cn(
                        "flex-1 rounded-xl px-4 py-3 text-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        location === item.href ? "bg-primary/20 text-primary" : "text-white hover:bg-white/5"
                      )}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      className="rounded-xl p-3 text-white hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      aria-expanded={showMobileServices}
                      aria-label="عرض تصنيفات الخدمات"
                    >
                      <ChevronDown className={cn("h-6 w-6 transition-transform duration-300", showMobileServices && "rotate-180")} />
                    </button>
                  </div>
                  <AnimatePresence>
                    {showMobileServices && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mr-4 mt-2 grid gap-1 border-r-2 border-primary/30 py-2 pr-4">
                          {serviceCategories.map(cat => (
                            <Link
                              key={cat.id}
                              href={cat.href}
                              onClick={handleNavigation}
                              aria-current={activeCategoryId === cat.id ? 'page' : undefined}
                              className={cn(
                                "block rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                activeCategoryId === cat.id ? "bg-primary/20 text-primary" : "text-white/80"
                              )}
                            >
                              {cat.title}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavigation}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    location === item.href ? "bg-primary/20 text-primary" : "text-white hover:bg-white/5"
                  )}
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-10 pt-8 border-t border-white/10 flex flex-col gap-4">
                <Button asChild className="w-full justify-center gap-2 bg-primary text-white border-transparent h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 focus-visible:ring-white">
                  <Link href="/request-service" onClick={handleNavigation}>
                    اطلب خدمة الآن
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border-[#25D366]/30 h-14 rounded-xl text-lg font-bold focus-visible:ring-white">
                  <a href={globalData.whatsappLink} target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp className="w-6 h-6" />
                    تواصل عبر واتساب
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-center gap-2 bg-white/5 hover:bg-white/10 border-white/10 text-white h-14 rounded-xl text-lg font-bold mt-2 focus-visible:ring-white">
                  <a href={`tel:${globalData.phone}`}>
                    <Phone className="w-5 h-5" />
                    <span className="dir-ltr inline-block" dir="ltr">{globalData.phoneDisplay}</span>
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
