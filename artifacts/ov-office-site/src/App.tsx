import { useEffect, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';

import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { FloatingWhatsApp } from '@/components/sections/FloatingWhatsApp';

import Home from '@/pages/home';
import AboutPage from '@/pages/about';
import ServicesIndexPage from '@/pages/services/index';
import IndividualServicePage from '@/pages/services/[slug]';
import ServiceCategoryPage from '@/pages/services/category';
import CompanyServicesPage from '@/pages/company-services';
import InvestorServicesPage from '@/pages/investor-services';
import PackagesPage from '@/pages/packages';
import KnowledgeCenterPage from '@/pages/knowledge-center';
import FAQPage from '@/pages/faq';
import ContactPage from '@/pages/contact';
import RequestServicePage from '@/pages/request-service';
import NotFound from '@/pages/not-found';
import ArticlePage from '@/pages/articles/[slug]';
import LegalPage from '@/pages/legal';
import { installConversionTracking } from '@/lib/analytics';

const queryClient = new QueryClient();

function resetPageScroll() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    if (window.location.hash) return;

    resetPageScroll();
  }, [location]);

  useEffect(() => {
    const handleSameRouteNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.hash) return;

      const isSameRoute =
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search;

      if (isSameRoute) resetPageScroll();
    };

    document.addEventListener('click', handleSameRouteNavigation, true);
    return () => document.removeEventListener('click', handleSameRouteNavigation, true);
  }, []);

  return null;
}

function SharedShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const isHome = location === '/';

  return (
    <div className="font-sans antialiased text-foreground bg-background min-h-[100dvh] flex flex-col">
      <Navbar />
      <main className={`flex-grow ${isHome ? '' : 'pt-[68px]'}`}>
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

function Router() {
  useEffect(() => installConversionTracking(), []);
  const [location] = useLocation();

  return (
    <RoutedErrorBoundary>
      <SharedShell>
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex-grow flex flex-col"
          >
            <Switch location={location}>
              <Route path="/" component={Home} />
              <Route path="/about" component={AboutPage} />

              <Route path="/services" component={ServicesIndexPage} />
              <Route path="/services/category/:categoryId" component={ServiceCategoryPage} />
              <Route path="/services/:slug" component={IndividualServicePage} />

              <Route path="/company-services" component={CompanyServicesPage} />
              <Route path="/investor-services" component={InvestorServicesPage} />
              <Route path="/packages" component={PackagesPage} />
              <Route path="/knowledge-center" component={KnowledgeCenterPage} />
              <Route path="/faq" component={FAQPage} />
              <Route path="/contact" component={ContactPage} />
              <Route path="/request-service" component={RequestServicePage} />
              <Route path="/articles/:slug" component={ArticlePage} />
              <Route path="/privacy">{() => <LegalPage type="privacy" />}</Route>
              <Route path="/terms">{() => <LegalPage type="terms" />}</Route>
              <Route path="/disclaimer">{() => <LegalPage type="disclaimer" />}</Route>

              <Route component={NotFound} />
            </Switch>
          </motion.div>
        </AnimatePresence>
      </SharedShell>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MotionConfig reducedMotion="user">
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <ScrollToTop />
            <Router />
          </WouterRouter>
        </MotionConfig>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
