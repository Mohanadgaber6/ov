import { useSEO } from '@/hooks/use-seo';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';

const companyServices = [
  'حجز الاسم التجاري باللغة العربية',
  'حجز الاسم التجاري باللغة الإنجليزية',
  'تأسيس الشركات والمنشآت',
  'إصدار السجل التجاري',
  'تحديث بيانات السجل التجاري',
  'تعديل وإضافة الأنشطة التجارية',
  'تعديل عقد التأسيس',
  'دخول أو خروج شريك',
  'نقل ملكية الشركة أو المؤسسة',
  'تغيير أو تعيين المدير',
  'تعديل صلاحيات المديرين',
  'زيادة أو تخفيض رأس المال',
  'فتح وتعديل الفروع',
  'إصدار الإفادات والمستخرجات التجارية',
  'تحديث بيانات المنشأة',
  'تحويل نوع الكيان التجاري',
  'الاندماج وإعادة الهيكلة',
  'شطب السجل التجاري',
  'تصفية المنشأة',
  'متابعة الطلبات لدى وزارة التجارة والمركز السعودي للأعمال',
  'تسجيل وتفعيل المنشأة في المنصات الحكومية',
  'متابعة التراخيص المرتبطة بالنشاط',
  'معالجة الملاحظات والنواقص في الطلبات',
];

export default function CompanyServicesPage() {
  useSEO({
    title: 'خدمات الشركات',
    description: 'تغطية شاملة لكافة المتطلبات القانونية والإدارية لتأسيس وتشغيل الشركات في السعودية.',
  });

  return (
    <div className="py-14 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
            خدمات الشركات المتكاملة
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            حلول موثوقة ومخصصة للمؤسسات والشركات لتسهيل بدء وتوسيع نطاق الأعمال في المملكة العربية السعودية، مع الالتزام التام بكافة اللوائح والأنظمة.
          </p>
        </div>

        <div className="grid gap-x-12 gap-y-0 border-y border-border md:grid-cols-2">
          {companyServices.map((service) => (
            <div key={service} className="flex items-center gap-3 border-b border-border py-5 last:border-b-0">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
              <span className="font-semibold text-secondary">{service}</span>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="h-14 bg-secondary px-9 text-lg text-white hover:bg-secondary/90">
            <Link href="/request-service?category=business-setup&source=company-services" data-conversion="request-service-click" data-service-category="تأسيس الأعمال" data-source-page="/company-services">اطلب خدمة للشركة</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14 border-primary/30 px-9 text-lg text-primary">
            <Link href="/services/company-formation-saudi">
              تفاصيل تأسيس الشركات
              <ArrowLeft className="mr-2 h-4 w-4 rtl-flip" />
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
