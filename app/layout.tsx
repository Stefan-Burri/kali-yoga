import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";
import { AgentationProvider } from "@/components/AgentationProvider";
import AnimatedGradientBg from "@/components/AnimatedGradientBg";
import CookieBanner from "@/components/CookieBanner";
import CustomCode from "@/components/CustomCode";
import LangAttribute from "@/components/LangAttribute";
import SmoothScroll from "@/components/SmoothScroll";
import { getFooter } from "@/lib/builder";
import { client } from "@/lib/sanity";
import { SITE_URL } from "@/lib/site";

/** CMS-Feld «Custom Code» (Allgemein) – z.B. das Google-Tag-Manager-Snippet.
    Wird clientseitig erst geladen, nachdem im Cookie-Banner «Einverstanden»
    gewählt wurde (Schweizer Datenschutzrecht). */
async function getCustomCode(): Promise<string | null> {
  try {
    return await client.fetch<string | null>(
      `*[_type == "siteSettings"][0].customCode`,
      {},
      { next: { revalidate: 60 } }
    );
  } catch {
    return null;
  }
}

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Kali Yoga · Yoga für «Every Body» · Yoga Studio in Bern",
  description: "Yoga für Alle, unabhängig von Alter, Geschlecht, Körperform oder körperlicher Verfassung. Yoga Studio in Bern an der Aarbergergasse 40.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [customCode, footer] = await Promise.all([getCustomCode(), getFooter("de")]);

  /* Strukturierte Daten (schema.org LocalBusiness) für die lokale Google-Suche
     und Google Maps – Kontaktdaten kommen aus dem Footer-Dokument im CMS. */
  const phone = footer?.phone ?? "076 262 05 62";
  const [postalCode, ...localityParts] = (footer?.city ?? "3011 Bern").split(" ");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#studio`,
    name: "Kali Yoga",
    description: "Yoga Studio in Bern — Yogaklassen, Yoga Therapie und Kleingruppen für «Every Body».",
    url: SITE_URL,
    telephone: phone.replace(/\s+/g, "").replace(/^0/, "+41"),
    email: footer?.email ?? "info@kali-yoga.ch",
    image: `${SITE_URL}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: footer?.address ?? "Aarbergergasse 40",
      postalCode,
      addressLocality: localityParts.join(" ") || "Bern",
      addressCountry: "CH",
    },
    sameAs: [footer?.facebook, footer?.instagram].filter(Boolean),
  };

  return (
    <html lang="de" className={`${fraunces.variable} ${workSans.variable}`}>
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {customCode ? <CustomCode html={customCode} /> : null}
        <LangAttribute />
        <AnimatedGradientBg />
        <SmoothScroll />
        {children}
        <CookieBanner tracking={Boolean(customCode)} />
        <AgentationProvider />
      </body>
    </html>
  );
}
