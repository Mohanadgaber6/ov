import { useEffect } from 'react';
import { useSEO } from '@/hooks/use-seo';
import { sections } from '@/data/content';
import { PackageCards } from '@/components/sections/Packages';
import { MotionSection, RevealText } from '@/components/motion';

export default function PackagesPage() {
  useEffect(() => {
    const sectionId = window.location.hash.slice(1);
    if (!sectionId) return;
    const timer = window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ block: 'start' });
    }, 250);
    return () => window.clearTimeout(timer);
  }, []);

  useSEO({
    title: 'باقات الأعمال',
    description: sections.packages.subtitle,
  });

  return (
    <div className="bg-background py-16 lg:py-24 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:30px_30px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <MotionSection className="mx-auto mb-20 max-w-3xl text-center">
          <RevealText>
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
              باقات مرنة حسب احتياج منشأتك
            </div>
          </RevealText>
          <RevealText>
            <h1 className="mb-6 text-4xl font-bold text-secondary md:text-6xl">{sections.packages.title}</h1>
          </RevealText>
          <RevealText>
            <p className="text-xl leading-relaxed text-muted-foreground border-r-2 border-primary/30 pr-6 inline-block mb-4">
              {sections.packages.subtitle}
            </p>
          </RevealText>
          <RevealText>
            <p className="text-sm font-medium text-muted-foreground/80 bg-muted/50 inline-block px-4 py-2 rounded-lg">
              اضغط على عرض تفاصيل الباقة، ثم افتح الجهة لعرض الخدمات الفرعية المشمولة.
            </p>
          </RevealText>
        </MotionSection>

        <PackageCards />
      </div>
    </div>
  );
}
