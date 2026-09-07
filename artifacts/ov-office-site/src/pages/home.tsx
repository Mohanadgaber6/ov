import { useEffect } from 'react';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { InvestorServices } from '@/components/sections/InvestorServices';
import { WhyUs } from '@/components/sections/WhyUs';
import { HowWeWork } from '@/components/sections/HowWeWork';
import { Packages } from '@/components/sections/Packages';
import { Platforms } from '@/components/sections/Platforms';
import { FAQ } from '@/components/sections/FAQ';
import { Blog } from '@/components/sections/Blog';
import { ContactCTA } from '@/components/sections/Contact';
import { OfficeLocation } from '@/components/sections/OfficeLocation';
import { RequestSteps } from '@/components/sections/RequestSteps';
import { useSEO } from '@/hooks/use-seo';
import { globalData } from '@/data/content';

export default function Home() {
  useEffect(() => {
    const sectionId = window.location.hash.slice(1);
    if (!sectionId) return;
    const timer = window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ block: 'start' });
    }, 250);
    return () => window.clearTimeout(timer);
  }, []);

  useSEO({
    title: 'الرئيسية',
    description: 'شريكك الموثوق لتأسيس وتطوير أعمالك في السعودية. نقدم حلولاً متكاملة للمستثمرين وأصحاب الأعمال.',
    canonical: globalData.website,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["Organization", "LocalBusiness"],
          "name": globalData.companyName,
          "alternateName": globalData.companyNameEn,
          "url": globalData.website,
          "telephone": globalData.phone,
          "email": globalData.email,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "مكة المكرمة",
            "addressCountry": "SA",
            "streetAddress": globalData.address
          },
          "hasMap": globalData.mapsLink
        }
      ]
    }
  });

  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Introduction to OV Office */}
      <About />

      {/* 3. Main Service Categories (refactored visual highlight) */}
      <Services />

      {/* 4. Investor Services Highlight */}
      <InvestorServices />

      {/* 5. Packages */}
      <Packages />

      {/* 6. Request steps */}
      <RequestSteps />

      {/* 7. Why OV Office */}
      <WhyUs />

      {/* 8. Government Platforms */}
      <Platforms />

      {/* 9. Full seven-step customer journey */}
      <HowWeWork />

      {/* 10. Latest Knowledge Center Articles */}
      <Blog />

      {/* 11. FAQ Preview */}
      <FAQ />

      {/* 12. Office location */}
      <OfficeLocation />

      {/* 13. Contact CTA */}
      <ContactCTA />
    </>
  );
}
