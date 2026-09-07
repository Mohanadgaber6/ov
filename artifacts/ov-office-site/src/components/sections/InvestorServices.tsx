import { sections } from '@/data/content';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';
import { MotionSection, RevealText, RevealImage, AnimatedButton, StaggerContainer } from '@/components/motion';
import { motion } from 'framer-motion';

export function InvestorServices() {
  const { hero } = sections;

  return (
    <section id="investor-services" className="py-16 lg:py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <MotionSection>
            <RevealText>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/5 text-secondary text-sm font-semibold mb-6 border border-secondary/10">
                <TrendingUp className="w-4 h-4 text-primary" />
                للمستثمرين ورجال الأعمال
              </div>
            </RevealText>

            <RevealText>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 leading-tight">
                خدمات المستثمرين
              </h2>
            </RevealText>

            <RevealText>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                نهيئ لك بيئة استثمارية خصبة، من التخطيط المبدئي، استخراج التراخيص اللازمة، وحتى إطلاق أعمالك بنجاح في السوق السعودي الواعد.
              </p>
            </RevealText>

            <StaggerContainer className="space-y-4 mb-10">
              {[
                { step: '1', title: 'دراسات وتخطيط', desc: 'توجيه دقيق للمستثمر وتوضيح لمتطلبات السوق وتراخيص وزارة الاستثمار.' },
                { step: '2', title: 'تنفيذ وتأسيس', desc: 'تأسيس الكيان القانوني للمستثمر الأجنبي بصورة نظامية وموثوقة.' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                  }}
                  className="group flex gap-5 p-5 rounded-2xl bg-muted/30 border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl transition-colors group-hover:bg-primary group-hover:text-white">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-secondary mb-2 transition-colors group-hover:text-primary">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </StaggerContainer>

            <RevealText>
              <AnimatedButton asChild className="h-14 bg-secondary hover:bg-secondary/90 text-white rounded-xl px-8 w-full sm:w-auto font-bold">
                <Link href="/investor-services">
                  اكتشف خدمات المستثمرين
                  <ArrowLeft className="w-5 h-5 mr-3 rtl-flip" />
                </Link>
              </AnimatedButton>
            </RevealText>
          </MotionSection>

          <MotionSection>
            <RevealImage effect="clip" className="relative group rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/5] sm:aspect-[4/3] relative">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  src={hero.image}
                  alt="Investor Services"
                  className="w-full h-full object-cover"
                />

                {/* Moving abstract lines */}
                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent pointer-events-none" />

                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <motion.div
                    animate={{ y: ['0%', '100%'], opacity: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute right-[20%] top-0 w-px h-1/2 bg-gradient-to-b from-transparent via-primary to-transparent"
                  />
                  <motion.div
                    animate={{ y: ['-100%', '0%'], opacity: [0, 1, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 1 }}
                    className="absolute left-[30%] bottom-0 w-px h-1/2 bg-gradient-to-t from-transparent via-primary to-transparent"
                  />
                </div>

                <div className="absolute inset-0 flex items-end p-8 sm:p-10">
                  <div className="text-white max-w-sm relative z-10 transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                    <p className="text-2xl font-bold mb-3 text-primary-foreground">استثمار آمن ومدروس</p>
                    <p className="text-white/90 text-base leading-relaxed">
                      نمهد لك الطريق لدخول السوق السعودي بخطوات قانونية واستراتيجية محكمة، مدعومة بخبرة عميقة في الأنظمة الحكومية.
                    </p>
                  </div>
                </div>
              </div>
            </RevealImage>
          </MotionSection>

        </div>
      </div>
    </section>
  );
}
