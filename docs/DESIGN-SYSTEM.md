# Velocity Fit — Design System & Tokens

## 1. Design Vision & Aesthetic Direction
The Velocity Fit visual language is crafted to communicate **clinical credibility, transformation authority, and premium sophistication**. It intentionally avoids two common industry clichés:
- It does **not** look like a generic, aggressive bodybuilding gym (no neon colors, no heavy grunge, no intimidating workout imagery).
- It does **not** look like a cold, sterile hospital portal (no clinical cyan-blues, no intimidating medical jargon).

Instead, it blends editorial luxury (similar to high-end wellness consultancies like Snabbit or Vitalis) with empathetic medical authority led by **Dr. Lubna Fatima**.

---

## 2. Centralized Color Palette

All colors are governed by CSS Custom Properties in `src/styles/tokens.css` and mapped to Tailwind utility classes in `tailwind.config.ts`. Modifying a token value automatically propagates across every component in the system.

### 2.1 Color Tokens Specification

| Token Name | Hex Code | Role & Strategic Usage |
| :--- | :--- | :--- |
| `--color-surface-dark` | `#121316` | Primary dark surface (hero, high-impact CTA sections, footer) |
| `--color-surface-elevated`| `#1A1D23` | Dark card surface, dropdowns, navigation bar when inverted |
| `--color-surface-light` | `#FBFBFA` | Pure off-white surface for crisp reading and program catalogs |
| `--color-surface-warm` | `#F4F1EA` | Soft champagne/linen neutral for editorial sections and storytelling |
| `--color-surface-subtle`| `#EAE6DC` | Subtle borders, divider lines, and card containers on light surfaces |
| `--color-accent-gold` | `#C5A059` | Champagne gold accent (primary action buttons, focus rings, highlights)|
| `--color-accent-gold-light`| `#DFBF7D`| Hover states for gold buttons and badge borders |
| `--color-accent-gold-muted`| `#8E7238`| Secondary accents, subtle iconography, active tab indicator |
| `--color-text-primary-dark`| `#111317`| High-contrast typography on light and warm surfaces (WCAG AAA) |
| `--color-text-secondary-dark`|`#555A64`| Subheadings and descriptive text on light/warm surfaces |
| `--color-text-primary-light`|`#F9FAFB`| High-contrast typography on dark surfaces |
| `--color-text-secondary-light`|`#A3A8B5`| Subheadings and muted details on dark surfaces |
| `--color-success` | `#2D7A4F` | Assessment validation checkmarks, qualified lead badges |
| `--color-error` | `#C53B3B` | Form validation errors and alerts |

---

## 3. Visual Rhythm Strategy
To prevent visual fatigue, pages alternate deliberately between four distinct section palettes:
1. **The Signature Dark Section:** Used for Hero, Transformational Statement, and Final CTA. Conveys prestige and deep focus.
2. **The Editorial Warm Section (`#F4F1EA`):** Used for Founder Story, The VelocityFit Formula, and V6 Audit™. Conveys human warmth and empathy.
3. **The Clean Off-White Section (`#FBFBFA`):** Used for Program Offerings, FAQ Accordions, and Resource Articles. Maximizes scannability and legibility.
4. **The High-Contrast Card Surface:** Elevated cards nested within sections to anchor attention on key choices (e.g. Assessment choices, Program tracks).

---

## 4. Typography Scale

- **Headings Font Family:** `Plus Jakarta Sans`, sans-serif (Authoritative, modern geometric sans with editorial warmth).
- **Body & Interface Font Family:** `Inter`, sans-serif (Optimized for mobile micro-typography and form inputs).

| Style | Tailwind Class | Size (Desktop / Mobile) | Line Height | Tracking | Weight |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | `text-4xl md:text-6xl` | 60px / 36px | 1.15 | `-0.02em` | SemiBold (600) |
| **H1** | `text-3xl md:text-5xl` | 48px / 30px | 1.2 | `-0.02em` | SemiBold (600) |
| **H2** | `text-2xl md:text-4xl` | 36px / 24px | 1.25 | `-0.015em`| SemiBold (600) |
| **H3** | `text-xl md:text-2xl` | 24px / 20px | 1.3 | `-0.01em` | Medium (500) |
| **Lead Body**| `text-lg md:text-xl` | 20px / 18px | 1.6 | normal | Regular (400) |
| **Body** | `text-base` | 16px | 1.6 | normal | Regular (400) |
| **Small/Label**| `text-sm` | 14px | 1.5 | `+0.01em` | Medium (500) |
| **Micro/Badge**| `text-xs` | 12px | 1.4 | `+0.05em` | SemiBold (600) |

---

## 5. Spacing, Radii & Elevation

### Spacing Scale
Built on an 8-pixel grid system:
- `space-1` = 4px
- `space-2` = 8px
- `space-3` = 12px
- `space-4` = 16px
- `space-6` = 24px
- `space-8` = 32px
- `space-12` = 48px
- `space-16` = 64px
- `space-24` = 96px

### Corner Radius
- Buttons & Badges: `rounded-full` (for soft, pill-shaped pills) or `rounded-xl` (12px)
- Cards & Form Panels: `rounded-2xl` (16px)
- Modals & Floating Drawers: `rounded-3xl` (24px)

### Shadows & Elevation
- `shadow-subtle`: `0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)`
- `shadow-elevated`: `0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)`
- `shadow-gold-glow`: `0 8px 20px -4px rgba(197, 160, 89, 0.25)`

---

## 6. Core Component Anatomy

### Button (`<Button />`)
- **Variants:**
  - `gold` (Primary CTA): Champagne gold background, dark charcoal text, hover brightness lift, active scale tap.
  - `outline` (Secondary CTA): 1.5px champagne gold border, transparent background, transitions to subtle gold tint on hover.
  - `dark`: Deep charcoal background with off-white text for light sections.
  - `ghost`: Transparent button with animated underline or text color change.
- **Sizes:** `sm` (compact labels/filters), `md` (standard forms), `lg` (hero CTAs, assessment submit).

### Card (`<Card />`)
- Border: 1px subtle neutral border (`border-[var(--color-surface-subtle)]`).
- Background: Dynamic based on parent rhythm.
- Transitions: Subtle 2px translate-Y lift and shadow expansion on hover.

### Form Field (`<FormField />`)
- Clear accessible labels positioned above input.
- High-contrast border with distinct gold focus ring (`ring-2 ring-[var(--color-accent-gold)]`).
- Inline error messages rendered with `role="alert"` for screen-reader compliance.
