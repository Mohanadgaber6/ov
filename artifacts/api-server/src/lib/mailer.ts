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

export interface SMTPRuntimeConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass?: string;
  fromEmail: string;
  sessionSecretSet: boolean;
}

export function getSMTPConfig(): SMTPRuntimeConfig {
  const host = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const rawPort = process.env.SMTP_PORT?.trim();
  const port = rawPort ? parseInt(rawPort, 10) : 465;

  const rawSecure = process.env.SMTP_SECURE?.trim().toLowerCase();
  // Strictly convert string "true" / "false" to boolean
  let secure = port === 465;
  if (rawSecure !== undefined && rawSecure !== "") {
    secure = rawSecure === "true" || rawSecure === "1" || rawSecure === "yes";
  }

  const user = (process.env.SMTP_USER || "ovoffiice@gmail.com").trim();
  const pass = process.env.SMTP_PASS?.trim();
  const fromEmail = (process.env.FROM_EMAIL || user || OFFICIAL_RECIPIENT_EMAIL).trim();
  const sessionSecretSet = Boolean(process.env.SESSION_SECRET?.trim());

  return { host, port, secure, user, pass, fromEmail, sessionSecretSet };
}

export function printSMTPRuntimeConfig(): SMTPRuntimeConfig {
  const config = getSMTPConfig();
  console.log("[SMTP RUNTIME CONFIG]", {
    SMTP_HOST: config.host,
    SMTP_PORT: config.port,
    SMTP_PORT_TYPE: typeof config.port,
    SMTP_SECURE: config.secure,
    SMTP_SECURE_TYPE: typeof config.secure,
    SMTP_USER: config.user,
    SMTP_PASS_CONFIGURED: Boolean(config.pass && config.pass.length > 0),
    SMTP_PASS_LENGTH: config.pass ? config.pass.length : 0,
    FROM_EMAIL: config.fromEmail,
    SESSION_SECRET_CONFIGURED: config.sessionSecretSet,
  });
  return config;
}

export function createTransporterInstance(config: SMTPRuntimeConfig, overridePort?: number, overrideSecure?: boolean): Transporter {
  const port = overridePort ?? config.port;
  const secure = overrideSecure ?? config.secure;

  if (config.user && config.pass) {
    return nodemailer.createTransport({
      host: config.host,
      port,
      secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
      // Essential timeouts to prevent Replit 30s gateway 502 timeouts
      connectionTimeout: 5000,
      greetingTimeout: 4000,
      socketTimeout: 8000,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  logger.warn("No SMTP credentials found in environment. Local mock mode.");
  return nodemailer.createTransport({
    jsonTransport: true,
  });
}

export function getTransporter(): Transporter {
  const config = printSMTPRuntimeConfig();
  return createTransporterInstance(config);
}

const getSenderAddress = (): string => {
  const config = getSMTPConfig();
  return `"أوفي الذكية - نموذج الموقع" <${config.fromEmail}>`;
};

/**
 * Diagnostic helper to test the SMTP connection live
 */
export async function testSMTPConnection(): Promise<{ success: boolean; config: any; error?: any }> {
  const config = printSMTPRuntimeConfig();
  if (!config.pass) {
    return {
      success: false,
      config: { ...config, pass: undefined },
      error: "SMTP_PASS is not configured in process.env",
    };
  }

  const transporter = createTransporterInstance(config);
  try {
    await transporter.verify();
    return {
      success: true,
      config: { ...config, pass: undefined },
    };
  } catch (primaryErr: any) {
    console.error("[SMTP VERIFY PRIMARY FAILED]", {
      host: config.host,
      port: config.port,
      secure: config.secure,
      message: primaryErr?.message,
      code: primaryErr?.code,
    });

    // If port 465 failed, test port 587 fallback
    if (config.port === 465) {
      console.log("[SMTP TEST] Trying port 587 fallback verification...");
      try {
        const fallbackTransporter = createTransporterInstance(config, 587, false);
        await fallbackTransporter.verify();
        return {
          success: true,
          config: { ...config, pass: undefined, note: "Port 465 timed out, but port 587 succeeded!" },
        };
      } catch (fallbackErr: any) {
        return {
          success: false,
          config: { ...config, pass: undefined },
          error: {
            primaryPort465: { message: primaryErr?.message, code: primaryErr?.code },
            fallbackPort587: { message: fallbackErr?.message, code: fallbackErr?.code },
          },
        };
      }
    }

    return {
      success: false,
      config: { ...config, pass: undefined },
      error: { message: primaryErr?.message, code: primaryErr?.code },
    };
  }
}

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

    let result;
    try {
      result = await mail.sendMail({
        from: getSenderAddress(),
        to: OFFICIAL_RECIPIENT_EMAIL, // STRICT: ALWAYS OFFICIAL_RECIPIENT_EMAIL
        replyTo: undefined,
        subject,
        text: textContent,
        html: htmlContent,
      });
    } catch (primaryErr: any) {
      console.error("[PRIMARY SEND FAILED - PORT " + (getSMTPConfig().port) + "]", {
        message: primaryErr?.message,
        code: primaryErr?.code,
        command: primaryErr?.command,
      });

      const config = getSMTPConfig();
      // If port 465 timed out or connection refused in cloud, automatically attempt port 587 STARTTLS
      if (config.port === 465 && config.user && config.pass) {
        console.log("[SMTP FALLBACK] Attempting automatic delivery via port 587 (STARTTLS)...");
        const fallbackTransporter = createTransporterInstance(config, 587, false);
        result = await fallbackTransporter.sendMail({
          from: getSenderAddress(),
          to: OFFICIAL_RECIPIENT_EMAIL,
          replyTo: undefined,
          subject,
          text: textContent,
          html: htmlContent,
        });
        console.log("[SMTP FALLBACK SUCCESS] Email sent via port 587! ID:", result.messageId);
      } else {
        throw primaryErr;
      }
    }

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
  } catch (error: any) {
    console.error("[SMTP ERROR DETAILS - CONTACT FORM]", {
      message: error?.message,
      code: error?.code,
      command: error?.command,
      response: error?.response,
      responseCode: error?.responseCode,
      stack: error?.stack,
    });
    logger.error({ error, recipient: OFFICIAL_RECIPIENT_EMAIL }, "Failed to send contact form email");
    return {
      success: false,
      error: `فشل إرسال البريد (${error?.code || 'SMTP_ERR'}): ${error?.message || 'خطأ غير معروف'}`,
    };
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
          <td class="field-label">البريد الإلكتروني:</td>
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

      <div class="section-title">تفاصيل الطلب والخدمة</div>
      <table class="field-table">
        <tr>
          <td class="field-label">فئة الخدمة:</td>
          <td class="field-value">${data.category || "غير محددة"}</td>
        </tr>
        <tr>
          <td class="field-label">الخدمة المطلوبة:</td>
          <td class="field-value">${data.service || "غير محددة"}</td>
        </tr>
        ${data.package ? `<tr><td class="field-label">الباقة المختارة:</td><td class="field-value">${data.package}</td></tr>` : ""}
        ${data.documentName ? `<tr><td class="field-label">المستندات المتوفرة:</td><td class="field-value">${data.documentName}</td></tr>` : ""}
        ${data.sourcePage ? `<tr><td class="field-label">صفحة المصدر:</td><td class="field-value" dir="ltr" style="text-align: right;">${data.sourcePage}</td></tr>` : ""}
        <tr>
          <td class="field-label">تاريخ ووقت التقديم:</td>
          <td class="field-value">${timestamp}</td>
        </tr>
      </table>

      <div style="margin-top: 20px;">
        <div class="field-label" style="margin-bottom: 8px;">وصف الطلب / المتطلبات:</div>
        <div class="message-box">${data.description}</div>
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

    let result;
    try {
      result = await mail.sendMail({
        from: getSenderAddress(),
        to: OFFICIAL_RECIPIENT_EMAIL, // STRICT: ALWAYS OFFICIAL_RECIPIENT_EMAIL
        replyTo: data.email, // Convenient reply-to pointing to the inquiring client
        subject,
        text: textContent,
        html: htmlContent,
      });
    } catch (primaryErr: any) {
      console.error("[PRIMARY SEND FAILED (SERVICE REQ) - PORT " + (getSMTPConfig().port) + "]", {
        message: primaryErr?.message,
        code: primaryErr?.code,
        command: primaryErr?.command,
      });

      const config = getSMTPConfig();
      if (config.port === 465 && config.user && config.pass) {
        console.log("[SMTP FALLBACK] Attempting delivery via port 587 (STARTTLS)...");
        const fallbackTransporter = createTransporterInstance(config, 587, false);
        result = await fallbackTransporter.sendMail({
          from: getSenderAddress(),
          to: OFFICIAL_RECIPIENT_EMAIL,
          replyTo: data.email,
          subject,
          text: textContent,
          html: htmlContent,
        });
        console.log("[SMTP FALLBACK SUCCESS] Email sent via port 587! ID:", result.messageId);
      } else {
        throw primaryErr;
      }
    }

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
  } catch (error: any) {
    console.error("[SMTP ERROR DETAILS - SERVICE REQUEST]", {
      message: error?.message,
      code: error?.code,
      command: error?.command,
      response: error?.response,
      responseCode: error?.responseCode,
      stack: error?.stack,
    });
    logger.error({ error, recipient: OFFICIAL_RECIPIENT_EMAIL }, "Failed to send service request email");
    return {
      success: false,
      error: `فشل إرسال البريد (${error?.code || 'SMTP_ERR'}): ${error?.message || 'خطأ غير معروف'}`,
    };
  }
}
