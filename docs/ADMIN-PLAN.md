# Velocity Fit — Admin Panel Architecture & Non-Technical Management

## 1. Executive Context & Core Requirement
The founder and clinical director of Velocity Fit, **Dr. Lubna Fatima**, is a medical professional, not a software engineer. The administration system must therefore be designed from the ground up to be **effortless, forgiving, and self-explanatory**. 

Dr. Fatima and her clinical assistants should never need to touch JSON, edit markdown, or write code to:
1. Review an incoming client's health assessment.
2. Send a WhatsApp consultation confirmation.
3. Update program pricing or FAQ answers.
4. Publish a client case study once patient consent is verified.

---

## 2. Admin Workspace Modules

```
┌─────────────────────────────────────────────────────────────┐
│             Velocity Fit Clinical Command Center            │
├──────────────┬──────────────────────────────────────────────┤
│ 📊 Dashboard │ • Deployed at /admin                         │
│              │ • 5 Core Stat Badges (New, Follow-Up, etc.)  │
│              │ • Recent Inbound Prospects Feed              │
├──────────────┼──────────────────────────────────────────────┤
│ 👥 Lead CRM  │ • Deployed at /admin/leads                   │
│              │ • Filter by 11 Business Statuses             │
│              │ • Search by Name, Phone, Email, City         │
│              │ • Server-Side Pagination                     │
├──────────────┼──────────────────────────────────────────────┤
│ 🔍 Details   │ • Deployed at /admin/leads/[id]              │
│              │ • Protected 5-Stage Clinical Intake Viewer   │
│              │ • 1-Click WhatsApp Launcher (Pre-filled)     │
│              │ • Status History Pipeline & Notes Manager    │
├──────────────┼──────────────────────────────────────────────┤
│ 🔐 Security  │ • Edge Middleware + Supabase RLS             │
│              │ • Strict Zero Medical Leak in URLs / Logs    │
└──────────────┴──────────────────────────────────────────────┘
```

---

## 2.1 Phase 2A & 2B Deployed Routes & Features
- **`/admin/login`:** Dark luxury administrative portal supporting Supabase Auth and offline development sessions.
- **`/admin`:** Executive dashboard calculating live metrics (New Leads, Follow-ups, Consultations Booked, Converted, Active Customers). Shows intentional empty state when database is clean.
- **`/admin/leads`:** Production CRM table with search, status filtering, source filtering, and pagination.
- **`/admin/leads/[id]`:** Detailed clinical case profile featuring:
  - Protected metabolic markers, BMI, and V6 Audit™ habit baselines.
  - **Consultation Appointments Manager:** Real-time appointment cards with date/time in IST, meeting mode (Google Meet link / Phone call), and 1-click status actions (Confirm, Complete, Cancel).
  - **Payment & Enrollment Records View:** Live transaction cards showing track, tier, duration, amount in ₹, gateway order ID, payment ID, and status badge.
  - Internal notes logger and 1-click WhatsApp/Call/Email triggers.

---

## 3. High-Priority User Flows for Dr. Fatima

### 3.1 Reviewing an Incoming Health Assessment
1. Dr. Fatima receives an instant WhatsApp/Email alert: *"New Health Assessment from [Client Name] (Hyderabad) - Goal: Weight Loss / PCOS Reversal."*
2. She taps the link to open the Lead Card on mobile or iPad.
3. She immediately sees:
   - Client vital metrics: BMI, target weight, timeline.
   - Medical history: Existing thyroid condition, medications.
   - Habit markers: Daily water intake, sleep patterns, emotional eating checkboxes.
   - Attribution badge: `Origin: Instagram Reel` or `Google Organic`.
4. Dr. Fatima taps the green **"Open WhatsApp Conversation"** button, which launches WhatsApp Web/App preloaded with:
   *"Hello [Client Name], this is Dr. Lubna Fatima from Velocity Fit. I have reviewed your health assessment and would like to invite you for your 30-minute clinical consultation..."*

### 3.2 Updating Program Pricing (e.g., Seasonal Discount)
1. Navigate to `/admin/programs`.
2. Select **VelocityFit Transformation (Flex Track)**.
3. Change regular or sale price in an intuitive INR currency field.
4. Tap **"Publish Changes"**. Changes go live immediately without server rebuilds.

### 3.3 Adding a Verified Transformation Story
Per the strict business information rule, transformations must never be fabricated.
1. In `/admin/testimonials`, tap **"Add New Patient Case Study"**.
2. Upload Before & After photos with verified consent checkmark:
   `[x] Patient has signed consent waiver for public image usage.`
3. Enter verified duration (e.g. 12 weeks) and verified fat loss.
4. Toggle `Verified by Doctor` to `True`.

---

## 4. Role-Based Access Control (RBAC)
- **Role 1: Doctor / Practice Owner (Dr. Fatima)**
  - Full access to clinical records, revenue analytics, program pricing, and user management.
- **Role 2: Clinical Assistant / Operations Coordinator**
  - View and update lead statuses, log follow-up notes, schedule consultation slots. Cannot modify program pricing or financial payout details.
- **Role 3: Content Manager**
  - Create and edit FAQs, blog posts, and educational guides. No access to private health assessments.
