import { sections } from '@/data/content';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { MotionSection, RevealText, RevealImage, StaggerContainer } from '@/components/motion';
import { motion } from 'framer-motion';

export function About() {
  const { about } = sections;

  return (
    <section id="about" className="py-16 lg:py-24 bg-white relative overflow-hidden border-b border-border/50">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-muted/40 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <MotionSection className="order-2 lg:order-1 relative group">
            <RevealImage effect="scale" className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl border border-border/50 z-10">
              <img
                src={about.image}
                alt="About OV Office"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent opacity-60" />
            </RevealImage>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -bottom-10 -right-10 bg-secondary p-8 rounded-2xl shadow-xl text-white max-w-[280px] hidden md:block border-t-4 border-primary z-20"
            >
              <h4 className="text-4xl font-bold text-primary mb-3">رؤية</h4>
              <p className="text-white/90 text-sm leading-relaxed font-medium">
                نطمح لأن نكون الشريك الاستراتيجي الأول للأعمال في المملكة، بتقديم حلول مبتكرة وموثوقة.
              </p>
            </motion.div>
          </MotionSection>

          <MotionSection className="order-1 lg:order-2">
            <RevealText>
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 border border-primary/20">
                {about.title}
              </div>
            </RevealText>

            <RevealText>
              <h2 className="text-3xl md:text-5xl font-bold text-secondary mb-8 leading-tight">
                {about.heading}
              </h2>
            </RevealText>

            <RevealText>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed border-r-2 border-primary/20 pr-6">
                <p>{about.description1}</p>
                <p>{about.description2}</p>
              </div>
            </RevealText>

            <StaggerContainer className="mt-12 grid sm:grid-cols-2 gap-6 mb-12">
              {[
                'احترافية وموثوقية',
                'توفير الوقت والجهد',
                'فهم عميق للسوق',
                'حلول متكاملة'
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-transparent hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-secondary text-sm">{item}</span>
                </motion.div>
              ))}
            </StaggerContainer>

            <RevealText>
              <Button asChild className="bg-secondary text-white hover:bg-secondary/90 px-8 h-14 w-full sm:w-auto font-bold rounded-xl shadow-md transition-all">
                <Link href="/about">
                  اكتشف المزيد عنا
                  <ArrowLeft className="w-5 h-5 mr-3 rtl-flip" />
                </Link>
              </Button>
            </RevealText>
          </MotionSection>

        </div>
      </div>
    </section>
  );
}
