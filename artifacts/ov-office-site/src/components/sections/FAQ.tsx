import { sections } from '@/data/content';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const { faq } = sections;

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">

        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            استفساراتك مجابة
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary">
            {faq.title}
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faq.items.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-muted/30 border border-border rounded-2xl px-6"
            >
              <AccordionTrigger className="text-lg font-bold text-secondary hover:no-underline hover:text-primary transition-colors py-6 text-right">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

      </div>
    </section>
  );
}
