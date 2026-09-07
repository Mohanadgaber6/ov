import { useRoute } from 'wouter';
import { ChevronLeft, ChevronRight, Info, Layers } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { globalData, serviceCategories } from '@/data/content';
import { useSEO } from '@/hooks/use-seo';
import NotFound from '@/pages/not-found';
import { getServicePageHref } from '@/lib/service-catalog';
import { MotionSection, RevealText, StaggerContainer, AnimatedButton } from '@/components/motion';
import { motion } from 'framer-motion';

export default function ServiceCategoryPage() {
  const [, params] = useRoute('/services/category/:categoryId');
  const category = serviceCategories.find((item) => item.id === params?.categoryId);

  useSEO({
    title: category?.title ?? 'تصنيف الخدمات',
    description: category
      ? `${category.description} تعرّف على خدمات ${category.title} التي تقدمها أوفي الذكية للمنشآت والمستثمرين.`
      : '',
    canonical: category ? `${globalData.website}${category.href}` : undefined,
    jsonLd: category ? {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: globalData.website },
        { '@type': 'ListItem', position: 2, name: 'الخدمات', item: `${globalData.website}/services` },
        { '@type': 'ListItem', position: 3, name: category.title, item: `${globalData.website}${category.href}` },
      ],
    } : undefined,
  });

  if (!category) return <NotFound />;

  return (
    <div className="bg-background min-h-screen">

      {/* Category Hero */}
      <section className="bg-secondary py-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
        <div className="absolute -top-1/2 -right-1/4 w-[80vw] h-[80vw] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <MotionSection>
            <RevealText>
              <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/60 font-medium" aria-label="مسار التنقل">
                <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
                <ChevronRight className="h-4 w-4 rtl-flip" />
                <Link href="/services" className="hover:text-white transition-colors">خدماتنا</Link>
                <ChevronRight className="h-4 w-4 rtl-flip" />
                <span className="font-bold text-primary-foreground px-2 py-0.5 rounded-md bg-primary/20 border border-primary/30">{category.title}</span>
              </nav>
            </RevealText>

            <div className="max-w-3xl">
              <RevealText>
                <h1 className="mb-4 text-4xl font-bold leading-tight text-white sm:text-5xl">{category.title}</h1>
              </RevealText>
              <RevealText>
                <p className="text-lg leading-relaxed text-white/80 max-w-2xl">{category.description}</p>
              </RevealText>
            </div>
          </MotionSection>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

          <MotionSection className="mb-12">
            <RevealText>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Layers className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-secondary">دليل خدمات القسم</h2>
              </div>
            </RevealText>

            <StaggerContainer className="grid sm:grid-cols-2 gap-4">
              {category.services.map((service) => (
                <motion.div
                  key={service.id}
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                >
                  <Link
                    href={getServicePageHref(service.id, service.href)}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-border/50 bg-white px-6 py-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 relative overflow-hidden h-full"
                  >
                    <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    <h3 className="text-lg font-bold text-secondary group-hover:text-primary transition-colors pr-2">
                      {service.title}
                    </h3>

                    <div className="w-10 h-10 rounded-xl bg-muted/50 text-secondary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:shadow-md">
                      <ChevronLeft className="h-5 w-5 rtl-flip transition-transform group-hover:-translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </StaggerContainer>
          </MotionSection>

          <MotionSection delay={0.2}>
            <aside className="relative overflow-hidden flex flex-col justify-between gap-8 rounded-3xl border border-border/50 bg-white p-8 sm:p-10 shadow-xl sm:flex-row items-center">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/5 rounded-full pointer-events-none" />

              <div className="flex items-start gap-5 flex-1 relative z-10">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-primary/20">
                  <Info className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-secondary mb-3">تحتاج مساعدة في تحديد الخدمة؟</h3>
                  <p className="text-muted-foreground text-base leading-relaxed max-w-md">
                    اشرح لنا احتياج منشأتك وسنساعدك في تحديد المسار المناسب والمتطلبات الأولية للبدء في الإجراءات بسرعة.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full sm:w-auto shrink-0 relative z-10">
                <AnimatedButton asChild className="w-full sm:w-56 h-14 bg-primary text-white hover:bg-primary/90 font-bold rounded-xl shadow-md">
                  <Link
                    href={`/request-service?category=${encodeURIComponent(category.id)}&source=${encodeURIComponent(category.href)}`}
                    data-conversion="request-service-click"
                    data-service-category={category.title}
                    data-source-page={category.href}
                  >
                    اطلب استشارة وتحديد المسار
                  </Link>
                </AnimatedButton>
                <AnimatedButton asChild variant="outline" className="w-full sm:w-56 h-14 border-secondary/20 text-secondary hover:bg-secondary hover:text-white hover:border-secondary font-bold rounded-xl transition-all">
                  <a href={globalData.whatsappLink} target="_blank" rel="noreferrer" data-conversion="whatsapp-click" data-service-category={category.title} data-source-page={category.href}>تواصل عبر واتساب</a>
                </AnimatedButton>
              </div>
            </aside>
          </MotionSection>

        </div>
      </div>
    </div>
  );
}
