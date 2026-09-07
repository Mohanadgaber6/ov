import { useSEO } from '@/hooks/use-seo';
import { sections } from '@/data/content';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import logoImage from '@assets/logo-web-trimmed.png';
import { MotionSection, RevealText, RevealImage, StaggerContainer, AnimatedButton } from '@/components/motion';
import { motion } from 'framer-motion';

export default function AboutPage() {
  useSEO({
    title: 'من نحن',
    description: sections.about.description1,
  });

  return (
    <div className="py-16 lg:py-24 bg-background min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Page Header */}
        <MotionSection className="max-w-3xl mx-auto text-center mb-24">
          <RevealText>
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
              قصة أوفي الذكية
            </div>
          </RevealText>
          <RevealText>
            <h1 className="text-4xl md:text-6xl font-bold text-secondary mb-6 leading-tight">
              عن الشركة
            </h1>
          </RevealText>
          <RevealText>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {sections.about.description1}
            </p>
          </RevealText>
        </MotionSection>

        {/* How We Work Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <MotionSection>
            <RevealImage effect="scale" className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[2rem] bg-secondary p-10 shadow-2xl sm:p-14 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                src={logoImage}
                alt="شعار أوفي الذكية"
                className="h-auto max-h-full w-full max-w-[78%] object-contain relative z-10 drop-shadow-xl"
              />
            </RevealImage>
          </MotionSection>

          <MotionSection>
            <RevealText>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-8">
                كيف نعمل
              </h2>
            </RevealText>
            <RevealText>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed mb-10 border-r-4 border-primary/20 pr-6">
                <p>ننظم ونتابع إجراءات وخدمات الأعمال من التأسيس وحتى التشغيل، وننسق الخطوات والمتطلبات مع الجهات والمنصات ذات العلاقة.</p>
                <p>نسعى إلى تبسيط الإجراءات وإزالة العوائق الإدارية، لنمنح المنشآت والمستثمرين التركيز الكامل على نمو مشاريعهم وتطويرها وفقاً لأعلى معايير السوق السعودي.</p>
              </div>
            </RevealText>
          </MotionSection>
        </div>

        {/* Vision, Mission, Values - Editorial Style */}
        <MotionSection className="max-w-5xl mx-auto mb-32 border-y border-border/50 py-14 lg:py-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-full bg-muted/20 rounded-full blur-[100px] pointer-events-none z-0" />

          <StaggerContainer className="grid md:grid-cols-3 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-border/50 relative z-10">
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="pt-8 md:pt-0 md:pl-8 group">
              <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                رؤيتنا
              </h3>
              <p className="text-secondary text-lg leading-relaxed font-medium group-hover:text-primary transition-colors">
                أن نكون من الخيارات الموثوقة للشركات والمستثمرين في إدارة خدمات الأعمال، من خلال تجربة منظمة وواضحة تساند نمو المنشآت واستمراريتها.
              </p>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="pt-8 md:pt-0 md:px-8 group">
              <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                رسالتنا
              </h3>
              <p className="text-secondary text-lg leading-relaxed font-medium group-hover:text-primary transition-colors">
                إدارة ومتابعة خدمات الأعمال والخدمات الحكومية بوضوح وتنظيم، ومساندة المنشآت في متابعة إجراءاتها من التأسيس إلى التشغيل.
              </p>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="pt-8 md:pt-0 md:pr-8 group">
              <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                قيمنا
              </h3>
              <p className="text-secondary text-lg leading-relaxed font-medium group-hover:text-primary transition-colors">
                النزاهة، الشفافية، الالتزام التام بالمواعيد، والعمل بروح الفريق الواحد لتحقيق النجاح المشترك والمستدام.
              </p>
            </motion.div>
          </StaggerContainer>
        </MotionSection>

        {/* CTA */}
        <MotionSection delay={0.2}>
          <div className="bg-secondary rounded-[2.5rem] p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <RevealText>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">ابدأ بخطوة واضحة لأعمالك</h2>
              </RevealText>
              <RevealText>
                <p className="text-white/80 text-xl mb-10 leading-relaxed">
                  اكتشف كيف يمكن لفريق أوفي الذكية أن يحدث فرقاً ملموساً في رحلتك الاستثمارية داخل المملكة.
                </p>
              </RevealText>
              <RevealText>
                <AnimatedButton asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-xl px-12 h-16 text-lg font-bold border-transparent shadow-lg shadow-primary/20">
                  <Link href="/contact">تواصل معنا الآن</Link>
                </AnimatedButton>
              </RevealText>
            </div>
          </div>
        </MotionSection>

      </div>
    </div>
  );
}
