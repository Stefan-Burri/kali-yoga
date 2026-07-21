"use client";

import Lottie from "lottie-react";
import { useRef, useEffect } from "react";
import balanceAnimation from "@/public/images/balance.json";

export default function HeroLottie() {
  const lottieRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.2);
    }
  }, []);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={balanceAnimation}
      loop
      autoplay
      className="w-[250px] h-[250px] sm:w-[320px] sm:h-[320px] lg:w-[380px] lg:h-[380px]"
    />
  );
}
