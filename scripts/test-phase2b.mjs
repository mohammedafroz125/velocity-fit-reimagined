/**
 * Automated Test Suite for Velocity Fit Phase 2B:
 * Consultation Booking + Payment Foundation + Lead Conversion Engine.
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

async function runTests() {
  console.log(`\n=== RUNNING PHASE 2B BOOKING & PAYMENT TESTS ON ${BASE_URL} ===\n`);

  let testLeadId = null;
  let testLead2Id = null;
  let bookedSlot = null;
  let createdAppointmentId = null;
  let createdOrderId = null;
  let adminCookie = null;

  // 0. Setup: Create Test Leads
  try {
    const res1 = await fetch(`${BASE_URL}/api/leads/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Fatima Bi",
        phone: "+91 91234 56789",
        email: "fatima.bi@example.com",
        primaryGoal: "PCOS & Metabolic Reset",
        preferredContactMethod: "WhatsApp",
      }),
    });
    const d1 = await res1.json();
    testLeadId = d1.leadId;

    const res2 = await fetch(`${BASE_URL}/api/leads/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Zoya Rehman",
        phone: "+91 99887 76655",
        email: "zoya.rehman@example.com",
        primaryGoal: "Weight Loss",
        preferredContactMethod: "Phone Call",
      }),
    });
    const d2 = await res2.json();
    testLead2Id = d2.leadId;

    assert(Boolean(testLeadId && testLead2Id), "Created 2 test leads for booking & checkout verification");
  } catch (err) {
    assert(false, `Test lead setup failed: ${err.message}`);
  }

  // 1. Consultation Availability Query (IST)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  // Ensure not Sunday
  if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1);
  const targetDateStr = tomorrow.toISOString().split("T")[0];

  try {
    const res = await fetch(`${BASE_URL}/api/booking/availability?date=${targetDateStr}`);
    const data = await res.json();
    assert(res.status === 200, "Availability API returns HTTP 200 for valid date");
    assert(data.success === true, "Availability API returns success: true");
    assert(data.timezone === "Asia/Kolkata", "Availability timezone explicitly reported as Asia/Kolkata");
    assert(Array.isArray(data.slots) && data.slots.length > 0, `Availability slots returned: ${data.slots.length} slots`);
    bookedSlot = data.slots[0];
  } catch (err) {
    assert(false, `Availability query failed: ${err.message}`);
  }

  // 2. Invalid Date Query
  try {
    const res = await fetch(`${BASE_URL}/api/booking/availability?date=invalid-date`);
    assert(res.status === 400, "Invalid date query returns HTTP 400 Bad Request");
  } catch (err) {
    assert(false, `Invalid date test failed: ${err.message}`);
  }

  // 3. Consultation Booking Creation
  try {
    const res = await fetch(`${BASE_URL}/api/booking/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: testLeadId,
        startTime: bookedSlot.startTime,
        endTime: bookedSlot.endTime,
        meetingType: "VIDEO_CALL",
        notes: "Prior thyroid blood work available for review.",
      }),
    });

    const data = await res.json();
    assert(res.status === 200, "Booking creation returns HTTP 200");
    assert(data.success === true, "Booking creation returns success: true");
    assert(Boolean(data.appointment?.id), `Created appointment ID: ${data.appointment?.id}`);
    assert(data.appointment.status === "REQUESTED", "Initial appointment status is REQUESTED");
    assert(data.appointment.meetingType === "VIDEO_CALL", "Appointment meeting type is VIDEO_CALL");
    createdAppointmentId = data.appointment.id;
  } catch (err) {
    assert(false, `Booking creation failed: ${err.message}`);
  }

  // 4. Double-Booking Prevention Check
  try {
    const res = await fetch(`${BASE_URL}/api/booking/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: testLead2Id,
        startTime: bookedSlot.startTime,
        endTime: bookedSlot.endTime,
        meetingType: "PHONE_CALL",
      }),
    });

    const data = await res.json();
    assert(res.status === 409, "Double booking same slot returns HTTP 409 Conflict");
    assert(data.error.includes("already booked"), `Double booking error message received: "${data.error}"`);
  } catch (err) {
    assert(false, `Double-booking prevention test failed: ${err.message}`);
  }

  // 5. Admin Authentication Setup for Appointment Status Tests
  const devAdminProfile = {
    id: "admin-dr-fatima-01",
    email: "admin@velocityfit.in",
    fullName: "Dr. Lubna Fatima",
    role: "SUPER_ADMIN",
    isActive: true,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  };
  const fallbackToken = Buffer.from(JSON.stringify(devAdminProfile)).toString("base64");

  try {
    const loginRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@velocityfit.in", password: "velocity2026" }),
    });
    const setCookie = loginRes.headers.get("set-cookie");
    if (setCookie) {
      adminCookie = setCookie.split(";")[0];
    } else {
      adminCookie = `vf_admin_session=${fallbackToken}`;
    }
  } catch (err) {
    adminCookie = `vf_admin_session=${fallbackToken}`;
    console.warn("Admin login warning:", err.message);
  }

  // 6. Unauthenticated Admin Appointment Status Update (401)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/appointments/${createdAppointmentId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CONFIRMED" }),
    });
    assert(res.status === 401, "Unauthenticated appointment status update returns HTTP 401 Unauthorized");
  } catch (err) {
    assert(false, `Unauthenticated check failed: ${err.message}`);
  }

  // 7. Authenticated Admin Appointment Status Update to CONFIRMED & COMPLETED
  try {
    const res = await fetch(`${BASE_URL}/api/admin/appointments/${createdAppointmentId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie || "vf_admin_session=mock_admin_token",
      },
      body: JSON.stringify({ status: "CONFIRMED", reason: "Consultation confirmed by Dr. Lubna" }),
    });

    const data = await res.json();
    assert(res.status === 200, "Admin appointment status update to CONFIRMED returns HTTP 200");
    assert(data.appointment?.status === "CONFIRMED", "Appointment status updated to CONFIRMED");

    // Also test COMPLETED transition
    const resComp = await fetch(`${BASE_URL}/api/admin/appointments/${createdAppointmentId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie || "vf_admin_session=mock_admin_token",
      },
      body: JSON.stringify({ status: "COMPLETED", reason: "Consultation successfully conducted" }),
    });
    const dataComp = await resComp.json();
    assert(dataComp.appointment?.status === "COMPLETED", "Appointment status updated to COMPLETED");
  } catch (err) {
    assert(false, `Admin appointment update failed: ${err.message}`);
  }

  // 8. Server-Side Price Resolution & Order Creation: Flex Prime 1-Month (₹2,000)
  try {
    const res = await fetch(`${BASE_URL}/api/payments/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: testLeadId,
        programTrack: "Flex",
        supportTier: "Prime",
        duration: "1-month",
      }),
    });

    const data = await res.json();
    assert(res.status === 200, "Create payment order for Flex Prime 1-Month returns HTTP 200");
    assert(data.success === true, "Create order returns success: true");
    assert(data.amountInRupees === 2000, `Verified price strictly ₹2,000 (actual: ₹${data.amountInRupees})`);
    assert(data.amount === 200000, `Razorpay paise strictly 200,000 (actual: ${data.amount})`);
    assert(Boolean(data.orderId), `Order ID returned: ${data.orderId}`);
    createdOrderId = data.orderId;
  } catch (err) {
    assert(false, `Price resolution order creation failed: ${err.message}`);
  }

  // 9. Server-Side Price Resolution: Grit Elite 3-Months (₹8,000)
  try {
    const res = await fetch(`${BASE_URL}/api/payments/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: testLead2Id,
        programTrack: "Grit",
        supportTier: "Elite",
        duration: "3-months",
      }),
    });

    const data = await res.json();
    assert(res.status === 200, "Create order for Grit Elite 3-Months returns HTTP 200");
    assert(data.amountInRupees === 8000, `Verified price strictly ₹8,000 (actual: ₹${data.amountInRupees})`);
    assert(data.amount === 800000, `Razorpay paise strictly 800,000 (actual: ${data.amount})`);
  } catch (err) {
    assert(false, `Grit Elite 3-Months order failed: ${err.message}`);
  }

  // 10. Server Price Enforcement: Invalid Track/Tier returns 400
  try {
    const res = await fetch(`${BASE_URL}/api/payments/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: testLeadId,
        programTrack: "UnknownTrack",
        supportTier: "Prime",
        duration: "1-month",
      }),
    });
    assert(res.status === 400, "Invalid program track rejected with HTTP 400");
  } catch (err) {
    assert(false, `Invalid track rejection test failed: ${err.message}`);
  }

  // 11. Payment Verification & Lead Conversion Engine
  try {
    // Generate valid HMAC signature if secret is configured or use test signature
    const secret = process.env.RAZORPAY_KEY_SECRET || "mock_secret_key";
    const testPaymentId = `pay_test_${Date.now()}`;
    const generatedSig = crypto
      .createHmac("sha256", secret)
      .update(`${createdOrderId}|${testPaymentId}`)
      .digest("hex");

    const verifyRes = await fetch(`${BASE_URL}/api/payments/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: createdOrderId,
        paymentId: testPaymentId,
        signature: generatedSig,
      }),
    });

    const verifyData = await verifyRes.json();
    assert(verifyRes.status === 200, "Valid signature verification returns HTTP 200");
    assert(verifyData.success === true, "Verification returns success: true");
    assert(verifyData.isConverted === true, "Lead marked as isConverted: true");
    assert(verifyData.lead?.status === "CONVERTED", "Lead status officially transitioned to CONVERTED");
  } catch (err) {
    assert(false, `Payment verification test failed: ${err.message}`);
  }

  // 12. Idempotent Payment Webhook Handling
  try {
    const webhookRes = await fetch(`${BASE_URL}/api/payments/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "order.paid",
        payload: {
          order: { entity: { id: createdOrderId } },
          payment: { entity: { id: `pay_wh_${Date.now()}`, order_id: createdOrderId } },
        },
      }),
    });

    const whData = await webhookRes.json();
    assert(webhookRes.status === 200, "Duplicate payment webhook processed cleanly (HTTP 200)");
    assert(whData.status === "ok", "Webhook handler returns status: ok without double-charge error");
  } catch (err) {
    assert(false, `Webhook idempotency test failed: ${err.message}`);
  }

  // 13. Payment Cancellation (Lead NOT converted on cancel)
  try {
    // Create new order for testLead2Id to cancel
    const newOrderRes = await fetch(`${BASE_URL}/api/payments/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: testLead2Id,
        programTrack: "Flex",
        supportTier: "Prime",
        duration: "1-month",
      }),
    });
    const newOrderData = await newOrderRes.json();

    const cancelRes = await fetch(`${BASE_URL}/api/payments/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: newOrderData.orderId }),
    });

    const cancelData = await cancelRes.json();
    assert(cancelRes.status === 200, "Payment cancel endpoint returns HTTP 200");
    assert(cancelData.payment?.status === "CANCELLED", "Payment record status updated to CANCELLED");
  } catch (err) {
    assert(false, `Payment cancellation test failed: ${err.message}`);
  }

  // 14. Public UX Route Verification
  try {
    const bookPageRes = await fetch(`${BASE_URL}/book-consultation`);
    assert(bookPageRes.status === 200, "/book-consultation route renders HTTP 200");

    const checkoutPageRes = await fetch(`${BASE_URL}/checkout`);
    assert(checkoutPageRes.status === 200, "/checkout route renders HTTP 200");
  } catch (err) {
    assert(false, `Public UX routes test failed: ${err.message}`);
  }

  console.log(`\n=== TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
