import Link from "next/link";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GlassCard } from "@/components/ui";

/* ─── Page ─── */

export default function Impressum() {
  return (
    <div className="min-h-screen">
      <StickyNavbar />

      {/* ─── Hero ─── */}
      <section className="pt-3 pb-[64px]">
        <HeroNavbar />
        <div className="flex flex-col items-center text-center px-6 pt-16 sm:pt-24 lg:pt-32 pb-8">
          <div className="max-w-[768px] mx-auto flex flex-col items-center">
            <h2 className="sm:hidden font-display text-h2 font-bold text-primary text-center mb-6">Impressum</h2>
            <h1 className="sr-only">Impressum</h1>
            <svg viewBox="-50 0 700 280" className="w-[600px] sm:w-[800px] lg:w-[1060px] h-auto hidden sm:block" role="img" aria-label="Impressum">
              <defs>
                <path id="curve-impressum" d="M 0,280 Q 300,-10 600,280" fill="none" />
              </defs>
              <text className="fill-primary font-display" style={{ fontSize: "54px", fontWeight: 700 }}>
                <textPath href="#curve-impressum" startOffset="50%" textAnchor="middle">
                  Impressum
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* ─── Content ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <GlassCard>
            <div className="max-w-[768px] mx-auto space-y-10 text-body text-foreground leading-[1.8]">

              {/* Kontakt */}
              <div>
                <h2 className="font-display text-h4 font-bold text-primary mb-4">Kontakt</h2>
                <p className="font-bold">Kali Yoga</p>
                <p>Karin Liechti</p>
                <p>Aarbergergasse 40</p>
                <p>3011 Bern</p>
                <p className="mt-3">
                  <a href="tel:+41762620562" className="hover:text-primary transition-colors">076 262 05 62</a>
                </p>
                <p>
                  <a href="mailto:info@kali-yoga.ch" className="hover:text-primary transition-colors">info@kali-yoga.ch</a>
                </p>
              </div>

              {/* Verantwortlich */}
              <div>
                <h2 className="font-display text-h4 font-bold text-primary mb-4">Verantwortlich für den Inhalt</h2>
                <p>Karin Liechti</p>
                <p>
                  <a href="mailto:info@kali-yoga.ch" className="hover:text-primary transition-colors">info@kali-yoga.ch</a>
                </p>
              </div>

              {/* Haftungsausschluss */}
              <div>
                <h2 className="font-display text-h4 font-bold text-primary mb-4">Haftungsausschluss</h2>
                <p>
                  Der Inhalt dieser Webseite wurde sorgfältig geprüft und wird regelmässig aktualisiert. Dennoch können wir keine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten Informationen übernehmen. Jegliche Haftung für Schäden, die direkt oder indirekt aus der Nutzung dieser Webseite entstehen, wird ausgeschlossen, sofern sie nicht auf Vorsatz oder grober Fahrlässigkeit beruhen.
                </p>
              </div>

              {/* Urheberrecht */}
              <div>
                <h2 className="font-display text-h4 font-bold text-primary mb-4">Urheberrecht</h2>
                <p>
                  Die Inhalte und Werke auf dieser Webseite unterliegen dem schweizerischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung ausserhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                </p>
              </div>

              {/* Datenschutz */}
              <div>
                <h2 className="font-display text-h4 font-bold text-primary mb-4">Datenschutz</h2>
                <p>
                  Informationen zum Umgang mit personenbezogenen Daten findest du in unserer{" "}
                  <Link href="/datenschutz" className="font-bold hover:text-primary transition-colors underline">
                    Datenschutzerklärung
                  </Link>.
                </p>
              </div>

            </div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}
