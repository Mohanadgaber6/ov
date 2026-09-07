import { sections, globalData } from '@/data/content';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin } from 'lucide-react';
import { MotionSection, RevealText, RevealImage } from '@/components/motion';
import { motion } from 'framer-motion';
import locationImage from '@assets/generated_images/ov-office-neutral.jpg';

export function OfficeLocation() {
  const { location } = sections;

  return (
    <section id="office-location" className="scroll-mt-20 bg-muted/30 py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <MotionSection className="mb-10 max-w-2xl">
          <RevealText>
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 border border-primary/20">
              مكة المكرمة
            </div>
          </RevealText>
          <RevealText>
            <h2 className="text-3xl font-bold text-secondary sm:text-5xl mb-6">{location.title}</h2>
          </RevealText>
          <RevealText>
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <a
                href={globalData.mapsLink}
                target="_blank"
                rel="noreferrer"
                data-conversion="location-click"
                className="flex items-center gap-3 text-lg leading-8 text-muted-foreground transition-colors hover:text-primary group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-border/50 group-hover:border-primary/30 transition-colors">
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                </div>
                <span className="font-medium">{globalData.address}</span>
              </a>
              <Button asChild className="h-12 w-full sm:w-auto bg-secondary px-6 text-white hover:bg-secondary/90 rounded-xl font-bold">
                <a href={globalData.mapsLink} target="_blank" rel="noreferrer" data-conversion="location-click">
                  فتح في خرائط جوجل
                  <ExternalLink className="mr-2 h-4 w-4 rtl-flip" />
                </a>
              </Button>
            </div>
          </RevealText>
        </MotionSection>

        <MotionSection>
          <RevealImage effect="clip" className="mt-8 overflow-hidden rounded-[2rem] border border-border/50 bg-white shadow-xl relative group">
            <div className="absolute inset-0 bg-secondary/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <iframe
              title="موقع مكتب أوفي الذكية على Google Maps"
              src={globalData.mapEmbedUrl}
              className="h-[320px] w-full sm:h-[450px] lg:h-[500px] grayscale-[20%] contrast-[90%] group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-700"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </RevealImage>
        </MotionSection>
      </div>
    </section>
  );
}
