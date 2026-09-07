import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Lovable Editorial Color Palette */
        ink: {
          DEFAULT: "var(--color-ink)",
          soft: "var(--color-ink-soft)",
        },
        ivory: "var(--color-ivory)",
        paper: "var(--color-paper)",
        mist: "var(--color-mist)",
        olive: {
          DEFAULT: "var(--color-olive)",
          deep: "var(--color-olive-deep)",
        },
        champagne: "var(--color-champagne)",

        /* Harmonized Surface & Accent Tokens */
        surface: {
          dark: "var(--color-surface-dark)",
          elevated: "var(--color-surface-elevated)",
          "elevated-hover": "var(--color-surface-elevated-hover)",
          light: "var(--color-surface-light)",
          warm: "var(--color-surface-warm)",
          "warm-elevated": "var(--color-surface-warm-elevated)",
          subtle: "var(--color-surface-subtle)",
        },
        border: {
          subtle: "var(--color-border-subtle)",
          dark: "var(--color-border-dark)",
        },
        accent: {
          gold: "var(--color-accent-gold)",
          "gold-light": "var(--color-accent-gold-light)",
          "gold-hover": "var(--color-accent-gold-hover)",
          "gold-muted": "var(--color-accent-gold-muted)",
          "gold-glow": "var(--color-accent-gold-glow)",
          sage: "var(--color-accent-sage)",
          "sage-subtle": "var(--color-accent-sage-subtle)",
          "sage-dark": "var(--color-accent-sage-dark)",
        },
        brand: {
          dark: "var(--color-surface-dark)",
          gold: "var(--color-accent-gold)",
          warm: "var(--color-surface-warm)",
        },
        content: {
          "primary-dark": "var(--color-text-primary-dark)",
          "secondary-dark": "var(--color-text-secondary-dark)",
          "muted-dark": "var(--color-text-muted-dark)",
          "primary-light": "var(--color-text-primary-light)",
          "secondary-light": "var(--color-text-secondary-light)",
          "muted-light": "var(--color-text-muted-light)",
        },
        status: {
          success: "var(--color-success)",
          "success-bg": "var(--color-success-bg)",
          error: "var(--color-error)",
          "error-bg": "var(--color-error-bg)",
          warning: "var(--color-warning)",
          info: "var(--color-info)",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
      },
      boxShadow: {
        subtle: "var(--shadow-subtle)",
        card: "var(--shadow-card)",
        elevated: "var(--shadow-elevated)",
        dark: "var(--shadow-dark)",
        gold: "var(--shadow-gold)",
      },
      fontFamily: {
        sans: ["var(--font-body)", "var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
        heading: ["var(--font-display)", "var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "DM Sans", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      keyframes: {
        "reveal-up": {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "reveal-up": "reveal-up 0.8s cubic-bezier(0.32, 0.72, 0, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
