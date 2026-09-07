import { globalData } from '@/data/content';
import { FaInstagram, FaTiktok, FaSnapchatGhost } from 'react-icons/fa';
import { SiX } from 'react-icons/si';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { Link } from 'wouter';
import { MotionSection, RevealText } from '@/components/motion';

const serviceLinks = [
  { label: 'تأسيس الشركات', href: '/services/company-formation-saudi' },
  { label: 'خدمات المستثمرين', href: '/investor-services' },
  { label: 'الخدمات الحكومية', href: '/services/category/government-services' },
  { label: 'الموارد البشرية', href: '/services/category/hr' },
  { label: 'التحويل ونقل الملكية', href: '/services/category/legal' },
];

const importantLinks = [
  { label: 'جميع الخدمات', href: '/services' },
  { label: 'الباقات', href: '/packages' },
  { label: 'مركز المعرفة', href: '/knowledge-center' },
  { label: 'الأسئلة الشائعة', href: '/faq' },
  { label: 'تواصل معنا', href: '/contact' },
];

const socialLinks = [
  { platform: 'X', url: 'https://x.com/Ov_Office', icon: SiX },
  { platform: 'TikTok', url: 'https://www.tiktok.com/@ov_office', icon: FaTiktok },
  { platform: 'Instagram', url: 'https://www.instagram.com/ov_office/', icon: FaInstagram },
  { platform: 'Snapchat', url: 'https://snapchat.com/t/0XcpKHm5', icon: FaSnapchatGhost },
];

export function Footer() {
  return (
    <footer id="footer" className="scroll-mt-20 border-t border-border bg-secondary pb-8 pt-14 lg:pt-20 text-white/80 relative overflow-hidden">
      {/* Decorative BG */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <MotionSection className="mb-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-12">

          {/* Logo and Description */}
          <RevealText className="lg:col-span-4">
            <Link href="/" className="mb-6 inline-block transition-transform hover:scale-105">
              <Logo className="h-16 w-auto" isLight />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-white/70">
              نساعد أصحاب الأعمال والمستثمرين في تنظيم ومتابعة خدمات التأسيس والتشغيل والمنصات ذات العلاقة، من خلال مسارات واضحة وحلول متكاملة.
            </p>
          </RevealText>

          {/* Links */}
          <RevealText delay={0.1} className="lg:col-span-2">
            <h2 className="mb-6 text-lg font-bold text-white relative inline-block">
              الخدمات
              <span className="absolute -bottom-2 right-0 w-1/2 h-0.5 bg-primary rounded-full"></span>
            </h2>
            <ul className="space-y-4 text-sm">
              {serviceLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-all hover:text-primary hover:translate-x-[-4px] inline-block">{item.label}</Link>
                </li>
              ))}
            </ul>
          </RevealText>

          <RevealText delay={0.2} className="lg:col-span-2">
            <h2 className="mb-6 text-lg font-bold text-white relative inline-block">
              روابط مهمة
              <span className="absolute -bottom-2 right-0 w-1/2 h-0.5 bg-primary rounded-full"></span>
            </h2>
            <ul className="space-y-4 text-sm">
              {importantLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-all hover:text-primary hover:translate-x-[-4px] inline-block">{item.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/request-service" data-conversion="request-service-click" data-source-page="footer" className="font-bold text-primary hover:text-primary/80 transition-colors inline-block mt-2">
                  اطلب خدمة الآن
                </Link>
              </li>
            </ul>
          </RevealText>

          {/* Contact */}
          <RevealText delay={0.3} className="lg:col-span-4">
            <h2 className="mb-6 text-lg font-bold text-white relative inline-block">
              تواصل معنا
              <span className="absolute -bottom-2 right-0 w-1/2 h-0.5 bg-primary rounded-full"></span>
            </h2>
            <ul className="space-y-5 text-sm mb-10">
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-colors group-hover:bg-primary/20 shrink-0">
                  <Phone className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                </div>
                <div className="flex flex-col">
                  <a href={`tel:${globalData.phone}`} data-conversion="phone-click" dir="ltr" className="transition-colors hover:text-primary font-medium">{globalData.phoneDisplay}</a>
                </div>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-colors group-hover:bg-primary/20 shrink-0">
                  <Mail className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                </div>
                <a href={`mailto:${globalData.email}`} dir="ltr" className="break-all transition-colors hover:text-primary font-medium">{globalData.email}</a>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-colors group-hover:bg-primary/20 shrink-0">
                  <MapPin className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                </div>
                <a href={globalData.mapsLink} target="_blank" rel="noreferrer" data-conversion="location-click" className="leading-relaxed transition-colors hover:text-primary pt-1">
                  {globalData.address}
                </a>
              </li>
            </ul>

            <div className="text-center sm:text-right mt-10 sm:mt-0">
              <h2 className="mb-6 text-lg font-bold text-white relative inline-block">
                تابعنا
                <span className="absolute -bottom-2 right-0 w-1/2 h-0.5 bg-primary rounded-full"></span>
              </h2>
              <div className="flex items-center justify-center sm:justify-start gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/5 text-white/80 hover:text-primary transition-all duration-200 border border-white/10 hover:border-primary/50 group"
                      aria-label={`تابعنا على ${social.platform}`}
                    >
                      <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                    </a>
                  );
                })}
              </div>
            </div>
          </RevealText>

        </MotionSection>

        <RevealText>
          <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} {globalData.companyName}. جميع الحقوق محفوظة.</p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <Link href="/privacy" className="transition-colors hover:text-white">سياسة الخصوصية</Link>
              <Link href="/terms" className="transition-colors hover:text-white">الشروط والأحكام</Link>
              <Link href="/disclaimer" className="transition-colors hover:text-white">إخلاء المسؤولية</Link>
            </div>
          </div>
        </RevealText>
      </div>
    </footer>
  );
}
