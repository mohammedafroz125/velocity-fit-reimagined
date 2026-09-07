import type { Metadata } from "next";

export interface MetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

const BASE_URL = "https://velocityfit.in";
const DEFAULT_OG_IMAGE = "/images/og-velocityfit.jpg";

export function generateSeoMetadata({
  title,
  description,
  path = "",
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
}: MetadataOptions): Metadata {
  const canonicalUrl = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const imageUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph: {
      title: `${title} | Velocity Fit`,
      description,
      url: canonicalUrl,
      siteName: "Velocity Fit",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Velocity Fit`,
      description,
      images: [imageUrl],
    },
  };
}

export function generatePhysicianJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: "Dr. Lubna Fatima",
    medicalSpecialty: "DietNutrition",
    worksFor: {
      "@type": "MedicalOrganization",
      name: "Velocity Fit",
      url: BASE_URL,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hyderabad",
        addressRegion: "Telangana",
        addressCountry: "IN",
      },
    },
    description:
      "Founder of Velocity Fit, pioneer of The VelocityFit Formula, focused on clinical weight loss and metabolic health reversal.",
  };
}
