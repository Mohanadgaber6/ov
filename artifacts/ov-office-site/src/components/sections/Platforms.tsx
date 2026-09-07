import { sections } from '@/data/content';
import { Building2 } from 'lucide-react';
import { MotionSection, RevealText } from '@/components/motion';
import { motion } from 'framer-motion';

export function Platforms() {
  const { platforms } = sections;
  // Duplicate for seamless loop
  const marqueeItems = [...platforms.items, ...platforms.items, ...platforms.items, ...platforms.items];

  return (
    <section id="platforms" className="scroll-mt-20 bg-white py-16 lg:py-24 overflow-hidden border-y border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
        <MotionSection className="mx-auto max-w-2xl text-center">
          <RevealText>
            <h2 className="mb-4 text-2xl font-bold text-secondary md:text-3xl">{platforms.title}</h2>
          </RevealText>
          <RevealText>
            <p className="text-muted-foreground">{platforms.subtitle}</p>
          </RevealText>
        </MotionSection>
      </div>

      <div className="relative w-full max-w-[100vw] overflow-hidden flex flex-col gap-6" dir="ltr">
        {/* Left/Right Fade Overlays */}
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

        {/* Track 1 (Right to Left) */}
        <div className="flex w-fit">
          <motion.div
            className="flex gap-6 pr-6 items-center"
            animate={{ x: [0, -1000] }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: "linear",
            }}
            whileHover={{ animationPlayState: "paused" }}
          >
            {marqueeItems.map((platform, i) => (
              <div
                key={`t1-${i}`}
                className="flex items-center gap-4 border border-border/50 bg-muted/30 px-8 py-5 rounded-2xl whitespace-nowrap hover:border-primary/30 hover:bg-white hover:shadow-sm transition-colors cursor-default"
                dir="rtl"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-border/50 shadow-sm shrink-0">
                  <Building2 className="h-5 w-5 text-primary" strokeWidth={1.5} />
                </div>
                <span className="font-bold text-secondary text-lg">{platform.name}</span>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
