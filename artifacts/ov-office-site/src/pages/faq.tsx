import { useSEO } from '@/hooks/use-seo';
import { sections } from '@/data/content';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  useSEO({
    title: 'الأسئلة الشائعة',
    description: 'إجابات على أبرز استفساراتكم حول خدمات تأسيس الأعمال والاستثمار في المملكة.',
    type: 'FAQPage',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": sections.faq.items.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    }
  });

  return (
    <div className="py-14 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
            {sections.faq.title}
          </h1>
          <p className="text-xl text-muted-foreground">
            إجابات وافية على أبرز ما يتبادر إلى ذهنك حول خدماتنا وإجراءات الأعمال.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-6">
          {sections.faq.items.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white border border-border rounded-2xl px-8 shadow-sm hover:border-primary/30 transition-colors"
            >
              <AccordionTrigger className="text-xl font-bold text-secondary hover:no-underline hover:text-primary transition-colors py-8 text-right">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-lg leading-relaxed pb-8">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

      </div>
    </div>
  );
}
