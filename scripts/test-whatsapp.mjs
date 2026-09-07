const pagesToTest = [
  '/',
  '/about',
  '/programs',
  '/programs/flex',
  '/programs/grit',
  '/how-it-works',
  '/results',
  '/resources',
  '/contact',
  '/get-started',
  '/faq'
];

const VERIFIED_WHATSAPP_NUMBER = '917337337886';
const SENSITIVE_KEYWORDS = ['bowel', 'constipat', 'period', 'cycle', 'thyroid', 'medication', 'surgery', 'pcos'];

async function auditWhatsAppLinks() {
  console.log('=== AUDITING WHATSAPP LINKS ACROSS ALL PAGES ===\n');
  let totalLinksFound = 0;
  let issues = 0;

  for (const page of pagesToTest) {
    const res = await fetch(`http://localhost:3000${page}`);
    const html = await res.text();

    // Look for any occurrence of wa.me
    const regex = /wa\.me\/([0-9]+)(?:[^\s"'>]*)/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
      totalLinksFound++;
      const fullUrl = match[0];
      const number = match[1];

      if (number !== VERIFIED_WHATSAPP_NUMBER) {
        console.error(`[FAIL] ${page}: Unverified WhatsApp number "${number}" in ${fullUrl}`);
        issues++;
      } else {
        console.log(`[PASS] ${page}: Verified WhatsApp link to ${number}`);
      }

      // Check query string for sensitive leaks
      const decodedQuery = decodeURIComponent(fullUrl).toLowerCase();
      for (const keyword of SENSITIVE_KEYWORDS) {
        if (decodedQuery.includes(keyword)) {
          console.error(`[FAIL] ${page}: URL leaks sensitive keyword "${keyword}" in WhatsApp link: ${fullUrl}`);
          issues++;
        }
      }
    }
  }

  console.log(`\n=== WHATSAPP AUDIT: ${totalLinksFound} links inspected, ${issues} issues found ===`);
  if (issues > 0) process.exit(1);
}

auditWhatsAppLinks();
