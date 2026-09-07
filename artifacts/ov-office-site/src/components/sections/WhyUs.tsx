import { sections } from '@/data/content';
import { ShieldCheck, Clock, Eye, Briefcase } from 'lucide-react';
import { MotionSection, RevealText, StaggerContainer } from '@/components/motion';
import { motion } from 'framer-motion';

const icons = [ShieldCheck, Clock, Eye, Briefcase];

export function WhyUs() {
  const { whyUs } = sections;

  return (
    <section className="py-16 lg:py-24 bg-secondary text-white relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none">
        <div className="grid grid-cols-6 gap-3">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="w-2 h-2 bg-white rounded-full" />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <MotionSection className="text-center max-w-2xl mx-auto mb-20">
          <RevealText>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {whyUs.title}
            </h2>
          </RevealText>
          <RevealText>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
          </RevealText>
        </MotionSection>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyUs.items.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
                }}
                className="group relative bg-white/5 border border-white/10 rounded-[2rem] p-8 overflow-hidden hover:border-primary/40 transition-colors duration-500"
              >
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <Icon className="w-8 h-8" strokeWidth={1.5} />
                </div>

                <h3 className="relative z-10 text-2xl font-bold mb-4">{item.title}</h3>
                <p className="relative z-10 text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-500">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </StaggerContainer>

      </div>
    </section>
  );
}
