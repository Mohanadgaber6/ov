import { sections } from '@/data/content';
import { ArrowLeft, Check, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'wouter';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getPackageServiceHref } from '@/lib/service-catalog';
import { MotionSection, RevealText, StaggerContainer } from '@/components/motion';
import { motion, AnimatePresence } from 'framer-motion';

export function PackageCards() {
  const packages = sections.packages.items;
  const [selectedPackage, setSelectedPackage] = useState(packages[0].title);

  const showPackageDetails = (title: string) => {
    setSelectedPackage(title);
    window.requestAnimationFrame(() => {
      document.getElementById('package-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="grid gap-6 lg:grid-cols-3">
        {packages.map((pkg) => (
          <motion.article
            key={`summary-${pkg.title}`}
            whileHover={{ y: -5 }}
            className={cn(
              "relative group flex flex-col border rounded-3xl p-6 transition-all duration-300 sm:p-8 overflow-hidden",
              selectedPackage === pkg.title
                ? "border-primary bg-primary/5 shadow-[0_10px_40px_-10px_rgba(26,188,156,0.3)]"
                : "border-border bg-white hover:border-primary/50 hover:shadow-xl",
              pkg.isPopular && selectedPackage !== pkg.title && "border-primary/50",
            )}
          >
            {/* Subtle light effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <h3 className="mb-3 text-2xl font-bold text-secondary relative z-10">{pkg.title}</h3>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground relative z-10">{pkg.description}</p>

            <ul className="mb-8 flex-1 space-y-3 relative z-10">
              {pkg.highlights.slice(0, 5).map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm text-secondary">
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="leading-tight pt-0.5">{benefit}</span>
                </li>
              ))}
            </ul>

            <Button
              type="button"
              variant={selectedPackage === pkg.title ? 'default' : 'outline'}
              className={cn(
                "h-12 w-full font-bold relative z-10 transition-colors",
                selectedPackage === pkg.title
                  ? "border-transparent bg-primary text-white hover:bg-primary/90"
                  : "border-border text-secondary group-hover:bg-muted group-hover:text-primary",
              )}
              onClick={() => showPackageDetails(pkg.title)}
            >
              عرض تفاصيل الباقة
              <ArrowLeft className={cn("mr-2 h-4 w-4 rtl-flip transition-transform", selectedPackage === pkg.title ? "" : "group-hover:-translate-x-1")} />
            </Button>
          </motion.article>
        ))}
      </div>

      <div id="package-details" className="scroll-mt-28">
        <Tabs
          value={selectedPackage}
          onValueChange={setSelectedPackage}
          dir="rtl"
          className="w-full"
        >
          <div className="mb-7">
            <p className="mb-3 text-sm font-bold text-primary">تفاصيل الباقة</p>
            <TabsList className="flex h-auto w-full overflow-x-auto gap-1 bg-muted p-1 sm:grid sm:grid-cols-3 rounded-xl touch-pan-x hide-scrollbar">
              {packages.map((pkg) => (
                <TabsTrigger
                  key={`tab-${pkg.title}`}
                  value={pkg.title}
                  className="min-h-[3rem] shrink-0 rounded-lg px-6 py-3 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all whitespace-nowrap"
                >
                  {pkg.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPackage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {packages.filter(p => p.title === selectedPackage).map((pkg) => (
                <TabsContent
                  key={`detail-${pkg.title}`}
                  value={pkg.title}
                  className="mt-0 border border-border bg-white rounded-3xl p-6 shadow-xl sm:p-10 outline-none"
                  forceMount
                >
                  <div className="mb-8 flex flex-col justify-between gap-6 border-b border-border/50 pb-8 md:flex-row md:items-center">
                    <div>
                      <h2 className="mb-3 text-3xl font-bold text-secondary">{pkg.title}</h2>
                      <p className="max-w-2xl text-muted-foreground">اضغط على الجهة لعرض الخدمات الفرعية المشمولة في هذه الباقة.</p>
                    </div>
                    <Button asChild size="lg" className="min-w-[200px] h-14 bg-primary text-white hover:bg-primary/90 font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
                      <Link href={`/request-service?package=${encodeURIComponent(pkg.title)}&source=packages`} data-conversion="request-service-click" data-source-page="/packages">
                        <PhoneCall className="ml-2 h-5 w-5" />
                        طلب هذه الباقة
                      </Link>
                    </Button>
                  </div>

                  <Accordion
                    type="single"
                    collapsible
                    className="divide-y divide-border/50 border-t border-border/50"
                  >
                    {pkg.groups.map((group, index) => (
                      <AccordionItem key={`${pkg.title}-${group.title}`} value={`${pkg.title}-${index}`} className="border-0">
                        <AccordionTrigger className="py-6 text-right text-base font-bold text-secondary hover:text-primary hover:no-underline sm:text-lg transition-colors group">
                          <span className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm transition-colors group-hover:bg-primary group-hover:text-white">
                              {index + 1}
                            </span>
                            {group.title}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-8">
                          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 bg-muted/30 p-6 rounded-2xl">
                            {group.services.map((service) => (
                              <li key={service} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                                <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-white flex items-center justify-center border border-primary/20">
                                  <Check className="h-2.5 w-2.5 text-primary" />
                                </div>
                                <Link href={getPackageServiceHref(group.title)} className="font-medium text-secondary hover:text-primary transition-colors block mt-[-2px]">
                                  {service}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              ))}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}

export function Packages() {
  return (
    <section id="packages" className="scroll-mt-20 bg-muted/30 py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:30px_30px]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <MotionSection className="mx-auto mb-16 max-w-2xl text-center">
          <RevealText>
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
              خطط تتناسب مع حجم أعمالك
            </div>
          </RevealText>
          <RevealText>
            <h2 className="mb-5 text-3xl font-bold text-secondary md:text-5xl">{sections.packages.title}</h2>
          </RevealText>
          <RevealText>
            <p className="text-lg text-muted-foreground">{sections.packages.subtitle}</p>
          </RevealText>
        </MotionSection>

        <StaggerContainer className="grid gap-8 lg:grid-cols-3 items-center">
          {sections.packages.items.map((pkg, i) => (
            <motion.article
              key={pkg.title}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
              }}
              whileHover={{ y: -5 }}
              className={cn(
                "relative group flex h-full flex-col border rounded-[2rem] p-8 sm:p-10 overflow-hidden transition-all duration-300",
                pkg.isPopular
                  ? "border-primary bg-secondary text-white shadow-[0_20px_60px_-15px_rgba(26,188,156,0.3)] lg:scale-105 z-10"
                  : "border-border bg-white text-secondary hover:shadow-xl hover:border-primary/40"
              )}
            >
              {pkg.title === 'باقة الأعمال' && (
                <span className="mb-3 inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
                  الاختيار المناسب
                </span>
              )}
              <h3 className="mb-4 text-2xl font-bold mt-2">{pkg.title}</h3>

              <p className={cn("mb-8 min-h-[60px] leading-relaxed", pkg.isPopular ? "text-white/80" : "text-muted-foreground")}>
                {pkg.description}
              </p>

              <ul className="mb-10 flex-1 space-y-4">
                {pkg.highlights.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm">
                    <div className={cn(
                      "mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                      pkg.isPopular ? "bg-white/10" : "bg-primary/10"
                    )}>
                      <Check className={cn("h-3 w-3", pkg.isPopular ? "text-primary" : "text-primary")} />
                    </div>
                    <span className={pkg.isPopular ? "text-white/90 pt-0.5" : "pt-0.5"}>{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button asChild variant={pkg.isPopular ? "default" : "outline"} className={cn(
                "h-14 w-full rounded-xl font-bold transition-all",
                pkg.isPopular
                  ? "bg-primary text-white hover:bg-primary/90 border-transparent shadow-[0_0_20px_rgba(26,188,156,0.4)]"
                  : "border-border hover:bg-muted group-hover:text-primary group-hover:border-primary/50"
              )}>
                <Link href="/packages">
                  التفاصيل الكاملة للباقة
                  <ArrowLeft className={cn("mr-2 h-5 w-5 rtl-flip transition-transform", !pkg.isPopular && "group-hover:-translate-x-1")} />
                </Link>
              </Button>
            </motion.article>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
