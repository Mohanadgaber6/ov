import { useEffect, useMemo, useState } from 'react';
import { useSEO } from '@/hooks/use-seo';
import { globalData, sections, serviceCategories } from '@/data/content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ChevronLeft, PhoneCall, Building2 } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { trackEvent } from '@/lib/analytics';
import { MotionSection, RevealText } from '@/components/motion';
import { motion, AnimatePresence } from 'framer-motion';

type FormValues = {
  name: string;
  company: string;
  mobile: string;
  email: string;
  city: string;
  description: string;
  contactMethod: string;
  documentName: string;
};

const initialValues: FormValues = {
  name: '', company: '', mobile: '', email: '', city: '', description: '', contactMethod: '', documentName: '',
};

export default function RequestServicePage() {
  useSEO({
    title: 'اطلب خدمة',
    description: 'قدم طلبك إلكترونياً للحصول على خدمات تأسيس الأعمال والاستشارات من أوفي الذكية.',
  });

  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [sourcePage, setSourcePage] = useState('request-service');
  const [values, setValues] = useState<FormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const category = serviceCategories.find((item) => item.id === selectedCategory);
  const services = useMemo(() => category?.services ?? [], [category]);
  const selectedServiceData = services.find((item) => item.id === selectedService);
  const packageItems = sections.packages.items;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedService = params.get('service') ?? '';
    const requestedCategory = params.get('category') ?? '';
    const requestedPackage = params.get('package') ?? '';
    const requestedSource = params.get('source') ?? 'request-service';
    const serviceCategory = serviceCategories.find((item) =>
      item.services.some((service) => service.id === requestedService),
    );
    const matchingPackage = packageItems.find((item) =>
      item.title === requestedPackage ||
      item.title.replace(/\s+/g, '-').toLowerCase() === requestedPackage.toLowerCase(),
    );

    if (serviceCategory) {
      setSelectedCategory(serviceCategory.id);
      setSelectedService(requestedService);
    } else if (serviceCategories.some((item) => item.id === requestedCategory)) {
      setSelectedCategory(requestedCategory);
    }
    if (matchingPackage) setSelectedPackage(matchingPackage.title);
    setSourcePage(requestedSource);
  }, [packageItems]);

  const updateValue = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const validateStep = () => {
    if (step === 1 && !selectedCategory) return 'يرجى اختيار فئة الخدمة.';
    if (step === 2 && !selectedService) return 'يرجى اختيار الخدمة المطلوبة.';
    if (step === 3) {
      if (!values.name.trim() || !values.mobile.trim() || !values.email.trim() || !values.city.trim()) {
        return 'يرجى تعبئة الاسم والجوال والبريد الإلكتروني والمدينة.';
      }
      if (!/\S+@\S+\.\S+/.test(values.email)) return 'يرجى إدخال بريد إلكتروني صحيح.';
    }
    if (step === 4 && (!values.description.trim() || !values.contactMethod)) {
      return 'يرجى وصف الطلب واختيار طريقة التواصل المفضلة.';
    }
    return '';
  };

  const nextStep = () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (step === 1) {
      trackEvent('service_form_start', {
        service_category: category?.title,
        source_page: sourcePage,
      });
    }
    setError('');
    setStep((current) => Math.min(current + 1, 5));
  };

  const handleSubmit = async () => {
    setError('');
    
    // Complete validation of all fields before final submission
    if (!selectedCategory) {
      setError('يرجى اختيار فئة الخدمة.');
      setStep(1);
      return;
    }
    if (!selectedService) {
      setError('يرجى اختيار الخدمة المطلوبة.');
      setStep(2);
      return;
    }
    if (!values.name.trim() || !values.mobile.trim() || !values.email.trim() || !values.city.trim()) {
      setError('يرجى تعبئة الاسم والجوال والبريد الإلكتروني والمدينة.');
      setStep(3);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(values.email)) {
      setError('يرجى إدخال بريد إلكتروني صحيح.');
      setStep(3);
      return;
    }
    if (!values.description.trim() || !values.contactMethod) {
      setError('يرجى وصف الطلب واختيار طريقة التواصل المفضلة.');
      setStep(4);
      return;
    }

    setIsSubmitting(true);

    try {
      // Server-side email delivery
      const res = await fetch('/api/forms/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          company: values.company.trim(),
          mobile: values.mobile.trim(),
          email: values.email.trim(),
          city: values.city.trim(),
          category: category?.title || selectedCategory || 'خدمات عامة',
          service: selectedServiceData?.title || selectedService || 'خدمة عامة',
          package: selectedPackage || '',
          contactMethod: values.contactMethod,
          description: values.description.trim(),
          documentName: values.documentName.trim(),
          sourcePage: sourcePage || window.location.pathname,
          website_hp: (values as any).website_hp || '',
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `حدث خطأ أثناء إرسال الطلب (${res.status})`);
      }

      trackEvent('service_form_submit', {
        service_name: selectedServiceData?.title || selectedService,
        service_category: category?.title || selectedCategory,
        source_page: sourcePage,
      });

      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Service request error:', err);
      setError(err?.message || 'حدث خطأ أثناء معالجة الطلب في الخادم. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 lg:py-24 bg-background min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">

        <MotionSection className="text-center mb-12">
          <RevealText>
            <div className="w-20 h-20 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-primary/20">
              <Building2 className="w-10 h-10" />
            </div>
          </RevealText>
          <RevealText>
            <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
              اطلب خدمة
            </h1>
          </RevealText>
          <RevealText>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              املأ النموذج أدناه وسيقوم فريق أوفي الذكية بالتواصل معك لتقديم الاستشارة وتلبية متطلباتك بمهنية واحترافية.
            </p>
          </RevealText>
        </MotionSection>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-[2.5rem] p-6 sm:p-10 md:p-14 shadow-2xl border border-border/50 relative overflow-hidden"
        >
          {isSubmitted ? (
            <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
              <div className="w-28 h-28 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8 relative">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping motion-reduce:animate-none" />
                <CheckCircle2 className="w-14 h-14 relative z-10" />
              </div>
              <h2 className="text-3xl font-bold text-secondary mb-4">تم إرسال طلبك بنجاح</h2>
              <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
                شكراً لتواصلك مع أوفي الذكية. تم استلام طلبك وسيقوم فريقنا بمراجعته والتواصل معك قريباً.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-xl font-bold border-secondary/20 hover:bg-secondary/5 transition-colors" onClick={() => { setIsSubmitted(false); setStep(1); setValues(initialValues); }}>
                  تقديم طلب جديد
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={(event) => { event.preventDefault(); if (step === 5) handleSubmit(); else nextStep(); }} className="space-y-8" data-testid="form-request-service">
              {/* Invisible Honeypot Spam Trap */}
              <input
                type="text"
                name="website_hp"
                value={(values as any).website_hp || ''}
                onChange={(e) => updateValue('website_hp' as any, e.target.value)}
                autoComplete="off"
                tabIndex={-1}
                aria-hidden="true"
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0, margin: 0, padding: 0 }}
              />
              <div>
                <div className="flex items-center justify-between text-sm font-bold text-secondary mb-4">
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">{step}</span>
                    الخطوة {step} من 5
                  </span>
                  <span className="text-primary font-mono bg-primary/10 px-3 py-1 rounded-full">{step * 20}%</span>
                </div>
                <Progress value={step * 20} aria-label={`الخطوة ${step} من 5`} className="h-2 bg-muted" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 1 && <div className="space-y-4">
                    <Label className="text-lg font-bold text-secondary">فئة الخدمة <span className="text-destructive">*</span></Label>
                    <p className="text-muted-foreground text-sm mb-4">حدد المسار الرئيسي الذي تندرج تحته الخدمة المطلوبة.</p>
                    <Select value={selectedCategory} onValueChange={(value) => { setSelectedCategory(value); setSelectedService(''); }}>
                      <SelectTrigger className="h-16 text-base bg-muted/50 border-border/50 focus:bg-white rounded-xl shadow-sm"><SelectValue placeholder="اختر فئة الخدمة..." /></SelectTrigger>
                      <SelectContent dir="rtl">{serviceCategories.map((item) => <SelectItem key={item.id} value={item.id} className="text-base py-3">{item.title}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>}

                  {step === 2 && <div className="space-y-8">
                    <div className="space-y-4">
                      <Label className="text-lg font-bold text-secondary">الخدمة المطلوبة <span className="text-destructive">*</span></Label>
                      <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger className="h-16 text-base bg-muted/50 border-border/50 focus:bg-white rounded-xl shadow-sm"><SelectValue placeholder="اختر الخدمة..." /></SelectTrigger>
                        <SelectContent dir="rtl">{services.map((item) => <SelectItem key={item.id} value={item.id} className="text-base py-3">{item.title}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-lg font-bold text-secondary">الباقة المناسبة (اختياري)</Label>
                      <p className="text-muted-foreground text-sm mb-2">إذا كنت ترغب في باقة متكاملة، يمكنك اختيارها من هنا.</p>
                      <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                        <SelectTrigger className="h-16 text-base bg-muted/50 border-border/50 focus:bg-white rounded-xl shadow-sm"><SelectValue placeholder="اختر باقة إن وجدت..." /></SelectTrigger>
                        <SelectContent dir="rtl">{packageItems.map((item) => <SelectItem key={item.title} value={item.title} className="text-base py-3">{item.title}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>}

                  {step === 3 && <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-base font-bold text-secondary">الاسم الكريم <span className="text-destructive">*</span></Label><Input value={values.name} onChange={(event) => updateValue('name', event.target.value)} placeholder="أدخل اسمك" className="h-14 text-base bg-muted/50 border-border/50 focus:bg-white rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-base font-bold text-secondary">اسم الشركة (اختياري)</Label><Input value={values.company} onChange={(event) => updateValue('company', event.target.value)} placeholder="اسم المنشأة" className="h-14 text-base bg-muted/50 border-border/50 focus:bg-white rounded-xl" />
                    </div>
                    <div className="space-y-3"><Label className="text-base font-bold text-secondary">رقم الجوال <span className="text-destructive">*</span></Label><Input type="tel" dir="ltr" value={values.mobile} onChange={(event) => updateValue('mobile', event.target.value)} placeholder="05x xxx xxxx" className="h-14 text-base text-left bg-muted/50 border-border/50 focus:bg-white rounded-xl" /></div>
                    <div className="space-y-3"><Label className="text-base font-bold text-secondary">البريد الإلكتروني <span className="text-destructive">*</span></Label><Input type="email" dir="ltr" value={values.email} onChange={(event) => updateValue('email', event.target.value)} placeholder="name@example.com" className="h-14 text-base text-left bg-muted/50 border-border/50 focus:bg-white rounded-xl" /></div>
                    <div className="space-y-3"><Label className="text-base font-bold text-secondary">المدينة <span className="text-destructive">*</span></Label><Input value={values.city} onChange={(event) => updateValue('city', event.target.value)} placeholder="مثال: مكة المكرمة" className="h-14 text-base bg-muted/50 border-border/50 focus:bg-white rounded-xl" /></div>
                  </div>}

                  {step === 4 && <div className="space-y-8">
                    <div className="space-y-4"><Label className="text-lg font-bold text-secondary">وصف الطلب <span className="text-destructive">*</span></Label><Textarea value={values.description} onChange={(event) => updateValue('description', event.target.value)} placeholder="اشرح احتياجك أو استفسارك بالتفصيل..." className="min-h-[160px] text-base resize-none bg-muted/50 border-border/50 focus:bg-white rounded-xl p-5" /></div>
                    <div className="space-y-4"><Label className="text-lg font-bold text-secondary">طريقة التواصل المفضلة <span className="text-destructive">*</span></Label><Select value={values.contactMethod} onValueChange={(value) => updateValue('contactMethod', value)}><SelectTrigger className="h-16 text-base bg-muted/50 border-border/50 focus:bg-white rounded-xl"><SelectValue placeholder="اختر الطريقة..." /></SelectTrigger><SelectContent dir="rtl"><SelectItem value="واتساب">واتساب</SelectItem><SelectItem value="اتصال هاتفي">اتصال هاتفي</SelectItem><SelectItem value="البريد الإلكتروني">البريد الإلكتروني</SelectItem></SelectContent></Select></div>
                    <div className="space-y-4"><Label className="text-lg font-bold text-secondary">اسم المستندات للتحضير (اختياري)</Label><Input value={values.documentName} onChange={(event) => updateValue('documentName', event.target.value)} placeholder="مثال: السجل التجاري، الهوية" className="h-16 text-base bg-muted/50 border-border/50 focus:bg-white rounded-xl" /><p className="text-sm text-muted-foreground font-medium bg-muted p-3 rounded-lg border border-border/50">لا يتم رفع مستندات عبر هذا النموذج؛ سيتم ترتيب نقل المستندات بشكل آمن بعد مراجعة الطلب.</p></div>
                  </div>}

                  {step === 5 && <div className="rounded-2xl bg-muted/30 border border-border/50 p-6 md:p-8 space-y-4 text-base">
                    <h2 className="text-2xl font-bold text-secondary mb-6 border-b border-border/50 pb-4">مراجعة الطلب</h2>
                    <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                      <p><strong className="text-muted-foreground block text-sm mb-1">الفئة:</strong> <span className="font-bold">{category?.title}</span></p>
                      <p><strong className="text-muted-foreground block text-sm mb-1">الخدمة:</strong> <span className="font-bold">{selectedServiceData?.title}</span></p>
                      {selectedPackage && <p><strong className="text-muted-foreground block text-sm mb-1">الباقة:</strong> <span className="font-bold">{selectedPackage}</span></p>}
                      <p><strong className="text-muted-foreground block text-sm mb-1">العميل:</strong> <span className="font-bold">{values.name}</span> <span className="text-sm text-muted-foreground ml-2 dir-ltr inline-block">({values.mobile})</span></p>
                      <p><strong className="text-muted-foreground block text-sm mb-1">طريقة التواصل:</strong> <span className="font-bold">{values.contactMethod}</span></p>
                    </div>
                    <div className="pt-4 border-t border-border/50 mt-4">
                      <p><strong className="text-muted-foreground block text-sm mb-1">وصف الطلب:</strong> <span className="font-bold block bg-white p-4 rounded-xl border border-border/50 mt-2">{values.description}</span></p>
                      {values.documentName && <p className="mt-4"><strong className="text-muted-foreground block text-sm mb-1">المستندات للتحضير:</strong> <span className="font-bold">{values.documentName}</span></p>}
                    </div>
                  </div>}
                </motion.div>
              </AnimatePresence>

              {error && <p role="alert" className="text-sm font-bold text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20">{error}</p>}

              <div className="pt-6 mt-8 border-t border-border/50 flex flex-col-reverse sm:flex-row gap-4">
                {step > 1 && <Button type="button" variant="outline" size="lg" className="h-14 px-8 text-lg rounded-xl font-bold border-secondary/20 hover:bg-secondary/5 transition-colors" onClick={() => { setError(''); setStep((current) => current - 1); }}>السابق</Button>}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="h-14 px-10 text-lg bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 w-full sm:w-auto transition-all disabled:opacity-70"
                  data-testid="button-submit"
                >
                  {isSubmitting ? 'جاري الإرسال...' : (step === 5 ? 'إرسال الطلب واعتماد' : <>التالي <ChevronLeft className="w-5 h-5 mr-2 rtl-flip" /></>)}
                </Button>

                <div className="flex-1 flex items-center justify-start sm:justify-end gap-3 text-muted-foreground text-sm font-medium bg-muted/30 p-3 rounded-xl sm:bg-transparent sm:p-0 sm:border-0 border border-border/50">
                  <PhoneCall className="w-5 h-5 text-primary" />
                  <span>بحاجة لمساعدة فورية؟ <a href={`tel:${globalData.phone}`} data-conversion="phone-click" className="text-primary hover:underline dir-ltr inline-block font-bold" dir="ltr">{globalData.phoneDisplay}</a></span>
                </div>
              </div>
            </form>
          )}
        </motion.div>

      </div>
    </div>
  );
}
