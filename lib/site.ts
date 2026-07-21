/* Öffentliche Basis-URL der Website. Beim Go-Live auf die echte Domain
   umstellen: auf Vercel die Umgebungsvariable NEXT_PUBLIC_SITE_URL setzen
   (z.B. https://www.kali-yoga.ch) — Fallback ist die Vercel-Adresse. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kali-yoga.vercel.app";
