/**
 * Velocity Fit - Vendor-Agnostic Analytics Dispatcher
 * Ready for Google Analytics 4, Meta Pixel, and GTM without vendor lock-in.
 */

export type AnalyticsEventName =
  | "page_view"
  | "cta_click"
  | "whatsapp_click"
  | "phone_click"
  | "form_start"
  | "form_submit"
  | "contact_form_success"
  | "booking_success"
  | "assessment_start"
  | "assessment_step"
  | "assessment_complete"
  | "program_view";

export interface AnalyticsEventProps {
  [key: string]: string | number | boolean | undefined | null;
}

export function trackEvent(name: AnalyticsEventName, properties?: AnalyticsEventProps) {
  if (typeof window === "undefined") return;

  const payload = {
    event: name,
    timestamp: new Date().toISOString(),
    ...properties,
  };

  // In development, log cleanly to console
  if (process.env.NODE_ENV !== "production") {
    // console.debug(`[Analytics] ${name}:`, payload);
  }

  // Push to GTM dataLayer if present
  const win = window as unknown as { dataLayer?: unknown[] };
  if (Array.isArray(win.dataLayer)) {
    win.dataLayer.push(payload);
  }

  // Dispatch custom browser DOM event for potential listener hooks
  try {
    const customEvent = new CustomEvent("velocityfit:analytics", { detail: payload });
    window.dispatchEvent(customEvent);
  } catch {
    // ignore
  }
}
