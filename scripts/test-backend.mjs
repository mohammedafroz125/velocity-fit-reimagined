/**
 * Automated Test Suite for Velocity Fit Phase 2A Backend & CRM Foundation.
 * Tests:
 * 1. Valid Contact Submission
 * 2. Invalid Contact Submission (400 validation)
 * 3. Assessment Submission & Server-Side BMI Calculation
 * 4. Lead Deduplication by Normalized Phone
 * 5. Unauthenticated Admin API Protection (401 Unauthorized)
 * 6. Admin Authentication & Session Handling
 * 7. Lead Status Transition & History Logging
 * 8. Status Transition Validation
 * 9. Lead Note Creation
 * 10. Unauthenticated CRM UI Route Protection (Redirect to /admin/login)
 * 11. Sensitive Data Privacy Audit
 */

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
  console.log(`\n=== RUNNING PHASE 2A BACKEND & CRM TESTS ON ${BASE_URL} ===\n`);

  let createdLeadId = null;
  let adminCookie = null;

  // -------------------------------------------------------------------------
  // 1. Valid Contact Submission
  // -------------------------------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/leads/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Ayesha Khan",
        phone: "+91 98765 43210",
        email: "ayesha.khan@example.com",
        primaryGoal: "Weight Loss",
        message: "Interested in the Flex track for lifestyle balance.",
        preferredContactMethod: "WhatsApp",
        attribution: {
          utmSource: "instagram",
          utmMedium: "bio_link",
          firstLandingPage: "/contact",
        },
      }),
    });

    const data = await res.json();
    assert(res.status === 200, "Valid contact submission returns HTTP 200");
    assert(data.success === true, "Valid contact submission returns success: true");
    assert(Boolean(data.leadId), `Contact submission returned valid leadId: ${data.leadId}`);
    assert(data.isNew === true, "First submission identified as new lead (isNew: true)");
    createdLeadId = data.leadId;
  } catch (err) {
    assert(false, `Contact submission request failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // 2. Invalid Contact Submission
  // -------------------------------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/leads/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "X", // Too short (min 2 chars)
        phone: "123", // Invalid phone (min 10 digits)
        email: "invalid-email-address",
      }),
    });

    const data = await res.json();
    assert(res.status === 400, "Invalid contact submission returns HTTP 400");
    assert(data.success === false, "Invalid contact submission returns success: false");
    assert(Boolean(data.details), "Server returns specific validation field error details");
  } catch (err) {
    assert(false, `Invalid contact test failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // 3. Assessment Submission & Server-Side BMI Calculation
  // -------------------------------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/leads/assessment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Rahul Verma",
        age: 34,
        gender: "Male",
        city: "Hyderabad",
        phone: "+91 91234 56789",
        email: "rahul.verma@example.com",
        heightCm: 175,
        currentWeightKg: 85,
        targetWeightKg: 72,
        targetTimeframe: "3 Months",
        mainGoals: ["Weight Loss", "Fatty Liver Reversal"],
        medicalConditions: ["Fatty Liver"],
        isOnLongTermMedications: "No",
        hasPastSurgeries: "No",
        dailyWaterLiters: 2.5,
        sleepHours: 7,
        bowelMovement: "Daily",
        eatingPatterns: ["Late Night Snacking"],
        seriousnessScale: 9,
        readyFor60DaysCommitment: "Yes",
        referralSource: "Instagram Reel on Cellular Hydration",
        attribution: {
          utmSource: "instagram",
          utmMedium: "reel",
          utmCampaign: "hydration_awareness",
        },
      }),
    });

    const data = await res.json();
    assert(res.status === 200, "Assessment submission returns HTTP 200");
    assert(data.success === true, "Assessment submission returns success: true");
    assert(Boolean(data.assessmentId), `Assessment stored with ID: ${data.assessmentId}`);
    // Expected BMI: 85 / (1.75 * 1.75) = 27.8
    assert(data.calculatedBmi === 27.8, `Calculated BMI verified: ${data.calculatedBmi} (expected 27.8)`);
  } catch (err) {
    assert(false, `Assessment submission failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // 4. Lead Deduplication Handling
  // -------------------------------------------------------------------------
  try {
    // Submit contact again with same phone as Ayesha Khan (+91 98765 43210 -> normalized 919876543210)
    const res = await fetch(`${BASE_URL}/api/leads/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Ayesha Khan",
        phone: "9876543210",
        email: "ayesha.khan@example.com",
        primaryGoal: "PCOS Management",
        message: "Second inquiry submitting updated preferences.",
        preferredContactMethod: "WhatsApp",
      }),
    });

    const data = await res.json();
    assert(res.status === 200, "Repeat submission returns HTTP 200");
    assert(data.isNew === false, "Deduplication triggered: existing lead recognized (isNew: false)");
    assert(data.leadId === createdLeadId, `Same lead record updated without creating duplicate (${data.leadId})`);
  } catch (err) {
    assert(false, `Deduplication test failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // 5. Unauthenticated Admin API Protection
  // -------------------------------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/admin/leads/${createdLeadId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CONTACTED" }),
    });

    assert(res.status === 401, `Unauthenticated status change rejected with HTTP 401 (got ${res.status})`);
  } catch (err) {
    assert(false, `Unauthenticated status change test failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // 6. Admin Authentication & Login
  // -------------------------------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@velocityfit.in",
        password: "velocity2026",
      }),
    });

    const data = await res.json();
    assert(res.status === 200, "Admin login returns HTTP 200");
    assert(data.success === true, "Admin login success: true");
    assert(data.user?.role === "SUPER_ADMIN", `Admin role verified: ${data.user?.role}`);

    // Extract cookie from Set-Cookie header
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      adminCookie = setCookie.split(";")[0];
      assert(true, "Admin session cookie received");
    } else {
      assert(false, "No Set-Cookie header in admin login response");
    }
  } catch (err) {
    assert(false, `Admin login test failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // 7. Authenticated Status Transition & History
  // -------------------------------------------------------------------------
  if (adminCookie && createdLeadId) {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/leads/${createdLeadId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: adminCookie,
        },
        body: JSON.stringify({
          status: "CONTACTED",
          reason: "Initial WhatsApp message dispatched by Dr. Fatima",
        }),
      });

      const data = await res.json();
      assert(res.status === 200, "Authenticated status update returns HTTP 200");
      assert(data.lead?.status === "CONTACTED", `Lead status updated to CONTACTED (got ${data.lead?.status})`);
    } catch (err) {
      assert(false, `Authenticated status update failed: ${err.message}`);
    }
  }

  // -------------------------------------------------------------------------
  // 8. Status Transition Validation
  // -------------------------------------------------------------------------
  if (adminCookie && createdLeadId) {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/leads/${createdLeadId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: adminCookie,
        },
        body: JSON.stringify({
          status: "BOGUS_STATUS_INVENTED",
        }),
      });

      assert(res.status === 400, `Invalid business status rejected with HTTP 400 (got ${res.status})`);
    } catch (err) {
      assert(false, `Status transition validation test failed: ${err.message}`);
    }
  }

  // -------------------------------------------------------------------------
  // 9. Lead Note Creation
  // -------------------------------------------------------------------------
  if (adminCookie && createdLeadId) {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/leads/${createdLeadId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: adminCookie,
        },
        body: JSON.stringify({
          noteBody: "Client interested in starting Flex Track after upcoming travel.",
        }),
      });

      const data = await res.json();
      assert(res.status === 200, "Lead note creation returns HTTP 200");
      assert(Boolean(data.note?.id), `Note created with ID: ${data.note?.id}`);
    } catch (err) {
      assert(false, `Lead note creation failed: ${err.message}`);
    }
  }

  // -------------------------------------------------------------------------
  // 10. Unauthenticated CRM UI Route Protection
  // -------------------------------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/admin`, {
      redirect: "manual",
    });

    const isRedirect = res.status === 307 || res.status === 302 || res.status === 308;
    const location = res.headers.get("location");
    assert(
      isRedirect && location?.includes("/admin/login"),
      `Unauthenticated /admin request redirects to /admin/login (status: ${res.status}, location: ${location})`
    );
  } catch (err) {
    assert(false, `Unauthenticated UI route protection test failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // 11. Sensitive Data Privacy Audit
  // -------------------------------------------------------------------------
  try {
    // Verify that the assessment response API did NOT echo sensitive medical conditions in public response
    const res = await fetch(`${BASE_URL}/api/leads/assessment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Priya Sharma",
        age: 29,
        gender: "Female",
        city: "Hyderabad",
        phone: "+91 99887 76655",
        email: "priya.sharma@example.com",
        heightCm: 162,
        currentWeightKg: 68,
        targetWeightKg: 58,
        targetTimeframe: "3 Months",
        mainGoals: ["PCOS Reversal"],
        medicalConditions: ["PCOS", "Hypothyroidism"],
        isOnLongTermMedications: "Yes",
        longTermMedicationsDetails: "Thyronorm 50mcg",
        dailyWaterLiters: 1.8,
        sleepHours: 6.5,
        bowelMovement: "Constipation",
        eatingPatterns: ["Night Eating"],
        seriousnessScale: 10,
        readyFor60DaysCommitment: "Yes",
        referralSource: "Instagram Profile",
      }),
    });

    const data = await res.json();
    const stringified = JSON.stringify(data);
    const leaksMedical =
      stringified.includes("Thyronorm") ||
      stringified.includes("Constipation") ||
      stringified.includes("Hypothyroidism");

    assert(!leaksMedical, "Public assessment response does NOT leak medications, bowel data, or diagnoses");
    assert(data.calculatedBmi === 25.9, `Priya's calculated BMI verified: ${data.calculatedBmi}`);
  } catch (err) {
    assert(false, `Privacy audit test failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log(`\n=== BACKEND TEST SUMMARY ===`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log(`ALL ${passed} PHASE 2A BACKEND & CRM TESTS PASSED.\n`);
  }
}

runTests();
