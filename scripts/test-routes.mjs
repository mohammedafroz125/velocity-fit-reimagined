const routes = [
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
  '/faq',
  '/robots.txt',
  '/sitemap.xml',
  '/non-existent-page-test-404',
];

async function runTests() {
  console.log('=== TESTING APPLICATION ROUTES ON http://localhost:3000 ===\n');
  let failures = 0;

  for (const route of routes) {
    const url = `http://localhost:3000${route}`;
    try {
      const res = await fetch(url);
      const text = await res.text();
      const is404Expected = route.includes('404');
      const expectedStatus = is404Expected ? 404 : 200;

      if (res.status === expectedStatus) {
        console.log(`[PASS] ${route} -> HTTP ${res.status} (${text.length} bytes)`);
      } else {
        console.error(`[FAIL] ${route} -> Expected ${expectedStatus}, got ${res.status}`);
        failures++;
      }

      // Verify title or key content if HTML
      if (res.headers.get('content-type')?.includes('text/html')) {
        const titleMatch = text.match(/<title>([^<]*)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : 'NO_TITLE';
        if (!title.includes('Velocity Fit') && !is404Expected) {
          console.warn(`[WARN] ${route} -> Title does not mention Velocity Fit: "${title}"`);
        }
      }
    } catch (err) {
      console.error(`[ERROR] ${route} -> ${err.message}`);
      failures++;
    }
  }

  console.log(`\n=== TEST COMPLETE: ${routes.length - failures}/${routes.length} PASSED ===`);
  if (failures > 0) {
    process.exit(1);
  }
}

runTests();
