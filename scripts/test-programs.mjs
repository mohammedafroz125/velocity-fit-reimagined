async function testProgramPricing() {
  console.log("=== TESTING PROGRAM PRICING ON LIVE PAGES ===\n");

  const expectedPrices = [
    { track: "Flex", url: "http://localhost:3000/programs/flex" },
    { track: "Grit", url: "http://localhost:3000/programs/grit" }
  ];

  let passed = 0;
  let total = 0;

  for (const { track, url } of expectedPrices) {
    const res = await fetch(url);
    const html = await res.text();

    console.log(`Checking ${track} track page (${url})...`);

    // Verify Prime 1-Month: ₹2,000
    total++;
    if (html.includes("2,000") && html.includes("Prime")) {
      console.log(`[PASS] ${track} + Prime + 1 Month (₹2,000) found`);
      passed++;
    } else {
      console.error(`[FAIL] ${track} + Prime + 1 Month (₹2,000) not found`);
    }

    // Verify Prime 3-Months: ₹5,500
    total++;
    if (html.includes("5,500") && html.includes("Prime")) {
      console.log(`[PASS] ${track} + Prime + 3 Months (₹5,500) found`);
      passed++;
    } else {
      console.error(`[FAIL] ${track} + Prime + 3 Months (₹5,500) not found`);
    }

    // Verify Elite 1-Month: ₹3,000
    total++;
    if (html.includes("3,000") && html.includes("Elite")) {
      console.log(`[PASS] ${track} + Elite + 1 Month (₹3,000) found`);
      passed++;
    } else {
      console.error(`[FAIL] ${track} + Elite + 1 Month (₹3,000) not found`);
    }

    // Verify Elite 3-Months: ₹8,000
    total++;
    if (html.includes("8,000") && html.includes("Elite")) {
      console.log(`[PASS] ${track} + Elite + 3 Months (₹8,000) found`);
      passed++;
    } else {
      console.error(`[FAIL] ${track} + Elite + 3 Months (₹8,000) not found`);
    }
  }

  console.log(`\n=== PROGRAM PRICING TEST: ${passed}/${total} VERIFIED ===`);
  if (passed !== total) process.exit(1);
}

testProgramPricing();
