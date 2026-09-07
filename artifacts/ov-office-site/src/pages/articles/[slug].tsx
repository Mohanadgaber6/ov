import { Link, useRoute } from 'wouter';
import { ChevronRight, CalendarDays, ArrowLeft, Lightbulb } from 'lucide-react';
import { useSEO } from '@/hooks/use-seo';
import { globalData, allServices } from '@/data/content';
import { knowledgeArticles } from '@/data/knowledge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import NotFound from '@/pages/not-found';
import { MotionSection, RevealText, StaggerContainer, AnimatedButton } from '@/components/motion';
import { motion } from 'framer-motion';

const date = (value: string) => new Intl.DateTimeFormat('ar-SA', { dateStyle: 'long' }).format(new Date(value));

export default function ArticlePage() {
  const [, params] = useRoute('/articles/:slug');
  const article = knowledgeArticles.find((item) => item.slug === params?.slug);
  const service = allServices.find((item) => item.id === article?.relatedServiceId);
  const related = article ? knowledgeArticles.filter((item) => article.relatedArticleSlugs.includes(item.slug)) : [];
  const url = article ? `${globalData.website}/articles/${article.slug}` : '';

  useSEO({
    title: article?.title ?? 'مقال غير موجودة', description: article?.summary ?? '', type: 'article', canonical: url || undefined,
    jsonLd: article ? { '@context': 'https://schema.org', '@graph': [
      { '@type': 'Article', headline: article.title, description: article.summary, datePublished: article.publishedAt, dateModified: article.updatedAt, mainEntityOfPage: url, author: { '@type': 'Organization', name: globalData.companyName }, publisher: { '@type': 'Organization', name: globalData.companyName, url: globalData.website } },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'الرئيسية', item: globalData.website }, { '@type': 'ListItem', position: 2, name: 'المركز المعرفي', item: `${globalData.website}/knowledge-center` }, { '@type': 'ListItem', position: 3, name: article.title, item: url }] },
      { '@type': 'FAQPage', mainEntity: article.faqs.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
    ] } : undefined,
  });

  if (!article) return <NotFound />;

  return (
    <div className="py-14 lg:py-20 bg-background min-h-screen relative overflow-hidden" dir="rtl">
      <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-muted/50 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <MotionSection>
          <RevealText>
            <nav aria-label="مسار التنقل" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-12 font-medium">
              <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
              <ChevronRight className="w-4 h-4 rtl-flip" />
              <Link href="/knowledge-center" className="hover:text-primary transition-colors">المركز المعرفي</Link>
              <ChevronRight className="w-4 h-4 rtl-flip" />
              <span className="text-primary-foreground font-bold px-3 py-1 bg-primary/10 rounded-full">{article.category}</span>
            </nav>
          </RevealText>
        </MotionSection>

        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <article className="min-w-0">
            <MotionSection>
              <header className="border-b border-border/50 pb-10 mb-12 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                <RevealText>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-secondary leading-tight mt-3">{article.title}</h1>
                </RevealText>
                <RevealText>
                  <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mt-6 border-r-4 border-primary/20 pr-6">
                    {article.summary}
                  </p>
                </RevealText>
                <RevealText>
                  <div className="flex flex-wrap items-center gap-6 mt-8 text-sm font-medium text-muted-foreground bg-muted/30 w-fit px-6 py-3 rounded-2xl border border-border/50">
                    <span className="flex items-center gap-2"><CalendarDays className="w-5 h-5 text-primary" />نُشر: {date(article.publishedAt)}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-border" />
                    <span>آخر تحديث: {date(article.updatedAt)}</span>
                  </div>
                </RevealText>
              </header>
            </MotionSection>

            <MotionSection delay={0.2}>
              <RevealText>
                <p className="text-lg md:text-xl leading-relaxed text-secondary/90 mb-12 font-medium">{article.introduction}</p>
              </RevealText>

              <div className="space-y-12">
                {article.sections.map((section, idx) => (
                  <motion.section
                    key={section.heading}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <h2 className="text-2xl font-bold text-secondary mb-5 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm shrink-0">
                        {idx + 1}
                      </span>
                      {section.heading}
                    </h2>
                    <div className="pr-4 space-y-4">
                      {section.paragraphs.map((paragraph, pIdx) => (
                        <p key={pIdx} className="leading-loose text-muted-foreground text-lg">{paragraph}</p>
                      ))}
                    </div>
                  </motion.section>
                ))}
              </div>
            </MotionSection>

            <MotionSection className="mt-16 bg-muted/30 p-8 rounded-3xl border border-border/50">
              <RevealText><h2 className="text-2xl font-bold text-secondary mb-6">أسئلة شائعة</h2></RevealText>
              <Accordion type="single" collapsible className="border-t border-border/50 divide-y divide-border/50">
                {article.faqs.map((item, index) => (
                  <AccordionItem key={item.question} value={`faq-${index}`} className="border-0">
                    <AccordionTrigger className="text-base font-bold text-secondary py-5 hover:text-primary transition-colors text-right">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-5">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </MotionSection>

            {related.length > 0 && (
              <MotionSection className="mt-16">
                <RevealText><h2 className="text-2xl font-bold text-secondary mb-6">مقالات ذات صلة</h2></RevealText>
                <StaggerContainer className="grid sm:grid-cols-2 gap-5">
                  {related.map((item) => (
                    <motion.div key={item.slug} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                      <Link href={`/articles/${item.slug}`} className="group block border border-border/50 bg-white rounded-2xl p-6 hover:shadow-md hover:border-primary/30 transition-all h-full">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-3">{item.category}</span>
                        <h3 className="font-bold text-secondary leading-relaxed group-hover:text-primary transition-colors text-lg">{item.title}</h3>
                      </Link>
                    </motion.div>
                  ))}
                </StaggerContainer>
              </MotionSection>
            )}
          </article>

          <aside className="relative">
            <div className="sticky top-28 rounded-3xl bg-secondary p-8 text-white shadow-xl overflow-hidden border border-secondary">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-[40px] pointer-events-none" />

              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                <Lightbulb className="w-6 h-6" />
              </div>

              <h2 className="text-2xl font-bold mb-3 relative z-10">هل تحتاج مساعدة في التنفيذ؟</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/80 relative z-10 mb-6">نراجع احتياجك وننسق متابعة الخدمة بدقة واحترافية.</p>

              {service && (
                <div className="mb-8">
                  <span className="text-xs text-white/50 font-medium mb-2 block">الخدمة المرتبطة</span>
                  <Link href={`/services/${service.id}`} className="group block rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors relative z-10">
                    <strong className="block text-base font-bold text-white group-hover:text-primary transition-colors">{service.title}</strong>
                  </Link>
                </div>
              )}

              <AnimatedButton asChild className="h-14 w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg relative z-10">
                <Link href={`/request-service?service=${article.relatedServiceId}`}>
                  اطلب الخدمة الآن
                  <ArrowLeft className="mr-2 w-5 h-5 rtl-flip" />
                </Link>
              </AnimatedButton>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
