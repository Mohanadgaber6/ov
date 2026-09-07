import "dotenv/config";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { logger } from "./logger";

// STRICT SERVER-SIDE CONSTANT - CANNOT BE OVERRIDDEN BY CLIENT
export const OFFICIAL_RECIPIENT_EMAIL = "ovoffiice@gmail.com";

export interface ContactFormData {
  name: string;
  phone: string;
  service?: string;
  message?: string;
  sourcePage?: string;
  clientIp?: string;
  userAgent?: string;
}

export interface ServiceRequestFormData {
  category?: string;
  service?: string;
  package?: string;
  name: string;
  company?: string;
  mobile: string;
  email: string;
  city: string;
  description: string;
  contactMethod: string;
  documentName?: string;
  sourcePage?: string;
  clientIp?: string;
  userAgent?: string;
}

let transporter: Transporter | null = null;

export function getTransporter(): Transporter {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER || "ovoffiice@gmail.com";
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
    });
    logger.info({ host, port, secure, user }, "SMTP Transporter configured with direct TLS");
  } else {
    logger.warn("No SMTP credentials found in environment. Local mock mode.");
    transporter = nodemailer.createTransport({
      jsonTransport: true,
    });
  }

  return transporter;
}

const getSenderAddress = (): string => {
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER || OFFICIAL_RECIPIENT_EMAIL;
  return `"أوفي الذكية - نموذج الموقع" <${from}>`;
};

export async function sendContactFormEmail(data: ContactFormData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const mail = getTransporter();
    const isRealSMTP = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

    const subject = `[طلب تواصل جديد] ${data.name} - ${data.service || "استفسار عام"}`;
    const timestamp = new Date().toLocaleString("ar-SA", { timeZone: "Asia/Riyadh" });

    const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: #0f172a; color: #ffffff; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; color: #ffffff; }
    .badge { display: inline-block; background: #0284c7; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 12px; margin-top: 8px; font-weight: bold; }
    .content { padding: 24px; }
    .field-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    .field-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; }
    .field-label { width: 35%; font-weight: bold; color: #64748b; font-size: 14px; }
    .field-value { font-size: 15px; color: #0f172a; font-weight: 500; }
    .message-box { background: #f8fafc; border-right: 4px solid #0284c7; padding: 16px; border-radius: 8px; margin-top: 16px; white-space: pre-wrap; font-size: 15px; }
    .footer { background: #f1f5f9; padding: 16px 24px; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>طلب تواصل جديد من موقع أوفي الذكية</h1>
      <span class="badge">نموذج تواصل معنا</span>
    </div>
    <div class="content">
      <table class="field-table">
        <tr>
          <td class="field-label">الاسم:</td>
          <td class="field-value">${data.name}</td>
        </tr>
        <tr>
          <td class="field-label">رقم الجوال:</td>
          <td class="field-value" dir="ltr" style="text-align: right;">${data.phone}</td>
        </tr>
        <tr>
          <td class="field-label">الخدمة المطلوبة:</td>
          <td class="field-value">${data.service || "غير محددة"}</td>
        </tr>
        <tr>
          <td class="field-label">وقت الإرسال:</td>
          <td class="field-value">${timestamp}</td>
        </tr>
        ${data.sourcePage ? `<tr><td class="field-label">صفحة المصدر:</td><td class="field-value" dir="ltr" style="text-align: right;">${data.sourcePage}</td></tr>` : ""}
      </table>
      <div style="margin-top: 20px;">
        <div class="field-label" style="margin-bottom: 8px;">نص الرسالة / التفاصيل:</div>
        <div class="message-box">${data.message || "لا توجد تفاصيل إضافية"}</div>
      </div>
    </div>
    <div class="footer">
      تم إرسال هذا الإشعار تلقائياً من خادم موقع أوفي الذكية إلى البريد الرسمي <strong>${OFFICIAL_RECIPIENT_EMAIL}</strong>
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
طلب تواصل جديد من موقع أوفي الذكية
------------------------------------
الاسم: ${data.name}
رقم الجوال: ${data.phone}
الخدمة: ${data.service || "غير محددة"}
نص الرسالة: ${data.message || "لا توجد تفاصيل"}
الوقت: ${timestamp}
المصدر: ${data.sourcePage || "الرئيسية"}
------------------------------------
المرسل إليه الرسمي: ${OFFICIAL_RECIPIENT_EMAIL}
    `;

    const result = await mail.sendMail({
      from: getSenderAddress(),
      to: OFFICIAL_RECIPIENT_EMAIL, // STRICT: ALWAYS OFFICIAL_RECIPIENT_EMAIL
      replyTo: undefined,
      subject,
      text: textContent,
      html: htmlContent,
    });

    logger.info(
      {
        messageId: result.messageId,
        recipient: OFFICIAL_RECIPIENT_EMAIL,
        isRealSMTP,
        form: "contact",
      },
      "Contact form email processed successfully",
    );

    return { success: true, messageId: result.messageId };
  } catch (error) {
    logger.error({ error, recipient: OFFICIAL_RECIPIENT_EMAIL }, "Failed to send contact form email");
    return { success: false, error: (error as Error).message };
  }
}

export async function sendServiceRequestEmail(data: ServiceRequestFormData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const mail = getTransporter();
    const isRealSMTP = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

    const isSingleServiceInquiry = Boolean(data.service && data.sourcePage?.includes("/services/"));
    const formTypeTitle = isSingleServiceInquiry ? "استفسار وطلب خدمة فردية" : "طلب خدمة جديد";
    const subject = `[${formTypeTitle}] ${data.service || data.category || "خدمات أوفي"} - ${data.name}`;
    const timestamp = new Date().toLocaleString("ar-SA", { timeZone: "Asia/Riyadh" });

    const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px; line-height: 1.6; }
    .container { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: #0f172a; color: #ffffff; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; color: #ffffff; }
    .badge { display: inline-block; background: #0284c7; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 12px; margin-top: 8px; font-weight: bold; }
    .content { padding: 24px; }
    .section-title { font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 20px; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 2px solid #e2e8f0; }
    .field-table { width: 100%; border-collapse: collapse; }
    .field-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
    .field-label { width: 35%; font-weight: bold; color: #64748b; font-size: 14px; }
    .field-value { font-size: 15px; color: #0f172a; font-weight: 500; }
    .message-box { background: #f8fafc; border-right: 4px solid #0284c7; padding: 16px; border-radius: 8px; margin-top: 12px; white-space: pre-wrap; font-size: 15px; }
    .footer { background: #f1f5f9; padding: 16px 24px; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${formTypeTitle} من موقع أوفي الذكية</h1>
      <span class="badge">${data.category || "خدمات عامة"} &bull; ${data.service || "عام"}</span>
    </div>
    <div class="content">
      <div class="section-title">بيانات العميل</div>
      <table class="field-table">
        <tr>
          <td class="field-label">اسم العميل:</td>
          <td class="field-value">${data.name}</td>
        </tr>
        <tr>
          <td class="field-label">اسم المنشأة / الشركة:</td>
          <td class="field-value">${data.company || "غير محدد"}</td>
        </tr>
        <tr>
          <td class="field-label">رقم الجوال:</td>
          <td class="field-value" dir="ltr" style="text-align: right;">${data.mobile}</td>
        </tr>
        <tr>
          <td class="field-label">البريد الإلكتروني للعميل:</td>
          <td class="field-value" dir="ltr" style="text-align: right;">${data.email}</td>
        </tr>
        <tr>
          <td class="field-label">المدينة:</td>
          <td class="field-value">${data.city}</td>
        </tr>
        <tr>
          <td class="field-label">طريقة التواصل المفضلة:</td>
          <td class="field-value">${data.contactMethod}</td>
        </tr>
      </table>

      <div class="section-title">تفاصيل الخدمة المطلوبة</div>
      <table class="field-table">
        <tr>
          <td class="field-label">فئة الخدمة:</td>
          <td class="field-value">${data.category || "غير محددة"}</td>
        </tr>
        <tr>
          <td class="field-label">الخدمة المحددة:</td>
          <td class="field-value"><strong>${data.service || "غير محددة"}</strong></td>
        </tr>
        ${data.package ? `<tr><td class="field-label">الباقة:</td><td class="field-value">${data.package}</td></tr>` : ""}
        ${data.documentName ? `<tr><td class="field-label">المستندات الجاهزة:</td><td class="field-value">${data.documentName}</td></tr>` : ""}
        <tr>
          <td class="field-label">وقت التقديم:</td>
          <td class="field-value">${timestamp}</td>
        </tr>
        ${data.sourcePage ? `<tr><td class="field-label">صفحة المصدر:</td><td class="field-value" dir="ltr" style="text-align: right;">${data.sourcePage}</td></tr>` : ""}
      </table>

      <div class="section-title">وصف الطلب والاحتياج</div>
      <div class="message-box">${data.description}</div>
    </div>
    <div class="footer">
      تم إرسال هذا الإشعار تلقائياً من خادم موقع أوفي الذكية إلى البريد الرسمي <strong>${OFFICIAL_RECIPIENT_EMAIL}</strong>
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
${formTypeTitle} من موقع أوفي الذكية
====================================
بيانات العميل:
- الاسم: ${data.name}
- الشركة: ${data.company || "غير محدد"}
- الجوال: ${data.mobile}
- البريد: ${data.email}
- المدينة: ${data.city}
- طريقة التواصل المفضلة: ${data.contactMethod}

تفاصيل الخدمة:
- الفئة: ${data.category || "غير محددة"}
- الخدمة: ${data.service || "غير محددة"}
- الباقة: ${data.package || "غير محددة"}
- المستندات: ${data.documentName || "لا توجد"}
- صفحة المصدر: ${data.sourcePage || "طلب خدمة"}
- الوقت: ${timestamp}

وصف الطلب:
${data.description}
====================================
المرسل إليه الرسمي: ${OFFICIAL_RECIPIENT_EMAIL}
    `;

    const result = await mail.sendMail({
      from: getSenderAddress(),
      to: OFFICIAL_RECIPIENT_EMAIL, // STRICT: ALWAYS OFFICIAL_RECIPIENT_EMAIL
      replyTo: data.email, // Convenient reply-to pointing to the inquiring client
      subject,
      text: textContent,
      html: htmlContent,
    });

    logger.info(
      {
        messageId: result.messageId,
        recipient: OFFICIAL_RECIPIENT_EMAIL,
        isRealSMTP,
        form: isSingleServiceInquiry ? "single_service_inquiry" : "service_request",
      },
      "Service request email processed successfully",
    );

    return { success: true, messageId: result.messageId };
  } catch (error) {
    logger.error({ error, recipient: OFFICIAL_RECIPIENT_EMAIL }, "Failed to send service request email");
    return { success: false, error: (error as Error).message };
  }
}
