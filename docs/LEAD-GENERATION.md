# Velocity Fit — Lead Generation & Attribution Architecture

## 1. Growth Funnel Strategy

The Velocity Fit platform is designed not as a passive brochure, but as an **automated client acquisition engine**. The business generates most of its clients through Dr. Lubna Fatima's social authority on Instagram (`@velocityfit.official`). The website's role is to convert this high-intent social traffic into qualified, scheduled consultations.

### Acquisition & Conversion Flow

```
[ Instagram Bio / Stories / Ads / Reels ]  OR  [ Google Search / Local SEO ]
                         │
                         ▼
        [ High-Conversion Velocity Landing Page ]
     (Hero Value Prop ➔ Goal Discovery ➔ Proof)
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
[ Interactive Assessment ]     [ Direct WhatsApp / Call ]
  (5-Stage Pre-Signup Form)      (Quick Inbound Inquiry)
        │                                 │
        ▼                                 ▼
  [ Lead Attribution Engine: UTMs, Referrer, Device Captured ]
                         │
                         ▼
        [ Qualified Lead Record Dispatched ]
    (Phase 1: Admin Notification | Phase 2: CRM)
                         │
                         ▼
  [ Personalized Clinical Follow-up by Dr. Fatima's Team ]
                         │
                         ▼
    [ Consultation / Enrollment in Flex or Grit ]
```

---

## 2. Lead Capture Mechanisms

To avoid reliance on a low-converting generic "Contact Us" form, Velocity Fit deploys multiple contextual entry points:

### 2.1 The Pre-Signup Health Assessment Wizard (Primary Engine)
- Located at `/get-started`.
- Positioned as: *"Discover your metabolic baseline and personalize your transformation roadmap with Dr. Lubna Fatima."*
- Structured across 5 clinical intake modules directly modeled from the verified FluentForms schema:
  1. **Personal Demographics:** Full name, Age, Gender, City, Phone (required for WhatsApp coordination), Email.
  2. **Body & Goal Snapshot:** Height (cm), Current Weight (kg), Highest Weight Ever, Target Weight (kg), Timeframe (1, 2, 3, 6 months), Primary Goals (Weight loss, Metabolic health, PCOS/Thyroid, etc.).
  3. **Health & Medical Background:** Known medical conditions (Diabetes, Hypertension, Fatty Liver, etc.), long-term medications, past surgeries, female-specific health markers.
  4. **Lifestyle & Habits (V6 Audit™ Foundation):** Water intake (Liters), Sleep hours, Bowel movement regularities, Eating patterns (emotional, night, long gaps), past diet attempts.
  5. **Readiness & Attribution:** Commitment score (1–10), life motivation, readiness to commit to 60 days of medical guidance, channel discovery source.

### 2.2 Reusable CTA Components
- **Sticky Header Quick Trigger:** Persistent *"Take Assessment"* button on desktop and prominent mobile bottom drawer.
- **WhatsApp Floating Action Button:** Direct link with pre-filled clinical enquiry message:
  `"Hello Dr. Lubna, I am visiting the Velocity Fit website and would like to learn more about your clinical transformation programs."`
- **Program-Specific Enquiry Cards:** *"Inquire about Flex"* or *"Inquire about Grit"* pre-selecting the program track.

---

## 3. Lead Attribution Engine

Every lead captured must be tied back to its acquisition origin so Dr. Fatima knows exactly which marketing channel produces paid transformations.

### 3.1 Attribution Parameters Captured
The frontend attribution utility (`src/lib/attribution.ts`) silently inspects the incoming request URL on first visit and persists values across session/cookies:
- `utm_source` (e.g. `instagram`, `google`, `facebook`, `newsletter`)
- `utm_medium` (e.g. `bio_link`, `cpc`, `story`, `reel`)
- `utm_campaign` (e.g. `obesity_free_india_sept26`, `weight_loss_hyderabad`)
- `utm_content` (e.g. `dr_lubna_water_therapy_video`)
- `utm_term` (e.g. `clinical_nutritionist_hyderabad`)
- `first_landing_page` (e.g. `/get-started`, `/programs/flex`)
- `referrer_url` (e.g. `https://l.instagram.com/`)
- `device_type` (e.g. `mobile`, `desktop`, `tablet`)
- `timestamp` (ISO 8601 string)

### 3.2 Lead Payload Data Contract
```typescript
export interface LeadSubmissionPayload {
  // Contact info
  fullName: string;
  phone: string;
  email: string;
  city?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Rather not specify';

  // Clinical & Goals Snapshot
  heightCm?: number;
  currentWeightKg?: number;
  targetWeightKg?: number;
  primaryGoals?: string[];
  medicalConditions?: string[];
  medications?: string;
  waterIntakeLiters?: number;
  commitmentScore?: number;
  preferredProgram?: 'Flex' | 'Grit' | 'Unsure';

  // Attribution & Marketing Metadata
  attribution: {
    utmSource: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    referrer: string;
    firstLandingPage: string;
    device: string;
    capturedAt: string;
  };
}
```

---

## 4. Analytics Event Taxonomy
The platform dispatches uniform events via `src/lib/analytics.ts`:
- `page_view`: Fired on route transitions with canonical path.
- `cta_click`: Fired when user clicks any primary action button (records CTA text and location).
- `whatsapp_click`: Fired when floating or inline WhatsApp buttons are tapped.
- `phone_click`: Fired when telephone link `tel:+919966827968` is clicked.
- `assessment_start`: Fired when module 1 of the assessment wizard begins.
- `assessment_step_complete`: Fired when modules 1–4 are successfully completed.
- `assessment_submit`: Fired when full assessment is submitted.
- `contact_submit`: Fired when general contact form is submitted.
