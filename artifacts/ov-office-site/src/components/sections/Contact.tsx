import { globalData } from '@/data/content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { Mail, PhoneCall, MapPin, Send } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { Link } from 'wouter';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { MotionSection, RevealText, RevealImage } from '@/components/motion';
import { motion } from 'framer-motion';

export function ContactCTA() {
  return (
    <section className="bg-primary py-16 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
      <div className="container mx-auto flex flex-col items-center justify-between gap-8 px-4 text-center sm:px-6 lg:flex-row lg:px-8 lg:text-right relative z-10">
        <MotionSection className="max-w-2xl">
          <RevealText>
            <p className="mb-3 text-sm font-bold text-white/80 uppercase tracking-wider">ابدأ بخطوة واضحة</p>
          </RevealText>
          <RevealText>
            <h2 className="mb-4 text-3xl font-bold md:text-5xl leading-tight text-white">هل تحتاج مساعدة في خدمات منشأتك؟</h2>
          </RevealText>
          <RevealText>
            <p className="text-lg leading-8 text-white/80">تواصل مع فريق أوفي الذكية لتحديد الخدمة أو الباقة المناسبة وبدء العمل فوراً.</p>
          </RevealText>
        </MotionSection>
        <MotionSection delay={0.2} className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild size="lg" className="h-14 w-full bg-white px-8 font-bold text-primary hover:bg-white/90 shadow-xl shadow-black/10">
              <Link href="/request-service" data-conversion="request-service-click">اطلب خدمة</Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild size="lg" variant="outline" className="h-14 w-full border-white/30 bg-transparent px-8 font-bold text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm">
              <a href={globalData.whatsappLink} target="_blank" rel="noreferrer" data-conversion="whatsapp-click">تواصل عبر واتساب</a>
            </Button>
          </motion.div>
        </MotionSection>
      </div>
    </section>
  );
}

export function Contact({ compact = false }: { compact?: boolean }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const contact = {
    title: "تواصل معنا",
    subtitle: "يسعدنا استقبال استفسارك ومساعدتك في تحديد الخدمة المناسبة لمنشأتك.",
    formFields: { name: "الاسم الكريم", phone: "رقم الجوال", service: "الخدمة المطلوبة", message: "رسالتك" },
    submitText: "إرسال الطلب",
    successMessage: "تم إرسال طلبك بنجاح، سنتواصل معك قريباً."
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const name = String(formData.get('name') ?? '');
    const phone = String(formData.get('phone') ?? '');
    const service = String(formData.get('service') ?? '');
    const messageContent = String(formData.get('message') ?? '');
    const hp = String(formData.get('website_hp') ?? '');

    try {
      // Server-side email delivery
      const res = await fetch('/api/forms/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          service,
          message: messageContent,
          sourcePage: window.location.pathname,
          website_hp: hp,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'حدث خطأ أثناء إرسال الطلب');
      }

      trackEvent('service_form_submit', { source_page: 'public-contact-form' });
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 8000);
    } catch (err: any) {
      console.error('Contact form submission failed:', err);
      setSubmitError(err?.message || 'حدث خطأ أثناء معالجة الطلب في الخادم. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className={cn(
        "relative overflow-hidden bg-white",
        compact ? "pb-12 pt-6 sm:pb-16 sm:pt-8" : "py-16 lg:py-24"
      )}
    >
      <div className="absolute left-0 bottom-0 w-full h-[500px] bg-secondary/5 rounded-tr-full pointer-events-none blur-[100px]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <MotionSection>
            {!compact && (
              <>
                <RevealText>
                  <Logo className="mb-8" isLight={false} />
                </RevealText>
                <RevealText>
                  <h2 className="mb-6 text-3xl font-bold text-secondary md:text-5xl">{contact.title}</h2>
                </RevealText>
                <RevealText>
                  <p className="mb-12 text-lg leading-relaxed text-muted-foreground">{contact.subtitle}</p>
                </RevealText>
              </>
            )}
            <div className="space-y-8">
              {[
                { icon: FaWhatsapp, title: "واتساب", content: globalData.phone, href: globalData.whatsappLink, dir: "ltr" },
                { icon: PhoneCall, title: "الهاتف", content: globalData.phone, href: `tel:${globalData.phone}`, dir: "ltr" },
                { icon: Mail, title: "البريد الإلكتروني", content: globalData.email, href: `mailto:${globalData.email}`, dir: "ltr" },
                { icon: MapPin, title: "العنوان", content: globalData.address, href: globalData.mapsLink, dir: "rtl" },
              ].map((item, index) => (
                <RevealText key={index} delay={index * 0.1}>
                  <div className="flex items-start gap-5 group">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-primary group-hover:text-white border border-transparent group-hover:border-primary/20 shadow-sm group-hover:shadow-md">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="pt-1">
                      <h4 className="text-lg font-bold text-secondary mb-1">{item.title}</h4>
                      <a
                        href={item.href}
                        target={item.icon === MapPin ? "_blank" : undefined}
                        rel={item.icon === MapPin ? "noreferrer" : undefined}
                        className="text-muted-foreground hover:text-primary transition-colors block leading-relaxed"
                        dir={item.dir as any}
                      >
                        {item.content}
                      </a>
                    </div>
                  </div>
                </RevealText>
              ))}
            </div>
          </MotionSection>

          <MotionSection delay={0.3}>
            <div className="rounded-[2.5rem] border border-border/50 bg-white p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center"
                >
                  <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-100">
                    <Send className="w-10 h-10 ml-2" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary mb-3">شكراً لتواصلك معنا</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">{contact.successMessage}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  {/* Invisible Honeypot Spam Trap */}
                  <input
                    type="text"
                    name="website_hp"
                    autoComplete="off"
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0, margin: 0, padding: 0 }}
                  />
                  <div className="space-y-2.5">
                    <Label htmlFor="name" className="text-secondary font-bold">{contact.formFields.name}</Label>
                    <Input id="name" name="name" required className="h-14 bg-muted/40 border-border/50 focus:bg-white focus:border-primary transition-all rounded-xl" />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="phone" className="text-secondary font-bold">{contact.formFields.phone}</Label>
                    <Input id="phone" name="phone" type="tel" dir="ltr" required className="h-14 bg-muted/40 border-border/50 focus:bg-white focus:border-primary transition-all rounded-xl text-left" />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="service" className="text-secondary font-bold">{contact.formFields.service}</Label>
                    <Input id="service" name="service" className="h-14 bg-muted/40 border-border/50 focus:bg-white focus:border-primary transition-all rounded-xl" />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="message" className="text-secondary font-bold">{contact.formFields.message}</Label>
                    <Textarea id="message" name="message" rows={4} className="bg-muted/40 border-border/50 focus:bg-white focus:border-primary transition-all rounded-xl resize-none py-4" />
                  </div>
                  {submitError && (
                    <p role="alert" className="text-sm font-bold text-destructive bg-destructive/10 p-3 rounded-xl border border-destructive/20 text-center">
                      {submitError}
                    </p>
                  )}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md shadow-primary/20 mt-4 disabled:opacity-70" data-testid="form-submit" data-conversion="lead-form-submit">
                      {isSubmitting ? 'جاري الإرسال...' : contact.submitText}
                    </Button>
                  </motion.div>
                </form>
              )}
            </div>
          </MotionSection>
        </div>
      </div>
    </section>
  );
}
