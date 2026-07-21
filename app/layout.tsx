import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";
import { AgentationProvider } from "@/components/AgentationProvider";
import AnimatedGradientBg from "@/components/AnimatedGradientBg";
import CookieBanner from "@/components/CookieBanner";
import SmoothScroll from "@/components/SmoothScroll";
import { client } from "@/lib/sanity";

/** CMS-Feld «Custom Code» (Allgemein) – z.B. das Google-Tag-Manager-Snippet.
    Wird als Roh-HTML am Anfang des <body> eingefügt; Skripte im
    servergerenderten HTML werden vom Browser normal ausgeführt. */
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
  title: "Kali Yoga · Yoga für «Every Body» · Yoga Studio in Bern",
  description: "Yoga für Alle, unabhängig von Alter, Geschlecht, Körperform oder körperlicher Verfassung. Yoga Studio in Bern an der Aarbergergasse 40.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const customCode = await getCustomCode();
  return (
    <html lang="de" className={`${fraunces.variable} ${workSans.variable}`}>
      <body className="font-sans antialiased">
        {customCode ? <div dangerouslySetInnerHTML={{ __html: customCode }} /> : null}
        <AnimatedGradientBg />
        <SmoothScroll />
        {children}
        <CookieBanner />
        <AgentationProvider />
      </body>
    </html>
  );
}
