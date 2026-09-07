import { Link } from 'wouter';
import { ArrowLeft, CheckCircle2, ClipboardList, MessageSquareText, Send, ArrowLeftCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MotionSection, RevealText, StaggerContainer } from '@/components/motion';
import { motion } from 'framer-motion';

const steps = [
  { icon: ClipboardList, title: 'اختر الفئة والخدمة', description: 'حدد المسار الأقرب لاحتياج منشأتك.' },
  { icon: MessageSquareText, title: 'أضف بيانات الطلب', description: 'اشرح الحالة وأدخل وسيلة التواصل المناسبة.' },
  { icon: CheckCircle2, title: 'راجع التفاصيل', description: 'تأكد من البيانات قبل إرسال الطلب.' },
  { icon: Send, title: 'أرسل للمتابعة', description: 'نراجع الطلب ونتواصل معك لتحديد الخطوة التالية.' },
];

export function RequestSteps() {
  return (
    <section className="border-y border-border/50 bg-white py-14 lg:py-20 overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:30px_30px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <MotionSection>
          <header className="mx-auto mb-16 max-w-2xl text-center">
            <RevealText>
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
                طلب واضح من البداية
              </div>
            </RevealText>
            <RevealText>
              <h2 className="text-3xl font-bold text-secondary sm:text-5xl mb-6">كيف تطلب الخدمة؟</h2>
            </RevealText>
            <RevealText>
              <p className="mt-4 leading-relaxed text-muted-foreground text-lg">
                مسار رقمي مختصر وفعال لإرسال احتياجك مع المعلومات الأساسية لضمان سرعة التنفيذ.
              </p>
            </RevealText>
          </header>
        </MotionSection>

        <StaggerContainer className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 relative">
          {/* Connecting line */}
          <div className="hidden xl:block absolute top-[4.5rem] right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.article
                key={step.title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                }}
                className="group relative rounded-3xl border border-border/50 bg-white p-8 hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              >
                {/* Number badge */}
                <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-secondary text-white font-bold flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>

                <div className="mb-6 h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Icon className="h-7 w-7 text-secondary group-hover:text-primary transition-colors" aria-hidden="true" />
                </div>

                <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>

                {/* Mobile indicator */}
                {index < steps.length - 1 && (
                  <div className="xl:hidden mt-6 text-center text-primary/30">
                    <ArrowLeftCircle className="inline-block w-6 h-6 rtl-flip rotate-90 md:rotate-0" />
                  </div>
                )}
              </motion.article>
            );
          })}
        </StaggerContainer>

        <MotionSection delay={0.4} className="mt-14 text-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Button asChild size="lg" className="h-14 bg-primary px-8 text-white hover:bg-primary/90 font-bold rounded-xl shadow-lg shadow-primary/20">
              <Link href="/request-service" data-conversion="request-service-click" data-source-page="home-request-steps">
                ابدأ طلب الخدمة
                <ArrowLeft className="mr-3 h-5 w-5 rtl-flip" />
              </Link>
            </Button>
          </motion.div>
        </MotionSection>
      </div>
    </section>
  );
}
