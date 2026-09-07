const pages = [
  '/',
  '/about',
  '/programs',
  '/programs/flex',
  '/programs/grit',
  '/how-it-works',
  '/results',
  '/resources',
  '/resources/cellular-hydration-fat-loss',
  '/resources/understanding-the-v6-audit',
  '/resources/curbing-night-eating-syndrome',
  '/contact',
  '/get-started',
  '/faq'
];

async function auditSEO() {
  console.log('=== SEO AUDIT ACROSS ALL PUBLIC PAGES ===\n');
  const seenTitles = new Set();
  let issues = 0;

  for (const path of pages) {
    const res = await fetch(`http://localhost:3000${path}`);
    const html = await res.text();

    // 1. Title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : null;
    if (!title) {
      console.error(`[FAIL] ${path}: Missing <title> tag`);
      issues++;
    } else if (seenTitles.has(title)) {
      console.error(`[FAIL] ${path}: Duplicate <title>: "${title}"`);
      issues++;
    } else {
      seenTitles.add(title);
      console.log(`[PASS] ${path} Title: "${title}"`);
    }

    // 2. Meta description
    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
    if (!descMatch || !descMatch[1]) {
      console.error(`[FAIL] ${path}: Missing meta description`);
      issues++;
    }

    // 3. Canonical link
    const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
    if (!canonicalMatch) {
      console.error(`[FAIL] ${path}: Missing canonical link`);
      issues++;
    }

    // 4. Single H1 check
    const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
    if (h1Matches.length === 0) {
      console.error(`[FAIL] ${path}: Missing <h1> tag`);
      issues++;
    } else if (h1Matches.length > 1) {
      console.warn(`[WARN] ${path}: Multiple <h1> tags found (${h1Matches.length})`);
    } else {
      console.log(`[PASS] ${path} <h1> verified (Single H1)`);
    }

    // 5. JSON-LD validity
    const jsonLdMatches = [...html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
    for (const jsonMatch of jsonLdMatches) {
      try {
        JSON.parse(jsonMatch[1]);
        console.log(`[PASS] ${path}: Valid JSON-LD block parsed`);
      } catch (e) {
        console.error(`[FAIL] ${path}: Invalid JSON-LD block syntax: ${e.message}`);
        issues++;
      }
    }
  }

  console.log(`\n=== SEO AUDIT COMPLETE: ${issues} ISSUES DETECTED ===`);
  if (issues > 0) process.exit(1);
}

auditSEO();
