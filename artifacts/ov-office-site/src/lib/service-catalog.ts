import { allServices, serviceCategories } from '@/data/content';

type Service = (typeof allServices)[number];

export type ServicePageData = Service & {
  categoryId: string;
  categoryTitle: string;
  categoryHref: string;
};

const priorityDetails: Record<string, Partial<Service>> = {
  'commercial-name-reservation': {
    description: 'تنظيم ومتابعة طلب حجز الاسم التجاري بما يناسب هوية المنشأة ونشاطها المقترح.',
    includes: ['مراجعة بيانات الاسم والنشاط', 'تنظيم البدائل المقترحة', 'متابعة حالة الطلب', 'تنسيق الملاحظات والاستكمالات'],
  },
  'commercial-registration': {
    description: 'تنسيق بيانات المنشأة ومتابعة إجراءات إصدار السجل التجاري عبر القنوات ذات العلاقة.',
    includes: ['مراجعة بيانات المنشأة', 'تنظيم معلومات النشاط والكيان', 'متابعة الطلب', 'تنسيق الملاحظات والاستكمالات'],
  },
  'commercial-registration-update': {
    description: 'مراجعة التغيير المطلوب ومتابعة تحديث بيانات السجل التجاري والملفات المرتبطة به.',
    includes: ['تحديد نطاق التحديث', 'مراجعة اتساق البيانات', 'متابعة طلب التعديل', 'تنسيق أثر التغيير على الملفات المرتبطة'],
  },
  'license-renewal': {
    description: 'تنظيم سجل التراخيص ومتابعة طلبات التجديد والاستكمال مع مراعاة اختلاف المتطلبات حسب النشاط والجهة.',
    includes: ['حصر التراخيص المطلوب متابعتها', 'مراجعة البيانات المتاحة', 'متابعة الطلبات', 'تنسيق الملاحظات والاستكمالات'],
  },
  'premium-residency-support': {
    description: 'مساندة المستثمر في تنظيم المعلومات ومتابعة الخدمات المرتبطة بالإقامة المميزة وفق مساره وحالته.',
    includes: ['دراسة الاحتياج الأولي', 'تنظيم المعلومات والوثائق المتاحة', 'توجيه الطلب للمسار المناسب', 'متابعة الاستكمالات'],
  },
  'worker-transfer': {
    description: 'تنظيم بيانات الأطراف ومتابعة طلب نقل خدمات العامل عبر المسار المناسب للحالة.',
    includes: ['مراجعة بيانات العامل والمنشآت', 'تنظيم الطلب', 'متابعة الحالة', 'تنسيق الملاحظات والاستكمالات'],
  },
  'profession-change': {
    description: 'متابعة طلب تغيير المهنة بعد مراجعة بيانات العامل والمنشأة والمسار المناسب عبر المنصات ذات العلاقة.',
    includes: ['مراجعة البيانات الأولية', 'تنظيم الطلب', 'متابعة الحالة', 'تنسيق الملاحظات'],
  },
  'work-permits': {
    description: 'متابعة خدمات إصدار وتجديد رخص العمل وتنظيم البيانات المرتبطة بالطلب.',
    includes: ['مراجعة بيانات العامل والمنشأة', 'متابعة حالة الرخصة', 'تنظيم الاستكمالات', 'توثيق حالة الطلب'],
  },
  'entity-conversion': {
    description: 'تنظيم خطوات تحويل المؤسسة إلى شركة ومتابعة أثر التغيير على السجلات والملفات ذات العلاقة.',
    includes: ['دراسة الوضع الحالي', 'تنظيم قرارات وبيانات الأطراف', 'متابعة إجراءات التحويل', 'تنسيق تحديث الملفات المرتبطة'],
  },
  'manager-change': {
    description: 'متابعة تغيير مدير الشركة وتنظيم بيانات القرار والصلاحيات والملفات المرتبطة.',
    includes: ['مراجعة قرار التغيير', 'تنظيم بيانات المدير', 'متابعة طلب التعديل', 'تنسيق تحديث السجلات ذات العلاقة'],
  },
  'capital-increase': {
    description: 'تنظيم بيانات قرار زيادة رأس المال ومتابعة تحديث عقد التأسيس والسجلات المرتبطة بحسب الحالة.',
    includes: ['مراجعة بيانات القرار', 'تنظيم معلومات رأس المال', 'متابعة التعديلات', 'تنسيق تحديث الملفات المرتبطة'],
  },
  'managed-wage-protection': {
    description: 'تنظيم ومراجعة ملفات حماية الأجور ومتابعة الملاحظات المرتبطة بها.',
    includes: ['مراجعة بيانات الملف', 'تنظيم حالات الموظفين', 'متابعة الرفع', 'تنسيق معالجة الملاحظات'],
  },
};

const priorityIds = new Set(Object.keys(priorityDetails));

export function getCategoryForService(serviceId: string) {
  return serviceCategories.find((category) => category.services.some((service) => service.id === serviceId));
}

export function getServicePageHref(serviceId: string, fallbackHref?: string) {
  if (allServices.some((service) => service.id === serviceId) || priorityIds.has(serviceId)) {
    return `/services/${serviceId}`;
  }
  return fallbackHref ?? getCategoryForService(serviceId)?.href ?? '/services';
}

export function getServicePageData(serviceId: string): ServicePageData | undefined {
  const category = getCategoryForService(serviceId);
  const existing = allServices.find((service) => service.id === serviceId);

  if (existing) {
    return {
      ...existing,
      categoryId: category?.id ?? 'services',
      categoryTitle: category?.title ?? 'الخدمات',
      categoryHref: category?.href ?? '/services',
    };
  }

  const listing = category?.services.find((service) => service.id === serviceId);
  const override = priorityDetails[serviceId];
  if (!category || !listing || !override) return undefined;

  return {
    id: serviceId,
    title: listing.title,
    description: override.description ?? category.description,
    includes: override.includes ?? [
      'مراجعة الوضع الحالي والهدف من الطلب',
      'تنظيم البيانات والمعلومات المتاحة',
      'متابعة الطلب مع القنوات ذات العلاقة',
      'تنسيق الملاحظات والاستكمالات',
    ],
    requirements: ['تختلف المتطلبات حسب نوع المنشأة والنشاط وحالة الطلب والجهة المختصة، ويتم تحديدها بعد مراجعة الحالة.'],
    process: ['استلام تفاصيل الحالة', 'مراجعة البيانات المتاحة', 'تحديد مسار المتابعة', 'متابعة الطلب والملاحظات'],
    categoryId: category.id,
    categoryTitle: category.title,
    categoryHref: category.href,
  };
}

export function getRelatedServices(serviceId: string) {
  const category = getCategoryForService(serviceId);
  if (!category) return [];

  return category.services
    .filter((service) => service.id !== serviceId)
    .map((service) => ({
      id: service.id,
      title: service.title,
      href: getServicePageHref(service.id, category.href),
    }))
    .slice(0, 3);
}

const packageGroupService: Record<string, string> = {
  'إدارة خدمات وزارة العمل': 'qiwa',
  'إدارة خدمات التأمينات الاجتماعية': 'gosi',
  'إدارة خدمات وزارة التجارة': 'ministry-of-commerce',
  'إدارة خدمات هيئة الزكاة والضريبة والجمارك': 'zatca',
  'إدارة خدمات وزارة الداخلية': 'absher-business',
  'إدارة خدمات بلدي': 'balady',
  'إدارة خدمات سلامة': 'government-platform-management',
  'إدارة خدمات شركات التأمين الطبي': 'medical-insurance',
  'خدمات الاستشارات': 'company-formation-saudi',
  'اشتراك برنامج حماية الأجور': 'mudad',
  'توثيق عقود العمل للموظفين': 'qiwa',
  'إعداد اللائحة الداخلية للمنشأة': 'labor-office',
  'إعداد عقود العمل لجميع الموظفين': 'qiwa',
  'تخفيف الأعباء المالية للمنشآت': 'labor-office',
  'تأهيل وتدريب موظفي المنشأة': 'labor-office',
};

export function getPackageServiceHref(groupTitle: string) {
  const serviceId = packageGroupService[groupTitle];
  return serviceId ? getServicePageHref(serviceId) : '/services';
}