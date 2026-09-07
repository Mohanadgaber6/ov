export type KnowledgeSection = {
  heading: string;
  paragraphs: string[];
};

export type KnowledgeArticle = {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  summary: string;
  introduction: string;
  sections: KnowledgeSection[];
  faqs: { question: string; answer: string }[];
  relatedServiceId: string;
  relatedArticleSlugs: string[];
};

const faq = (topic: string) => [
  { question: `هل يختلف ${topic} من حالة لأخرى؟`, answer: 'نعم، يتأثر الإجراء بنوع الكيان والنشاط وبيانات الطلب والجهة المختصة.' },
  { question: 'كيف أبدأ التحضير؟', answer: 'ابدأ بجمع بيانات المنشأة والوثائق المتاحة، ثم راجعها قبل تقديم أي طلب.' },
  { question: 'هل المتابعة تعني قبول الطلب؟', answer: 'لا. المتابعة تساعد على تنظيم الطلب والرد على الملاحظات، بينما قرار القبول أو الرفض يعود للجهة المختصة.' },
  { question: 'هل يمكن الاعتماد على هذه المعلومات وحدها؟', answer: 'هذه مسودة توعوية عامة، ويجب التحقق من القنوات الرسمية والمتطلبات المحدثة قبل التنفيذ.' },
];

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    slug: 'preparing-company-formation-file', title: 'كيف تجهّز ملف تأسيس شركتك بصورة منظمة', category: 'تأسيس الأعمال', publishedAt: '2025-01-12', updatedAt: '2025-02-15',
    summary: 'خطوات عملية لترتيب المعلومات والوثائق قبل بدء رحلة تأسيس الكيان.', introduction: 'يقلل التنظيم المبكر من تكرار المراجعات ويمنحك صورة أوضح عن الخطوات التالية.',
    sections: [{ heading: 'حدد صورة النشاط والكيان', paragraphs: ['دوّن النشاط المقصود، الشركاء، الصلاحيات، ومقر العمل المتوقع. هذه المعلومات تساعد في توجيه الطلب إلى المسار المناسب.'] }, { heading: 'رتب الوثائق المتاحة', paragraphs: ['احتفظ بنسخ واضحة من هويات الأطراف والوثائق ذات الصلة، وسجل مصدر كل وثيقة وتاريخها. قد تطلب الجهة المختصة مستندات إضافية بحسب الحالة.'] }, { heading: 'راجع البيانات قبل التقديم', paragraphs: ['طابق الأسماء والأرقام وبيانات التواصل بين المستندات. أي اختلاف يحتاج إلى توضيح أو معالجة قبل المتابعة.'] }],
    faqs: faq('ملف تأسيس الشركة'), relatedServiceId: 'company-formation-saudi', relatedArticleSlugs: ['choosing-business-name', 'understanding-commercial-registration']
  },
  {
    slug: 'choosing-business-name', title: 'اختيار اسم تجاري واضح وقابل للاستخدام', category: 'تأسيس الأعمال', publishedAt: '2025-01-18', updatedAt: '2025-02-15',
    summary: 'منهج بسيط لصياغة بدائل للاسم التجاري ومراجعتها قبل تقديم الطلب.', introduction: 'الاسم التجاري جزء من هوية المنشأة، ومن الأفضل التعامل معه كقرار تشغيلي وتسويقي إلى جانب كونه إجراءً رسمياً.',
    sections: [{ heading: 'ابدأ بقائمة بدائل', paragraphs: ['جهّز أكثر من اسم يعبر عن النشاط ولا يربك العميل. تجنب ربط خطتك باسم واحد قبل التحقق عبر القنوات الرسمية.'] }, { heading: 'اختبر الوضوح', paragraphs: ['اسأل هل يسهل نطق الاسم وكتابته؟ وهل يظل مناسباً إذا توسع النشاط لاحقاً؟'] }, { heading: 'تحقق قبل اعتماد الهوية', paragraphs: ['تخضع إمكانية الحجز أو الاستخدام لمراجعة الجهة المختصة. لا تعدّ التصميمات النهائية أو المواد المطبوعة قبل تأكيد وضع الاسم.'] }],
    faqs: faq('اختيار الاسم التجاري'), relatedServiceId: 'ministry-of-commerce', relatedArticleSlugs: ['preparing-company-formation-file', 'brand-identity-brief']
  },
  {
    slug: 'understanding-commercial-registration', title: 'السجل التجاري: ما الذي ينبغي مراجعته في بياناته؟', category: 'تأسيس الأعمال', publishedAt: '2025-01-26', updatedAt: '2025-02-15',
    summary: 'نقاط مراجعة عامة للبيانات التجارية لتسهيل الربط مع العمليات اللاحقة.', introduction: 'تظهر بيانات السجل في مسارات تشغيلية متعددة، لذلك تفيد مراجعتها بدقة كلما طرأ تغيير على المنشأة.',
    sections: [{ heading: 'البيانات الأساسية', paragraphs: ['راجع اسم الكيان ونشاطه وعناوينه وبيانات المفوضين وفق الوثائق المتاحة لديك.'] }, { heading: 'صلة البيانات بالتشغيل', paragraphs: ['قد تعتمد منصات أو جهات أخرى على بيانات المنشأة، لذلك يساعد الاتساق على تقليل الاستفسارات.'] }, { heading: 'التحديث عند التغيير', paragraphs: ['عند تغيير جوهري في الكيان أو النشاط، تحقق من أثره على السجل والتراخيص والملفات ذات العلاقة.'] }],
    faqs: faq('بيانات السجل التجاري'), relatedServiceId: 'ministry-of-commerce', relatedArticleSlugs: ['preparing-company-formation-file', 'updating-company-data']
  },
  {
    slug: 'foreign-investor-document-readiness', title: 'جاهزية ملف المستثمر الأجنبي: تنظيم قبل المتابعة', category: 'خدمات المستثمرين', publishedAt: '2025-02-02', updatedAt: '2025-02-15',
    summary: 'إطار عام لتجميع المعلومات وتنسيقها عند دراسة مسار استثماري.', introduction: 'تختلف الملفات الاستثمارية بحسب المستثمر والنشاط والجهة المختصة؛ لذلك تكون البداية الأفضل بفهم الحالة وترتيب مصادر البيانات.',
    sections: [{ heading: 'عرّف المشروع والأطراف', paragraphs: ['لخص النشاط المقترح، الهيكل، الأطراف ذات العلاقة، ووسائل التواصل المعتمدة في ملف واحد.'] }, { heading: 'نسق الوثائق', paragraphs: ['راجع وضوح النسخ وترجمة الوثائق أو تصديقها عندما تطلب القنوات الرسمية ذلك. لا تفترض أن قائمة سابقة تنطبق على كل طلب.'] }, { heading: 'خطط للملاحظات', paragraphs: ['خصص مسؤول اتصال سريع الرد واحتفظ بسجل للملاحظات والنسخ المحدثة من المستندات.'] }],
    faqs: faq('ملف المستثمر الأجنبي'), relatedServiceId: 'foreign-company-formation', relatedArticleSlugs: ['investment-license-preparation', 'preparing-company-formation-file']
  },
  {
    slug: 'investment-license-preparation', title: 'التحضير لطلب متعلق بالترخيص الاستثماري', category: 'خدمات المستثمرين', publishedAt: '2025-02-05', updatedAt: '2025-02-15',
    summary: 'كيف تصنع ملفاً داخلياً يساعدك على وصف النشاط ورفع المستندات بترتيب.', introduction: 'التحضير لا يضمن نتيجة الطلب، لكنه يسهّل استكمال المعلومات التي قد تطلبها الجهة المختصة.',
    sections: [{ heading: 'وصف متسق للنشاط', paragraphs: ['اكتب وصفاً موجزاً ودقيقاً للنشاط والنموذج التشغيلي، وراجعه مع الوثائق الداعمة.'] }, { heading: 'ملف مستندات قابل للمراجعة', paragraphs: ['رتب الملفات بعناوين واضحة وإصدارات حديثة، وحدد الشخص المسؤول عن كل معلومة.'] }, { heading: 'تابع المصدر الرسمي', paragraphs: ['تحقق من المنصة أو الجهة الرسمية عند البدء، لأن الإجراءات والمعلومات قد تتغير.'] }],
    faqs: faq('طلب الترخيص الاستثماري'), relatedServiceId: 'investment-license', relatedArticleSlugs: ['foreign-investor-document-readiness', 'government-platform-readiness']
  },
  {
    slug: 'government-platform-readiness', title: 'جاهزية المنشأة لاستخدام المنصات الحكومية', category: 'الخدمات الحكومية', publishedAt: '2025-02-08', updatedAt: '2025-02-15',
    summary: 'مبادئ تنظيم الصلاحيات والبيانات وسجل المتابعة على المنصات.', introduction: 'إدارة الوصول والبيانات جزء من استمرارية أعمال المنشأة، وليست خطوة تقنية فقط.',
    sections: [{ heading: 'حدد أصحاب الصلاحيات', paragraphs: ['وثّق من يملك حق الدخول ومن يتابع الطلبات، وراجع التفويضات عبر القنوات المعتمدة عند الحاجة.'] }, { heading: 'أنشئ سجل متابعة', paragraphs: ['سجل الطلب، حالته، الملاحظات، والوثائق المرتبطة به في مكان آمن يسهل الرجوع إليه.'] }, { heading: 'لا تشارك بيانات الدخول', paragraphs: ['استخدم آليات التفويض أو الوصول الرسمية بدلاً من تداول كلمات المرور أو البيانات الحساسة.'] }],
    faqs: faq('إدارة المنصات الحكومية'), relatedServiceId: 'government-platform-management', relatedArticleSlugs: ['data-review-before-submission', 'license-renewal-planning']
  },
  {
    slug: 'data-review-before-submission', title: 'مراجعة البيانات قبل رفع أي طلب', category: 'الخدمات الحكومية', publishedAt: '2025-02-10', updatedAt: '2025-02-15',
    summary: 'قائمة ذهنية مختصرة لخفض أخطاء الإدخال وتعارض المستندات.', introduction: 'يمكن أن تؤدي معلومة ناقصة أو غير متسقة إلى تأخير المراجعة؛ لذا خصص وقتاً لمراجعة مستقلة قبل الإرسال.',
    sections: [{ heading: 'طابق المصدر', paragraphs: ['قارن البيانات المدخلة بالوثيقة الأصلية، خصوصاً الأسماء والأرقام والتواريخ وبيانات الاتصال.'] }, { heading: 'تحقق من الاكتمال', paragraphs: ['تأكد من إرفاق كل ملف مطلوب حسب شاشة الطلب أو تعليمات الجهة، ومن قابلية فتح المرفقات.'] }, { heading: 'احتفظ بأثر المراجعة', paragraphs: ['سجل النسخة التي أرسلت ومن راجعها وتاريخ الرفع، لتسهيل التعامل مع الاستفسارات.'] }],
    faqs: faq('مراجعة البيانات قبل الرفع'), relatedServiceId: 'government-platform-management', relatedArticleSlugs: ['government-platform-readiness', 'payroll-file-review']
  },
  {
    slug: 'license-renewal-planning', title: 'التخطيط لمراجعة وتجديد التراخيص', category: 'الخدمات الحكومية', publishedAt: '2025-02-12', updatedAt: '2025-02-15',
    summary: 'طريقة تنظيمية لمتابعة التراخيص والوثائق دون افتراض مدد أو اشتراطات ثابتة.', introduction: 'يتطلب كل ترخيص مراجعة وضعه ومتطلبات الجهة المختصة في الوقت الفعلي.',
    sections: [{ heading: 'اصنع سجلاً موحداً', paragraphs: ['اجمع التراخيص المرتبطة بالمنشأة مع الجهة والنشاط ومالك المتابعة وحالة الوثائق.'] }, { heading: 'راجع الأثر التشغيلي', paragraphs: ['حدد الأعمال التي قد تتأثر عند وجود طلب معلق أو وثيقة تحتاج إلى تحديث.'] }, { heading: 'تحقق قبل الإجراء', paragraphs: ['لا تعتمد على معلومات قديمة حول الرسوم أو المواعيد أو المتطلبات؛ ارجع دائماً للقنوات الرسمية.'] }],
    faqs: faq('تجديد التراخيص'), relatedServiceId: 'government-platform-management', relatedArticleSlugs: ['government-platform-readiness', 'balady-license-readiness']
  },
  {
    slug: 'balady-license-readiness', title: 'الاستعداد لمتابعة طلب بلدي للنشاط', category: 'الخدمات الحكومية', publishedAt: '2025-02-14', updatedAt: '2025-02-15',
    summary: 'كيف ترتب معلومات الموقع والنشاط ووثائقه قبل متابعة الطلب.', introduction: 'يرتبط الطلب عادةً بواقع النشاط والموقع، وقد تختلف المراجعة بحسب الحالة والتعليمات المطبقة.',
    sections: [{ heading: 'وثق معلومات الموقع', paragraphs: ['اجمع بيانات الموقع والعقد والمخططات أو الوثائق المتاحة بشكل منظم.'] }, { heading: 'اربط النشاط بالملف', paragraphs: ['تأكد من أن وصف النشاط وبيانات المنشأة متسقان عبر المستندات والطلبات ذات العلاقة.'] }, { heading: 'استعد للملاحظات', paragraphs: ['قد تطلب الجهة المختصة استكمالات أو تعديلات؛ تعامل معها وفق الإشعار الرسمي.'] }],
    faqs: faq('طلب بلدي'), relatedServiceId: 'balady', relatedArticleSlugs: ['license-renewal-planning', 'understanding-commercial-registration']
  },
  {
    slug: 'payroll-file-review', title: 'مراجعة ملف الرواتب قبل المتابعة', category: 'إدارة الرواتب', publishedAt: '2025-02-16', updatedAt: '2025-02-18',
    summary: 'ممارسات تنظيمية لمراجعة بيانات الرواتب والمستندات الداعمة.', introduction: 'دقة الملف تبدأ من اتساق البيانات الداخلية، مع الرجوع إلى القنوات المعتمدة لأي متطلب تشغيلي.',
    sections: [{ heading: 'وحد مصدر البيانات', paragraphs: ['حدد المصدر المعتمد لبيانات العاملين والرواتب، ووثق أي تعديل قبل إدراجه.'] }, { heading: 'راجع الاستثناءات', paragraphs: ['اعزل الحالات التي تحتاج تفسيراً أو مستنداً داعماً بدلاً من تمريرها دون مراجعة.'] }, { heading: 'احمِ البيانات', paragraphs: ['قصر الوصول إلى ملفات الرواتب على الأشخاص المخولين واتبع سياسات الخصوصية الداخلية.'] }],
    faqs: faq('ملف الرواتب'), relatedServiceId: 'mudad', relatedArticleSlugs: ['data-review-before-submission', 'employee-record-organization']
  },
  {
    slug: 'employee-record-organization', title: 'تنظيم ملفات الموظفين بصورة عملية', category: 'الموارد البشرية', publishedAt: '2025-02-19', updatedAt: '2025-02-20',
    summary: 'هيكل مبسط لملفات الموظفين يساعد على سرعة المراجعة وحماية الخصوصية.', introduction: 'الملف المنظم لا يغني عن المتطلبات الرسمية، لكنه يسهل الوصول إلى المعلومة الصحيحة عند الحاجة.',
    sections: [{ heading: 'هيكل موحد للملف', paragraphs: ['اعتمد تسميات موحدة وتقسيمات واضحة للوثائق، مع تجنب تكرار النسخ غير الموثقة.'] }, { heading: 'تحديث مسؤول', paragraphs: ['حدد من يحدّث كل نوع من البيانات، وسجل تاريخ التعديل ومصدره.'] }, { heading: 'خصوصية وصلاحيات', paragraphs: ['احفظ الملفات في بيئة مؤمنة وقصر الاطلاع على من تقتضي مهمته ذلك.'] }],
    faqs: faq('تنظيم ملفات الموظفين'), relatedServiceId: 'labor-office', relatedArticleSlugs: ['payroll-file-review', 'government-platform-readiness']
  },
  {
    slug: 'updating-company-data', title: 'عند تغير بيانات المنشأة: من أين تبدأ؟', category: 'التغييرات القانونية', publishedAt: '2025-02-22', updatedAt: '2025-02-23',
    summary: 'خطوات تنسيق داخلية لفهم أثر تغيير البيانات على السجلات والملفات المرتبطة.', introduction: 'التغيير في الاسم أو الشركاء أو العنوان أو النشاط قد يرتبط بأكثر من ملف؛ ابدأ بحصر الأثر قبل اتخاذ الإجراء.',
    sections: [{ heading: 'صف التغيير بوضوح', paragraphs: ['وثق ما الذي تغير وقرار الأطراف والمستندات المؤيدة له وفق حالتك.'] }, { heading: 'ارسم خريطة الارتباط', paragraphs: ['احصر السجلات والتراخيص والمنصات والعقود التي قد تعتمد على البيانات محل التغيير.'] }, { heading: 'اتبع المسار المعتمد', paragraphs: ['تُقدّم الإجراءات وتُعتمد لدى الجهات المختصة بحسب متطلبات كل حالة، وقد يتطلب ذلك استكمالات إضافية.'] }],
    faqs: faq('تحديث بيانات المنشأة'), relatedServiceId: 'articles-of-association-amendment', relatedArticleSlugs: ['understanding-commercial-registration', 'ownership-transfer-preparation']
  },
  {
    slug: 'ownership-transfer-preparation', title: 'التحضير المنظم لتغيير ملكية منشأة', category: 'التغييرات القانونية', publishedAt: '2025-02-25', updatedAt: '2025-02-26',
    summary: 'نقاط تنسيق عامة للأطراف والوثائق قبل بدء متابعة تغيير الملكية.', introduction: 'تغيير الملكية موضوع ذو أثر قانوني وتشغيلي؛ وتختلف تفاصيله وفق الكيان والأطراف والجهات ذات العلاقة.',
    sections: [{ heading: 'وضح دور كل طرف', paragraphs: ['حدد ممثلي الأطراف ووسائل التواصل والوثائق التي تثبت الصلاحية، مع توثيق أي قرار ذي صلة.'] }, { heading: 'اجمع صورة الالتزامات', paragraphs: ['راجع الملفات والسجلات والتراخيص والعقود ذات العلاقة لتكوين صورة عملية قبل التقديم.'] }, { heading: 'تجنب الوعود المسبقة', paragraphs: ['تتولى الجهات المختصة قرار الاعتماد، وقد تتغير المتطلبات أو تظهر ملاحظات بحسب الملف.'] }],
    faqs: faq('تغيير ملكية المنشأة'), relatedServiceId: 'company-ownership-transfer', relatedArticleSlugs: ['updating-company-data', 'preparing-company-formation-file']
  },
  {
    slug: 'brand-identity-brief', title: 'كيف تكتب موجزاً واضحاً للهوية البصرية', category: 'التسويق والتصميم', publishedAt: '2025-02-28', updatedAt: '2025-03-01',
    summary: 'أسئلة أساسية تساعد المنشأة على تحويل رؤيتها إلى موجز تصميم قابل للتنفيذ.', introduction: 'الموجز الجيد يوفر سياقاً للمصمم ويجعل المراجعات مبنية على أهداف واضحة لا على الانطباع فقط.',
    sections: [{ heading: 'عرّف الجمهور والرسالة', paragraphs: ['صف العميل الذي تريد مخاطبته وما الانطباع الذي ينبغي أن تتركه العلامة لديه.'] }, { heading: 'اجمع المراجع', paragraphs: ['شارك أمثلة تعجبك أو لا تناسبك مع شرح السبب، ولا تكتفِ بالصور دون سياق.'] }, { heading: 'حدد الاستخدامات', paragraphs: ['اذكر أين ستستخدم الهوية: قنوات رقمية أو مطبوعات أو واجهات، حتى تجهز الملفات المناسبة.'] }],
    faqs: faq('موجز الهوية البصرية'), relatedServiceId: 'visual-identity-design', relatedArticleSlugs: ['choosing-business-name', 'preparing-company-formation-file']
  },
];

export const knowledgeCategories = [...new Set(knowledgeArticles.map((article) => article.category))];