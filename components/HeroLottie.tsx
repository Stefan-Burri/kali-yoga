"use client";

import { useEffect, useRef, useState } from "react";
import type { LottieRefCurrentProps } from "lottie-react";
import type { ComponentType } from "react";

/* Gleiche Grösse für Platzhalter und Animation – kein Layout-Springen. */
const SIZE_CLASS = "w-[250px] h-[250px] sm:w-[320px] sm:h-[320px] lg:w-[380px] lg:h-[380px]";

type LottieModule = {
  Lottie: ComponentType<{
    lottieRef: React.Ref<LottieRefCurrentProps>;
    animationData: unknown;
    loop: boolean;
    autoplay: boolean;
    className: string;
  }>;
  data: unknown;
};

/* Die Lottie-Bibliothek (~100 KB) und die Animationsdaten werden erst NACH dem
   ersten Seitenaufbau geladen (requestIdleCallback). So blockieren sie weder
   das grösste Element (LCP) noch den Haupt-Thread beim Start – Kernpunkt der
   PageSpeed-Optimierung der Startseite. */
export default function HeroLottie({ src }: { src?: string | null } = {}) {
  const [mod, setMod] = useState<LottieModule | null>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    let cancelled = false;

    /* `src` = eine im Studio hochgeladene Lottie-JSON-Datei (Sanity-CDN);
       ohne src die eingebaute Balance-Animation. */
    const animationData = src
      ? fetch(src).then((r) => r.json())
      : import("@/public/images/balance.json").then((m) => m.default);

    const load = () => {
      Promise.all([import("lottie-react"), animationData]).then(([lottie, animation]) => {
        if (!cancelled) setMod({ Lottie: lottie.default as LottieModule["Lottie"], data: animation });
      });
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(load, { timeout: 2000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback?.(id);
      };
    }
    const timer = setTimeout(load, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [src]);

  useEffect(() => {
    lottieRef.current?.setSpeed(0.2);
  }, [mod]);

  if (!mod) return <div className={SIZE_CLASS} aria-hidden="true" />;

  const { Lottie, data } = mod;
  return <Lottie lottieRef={lottieRef} animationData={data} loop autoplay className={SIZE_CLASS} />;
}
