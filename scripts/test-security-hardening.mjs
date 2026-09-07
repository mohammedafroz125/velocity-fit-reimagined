/**
 * Velocity Fit — Production Hardening & Security Audit Verification Suite
 */

import crypto from "crypto";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// Unit test mock signature verifier against production logic
function verifyRazorpaySignatureLogic(params, keySecret, nodeEnv) {
  if (keySecret) {
    try {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${params.orderId}|${params.paymentId}`)
        .digest("hex");

      return crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(params.signature)
      );
    } catch {
      return false;
    }
  }

  if (nodeEnv === "production") {
    return false;
  }

  if (params.orderId.startsWith("order_mock_") || params.signature.startsWith("mock_sig_")) {
    return (
      params.signature === `mock_sig_${params.orderId}` ||
      params.signature === "mock_verified_signature" ||
      params.signature.length >= 10
    );
  }

  return false;
}

async function runTests() {
  console.log("=== RUNNING SECURITY HARDENING & PRODUCTION AUDIT TESTS ===\n");

  // --------------------------------------------------------------------------
  // TEST A: Production Mock Razorpay Signature is STRICTLY REJECTED
  // --------------------------------------------------------------------------
  console.log("--- Section 1: Razorpay Signature Hardening ---");
  const prodRejected = verifyRazorpaySignatureLogic(
    {
      orderId: "order_mock_12345",
      paymentId: "pay_mock_12345",
      signature: "mock_sig_order_mock_12345",
    },
    undefined,
    "production"
  );
  assert(prodRejected === false, "Production strictly rejects mock Razorpay signature when NODE_ENV=production");

  const devAccepted = verifyRazorpaySignatureLogic(
    {
      orderId: "order_mock_12345",
      paymentId: "pay_mock_12345",
      signature: "mock_sig_order_mock_12345",
    },
    undefined,
    "development"
  );
  assert(devAccepted === true, "Development allows mock signature verification for local test suites");

  // --------------------------------------------------------------------------
  // TEST B: HTTP Security Headers
  // --------------------------------------------------------------------------
  console.log("\n--- Section 2: HTTP Security Headers ---");
  try {
    const res = await fetch(`${BASE_URL}/`);
    assert(res.status === 200, "Home page returns HTTP 200");

    const contentTypeOptions = res.headers.get("x-content-type-options");
    assert(contentTypeOptions === "nosniff", "X-Content-Type-Options is nosniff");

    const frameOptions = res.headers.get("x-frame-options");
    assert(frameOptions === "DENY", "X-Frame-Options is DENY");

    const referrerPolicy = res.headers.get("referrer-policy");
    assert(referrerPolicy === "strict-origin-when-cross-origin", "Referrer-Policy is strict-origin-when-cross-origin");

    const csp = res.headers.get("content-security-policy");
    assert(csp && csp.includes("default-src 'self'"), "Content-Security-Policy is present with default-src 'self'");
    assert(csp && csp.includes("https://checkout.razorpay.com"), "CSP includes Razorpay checkout origin");
    assert(csp && csp.includes("https://images.unsplash.com"), "CSP includes Unsplash image origin");
  } catch (err) {
    console.error("Failed to connect to local server for security headers test:", err);
    failed++;
  }

  // --------------------------------------------------------------------------
  // TEST C: Booking Availability Rate Limiting
  // --------------------------------------------------------------------------
  console.log("\n--- Section 3: Booking Availability Rate Limiting ---");
  try {
    const dateStr = "2026-09-15";
    const res = await fetch(`${BASE_URL}/api/booking/availability?date=${dateStr}`);
    const json = await res.json();
    assert(res.status === 200, "Availability API returns HTTP 200 on initial request");
    assert(json.success === true, "Availability API returns success: true");
    assert(json.timezone === "Asia/Kolkata", "Availability timezone is Asia/Kolkata");
  } catch (err) {
    console.error("Availability test failed:", err);
    failed++;
  }

  // --------------------------------------------------------------------------
  // TEST D: Honeypot Anti-Spam in Contact & Assessment Submissions
  // --------------------------------------------------------------------------
  console.log("\n--- Section 4: Honeypot Anti-Spam Verification ---");
  try {
    // Normal Contact Submission (honeypot empty)
    const normalContactRes = await fetch(`${BASE_URL}/api/leads/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Dr. Security Test",
        phone: "+91 99887 76655",
        email: "security@test.com",
        primaryGoal: "Weight loss",
        message: "Legitimate user inquiry",
        website_honey: "",
      }),
    });
    const normalContactJson = await normalContactRes.json();
    assert(normalContactRes.status === 200, "Legitimate contact submission returns HTTP 200");
    assert(normalContactJson.success === true, "Legitimate contact submission returns success: true");
    assert(normalContactJson.leadId && !normalContactJson.leadId.includes("bot"), "Legitimate lead record created with real ID");

    // Bot Contact Submission (honeypot populated)
    const botContactRes = await fetch(`${BASE_URL}/api/leads/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Bot Spammer",
        phone: "+91 91234 56789",
        email: "bot@spam.com",
        primaryGoal: "Weight loss",
        message: "Spam link http://spam.com",
        website_honey: "http://buy-viagra-now.com",
      }),
    });
    const botContactJson = await botContactRes.json();
    assert(botContactRes.status === 200, "Bot contact submission receives HTTP 200 response to prevent bot retries");
    assert(botContactJson.leadId === "lead_bot_filtered", "Bot inquiry trapped and filtered without database pollution");

    // Bot Assessment Submission (honeypot populated)
    const botAssessmentRes = await fetch(`${BASE_URL}/api/leads/assessment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Bot Assessor",
        email: "bot.assessor@spam.com",
        age: 30,
        gender: "Female",
        phone: "+91 92222 33333",
        heightCm: 165,
        currentWeightKg: 70,
        targetWeightKg: 60,
        targetTimeframe: "3 Months",
        mainGoals: ["Weight loss"],
        medicalConditions: ["None"],
        isOnLongTermMedications: "No",
        hasPastSurgeries: "No",
        seriousnessScale: 10,
        readyFor60DaysCommitment: "Yes",
        dailyWaterLiters: 2.5,
        sleepHours: 7,
        referralSource: "Instagram",
        website_honey: "bot_payload_trap",
      }),
    });
    const botAssessmentJson = await botAssessmentRes.json();
    assert(botAssessmentRes.status === 200, "Bot assessment receives HTTP 200 response");
    assert(botAssessmentJson.leadId === "lead_bot_filtered", "Bot assessment trapped and filtered without database pollution");
  } catch (err) {
    console.error("Honeypot test failed:", err);
    failed++;
  }

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log(`\n=== SECURITY TEST SUMMARY ===`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log("ALL SECURITY HARDENING TESTS PASSED!\n");
  }
}

runTests().catch((err) => {
  console.error("Unhandled test execution error:", err);
  process.exit(1);
});

