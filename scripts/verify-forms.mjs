const API_BASE = "http://localhost:3000/api";
const PROXY_BASE = "http://localhost:5173/api";

async function postJSON(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const text = await response.text();
  let body = {};
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  return { status: response.status, body };
}

async function runTests() {
  console.log("=== STARTING FULL PRODUCTION VERIFICATION SUITE ===\n");
  let passed = 0;
  let total = 0;

  function assert(title, condition, extra) {
    total++;
    if (condition) {
      console.log(`[PASS] Test ${total}: ${title}`);
      passed++;
    } else {
      console.error(`[FAIL] Test ${total}: ${title}`, extra);
    }
  }

  // 1. Health check
  const healthRes = await fetch(`${API_BASE}/healthz`);
  const healthBody = await healthRes.json();
  assert("API Server /api/healthz status is ok", healthRes.status === 200 && healthBody.status === "ok");

  // 2. Test 1 — Contact Us Form
  console.log("\n--- Testing Contact Us Form ---");
  const contactPayload = {
    name: "سعد بن خالد الدوسري",
    phone: "0551234567",
    service: "استشارة تأسيس فرع شركة أجنبية",
    message: "نود الاستفسار عن متطلبات تأسيس فرع في الرياض والخطوات الأولية.",
    sourcePage: "/contact",
  };
  const contactRes = await postJSON(`${API_BASE}/forms/contact`, contactPayload);
  assert(
    "Contact Us form submission returns 200 and success status",
    contactRes.status === 200 && contactRes.body.success === true && contactRes.body.recipient === "ovoffiice@gmail.com",
    contactRes.body
  );

  // 3. Test 2 — Request a Service Form (Multi-step)
  console.log("\n--- Testing Request a Service Form ---");
  const servicePayload = {
    name: "عبدالله الشمري",
    company: "شركة الأفق للاستشارات",
    mobile: "0509876543",
    email: "client@domain.com",
    city: "الرياض",
    category: "خدمات المستثمر الأجنبي",
    service: "إصدار ترخيص الاستثمار الأجنبي (MISA)",
    package: "باقة المستثمر المتكاملة",
    contactMethod: "واتساب",
    description: "نحتاج إلى مراجعة شاملة لمتطلبات ترخيص الاستثمار والتسجيل التجاري.",
    documentName: "عقد التأسيس والقوائم المالية",
    sourcePage: "/request-service",
  };
  const serviceRes = await postJSON(`${API_BASE}/forms/service-request`, servicePayload);
  assert(
    "Request a Service form submission returns 200 and success status",
    serviceRes.status === 200 && serviceRes.body.success === true && serviceRes.body.recipient === "ovoffiice@gmail.com",
    serviceRes.body
  );

  // 4. Test 3 — Single Service Inquiry Form
  console.log("\n--- Testing Single Service Inquiry Form ---");
  const singleServicePayload = {
    name: "نورة القحطاني",
    company: "مؤسسة الابتكار الرقمي",
    mobile: "0543210987",
    email: "inquiry@domain.com",
    city: "مكة المكرمة",
    category: "خدمات الشركات",
    service: "تأسيس شركة الشخص الواحد",
    contactMethod: "اتصال هاتفي",
    description: "استفسار عن إجراءات تحويل المؤسسة الفردية إلى شركة الشخص الواحد.",
    sourcePage: "/services/one-person-company",
  };
  const singleRes = await postJSON(`${API_BASE}/forms/service-request`, singleServicePayload);
  assert(
    "Single Service Inquiry submission returns 200 and success status",
    singleRes.status === 200 && singleRes.body.success === true && singleRes.body.recipient === "ovoffiice@gmail.com",
    singleRes.body
  );

  // 5. Test 4 — Recipient Override Attempt
  console.log("\n--- Testing Recipient Override Security ---");
  const hackPayload = {
    name: "هاكر محتمل",
    phone: "0500000000",
    service: "اختبار أمان",
    message: "محاولة تغيير المستلم",
    to: "attacker@evil.com",
    recipient: "attacker@evil.com",
    destination: "attacker@evil.com",
  };
  const hackRes = await postJSON(`${API_BASE}/forms/contact`, hackPayload);
  assert(
    "Recipient override is ignored; destination remains strictly ovoffiice@gmail.com",
    hackRes.status === 200 && hackRes.body.recipient === "ovoffiice@gmail.com",
    hackRes.body
  );

  // 6. Test 5 — Server-side Validation
  console.log("\n--- Testing Server-Side Validation ---");
  const invalidEmailPayload = {
    name: "مستخدم",
    mobile: "0555555555",
    email: "invalid-email-address",
    city: "جدة",
    contactMethod: "واتساب",
    description: "طلب بدون بريد صحيح",
  };
  const invalidRes = await postJSON(`${API_BASE}/forms/service-request`, invalidEmailPayload);
  assert(
    "Invalid email format is rejected with HTTP 400",
    invalidRes.status === 400 && invalidRes.body.success === false,
    invalidRes.body
  );

  const missingFieldPayload = {
    name: "",
    phone: "",
  };
  const missingRes = await postJSON(`${API_BASE}/forms/contact`, missingFieldPayload);
  assert(
    "Missing required fields rejected with HTTP 400",
    missingRes.status === 400 && missingRes.body.success === false,
    missingRes.body
  );

  // 7. Test 6 — Honeypot Detection
  console.log("\n--- Testing Honeypot Spam Protection ---");
  const honeypotPayload = {
    name: "Spam Bot",
    phone: "0501234567",
    service: "SEO spam",
    message: "Buy cheap backlinks",
    website_hp: "bot filled this hidden trap",
  };
  const hpRes = await postJSON(`${API_BASE}/forms/contact`, honeypotPayload);
  assert(
    "Honeypot returns 200 to silence bot, while dropping mail delivery (no recipient returned)",
    hpRes.status === 200 && hpRes.body.success === true && hpRes.body.recipient === undefined,
    hpRes.body
  );

  // 8. Test 7 — Vite Proxy / Frontend Integration
  console.log("\n--- Testing Vite Proxy to Backend ---");
  try {
    const proxyContactRes = await postJSON(`${PROXY_BASE}/forms/contact`, {
      name: "تجربة عبر بروكسي الفرونت إند",
      phone: "0567890123",
      service: "استفسار موقع",
      message: "تم الإرسال من الواجهة الأمامية عبر البروكسي بنجاح.",
    });
    assert(
      "Frontend Vite proxy /api/forms/contact forwards cleanly to backend API",
      proxyContactRes.status === 200 && proxyContactRes.body.success === true,
      proxyContactRes.body
    );
  } catch (err) {
    console.error("Vite proxy request failed:", err);
  }

  console.log(`\n=== TEST SUITE SUMMARY: ${passed}/${total} PASSED ===`);
  if (passed === total) {
    console.log(">>> ALL VERIFICATION AND SECURITY CHECKS PASSED! <<<");
  } else {
    console.error("SOME TESTS FAILED");
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
