"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* Ohne Tracking: reiner Hinweis («Alles klar»).
   Mit Tracking (Custom Code im CMS hinterlegt): echte Einwilligung –
   «Einverstanden» lädt die Tracking-Skripte, «Nur notwendige» nicht. */

const NOTICE_KEY = "kali-yoga-cookie-ok";
export const CONSENT_KEY = "kali-yoga-consent";
export const CONSENT_EVENT = "kali-yoga-consent-changed";

export default function CookieBanner({ tracking = false }: { tracking?: boolean }) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname() ?? "/";
  const isEn = pathname === "/en" || pathname.startsWith("/en/");

  useEffect(() => {
    try {
      if (tracking) {
        // Einwilligung nötig – der alte «Alles klar»-Klick zählt nicht als Zustimmung.
        if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
      } else {
        if (!localStorage.getItem(NOTICE_KEY)) setVisible(true);
      }
    } catch {
      // localStorage gesperrt (z.B. Privatmodus) – Banner einfach zeigen
      setVisible(true);
    }
  }, [tracking]);

  if (!visible) return null;

  const store = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // nicht speicherbar – Banner trotzdem für diese Sitzung schliessen
    }
  };

  const acceptNotice = () => {
    store(NOTICE_KEY, "1");
    setVisible(false);
  };

  const consent = (value: "all" | "necessary") => {
    store(CONSENT_KEY, value);
    setVisible(false);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  const privacyLink = (
    <Link href={isEn ? "/en/privacy-policy" : "/datenschutz"} className="text-primary underline underline-offset-2 hover:text-secondary transition-colors">
      {isEn ? "privacy policy" : "Datenschutzerklärung"}
    </Link>
  );

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-[420px] z-[60]">
      <div
        className="rounded-[12px] backdrop-blur-md bg-background/95 border border-foreground/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-5 sm:p-6"
        style={{ backgroundImage: "url('/images/grain-texture.webp')" }}
        role="dialog"
        aria-label={isEn ? "Cookie notice" : "Cookie-Hinweis"}
      >
        <p className="text-small text-foreground leading-relaxed">
          {tracking ? (
            isEn ? (
              <>
                This website uses technically necessary cookies and – only with your consent – cookies for statistics and
                marketing (e.g. Google). More in the {privacyLink}.
              </>
            ) : (
              <>
                Diese Website verwendet technisch notwendige Cookies sowie – nur mit deiner Einwilligung – Cookies für
                Statistik und Marketing (z.B. Google). Mehr dazu in der {privacyLink}.
              </>
            )
          ) : isEn ? (
            <>This website only uses technically necessary cookies – no tracking, no advertising. More in the {privacyLink}.</>
          ) : (
            <>
              Diese Website verwendet nur technisch notwendige Cookies – kein Tracking, keine Werbung. Mehr dazu in der{" "}
              {privacyLink}.
            </>
          )}
        </p>
        {tracking ? (
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => consent("all")}
              className="inline-flex items-center px-5 py-2 text-small font-medium rounded-[6px] bg-primary text-primary-light hover:bg-secondary transition-colors cursor-pointer"
            >
              {isEn ? "Accept" : "Einverstanden"}
            </button>
            <button
              onClick={() => consent("necessary")}
              className="inline-flex items-center px-5 py-2 text-small font-medium rounded-[6px] border-2 border-primary text-primary hover:border-secondary hover:text-secondary transition-colors cursor-pointer"
            >
              {isEn ? "Necessary only" : "Nur notwendige"}
            </button>
          </div>
        ) : (
          <button
            onClick={acceptNotice}
            className="mt-4 inline-flex items-center px-5 py-2 text-small font-medium rounded-[6px] bg-primary text-primary-light hover:bg-secondary transition-colors cursor-pointer"
          >
            {isEn ? "Got it" : "Alles klar"}
          </button>
        )}
      </div>
    </div>
  );
}
