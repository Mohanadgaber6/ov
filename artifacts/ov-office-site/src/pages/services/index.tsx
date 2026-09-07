import { useSEO } from '@/hooks/use-seo';
import { serviceCategories } from '@/data/content';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import {
  ArrowLeft,
  Building2,
  BriefcaseBusiness,
  Calculator,
  FileText,
  HeartHandshake,
  Landmark,
  Megaphone,
  Scale,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { MotionSection, RevealText, StaggerContainer } from '@/components/motion';
import { motion } from 'framer-motion';

const categoryIcons: Record<string, LucideIcon> = {
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

export default function ServicesIndexPage() {
  useSEO({
    title: 'خدماتنا',
    description: 'دليل خدمات أوفي الذكية: تأسيس الأعمال، الخدمات الحكومية، المستثمرون، الموارد البشرية، الرواتب، التسويق والتصميم والمزيد.',
  });

  return (
    <div className="bg-background py-16 lg:py-24 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:30px_30px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <MotionSection className="mx-auto mb-20 max-w-3xl text-center">
          <RevealText>
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
              تسعة مسارات لخدمة منشأتك
            </div>
          </RevealText>
          <RevealText>
            <h1 className="mb-6 text-4xl font-bold text-secondary md:text-5xl leading-tight">منظومة خدمات متكاملة</h1>
          </RevealText>
          <RevealText>
            <p className="text-xl leading-8 text-muted-foreground border-r-2 border-primary/30 pr-6 inline-block">
              نغطي جميع احتياجات منشأتك من التأسيس وحتى التشغيل عبر مسارات منظمة تضمن لك الامتثال والنمو المستدام.
            </p>
          </RevealText>
        </MotionSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {serviceCategories.map((category) => {
            const Icon = categoryIcons[category.id] ?? Building2;
            const exampleServices = category.services.slice(0, 3);
            const hasMore = category.services.length > 3;

            return (
              <motion.div
                key={category.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-[2rem] border border-border/50 p-8 flex flex-col hover:shadow-xl hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-br-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Icon className="w-8 h-8" strokeWidth={1.5} />
                </div>

                <h2 className="text-2xl font-bold text-secondary mb-4 group-hover:text-primary transition-colors">{category.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">{category.description}</p>

                <div className="mb-8 bg-muted/30 p-5 rounded-2xl">
                  <h4 className="text-sm font-bold text-secondary mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                    أمثلة على الخدمات المشمولة:
                  </h4>
                  <ul className="space-y-3">
                    {exampleServices.map(srv => (
                      <li key={srv.id} className="text-sm text-muted-foreground flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 shrink-0" />
                        {srv.title}
                      </li>
                    ))}
                    {hasMore && (
                      <li className="text-sm text-muted-foreground/60 italic font-medium pt-1">
                        والمزيد من الخدمات...
                      </li>
                    )}
                  </ul>
                </div>

                <Button asChild className="w-full bg-secondary hover:bg-secondary/90 text-white mt-auto h-14 rounded-xl font-bold">
                  <Link href={category.href}>
                    تصفح جميع الخدمات في هذا المسار
                    <ArrowLeft className="w-5 h-5 mr-2 rtl-flip group-hover:-translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            );
          })}
        </StaggerContainer>
      </div>
    </div>
  );
}
