import { Link, useRoute } from 'wouter';
import { ArrowLeft, CheckCircle2, ChevronRight, FileCheck2, MessageCircle, ShieldCheck } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { globalData } from '@/data/content';
import { getRelatedServices, getServicePageData } from '@/lib/service-catalog';
import { useSEO } from '@/hooks/use-seo';
import NotFound from '@/pages/not-found';
import { MotionSection, RevealText, StaggerContainer, AnimatedButton } from '@/components/motion';
import { motion } from 'framer-motion';

function buildFaqs(service: NonNullable<ReturnType<typeof getServicePageData>>) {
  return [
    {
      question: `ما الذي تشمله خدمة ${service.title}؟`,
      answer: `تشمل الخدمة ${service.includes.slice(0, 3).join('، ')}، ويتحدد النطاق النهائي بعد مراجعة حالتك.`,
    },
    {
      question: `كيف أبدأ طلب ${service.title}؟`,
      answer: 'ابدأ بإرسال وصف مختصر للحالة وبيانات التواصل. نراجع المعلومات المتاحة ثم نحدد معك الخطوة التالية.',
    },
    {
      question: `هل تختلف متطلبات ${service.title} من منشأة لأخرى؟`,
      answer: `نعم. تختلف المتطلبات حسب نوع الكيان والنشاط وحالة الطلب والجهة المختصة. ${service.requirements[0]}`,
    },
    {
      question: `كيف تتابع أوفي الذكية خدمة ${service.title}؟`,
      answer: `نعمل عبر مسار منظم يبدأ بـ${service.process[0]} ثم ${service.process.slice(1).join('، ')}.`,
    },
    {
      question: 'هل تضمن أوفي الذكية قبول أو اعتماد الطلب؟',
      answer: 'لا. ننظم الملف ونتابع الإجراء والملاحظات، بينما يبقى القبول والاعتماد والقرار النهائي للجهة المختصة.',
    },
  ];
}

export default function IndividualServicePage() {
  const [, params] = useRoute('/services/:slug');
  const service = getServicePageData(params?.slug ?? '');
  const relatedServices = service ? getRelatedServices(service.id) : [];
  const faqs = service ? buildFaqs(service) : [];
  const canonical = service ? `${globalData.website}/services/${service.id}` : undefined;
  const requestHref = service
    ? `/request-service?service=${encodeURIComponent(service.id)}&category=${encodeURIComponent(service.categoryId)}&source=${encodeURIComponent(`/services/${service.id}`)}`
    : '/request-service';
  const whatsappHref = service
    ? `${globalData.whatsappLink}?text=${encodeURIComponent(`مرحباً، أرغب في الاستفسار عن خدمة: ${service.title}`)}`
    : globalData.whatsappLink;

  useSEO({
    title: service?.title ?? 'الخدمة غير موجودة',
    description: service?.description ?? '',
    canonical,
    jsonLd: service ? {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          name: service.title,
          description: service.description,
          provider: { '@type': 'Organization', name: globalData.companyName, url: globalData.website },
          areaServed: { '@type': 'Country', name: 'Saudi Arabia' },
          url: canonical,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: globalData.website },
            { '@type': 'ListItem', position: 2, name: 'الخدمات', item: `${globalData.website}/services` },
            { '@type': 'ListItem', position: 3, name: service.categoryTitle, item: `${globalData.website}${service.categoryHref}` },
            { '@type': 'ListItem', position: 4, name: service.title, item: canonical },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: faqs.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        },
      ],
    } : undefined,
  });

  if (!service) return <NotFound />;

  return (
    <div className="bg-background pb-24 sm:pb-0 min-h-screen">
      <section className="relative overflow-hidden bg-secondary py-16 sm:py-24 text-white">
        {/* Animated Background Details */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <motion.div
            animate={{
              rotate: [0, 90],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -right-1/4 w-[100vw] h-[100vw] rounded-full bg-primary/20 blur-[120px]"
          />
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <MotionSection>
            <RevealText>
              <nav aria-label="مسار التنقل" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/60 font-medium">
                <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link><ChevronRight className="h-4 w-4 rtl-flip" />
                <Link href="/services" className="hover:text-white transition-colors">الخدمات</Link><ChevronRight className="h-4 w-4 rtl-flip" />
                <Link href={service.categoryHref} className="hover:text-white transition-colors">{service.categoryTitle}</Link><ChevronRight className="h-4 w-4 rtl-flip" />
                <span className="text-primary-foreground font-bold px-2 py-0.5 bg-primary/20 rounded-md border border-primary/30">{service.title}</span>
              </nav>
            </RevealText>

            <div className="max-w-3xl">
              <RevealText>
                <h1 className="text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl mb-6">{service.title}</h1>
              </RevealText>
              <RevealText>
                <p className="mb-10 text-lg leading-relaxed text-white/80">{service.description}</p>
              </RevealText>
              <RevealText>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <AnimatedButton asChild className="h-14 px-8 text-base bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 border-transparent font-bold rounded-xl w-full sm:w-auto">
                    <Link href={requestHref} data-conversion="request-service-click" data-service-name={service.title} data-service-category={service.categoryTitle} data-source-page={`/services/${service.id}`}>
                      اطلب خدمة {service.title}<ArrowLeft className="mr-3 h-5 w-5 rtl-flip" />
                    </Link>
                  </AnimatedButton>
                  <AnimatedButton asChild className="h-14 px-8 text-base bg-white/5 border border-white/20 text-white hover:bg-white/10 backdrop-blur-sm font-bold rounded-xl w-full sm:w-auto transition-colors">
                    <a href={whatsappHref} target="_blank" rel="noreferrer" data-conversion="whatsapp-click" data-service-name={service.title} data-service-category={service.categoryTitle} data-source-page={`/services/${service.id}`}>
                      <FaWhatsapp className="ml-3 h-5 w-5" />استفسر عبر واتساب
                    </a>
                  </AnimatedButton>
                </div>
              </RevealText>
            </div>
          </MotionSection>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_340px]">
          <main className="space-y-20">
            <MotionSection>
              <RevealText><h2 className="text-2xl font-bold text-secondary sm:text-3xl mb-6">عن الخدمة</h2></RevealText>
              <RevealText>
                <p className="text-lg leading-relaxed text-muted-foreground border-r-2 border-primary/30 pr-6">
                  تساعد خدمة {service.title} على تنظيم البيانات والخطوات المطلوبة وتقليل تشتت المتابعة، مع مراعاة أن الإجراءات والمتطلبات قد تتغير حسب الحالة والجهة المختصة.
                </p>
              </RevealText>
            </MotionSection>

            <MotionSection>
              <RevealText><h2 className="text-2xl font-bold text-secondary sm:text-3xl mb-8">تشمل الخدمة</h2></RevealText>
              <StaggerContainer className="grid gap-5 sm:grid-cols-2">
                {service.includes.map((item) => (
                  <motion.div key={item} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex gap-4 rounded-2xl border border-border/50 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-bold leading-relaxed text-secondary pt-0.5">{item}</span>
                  </motion.div>
                ))}
              </StaggerContainer>
            </MotionSection>

            <MotionSection className="rounded-3xl bg-muted/40 p-8 sm:p-10 border border-border/50">
              <RevealText>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileCheck2 className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-secondary">المتطلبات والمعلومات الأولية</h2>
                </div>
              </RevealText>
              <RevealText>
                <p className="leading-relaxed text-muted-foreground mb-8">
                  تختلف المتطلبات حسب نوع المنشأة والنشاط وحالة الطلب والجهة المختصة. يبدأ التحديد الدقيق بعد مراجعة الحالة، وقد تشمل المعلومات الأولية:
                </p>
              </RevealText>
              <StaggerContainer className="space-y-4">
                {service.requirements.map((item) => (
                  <motion.li key={item} variants={{ hidden: { opacity: 0, x: 10 }, visible: { opacity: 1, x: 0 } }} className="flex gap-4 items-center bg-white p-4 rounded-xl border border-border/50 shadow-sm">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span className="leading-tight text-secondary font-medium">{item}</span>
                  </motion.li>
                ))}
              </StaggerContainer>
            </MotionSection>

            <MotionSection>
              <RevealText>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-secondary sm:text-3xl">كيف تساعدك أوفي الذكية؟</h2>
                </div>
              </RevealText>
              <RevealText>
                <p className="leading-relaxed text-muted-foreground text-lg border-r-2 border-primary/30 pr-6">
                  نراجع الحالة، ننظم البيانات والمستندات المتاحة، نوضح مسار العمل، ونتابع الطلب والملاحظات معك. لا تمثل المتابعة ضماناً للقبول أو الاعتماد؛ القرار النهائي للجهة المختصة.
                </p>
              </RevealText>
            </MotionSection>

            <MotionSection>
              <RevealText><h2 className="text-2xl font-bold text-secondary sm:text-3xl mb-8">خطوات التنفيذ</h2></RevealText>
              <StaggerContainer className="grid gap-4 sm:grid-cols-2">
                {service.process.slice(0, 5).map((step, index) => (
                  <motion.div key={step} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="flex items-center gap-5 rounded-2xl border border-border/50 bg-white p-5 shadow-sm hover:border-primary/30 transition-colors">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">{index + 1}</span>
                    <span className="font-bold text-secondary leading-tight">{step}</span>
                  </motion.div>
                ))}
              </StaggerContainer>
            </MotionSection>

            <MotionSection>
              <RevealText><h2 className="text-2xl font-bold text-secondary sm:text-3xl mb-8">أسئلة شائعة عن {service.title}</h2></RevealText>
              <Accordion type="single" collapsible className="border-y border-border/50 divide-y divide-border/50">
                {faqs.map((item, index) => (
                  <AccordionItem key={item.question} value={`faq-${index}`} className="border-0">
                    <AccordionTrigger className="text-right text-lg font-bold text-secondary py-6 hover:text-primary transition-colors">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed text-muted-foreground pb-6">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </MotionSection>

            {relatedServices.length > 0 && (
              <MotionSection>
                <RevealText><h2 className="text-2xl font-bold text-secondary sm:text-3xl mb-8">خدمات ذات صلة</h2></RevealText>
                <StaggerContainer className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
                  {relatedServices.map((related) => (
                    <motion.div key={related.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} whileHover={{ y: -5 }}>
                      <Link href={related.href} className="group flex flex-col h-full rounded-2xl border border-border/50 bg-white p-6 transition-all hover:border-primary/50 hover:shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-24 h-24 bg-primary/5 rounded-br-full pointer-events-none group-hover:bg-primary/10 transition-colors" />
                        <h3 className="font-bold leading-relaxed text-secondary group-hover:text-primary transition-colors mb-6 relative z-10">{related.title}</h3>
                        <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-primary relative z-10">
                          عرض الخدمة
                          <ArrowLeft className="h-4 w-4 rtl-flip transition-transform group-hover:-translate-x-1" />
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </StaggerContainer>
              </MotionSection>
            )}
          </main>

          <aside>
            <div className="sticky top-28 rounded-3xl border border-border/50 bg-white p-8 shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 relative z-10">
                <MessageCircle className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-3 relative z-10">ناقش احتياجك معنا</h2>
              <p className="text-sm leading-relaxed text-muted-foreground mb-8 relative z-10">أرسل تفاصيل حالتك لنحدد معك نطاق المتابعة والخطوة التالية بشكل واضح ومباشر.</p>
              <AnimatedButton asChild className="h-14 w-full bg-primary text-white hover:bg-primary/90 font-bold rounded-xl shadow-md relative z-10">
                <Link href={requestHref} data-conversion="request-service-click" data-service-name={service.title} data-service-category={service.categoryTitle} data-source-page={`/services/${service.id}`}>
                  اطلب الخدمة الآن
                </Link>
              </AnimatedButton>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-white/95 p-4 backdrop-blur-md sm:hidden shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <Button asChild className="h-14 w-full bg-primary text-white font-bold rounded-xl">
          <Link href={requestHref} data-conversion="request-service-click" data-service-name={service.title} data-service-category={service.categoryTitle} data-source-page={`/services/${service.id}`}>اطلب الخدمة</Link>
        </Button>
      </div>
    </div>
  );
}
