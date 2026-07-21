"use client";

import { useEffect, useRef } from "react";
import { CONSENT_KEY, CONSENT_EVENT } from "@/components/CookieBanner";

/* Fügt den CMS-Custom-Code (z.B. Google Tag Manager) erst ein, nachdem die
   Besucherin im Cookie-Banner «Einverstanden» gewählt hat. <script>-Tags aus
   innerHTML werden vom Browser nicht ausgeführt – sie werden deshalb einzeln
   als frische Skript-Elemente nachgebaut. */
export default function CustomCode({ html }: { html: string }) {
  const injected = useRef(false);

  useEffect(() => {
    const inject = () => {
      if (injected.current) return;
      let consent: string | null = null;
      try {
        consent = localStorage.getItem(CONSENT_KEY);
      } catch {
        return;
      }
      if (consent !== "all") return;
      injected.current = true;

      const container = document.createElement("div");
      container.setAttribute("data-custom-code", "");
      const template = document.createElement("template");
      template.innerHTML = html;

      template.content.childNodes.forEach((node) => {
        if (node.nodeName === "SCRIPT") {
          const old = node as HTMLScriptElement;
          const script = document.createElement("script");
          for (const attr of Array.from(old.attributes)) {
            script.setAttribute(attr.name, attr.value);
          }
          script.text = old.text;
          container.appendChild(script);
        } else {
          container.appendChild(node.cloneNode(true));
        }
      });

      document.body.appendChild(container);
    };

    inject();
    window.addEventListener(CONSENT_EVENT, inject);
    return () => window.removeEventListener(CONSENT_EVENT, inject);
  }, [html]);

  return null;
}
