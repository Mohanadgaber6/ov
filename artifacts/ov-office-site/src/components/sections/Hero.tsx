import { sections, globalData } from '@/data/content';
import { Button } from '@/components/ui/button';
import { FaWhatsapp } from 'react-icons/fa';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { StaggerContainer, RevealText, AnimatedButton } from '@/components/motion';

export function Hero() {
  const { hero } = sections;

  return (
    <section id="hero" className="relative min-h-[100svh] lg:min-h-[100dvh] flex items-center pt-24 pb-16 lg:pt-32 overflow-hidden bg-secondary">
      {/* Static image with a calm navy readability overlay. */}
      <div className="absolute inset-0 z-0">
        <picture>
          <img
            src={hero.image}
            alt="إطلالة جوية على مكة المكرمة والمسجد الحرام"
            className="w-full h-full object-cover object-[center_30%]"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-secondary/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/60 to-secondary/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-secondary/30" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer className="max-w-3xl">
          {/* Badge */}
          <RevealText>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-primary-foreground text-sm font-semibold mb-8 shadow-2xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              شريكك في إدارة خدمات الأعمال
            </div>
          </RevealText>

          {/* Title */}
          <RevealText>
            <h1 className="type-display mb-6 text-white font-bold leading-[1.2]">
              <span className="block">إدارة خدمات أعمالك</span>
              <span className="block text-white/90">من التأسيس إلى التشغيل</span>
            </h1>
          </RevealText>

          {/* Subtitle */}
          <RevealText>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl font-medium">
              {hero.subtitle}
            </p>
          </RevealText>

          {/* CTAs */}
          <RevealText>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <AnimatedButton asChild className="h-14 px-8 text-base bg-primary hover:bg-primary/90 text-white border-transparent w-full sm:w-auto font-bold rounded-lg">
                <Link href="/request-service" data-testid="hero-cta-primary">
                  {hero.primaryCta}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, delay: 0.4 }}>
                    <ArrowLeft className="w-5 h-5 mr-3 rtl-flip" />
                  </motion.div>
                </Link>
              </AnimatedButton>

              <AnimatedButton asChild className="h-14 px-8 text-base bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-md w-full sm:w-auto font-bold rounded-lg transition-colors">
                <Link href="/services" data-testid="hero-cta-secondary">
                  {hero.secondaryCta}
                </Link>
              </AnimatedButton>

              <a href={globalData.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm mt-4 sm:mt-0 sm:mr-4 group font-medium">
                <FaWhatsapp className="w-5 h-5 group-hover:scale-110 transition-transform text-[#25D366]" />
                تواصل عبر واتساب
              </a>
            </div>
          </RevealText>
        </StaggerContainer>
      </div>
    </section>
  );
}
