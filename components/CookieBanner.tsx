"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "kali-yoga-cookie-ok";

/* Dezenter Hinweis am unteren Rand; verschwindet nach der Bestätigung
   dauerhaft (localStorage). Sprache folgt dem /en-Pfad. */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname() ?? "/";
  const isEn = pathname === "/en" || pathname.startsWith("/en/");

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage gesperrt (z.B. Privatmodus) – Banner einfach zeigen
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // nicht speicherbar – Banner trotzdem für diese Sitzung schliessen
    }
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-[420px] z-[60]">
      <div
        className="rounded-[12px] backdrop-blur-md bg-background/95 border border-foreground/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-5 sm:p-6"
        style={{ backgroundImage: "url('/images/grain-texture.webp')" }}
        role="dialog"
        aria-label={isEn ? "Cookie notice" : "Cookie-Hinweis"}
      >
        <p className="text-small text-foreground leading-relaxed">
          {isEn ? (
            <>
              This website only uses technically necessary cookies – no tracking, no advertising. More in the{" "}
              <Link href="/datenschutz" className="text-primary underline underline-offset-2 hover:text-secondary transition-colors">
                privacy policy
              </Link>
              .
            </>
          ) : (
            <>
              Diese Website verwendet nur technisch notwendige Cookies – kein Tracking, keine Werbung. Mehr dazu in der{" "}
              <Link href="/datenschutz" className="text-primary underline underline-offset-2 hover:text-secondary transition-colors">
                Datenschutzerklärung
              </Link>
              .
            </>
          )}
        </p>
        <button
          onClick={accept}
          className="mt-4 inline-flex items-center px-5 py-2 text-small font-medium rounded-[6px] bg-primary text-primary-light hover:bg-secondary transition-colors cursor-pointer"
        >
          {isEn ? "Got it" : "Alles klar"}
        </button>
      </div>
    </div>
  );
}
