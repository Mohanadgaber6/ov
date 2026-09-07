import { ArrowLeft, BookOpen, CalendarDays } from 'lucide-react';
import { Link } from 'wouter';
import { knowledgeArticles } from '@/data/knowledge';
import { MotionSection, RevealText, StaggerContainer } from '@/components/motion';
import { motion } from 'framer-motion';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium' }).format(new Date(value));

export function Blog() {
  const featured = knowledgeArticles.slice(0, 3);

  return (
    <section className="bg-white py-16 lg:py-24 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionSection>
          <header className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end border-b border-border/50 pb-8">
            <div className="max-w-2xl">
              <RevealText>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BookOpen className="h-7 w-7" strokeWidth={1.5} />
                </div>
              </RevealText>
              <RevealText>
                <h2 className="text-3xl font-bold text-secondary sm:text-4xl mb-4">من مركز المعرفة</h2>
              </RevealText>
              <RevealText>
                <p className="leading-relaxed text-muted-foreground text-lg">
                  أدلة عملية ومسودات تساعدك على تنظيم المعلومات قبل بدء أي إجراء رسمي.
                </p>
              </RevealText>
            </div>
            <RevealText>
              <Link href="/knowledge-center" className="inline-flex items-center gap-2 font-bold text-secondary hover:text-primary transition-colors">
                جميع المقالات <ArrowLeft className="h-5 w-5 rtl-flip" />
              </Link>
            </RevealText>
          </header>
        </MotionSection>

        <StaggerContainer className="grid gap-8 md:grid-cols-3">
          {featured.map((article) => (
            <motion.article
              key={article.slug}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="group flex flex-col rounded-3xl bg-muted/30 p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {article.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(article.updatedAt)}
                </span>
              </div>

              <h3 className="mb-4 text-2xl font-bold leading-relaxed text-secondary group-hover:text-primary transition-colors">
                <Link href={`/articles/${article.slug}`}>
                  {article.title}
                </Link>
              </h3>

              <p className="mb-8 flex-1 text-base leading-relaxed text-muted-foreground">
                {article.summary}
              </p>

              <Link
                href={`/articles/${article.slug}`}
                className="mt-auto inline-flex items-center gap-2 font-bold text-secondary group-hover:text-primary transition-colors w-fit"
              >
                اقرأ المزيد
                <ArrowLeft className="h-4 w-4 rtl-flip transition-transform group-hover:-translate-x-1" />
              </Link>
            </motion.article>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
