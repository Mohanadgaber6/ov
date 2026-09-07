import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { BookOpen, Search, ArrowLeft, CalendarDays } from 'lucide-react';
import { useSEO } from '@/hooks/use-seo';
import { allServices } from '@/data/content';
import { knowledgeArticles, knowledgeCategories } from '@/data/knowledge';
import { Input } from '@/components/ui/input';
import { MotionSection, RevealText, StaggerContainer } from '@/components/motion';
import { motion, AnimatePresence } from 'framer-motion';

export default function KnowledgeCenterPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('الكل');

  const normalizedQuery = query.trim().toLowerCase();

  const articles = useMemo(() => knowledgeArticles.filter((article) =>
    (category === 'الكل' || article.category === category) &&
    (!normalizedQuery || `${article.title} ${article.summary} ${article.introduction} ${article.category}`.toLowerCase().includes(normalizedQuery)),
  ), [category, normalizedQuery]);

  const services = useMemo(() => !normalizedQuery ? [] : allServices.filter((service) =>
    `${service.title} ${service.description}`.toLowerCase().includes(normalizedQuery),
  ), [normalizedQuery]);

  useSEO({
    title: 'مركز المعرفة',
    description: 'مقالات عملية حول تنظيم الأعمال والخدمات الحكومية والتشغيل في المملكة.',
  });

  const featuredArticle = !normalizedQuery && category === 'الكل' && articles.length > 0 ? articles[0] : null;
  const gridArticles = featuredArticle ? articles.slice(1) : articles;

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium' }).format(new Date(value));

  return (
    <div className="py-14 lg:py-20 bg-background min-h-screen" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionSection className="max-w-3xl mb-12">
          <RevealText>
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8" strokeWidth={1.5} />
            </div>
          </RevealText>
          <RevealText>
            <h1 className="text-4xl md:text-6xl font-bold text-secondary mb-6 leading-tight">المركز المعرفي</h1>
          </RevealText>
          <RevealText>
            <p className="text-xl text-muted-foreground leading-relaxed border-r-2 border-primary/30 pr-6">
              مسودات معرفية وأدلة عملية لمساعدتك على تنظيم المعلومات والخطوات قبل بدء الإجراءات الرسمية.
            </p>
          </RevealText>
        </MotionSection>

        <MotionSection delay={0.2} className="relative mb-8 max-w-2xl">
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ابحث في المقالات والخدمات..."
            className="pr-14 h-16 text-lg rounded-2xl bg-white border-border/50 shadow-sm focus:border-primary transition-colors"
            aria-label="البحث في المركز المعرفي والخدمات"
          />
        </MotionSection>

        <MotionSection delay={0.3} className="flex flex-wrap gap-2 mb-16 pb-8 border-b border-border/50">
          {['الكل', ...knowledgeCategories].map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${category === item ? 'bg-secondary text-white shadow-md scale-105' : 'bg-muted/50 text-secondary hover:bg-muted'}`}
            >
              {item}
            </button>
          ))}
        </MotionSection>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${category}-${normalizedQuery}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {normalizedQuery && (
              <section className="mb-16">
                <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
                  الخدمات المطابقة
                  <span className="text-sm font-medium text-muted-foreground px-3 py-1 bg-muted rounded-full">{services.length}</span>
                </h2>
                {services.length ? (
                  <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                      <motion.div key={service.id} variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}>
                        <Link href={`/services/${service.id}`} className="block border border-border/50 rounded-2xl p-6 hover:border-primary hover:shadow-md transition-all bg-white group h-full">
                          <h3 className="font-bold text-lg text-secondary group-hover:text-primary transition-colors mb-2">{service.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{service.description}</p>
                        </Link>
                      </motion.div>
                    ))}
                  </StaggerContainer>
                ) : (
                  <div className="bg-muted/30 rounded-2xl p-8 text-center text-muted-foreground border border-dashed border-border">
                    لا توجد خدمات مطابقة لعبارة البحث.
                  </div>
                )}
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold text-secondary mb-8 flex items-center gap-3">
                المقالات
                {articles.length > 0 && <span className="text-sm font-medium text-muted-foreground px-3 py-1 bg-muted rounded-full">{articles.length}</span>}
              </h2>

              {articles.length ? (
                <div className="flex flex-col gap-8">
                  {/* Featured Article */}
                  {featuredArticle && (
                    <motion.article
                      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                      initial="hidden"
                      animate="visible"
                      className="group flex flex-col md:flex-row gap-8 rounded-[2rem] bg-secondary p-8 sm:p-12 shadow-xl border border-secondary overflow-hidden relative"
                    >
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />

                      <div className="flex-1 relative z-10 flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-6">
                          <span className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-bold text-white border border-primary/30">
                            {featuredArticle.category}
                          </span>
                          <span className="flex items-center gap-2 text-sm font-medium text-white/60">
                            <CalendarDays className="h-4 w-4" />
                            {formatDate(featuredArticle.updatedAt)}
                          </span>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-bold leading-tight text-white mb-6 group-hover:text-primary-foreground transition-colors">
                          <Link href={`/articles/${featuredArticle.slug}`}>
                            {featuredArticle.title}
                          </Link>
                        </h3>
                        <p className="text-lg leading-relaxed text-white/70 mb-8 max-w-2xl">
                          {featuredArticle.summary}
                        </p>
                        <Link href={`/articles/${featuredArticle.slug}`} className="inline-flex items-center gap-3 font-bold text-white group-hover:text-primary transition-colors w-fit">
                          اقرأ المقال كاملاً
                          <ArrowLeft className="h-5 w-5 rtl-flip transition-transform group-hover:-translate-x-2" />
                        </Link>
                      </div>
                    </motion.article>
                  )}

                  {/* Grid Articles */}
                  {gridArticles.length > 0 && (
                    <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {gridArticles.map((article) => (
                        <motion.article
                          key={article.slug}
                          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                          className="group flex flex-col rounded-3xl border border-border/50 bg-white p-8 hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between mb-6">
                            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{article.category}</span>
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {formatDate(article.updatedAt)}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-secondary mb-4 leading-relaxed group-hover:text-primary transition-colors">
                            <Link href={`/articles/${article.slug}`}>
                              {article.title}
                            </Link>
                          </h3>

                          <p className="text-muted-foreground leading-relaxed flex-grow mb-8 line-clamp-3">
                            {article.summary}
                          </p>

                          <Link href={`/articles/${article.slug}`} className="inline-flex items-center gap-2 mt-auto text-secondary font-bold group-hover:text-primary transition-colors w-fit">
                            اقرأ المزيد
                            <ArrowLeft className="w-4 h-4 rtl-flip transition-transform group-hover:-translate-x-1" />
                          </Link>
                        </motion.article>
                      ))}
                    </StaggerContainer>
                  )}
                </div>
              ) : (
                <div className="bg-muted/30 border border-dashed border-border rounded-3xl p-12 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-border/50">
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg text-secondary font-medium mb-2">لم نعثر على مقالات مطابقة</p>
                  <p className="text-muted-foreground">جرّب استخدام كلمات مفتاحية أخرى أو تصفح كل الأقسام.</p>
                </div>
              )}
            </section>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
