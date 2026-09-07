import rateLimit from "express-rate-limit";

// Rate limiter for public form submissions to prevent spam and flooding
export const formRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 60, // Limit each IP to 60 submissions per 15-minute window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: "تم تجاوز الحد المسموح به من الطلبات مؤقتاً. يرجى المحاولة بعد قليل.",
  },
});
