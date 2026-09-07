# Velocity Fit — Search Engine Optimization (SEO) Strategy

## 1. Organic Search Objectives
While Instagram currently drives immediate peer awareness, Google Search represents the highest-intent acquisition channel for people actively seeking clinical obesity reversal, metabolic nutritionists, and physician-supervised weight loss in Hyderabad and across India.

The SEO architecture is designed to capture:
1. **Brand Queries:** *"Velocity Fit"*, *"VelocityFit Dr Lubna Fatima"*, *"VelocityFit Formula"*, *"VelocityFit Hyderabad"*.
2. **Local Clinical Queries:** *"clinical nutritionist Hyderabad"*, *"doctor led weight loss Hyderabad"*, *"PCOS metabolic diet clinic Hyderabad"*.
3. **National Problem-Solving Queries:** *"how to reverse obesity sustainably"*, *"V6 lifestyle audit nutrition"*, *"doctor supervised fat loss program India"*.

---

## 2. Technical SEO Architecture

### 2.1 Next.js App Router Metadata API
Every page implements typed, programmatic metadata via `src/lib/seo.ts` rather than hardcoded tags.
- **Canonical URLs:** Strict canonical tags generated dynamically using the production domain (`https://velocityfit.in`).
- **OpenGraph & Twitter Cards:** Custom dynamic image generation and optimized OG tags (`og:title`, `og:description`, `og:image`, `og:type: website`).
- **Robots & Crawling:** Dynamic `src/app/robots.ts` configured to allow complete indexing while disallowing internal administrative or portal routes.
- **XML Sitemap:** Dynamic `src/app/sitemap.ts` automatically generating all marketing, program, FAQ, and resource URLs with correct change frequencies and priority scores.

### 2.2 Semantic HTML & Heading Discipline
- **Single H1 Rule:** Exactly one semantic `<h1>` element per page encapsulating the primary topic.
- **Hierarchical Nesting:** Strict progression from `<h1>` ➔ `<h2>` ➔ `<h3>` without skipping levels.
- **Image Optimization:** All images utilize Next.js `<Image />` with verified `alt` attributes, explicit aspect ratios to eliminate layout shifts (CLS), and WebP/AVIF compression.

---

## 3. Structured Data (Schema.org JSON-LD)

To achieve rich search snippets and medical knowledge graph integration, the platform injects Schema.org JSON-LD:

### 3.1 MedicalOrganization / HealthBusiness Schema
```json
{
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "name": "Velocity Fit",
  "url": "https://velocityfit.in",
  "logo": "https://velocityfit.in/images/logo.png",
  "founder": {
    "@type": "Person",
    "name": "Dr. Lubna Fatima",
    "jobTitle": "Clinical Nutritionist & Founder"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Hyderabad",
    "addressRegion": "Telangana",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9966827968",
    "contactType": "customer support",
    "areaServed": "IN",
    "availableLanguage": ["English", "Hindi", "Urdu", "Telugu"]
  }
}
```

### 3.2 Physician / Medical Practitioner Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Physician",
  "name": "Dr. Lubna Fatima",
  "medicalSpecialty": "DietNutrition",
  "worksFor": {
    "@type": "MedicalOrganization",
    "name": "Velocity Fit"
  },
  "description": "Founder of Velocity Fit, pioneer of The VelocityFit Formula and advocate for an Obesity-Free India."
}
```

### 3.3 FAQPage Schema
Injected into `/faq` and contextual FAQ sections to enable expandable rich questions directly in Google SERPs.

---

## 4. Local SEO Focus (Hyderabad, India)
- **Local Landing Signals:** Explicit citation of Hyderabad headquarters across footers, contact pages, and structured data.
- **Google Business Profile (GBP) Synchronization:** Consistent NAP (Name, Address, Phone: `+91 9966827968`) across all digital footers and social headers.
- **Geo-Meta Tags:** Configured for Hyderabad, Telangana (`geo.region: IN-TG`, `geo.placename: Hyderabad`).

## 5. People-First Content Guidelines
- Zero keyword-stuffing or artificial density targets.
- Content structured around genuine patient questions, clinical reasoning, habit science, and transparent expectation management.
- Medical disclaimer clearly visible in the global footer:
  *"Velocity Fit provides clinical and lifestyle nutritional guidance. Always consult your primary care physician before beginning any intensive dietary transformation."*
