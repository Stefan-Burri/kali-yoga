import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GlassCard } from "@/components/ui";

/* ─── Page ─── */

export default function Datenschutz() {
  return (
    <div className="min-h-screen">
      <StickyNavbar />

      {/* ─── Hero ─── */}
      <section className="pt-3 pb-[64px]">
        <HeroNavbar />
        <div className="flex flex-col items-center text-center px-6 pt-16 sm:pt-24 lg:pt-32 pb-8">
          <div className="max-w-[768px] mx-auto flex flex-col items-center">
            <h2 className="sm:hidden font-display text-h2 font-bold text-primary text-center mb-6">Datenschutz</h2>
            <h1 className="sr-only">Datenschutz</h1>
            <svg viewBox="-50 0 700 280" className="w-[600px] sm:w-[800px] lg:w-[1060px] h-auto hidden sm:block" role="img" aria-label="Datenschutz">
              <defs>
                <path id="curve-datenschutz" d="M 0,280 Q 300,-10 600,280" fill="none" />
              </defs>
              <text className="fill-primary font-display" style={{ fontSize: "54px", fontWeight: 700 }}>
                <textPath href="#curve-datenschutz" startOffset="50%" textAnchor="middle">
                  Datenschutz
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

              {/* 1 */}
              <div>
                <h2 className="font-display text-h4 font-bold text-primary mb-4">1. Datenschutzerklärung</h2>
                <p>
                  Diese Datenschutzerklärung informiert dich über die Art, den Umfang und den Zweck der Erhebung und Verwendung deiner personenbezogenen Daten auf unserer Website www.kali-yoga.ch (nachfolgend &laquo;Website&raquo;) durch die Firma &laquo;Kali Yoga&raquo; (nachfolgend &laquo;wir&raquo; oder &laquo;uns&raquo;) und klärt dich über deine Rechte gemäss den geltenden Datenschutzgesetzen auf.
                </p>
              </div>

              {/* 2 */}
              <div>
                <h2 className="font-display text-h4 font-bold text-primary mb-4">2. Verantwortliche Person für die Datenverarbeitung</h2>
                <p>Kali Yoga</p>
                <p>Karin Liechti</p>
                <p>Aarbergergasse 40</p>
                <p>3011 Bern</p>
              </div>

              {/* 3 */}
              <div>
                <h2 className="font-display text-h4 font-bold text-primary mb-4">3. Datenerfassung auf dieser Website</h2>

                <h3 className="font-display text-body-lg font-bold text-primary mt-6 mb-3">3.1 Logfiles</h3>
                <p className="mb-3">
                  Bei jedem Zugriff auf unsere Website werden automatisch technische Daten erfasst und in sogenannten Logfiles gespeichert. Folgende Daten werden erhoben:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>IP-Adresse und Betriebssystem deines Geräts</li>
                  <li>Browsertyp, Version, Sprache</li>
                  <li>Datum und Uhrzeit der Serveranfrage</li>
                  <li>Aufgerufene Datei</li>
                  <li>Referrer URL</li>
                  <li>Status-Code (z.B. 404)</li>
                  <li>Verwendetes Übertragungsprotokoll (z.B. HTTP/2)</li>
                </ul>

                <h3 className="font-display text-body-lg font-bold text-primary mt-6 mb-3">3.2 Kontaktformular</h3>
                <p>
                  Wenn du uns über das Kontaktformular kontaktierst, werden folgende Daten erhoben: Name, Firma, E-Mail, Adresse, Telefon, Betreff und Nachrichteninhalt. Diese Daten werden ausschliesslich zur Bearbeitung deiner Anfrage verwendet.
                </p>

                <h3 className="font-display text-body-lg font-bold text-primary mt-6 mb-3">3.3 Cookies</h3>
                <p>
                  Unsere Website kann Cookies verwenden, um die Nutzererfahrung zu verbessern. Du kannst die Verwendung von Cookies in deinen Browsereinstellungen einschränken oder deaktivieren.
                </p>

                <h3 className="font-display text-body-lg font-bold text-primary mt-6 mb-3">3.4 Newsletter</h3>
                <p>
                  Wenn du dich für unseren Newsletter anmeldest, werden deine E-Mail-Adresse und ggf. dein Name gespeichert, um dir regelmässig Informationen zuzusenden. Du kannst den Newsletter jederzeit abbestellen.
                </p>

                <h3 className="font-display text-body-lg font-bold text-primary mt-6 mb-3">3.5 Newsletter-Analytics</h3>
                <p>
                  Unser Newsletter kann Tracking-Technologien enthalten, um die Öffnungsrate und Klickrate zu messen. Diese Daten werden anonym erhoben und dienen der Verbesserung unserer Kommunikation.
                </p>

                <h3 className="font-display text-body-lg font-bold text-primary mt-6 mb-3">3.6 Registrierung</h3>
                <p>
                  Bei einer Registrierung werden folgende Daten erhoben: Name, Firma, E-Mail, Adresse, Telefon. Diese Daten werden zur Bereitstellung des jeweiligen Dienstes verwendet.
                </p>
              </div>

              {/* 4 */}
              <div>
                <h2 className="font-display text-h4 font-bold text-primary mb-4">4. Externe Dienste</h2>
                <p>Zur Zeit nutzen wir keine Dienste von externen Anbietern.</p>
              </div>

              {/* 5 */}
              <div>
                <h2 className="font-display text-h4 font-bold text-primary mb-4">5. Links</h2>
                <p>
                  Unsere Website kann Links zu externen Websites enthalten. Wir haben keinen Einfluss auf den Inhalt und die Datenschutzpraktiken dieser Websites und übernehmen keine Verantwortung dafür. Bitte informiere dich direkt auf den verlinkten Websites über deren Datenschutzpraktiken.
                </p>
              </div>

              {/* 6 */}
              <div>
                <h2 className="font-display text-h4 font-bold text-primary mb-4">6. Weitergabe von Daten an Dritte</h2>
                <p>
                  Wir geben deine personenbezogenen Daten nicht ohne deine ausdrückliche Zustimmung an Dritte weiter, es sei denn, wir sind gesetzlich dazu verpflichtet.
                </p>
              </div>

              {/* 7 */}
              <div>
                <h2 className="font-display text-h4 font-bold text-primary mb-4">7. Deine Rechte</h2>
                <p>
                  Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch gegen die Verarbeitung deiner personenbezogenen Daten. Wenn du von diesen Rechten Gebrauch machen möchtest, wende dich bitte an uns.
                </p>
              </div>

              {/* 8 */}
              <div>
                <h2 className="font-display text-h4 font-bold text-primary mb-4">8. Aktualität und Änderung dieser Datenschutzerklärung</h2>
                <p>
                  Wir behalten uns das Recht vor, diese Datenschutzerklärung jederzeit zu ändern. Die aktuelle Version ist auf unserer Website verfügbar. Bitte informiere dich regelmässig über den Inhalt unserer Datenschutzerklärung.
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
