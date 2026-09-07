import { useSEO } from '@/hooks/use-seo';
import { serviceCategories, allServices } from '@/data/content';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft, TrendingUp, CheckCircle2, Globe, Building, Landmark, Settings } from 'lucide-react';
import makkahImage from '@assets/20241216192232897_(1)_1788430914631.jpg';
import { getServicePageHref } from '@/lib/service-catalog';
import { MotionSection, RevealText, RevealImage, StaggerContainer, AnimatedButton } from '@/components/motion';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function InvestorServicesPage() {
  useSEO({
    title: 'خدمات المستثمرين',
    description: 'باقة متكاملة من الخدمات المخصصة لرجال الأعمال والمستثمرين لتهيئة بيئة خصبة لنمو الاستثمار في السعودية.',
  });

  const category = serviceCategories.find(c => c.id === 'investors');

  const journeyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ["start center", "end center"]
  });

  const journeySteps = [
    { icon: Globe, title: 'إجراءات المستثمر', desc: 'استخراج التراخيص الاستثمارية الأولية (MISA)' },
    { icon: Building, title: 'تأسيس الكيان', desc: 'صياغة عقود التأسيس للكيانات الأجنبية أو المختلطة' },
    { icon: Landmark, title: 'السجل التجاري', desc: 'الإصدار الرسمي للسجل وفتح الملفات الأساسية' },
    { icon: Settings, title: 'تفعيل المنصات', desc: 'الربط مع الجهات الحكومية لبدء التشغيل النظامي' },
    { icon: TrendingUp, title: 'بدء التشغيل', desc: 'متابعة دورية لضمان الامتثال واستمرار النمو' }
  ];

  return (
    <div className="bg-background min-h-screen">

      {/* Dark Premium Hero */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-secondary">
        {/* Background visual */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            src={makkahImage}
            alt="صورة جوية للمسجد الحرام في مكة المكرمة"
            className="w-full h-full object-cover mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-transparent to-transparent opacity-90" />
        </div>

        {/* Subtle animated lines representing connections */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M -100,100 Q 300,300 800,100 T 1500,200"
              fill="transparent"
              stroke="url(#grad1)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            <motion.path
              d="M 100,500 Q 600,200 1000,400 T 1800,300"
              fill="transparent"
              stroke="url(#grad1)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear', delay: 1 }}
            />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <MotionSection>
              <RevealText>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm font-bold mb-8 border border-primary/30 backdrop-blur-md">
                  <TrendingUp className="w-4 h-4" />
                  بوابة الدخول للسوق السعودي
                </div>
              </RevealText>

              <RevealText>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-[1.2]">
                  خدمات المستثمرين <br/>في السعودية
                </h1>
              </RevealText>

              <RevealText>
                <p className="text-xl text-white/70 leading-relaxed mb-10">
                  ندرك أهمية توفير بيئة قانونية وتنظيمية مستقرة لرؤوس الأموال. نقدم للمستثمر الأجنبي والمحلي مساراً واضحاً وسريعاً للترخيص والتشغيل دون تعقيدات بيروقراطية.
                </p>
              </RevealText>

              <StaggerContainer className="grid sm:grid-cols-2 gap-4 mb-12">
                {[
                  'تأسيس الكيانات وفق نظام الاستثمار',
                  'استخراج التراخيص (MISA)',
                  'الإقامات المميزة للمستثمرين',
                  'إدارة المنصات الحكومية'
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-bold text-white/90 text-sm">{item}</span>
                  </motion.div>
                ))}
              </StaggerContainer>

              <RevealText>
                <AnimatedButton asChild className="bg-primary hover:bg-primary/90 text-white px-8 h-14 font-bold rounded-xl shadow-lg shadow-primary/20 w-full sm:w-auto">
                  <Link href="/request-service">
                    ابدأ رحلتك الاستثمارية
                    <ArrowLeft className="w-5 h-5 mr-3 rtl-flip" />
                  </Link>
                </AnimatedButton>
              </RevealText>
            </MotionSection>
          </div>
        </div>
      </section>

      {/* Visual Investor Journey */}
      <section className="py-16 lg:py-24 bg-white border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MotionSection className="text-center max-w-2xl mx-auto mb-20">
            <RevealText>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6">رحلة المستثمر</h2>
            </RevealText>
            <RevealText>
              <p className="text-lg text-muted-foreground">
                مسار مترابط يضمن انتقالك من فكرة الاستثمار إلى التشغيل الفعلي على أرض الواقع في المملكة العربية السعودية.
              </p>
            </RevealText>
          </MotionSection>

          <div className="relative max-w-5xl mx-auto" ref={journeyRef}>
            {/* Animated Connection Line */}
            <div className="absolute top-1/2 right-0 w-full h-1 bg-muted -translate-y-1/2 hidden md:block rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-l from-primary via-primary/50 to-primary origin-right"
                style={{ scaleX: scrollYProgress }}
              />
            </div>

            <div className="grid md:grid-cols-5 gap-8 relative z-10">
              {journeySteps.map((step, index) => {
                const Icon = step.icon;
                const stepProgress = index / (journeySteps.length - 1);
                const isActive = useTransform(scrollYProgress, p => p >= stepProgress - 0.1);

                return (
                  <div key={index} className="relative flex flex-row md:flex-col items-center gap-6 md:gap-4 md:text-center group">
                    {/* Mobile vertical line */}
                    <div className="md:hidden absolute right-6 top-14 bottom-[-2rem] w-0.5 bg-muted">
                      {index < journeySteps.length - 1 && (
                         <motion.div
                           className="w-full bg-primary origin-top"
                           style={{ scaleY: useTransform(scrollYProgress, p => Math.max(0, Math.min(1, (p - stepProgress) * (journeySteps.length - 1)))) }}
                         />
                      )}
                    </div>

                    <motion.div
                      style={{
                        backgroundColor: useTransform(isActive, v => v ? 'hsl(var(--primary))' : 'hsl(var(--muted))'),
                        color: useTransform(isActive, v => v ? 'white' : 'hsl(var(--muted-foreground))'),
                        scale: useTransform(isActive, v => v ? 1.1 : 1)
                      }}
                      className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border-4 border-white shadow-md relative z-10 shrink-0 transition-colors duration-300"
                    >
                      <Icon className="w-5 h-5 md:w-7 md:h-7" />
                    </motion.div>

                    <div className="pt-2 md:pt-0">
                      <div className="text-primary text-xs font-bold mb-1 opacity-60">0{index + 1}</div>
                      <h3 className="font-bold text-secondary mb-1 md:mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px] mx-auto hidden md:block">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {category && (
            <>
              <MotionSection className="mb-14 text-center max-w-2xl mx-auto">
                <RevealText>
                  <h2 className="text-3xl font-bold text-secondary mb-4">التفاصيل والخدمات المشمولة</h2>
                </RevealText>
                <RevealText>
                  <p className="text-muted-foreground">اختر الخدمة للاطلاع على المتطلبات، الإجراءات، وكل ما يشمله التنفيذ.</p>
                </RevealText>
              </MotionSection>

              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.services.map((srvInfo, index) => {
                  const srv = allServices.find(s => s.id === srvInfo.id);

                  return (
                    <motion.div
                      key={srvInfo.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                    >
                      <Link
                        href={getServicePageHref(srvInfo.id, srvInfo.href)}
                        className="group bg-white border border-border/50 rounded-[2rem] p-8 hover:shadow-xl hover:border-primary/30 transition-all block h-full flex flex-col relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-br-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          {index + 1}
                        </div>

                        <h3 className="text-xl font-bold text-secondary group-hover:text-primary transition-colors mb-3">
                          {srvInfo.title}
                        </h3>

                        <p className="text-muted-foreground mb-8 text-sm leading-relaxed flex-1">
                          {srv?.description ?? 'تنسيق المتطلبات والخطوات اللازمة ومتابعة الإجراء مع الجهات والمنصات ذات العلاقة.'}
                        </p>

                        <div className="mt-auto inline-flex items-center text-primary font-bold text-sm">
                          التفاصيل الكاملة
                          <ArrowLeft className="w-4 h-4 rtl-flip mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </StaggerContainer>
            </>
          )}
        </div>
      </section>

    </div>
  );
}
