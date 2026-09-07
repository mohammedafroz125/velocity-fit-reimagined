import { LeadAttribution } from "@/types";

const STORAGE_KEY = "vf_attribution_v1";

/**
 * Extracts UTM parameters and referrer information from current browser URL.
 * Persists in sessionStorage so attribution is preserved throughout visitor journey.
 */
export function captureAttribution(): LeadAttribution {
  if (typeof window === "undefined") {
    return {
      capturedAt: new Date().toISOString(),
    };
  }

  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) {
      return JSON.parse(existing) as LeadAttribution;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const attribution: LeadAttribution = {
      utmSource: urlParams.get("utm_source") || (document.referrer.includes("instagram.com") ? "instagram" : undefined),
      utmMedium: urlParams.get("utm_medium") || undefined,
      utmCampaign: urlParams.get("utm_campaign") || undefined,
      utmContent: urlParams.get("utm_content") || undefined,
      utmTerm: urlParams.get("utm_term") || undefined,
      referrer: document.referrer || undefined,
      firstLandingPage: window.location.pathname + window.location.search,
      device: getDeviceType(),
      capturedAt: new Date().toISOString(),
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
    return attribution;
  } catch {
    return {
      capturedAt: new Date().toISOString(),
      device: getDeviceType(),
    };
  }
}

/**
 * Get previously captured attribution or capture fresh if not present.
 */
export function getStoredAttribution(): LeadAttribution {
  if (typeof window === "undefined") {
    return { capturedAt: new Date().toISOString() };
  }
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) {
      return JSON.parse(existing);
    }
  } catch {
    // fallback
  }
  return captureAttribution();
}

function getDeviceType(): string {
  if (typeof window === "undefined") return "unknown";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}
