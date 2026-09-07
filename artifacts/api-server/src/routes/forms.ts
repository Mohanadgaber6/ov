import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { formRateLimiter } from "../middlewares/rate-limit";
import { sendContactFormEmail, sendServiceRequestEmail, OFFICIAL_RECIPIENT_EMAIL } from "../lib/mailer";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// Validation schema for Contact Us form
const contactSchema = z.object({
  name: z.string().trim().min(2, "الاسم مطلوب ويجب ألا يقل عن حرفين").max(100, "الاسم طويل جداً"),
  phone: z.string().trim().min(7, "رقم الجوال غير صحيح").max(35, "رقم الجوال طويل جداً"),
  service: z.string().trim().max(150).optional().default(""),
  message: z.string().trim().max(3000).optional().default(""),
  sourcePage: z.string().trim().max(250).optional().default(""),
  // Honeypot fields (must be empty)
  _hp: z.string().optional(),
  website_hp: z.string().optional(),
  company_fax: z.string().optional(),
});

// Validation schema for Request a Service / Single Service Inquiry form
const serviceRequestSchema = z.object({
  name: z.string().trim().min(2, "الاسم مطلوب").max(100, "الاسم طويل جداً"),
  company: z.string().trim().max(150).optional().default(""),
  mobile: z.string().trim().min(7, "رقم الجوال غير صحيح").max(35, "رقم الجوال طويل جداً"),
  email: z.string().trim().email("يرجى إدخال بريد إلكتروني صحيح").max(150),
  city: z.string().trim().min(2, "المدينة مطلوبة").max(100),
  category: z.string().trim().max(150).optional().default(""),
  service: z.string().trim().max(150).optional().default(""),
  package: z.string().trim().max(150).optional().default(""),
  contactMethod: z.string().trim().min(2, "يرجى اختيار طريقة التواصل").max(50),
  description: z.string().trim().min(1, "يرجى كتابة وصف للطلب").max(4000),
  documentName: z.string().trim().max(250).optional().default(""),
  sourcePage: z.string().trim().max(250).optional().default(""),
  // Honeypot fields (must be empty)
  _hp: z.string().optional(),
  website_hp: z.string().optional(),
  company_fax: z.string().optional(),
});

/**
 * Check if any honeypot spam traps were filled by a bot.
 */
function isHoneypotTriggered(body: any): boolean {
  return Boolean(
    (body._hp && body._hp.trim().length > 0) ||
    (body.website_hp && body.website_hp.trim().length > 0) ||
    (body.company_fax && body.company_fax.trim().length > 0)
  );
}

// POST /api/forms/contact
router.post("/contact", async (req: Request, res: Response) => {
  // Honeypot trap check
  if (isHoneypotTriggered(req.body)) {
    logger.warn({ ip: req.ip }, "Honeypot triggered on contact form submission. Dropping silently.");
    // Return standard success to not tip off spam bot
    return res.status(200).json({ success: true, message: "تم الاستلام بنجاح" });
  }

  // Server-side validation
  const validationResult = contactSchema.safeParse(req.body);
  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((e: z.ZodIssue) => e.message);
    logger.warn({ errors, ip: req.ip }, "Contact form validation failed");
    return res.status(400).json({
      success: false,
      error: errors[0] || "بيانات النموذج غير صالحة",
      details: errors,
    });
  }

  const { name, phone, service, message, sourcePage } = validationResult.data;

  // Send email to hardcoded official recipient
  const sendResult = await sendContactFormEmail({
    name,
    phone,
    service,
    message,
    sourcePage,
    clientIp: req.ip,
    userAgent: req.get("user-agent"),
  });

  if (!sendResult.success) {
    logger.error({ error: sendResult.error }, "Failed to deliver contact form email");
    return res.status(500).json({
      success: false,
      error: sendResult.error || "حدث خطأ أثناء معالجة الطلب في الخادم.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "تم استلام رسالتك وإرسالها بنجاح إلى فريق أوفي الذكية.",
    recipient: OFFICIAL_RECIPIENT_EMAIL,
  });
});

// POST /api/forms/service-request
router.post("/service-request", async (req: Request, res: Response) => {
  // Honeypot trap check
  if (isHoneypotTriggered(req.body)) {
    logger.warn({ ip: req.ip }, "Honeypot triggered on service request submission. Dropping silently.");
    return res.status(200).json({ success: true, message: "تم الاستلام بنجاح" });
  }

  // Server-side validation
  const validationResult = serviceRequestSchema.safeParse(req.body);
  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((e: z.ZodIssue) => e.message);
    logger.warn({ errors, ip: req.ip }, "Service request validation failed");
    return res.status(400).json({
      success: false,
      error: errors[0] || "بيانات النموذج غير صالحة",
      details: errors,
    });
  }

  const data = validationResult.data;

  // Send email to hardcoded official recipient
  const sendResult = await sendServiceRequestEmail({
    name: data.name,
    company: data.company,
    mobile: data.mobile,
    email: data.email,
    city: data.city,
    category: data.category,
    service: data.service,
    package: data.package,
    contactMethod: data.contactMethod,
    description: data.description,
    documentName: data.documentName,
    sourcePage: data.sourcePage,
    clientIp: req.ip,
    userAgent: req.get("user-agent"),
  });

  if (!sendResult.success) {
    logger.error({ error: sendResult.error }, "Failed to deliver service request email");
    return res.status(500).json({
      success: false,
      error: sendResult.error || "حدث خطأ أثناء معالجة الطلب في الخادم.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "تم استلام طلب الخدمة وإرساله بنجاح إلى فريق أوفي الذكية.",
    recipient: OFFICIAL_RECIPIENT_EMAIL,
  });
});

export default router;
