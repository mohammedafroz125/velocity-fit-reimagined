import type { Metadata } from "next";
import "@/styles/globals.css";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { siteConfig } from "@/data/site-config";
import { generatePhysicianJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.brandName} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.brandName}`,
  },
  description: siteConfig.missionStatement,
  metadataBase: new URL("https://velocityfit.in"),
  alternates: {
    canonical: "https://velocityfit.in",
  },
  keywords: [
    "Velocity Fit",
    "Dr Lubna Fatima",
    "Clinical Nutritionist Hyderabad",
    "Weight Loss Hyderabad",
    "Obesity Reversal India",
    "PCOS Dietitian Hyderabad",
    "The VelocityFit Formula",
    "V6 Audit",
  ],
  authors: [{ name: "Dr. Lubna Fatima" }],
  creator: "Velocity Fit",
  publisher: "Velocity Fit",
  openGraph: {
    title: `${siteConfig.brandName} | ${siteConfig.tagline}`,
    description: siteConfig.missionStatement,
    url: "https://velocityfit.in",
    siteName: siteConfig.brandName,
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const physicianJsonLd = generatePhysicianJsonLd();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-body bg-ivory text-ink overflow-x-hidden antialiased selection:bg-champagne selection:text-ink">
        <Header />
        <main className="flex-grow w-full overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
