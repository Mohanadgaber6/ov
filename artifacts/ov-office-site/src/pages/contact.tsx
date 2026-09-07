import { useEffect } from 'react';
import { useSEO } from '@/hooks/use-seo';
import { Contact, ContactCTA } from '@/components/sections/Contact';
import { OfficeLocation } from '@/components/sections/OfficeLocation';
import { MotionSection, RevealText } from '@/components/motion';

export default function ContactPage() {
  useEffect(() => {
    const sectionId = window.location.hash.slice(1);
    if (!sectionId) return;
    const timer = window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ block: 'start' });
    }, 250);
    return () => window.clearTimeout(timer);
  }, []);

  useSEO({
    title: 'تواصل معنا',
    description: 'نحن هنا للإجابة على استفساراتك ومساعدتك في تحقيق أهدافك التجارية. تواصل مع فريق أوفي الذكية اليوم.',
  });

  return (
    <div className="bg-background pt-16 lg:pt-24 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:30px_30px]" />

      <div className="container mx-auto mb-16 max-w-3xl px-4 text-center sm:px-6 lg:px-8 relative z-10">
        <MotionSection>
          <RevealText>
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
              كيف يمكننا مساعدتك؟
            </div>
          </RevealText>
          <RevealText>
            <h1 className="mb-6 text-4xl font-bold text-secondary md:text-6xl">
              تواصل معنا
            </h1>
          </RevealText>
          <RevealText>
            <p className="text-xl leading-relaxed text-muted-foreground">
              يسعدنا استقبال استفسارك ومساعدتك في تحديد الخدمة المناسبة لمنشأتك. فريق أوفي الذكية مستعد دائماً للرد على أسئلتك.
            </p>
          </RevealText>
        </MotionSection>
      </div>

      <div className="relative z-10">
        <Contact compact />
        <OfficeLocation />
        <ContactCTA />
      </div>
    </div>
  );
}
