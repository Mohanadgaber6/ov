import { serviceCategories } from '@/data/content';
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  Calculator,
  FileText,
  HeartHandshake,
  Landmark,
  Megaphone,
  Scale,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'wouter';
import { MotionSection, RevealText, StaggerContainer } from '@/components/motion';
import { motion } from 'framer-motion';

const iconMap: Record<string, LucideIcon> = {
  'business-setup': Building2,
  'government-services': Landmark,
  investors: BriefcaseBusiness,
  'operations-finance': Calculator,
  'digital-marketing-design': Megaphone,
  hr: Users,
  'insurance-support': HeartHandshake,
  legal: Scale,
  'payroll-finance': FileText,
};

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 bg-muted/30 py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:30px_30px]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <MotionSection className="mx-auto mb-16 max-w-2xl text-center">
          <RevealText>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
              خدمات منظمة حسب احتياجك
            </div>
          </RevealText>
          <RevealText>
            <h2 className="mb-5 text-3xl font-bold text-secondary md:text-4xl">منظومة خدمات أوفي</h2>
          </RevealText>
          <RevealText>
            <p className="text-lg leading-relaxed text-muted-foreground">
              تصفح مساراتنا المخصصة لتلبية كافة احتياجات منشأتك الإدارية والتشغيلية والقانونية.
            </p>
          </RevealText>
        </MotionSection>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCategories.map((category) => {
            const Icon = iconMap[category.id] ?? BriefcaseBusiness;
            return (
              <motion.div
                key={category.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                }}
                className="group relative h-full"
              >
                <Link href={category.href} className="block h-full">
                  <div className="relative h-full flex flex-col overflow-hidden rounded-2xl bg-white p-8 border border-border/50 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-primary/30 z-10">

                    {/* Hover Background Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-7 w-7" strokeWidth={1.5} />
                    </div>

                    <h3 className="mb-3 text-xl font-bold text-secondary transition-colors group-hover:text-primary relative z-10">
                      {category.title}
                    </h3>

                    <p className="mb-8 flex-1 leading-7 text-muted-foreground relative z-10">
                      {category.description}
                    </p>

                    <div className="mt-auto flex items-center text-sm font-bold text-primary relative z-10">
                      <span className="relative overflow-hidden">
                        <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                          عرض الخدمات
                        </span>
                        <span className="absolute inset-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-secondary">
                          عرض الخدمات
                        </span>
                      </span>
                      <ArrowLeft className="h-4 w-4 rtl-flip mr-2 transition-transform duration-300 group-hover:-translate-x-2 group-hover:text-secondary" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
