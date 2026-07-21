import Link from "next/link";
import Image from "next/image";
import { primaryBtnClass } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center text-center px-6">
      <Link href="/">
        <Image src="/images/logo-v2.svg" alt="Kali Yoga" width={180} height={24} className="h-[22px] w-auto" />
      </Link>
      <h1 className="mt-10 font-display text-h1 font-bold text-primary text-balance">Seite nicht gefunden</h1>
      <p className="mt-5 text-body-lg text-foreground max-w-[480px] leading-relaxed">
        Diese Seite gibt es nicht oder nicht mehr. Vielleicht hilft dir die Startseite weiter.
      </p>
      <p className="mt-2 text-small text-foreground/60">This page could not be found.</p>
      <Link href="/" className={`mt-8 ${primaryBtnClass} self-center`}>
        Zur Startseite
      </Link>
    </div>
  );
}
