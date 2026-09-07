import { sections } from '@/data/content';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { MotionSection, RevealText } from '@/components/motion';
import { cn } from '@/lib/utils';

export function HowWeWork() {
  const { howWeWork } = sections;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 2.5 seconds as per final spec
  const INTERVAL_MS = 2500;

  useEffect(() => {
    if (isPaused) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % howWeWork.steps.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [isPaused, howWeWork.steps.length]);

  useEffect(() => () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const activateStep = useCallback((index: number) => {
    setActiveIndex(index);
    setIsPaused(false);
  }, []);

  const nextStep = useCallback(() => {
    setActiveIndex((current) => (current + 1) % howWeWork.steps.length);
    setIsPaused(false);
  }, [howWeWork.steps.length]);

  const prevStep = useCallback(() => {
    setActiveIndex((current) => (current === 0 ? howWeWork.steps.length - 1 : current - 1));
    setIsPaused(false);
  }, [howWeWork.steps.length]);

  const pause = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setIsPaused(true);
  };

  const resume = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setIsPaused(false), 120);
  };

  // Touch handling for mobile swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    pause();
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      resume();
      return;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextStep();
    } else if (isRightSwipe) {
      prevStep();
    } else {
      resume();
    }
  };

  const currentStepData = howWeWork.steps[activeIndex];

  return (
    <section id="customer-journey" className="scroll-mt-20 bg-secondary py-16 lg:py-24 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <MotionSection className="mb-12 lg:mb-20">
          <div className="max-w-2xl mx-auto text-center">
            <RevealText>
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
                رحلة العميل معنا
              </div>
            </RevealText>
            <RevealText>
              <h2 className="text-3xl font-bold text-white md:text-5xl mb-6">
                {howWeWork.title}
              </h2>
            </RevealText>
            <RevealText>
              <p className="text-white/60 text-lg leading-relaxed">
                مسار واضح وشفاف يضمن لك تحقيق أهدافك بأعلى معايير الجودة والاحترافية.
              </p>
            </RevealText>
          </div>
        </MotionSection>

        {/* Mobile Layout */}
        <div
          className="lg:hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex flex-col items-center max-w-sm mx-auto">
            {/* Step Counter */}
            <div className="text-primary font-bold tracking-widest text-lg mb-8" dir="ltr">
              {String(activeIndex + 1).padStart(2, '0')} / {String(howWeWork.steps.length).padStart(2, '0')}
            </div>

            {/* Active Step Display */}
            <div className="relative w-full text-center px-4 min-h-[160px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute inset-0 flex flex-col items-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary text-white text-xl font-bold mb-6 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                    {activeIndex === howWeWork.steps.length - 1 ? <Check className="h-7 w-7" /> : currentStepData.step}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{currentStepData.title}</h3>
                  <p className="text-white/70 text-base leading-relaxed">{currentStepData.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 mt-10">
              <button
                onClick={prevStep}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-primary hover:text-white transition-colors border border-white/10"
                aria-label="الخطوة السابقة"
              >
                <ChevronRight className="w-6 h-6 rtl-flip" />
              </button>

              {/* Dots Indicator */}
              <div className="flex gap-2" dir="ltr">
                {howWeWork.steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => activateStep(i)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      i === activeIndex ? "w-6 bg-primary" : "w-2 bg-white/20"
                    )}
                    aria-label={`انتقل للخطوة ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-primary hover:text-white transition-colors border border-white/10"
                aria-label="الخطوة التالية"
              >
                <ChevronLeft className="w-6 h-6 rtl-flip" />
              </button>
            </div>

          </div>
        </div>

        {/* Desktop Layout */}
        <div
          className="hidden lg:block relative py-10 lg:py-0"
          onMouseEnter={pause}
          onMouseLeave={resume}
          onFocus={pause}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) resume();
          }}
        >
          <div className="absolute right-0 top-7 hidden h-px w-full bg-white/10 lg:block" aria-hidden="true" />
          <div
            className="absolute right-0 top-7 hidden h-[2px] w-full origin-right bg-primary transition-transform duration-300 lg:block ease-out"
            style={{ transform: `scaleX(${(activeIndex + 1) / howWeWork.steps.length})` }}
            aria-hidden="true"
          />
          <div className="grid gap-0 lg:grid-cols-7 relative z-10">
            {howWeWork.steps.map((step, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={step.step}
                  type="button"
                  onClick={() => activateStep(index)}
                  className="relative flex w-full gap-6 pb-12 pr-0 text-right lg:block lg:px-3 lg:pb-0 lg:text-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-secondary"
                  aria-current={isActive ? 'step' : undefined}
                  data-testid={`button-journey-step-${index + 1}`}
                >
                  <span className={cn(
                    "absolute right-2 top-0 flex h-12 w-12 translate-x-1/2 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 lg:static lg:mx-auto lg:mb-8 lg:h-14 lg:w-14 lg:translate-x-0 lg:text-lg",
                    isActive
                      ? "border-primary bg-primary text-white scale-110 shadow-[0_0_15px_rgba(20,184,166,0.4)]"
                      : "border-white/20 bg-secondary text-white/50 group-hover:border-primary/50 group-hover:text-primary"
                  )}>
                    {index === howWeWork.steps.length - 1 ? <Check className="h-4 w-4 lg:h-6 lg:w-6" /> : step.step}
                  </span>
                  <span className={cn("block pt-1 pr-16 transition-opacity duration-300 lg:p-0", isActive ? "opacity-100" : "opacity-40 group-hover:opacity-70")}>
                    <span className={cn(
                      "mb-3 block text-xl font-bold transition-colors",
                      isActive ? "text-primary" : "text-white"
                    )}>{step.title}</span>
                    <span className="mx-auto block max-w-[220px] text-sm leading-8 text-white/70">{step.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="sr-only"
              aria-live="polite"
            >
              المرحلة الحالية: {howWeWork.steps[activeIndex].title}
            </motion.p>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
