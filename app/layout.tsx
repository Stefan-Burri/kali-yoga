import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";
import { AgentationProvider } from "@/components/AgentationProvider";
import AnimatedGradientBg from "@/components/AnimatedGradientBg";
import SmoothScroll from "@/components/SmoothScroll";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${fraunces.variable} ${workSans.variable}`}>
      <body className="font-sans antialiased">
        <AnimatedGradientBg />
        <SmoothScroll />
        {children}
        <AgentationProvider />
      </body>
    </html>
  );
}
