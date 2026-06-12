import Link from "next/link";
import Image from "next/image";
import { GoldLine, GlassCard, SectionHeading, secondaryBtnClass, primaryBtnClass, ChevronRight, imageShadow } from "@/components/ui";

/* ─── Color Swatch ─── */
function Swatch({ name, variable, hex, className }: { name: string; variable: string; hex: string; className: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-20 h-20 rounded-[12px] border border-foreground/10 ${className}`} />
      <p className="text-small font-bold text-foreground">{name}</p>
      <p className="text-small text-foreground/60 font-mono">{hex}</p>
      <p className="text-small text-foreground/40 font-mono">{variable}</p>
    </div>
  );
}

/* ─── Section Wrapper ─── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-12 border-b border-foreground/10">
      <h2 className="font-display text-h4 font-bold text-primary mb-8">{title}</h2>
      {children}
    </section>
  );
}

/* ─── Navbar CTA (matches Navbar.tsx) ─── */
const ctaBtnClass = "inline-flex items-center px-6 py-2 text-small font-medium rounded-[6px] bg-primary text-primary-light border-2 border-primary hover:bg-secondary hover:border-secondary transition-colors";

export default function Styleguide() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1280px] px-6 py-16">

        {/* Header */}
        <div className="mb-16">
          <Link href="/" className="text-small text-primary hover:text-secondary transition-colors mb-4 inline-block">&larr; Zurück zur Startseite</Link>
          <h1 className="font-display text-h2 font-bold text-primary">Design System</h1>
          <p className="mt-2 text-h6 text-foreground">Kali Yoga — Styleguide &amp; Komponentenbibliothek</p>
          <GoldLine centered={false} />
          <Link href="/components" className="text-small text-primary hover:text-secondary transition-colors mt-2 inline-block">Komponenten-Showcase &rarr;</Link>
        </div>

        {/* ═══════════════════════════════════════════
            1. DESIGN TOKENS
        ═══════════════════════════════════════════ */}

        {/* ─── Colors ─── */}
        <Section title="1. Farben">
          <h3 className="font-display text-body-lg font-bold mb-4">Primärfarben</h3>
          <div className="flex flex-wrap gap-8 mb-10">
            <Swatch name="Primary" variable="--primary" hex="#715A76" className="bg-primary" />
            <Swatch name="Secondary" variable="--secondary" hex="#C47AC0" className="bg-secondary" />
            <Swatch name="Gold" variable="--gold" hex="#D19C1D" className="bg-gold" />
          </div>

          <h3 className="font-display text-body-lg font-bold mb-4">Hintergrund &amp; Text</h3>
          <div className="flex flex-wrap gap-8 mb-10">
            <Swatch name="Background" variable="--background" hex="#F6F2ED" className="bg-background" />
            <Swatch name="Foreground" variable="--foreground" hex="#1A1A1F" className="bg-foreground" />
            <Swatch name="Primary Light" variable="--primary-light" hex="#F6F2ED" className="bg-primary-light border-2 border-foreground/20" />
          </div>

          <h3 className="font-display text-body-lg font-bold mb-4">Akzentfarben</h3>
          <div className="flex flex-wrap gap-8">
            <Swatch name="Gold Light" variable="--gold-light" hex="#F0E6C8" className="bg-gold-light" />
            <Swatch name="Section BG" variable="--section-bg" hex="#EFEBE6" className="bg-section-bg" />
          </div>
        </Section>

        {/* ─── Typography ─── */}
        <Section title="2. Typografie">
          <div className="space-y-8">
            <div>
              <p className="text-small text-foreground/40 uppercase tracking-wider mb-2">Display / Hero Curved — Fraunces Bold, SVG textPath</p>
              <svg viewBox="-50 0 700 280" className="w-[600px] h-auto" aria-label="Beispiel">
                <defs><path id="curve-sg" d="M 0,280 Q 300,-10 600,280" fill="none" /></defs>
                <text className="fill-primary font-display" style={{ fontSize: "54px", fontWeight: 700 }}>
                  <textPath href="#curve-sg" startOffset="50%" textAnchor="middle">Yogaklassen</textPath>
                </text>
              </svg>
              <p className="text-small text-foreground/40 mt-2">Responsive: w-[600px] / sm:w-[800px] / lg:w-[1060px]</p>
            </div>
            <div>
              <p className="text-small text-foreground/40 uppercase tracking-wider mb-2">H1 Gerade — Fraunces Bold, responsive 36/52/72px</p>
              <h1 className="font-display text-h1 font-bold text-primary max-w-[640px] text-balance">Stundenplan Yogaklassen Bern</h1>
              <p className="text-small text-foreground/40 mt-2">max-w-[640px] text-balance</p>
            </div>
            <div>
              <p className="text-small text-foreground/40 uppercase tracking-wider mb-2">H2 — Section Heading — Fraunces Bold, 32/42px</p>
              <h2 className="font-display text-h2 font-bold text-primary">Harmonie für Körper, Atem und Geist</h2>
            </div>
            <div>
              <p className="text-small text-foreground/40 uppercase tracking-wider mb-2">H2 — Content Heading — Fraunces Bold, 28/36px</p>
              <h2 className="font-display text-h3 font-bold text-primary">Karin Liechti</h2>
            </div>
            <div>
              <p className="text-small text-foreground/40 uppercase tracking-wider mb-2">H3 — Card/Feature Heading — Fraunces Bold, 18-20px</p>
              <h3 className="font-display text-body-lg font-bold text-primary">Entspannung</h3>
            </div>
            <div>
              <p className="text-small text-foreground/40 uppercase tracking-wider mb-2">Body — Work Sans, 16/18px (Hero Beschreibung)</p>
              <p className="text-h6 text-foreground max-w-[768px] leading-relaxed">
                Durch Bewegung, Atmung, Entspannung und Raum für individuelle Exploration den Körper bewusst wahrnehmen.
              </p>
            </div>
            <div>
              <p className="text-small text-foreground/40 uppercase tracking-wider mb-2">Body Small — Work Sans, 14px (Fliesstext)</p>
              <p className="text-body text-foreground leading-[1.8] max-w-[768px]">
                Das Yoga Studio mit schönem Eichenparkett wird von einer langen Fensterfront lichtdurchflutet, hat viel frische Luft und kaum Lärm.
              </p>
            </div>
            <div>
              <p className="text-small text-foreground/40 uppercase tracking-wider mb-2">Caption / Label — Work Sans, 12-13px</p>
              <p className="text-small text-foreground/60 uppercase tracking-wider">Kursdauer</p>
              <p className="text-small text-foreground/60 mt-1">– Aadil Palkhivala –</p>
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            2. KOMPONENTEN
        ═══════════════════════════════════════════ */}

        {/* ─── Buttons ─── */}
        <Section title="3. Buttons">
          <div className="space-y-8">
            <div>
              <p className="text-small text-foreground/40 uppercase tracking-wider mb-3">Primary Button — primaryBtnClass</p>
              <div className="flex flex-wrap gap-4">
                <button className={primaryBtnClass}>Anmeldung</button>
                <button className={primaryBtnClass}>Anmelden</button>
              </div>
              <p className="text-small text-foreground/40 mt-2 font-mono">bg-primary text-primary-light rounded-[6px] hover:bg-secondary</p>
            </div>
            <div>
              <p className="text-small text-foreground/40 uppercase tracking-wider mb-3">Secondary Button — secondaryBtnClass</p>
              <div className="flex flex-wrap gap-4">
                <button className={secondaryBtnClass}>Mehr Erfahren <ChevronRight /></button>
                <button className={secondaryBtnClass}>Studio mieten <ChevronRight /></button>
                <button className={secondaryBtnClass}>Kontakt</button>
              </div>
              <p className="text-small text-foreground/40 mt-2 font-mono">border-2 border-primary text-primary rounded-[6px] hover:border-secondary hover:text-secondary</p>
            </div>
            <div>
              <p className="text-small text-foreground/40 uppercase tracking-wider mb-3">Navbar CTA — ctaBtnClass</p>
              <button className={ctaBtnClass}>Anmelden</button>
              <p className="text-small text-foreground/40 mt-2 font-mono">bg-primary text-primary-light border-2 border-primary hover:bg-secondary hover:border-secondary</p>
            </div>
          </div>
        </Section>

        {/* ─── Decorative Elements ─── */}
        <Section title="4. Dekorative Elemente">
          <div className="space-y-10">
            <div>
              <p className="text-small text-foreground/40 uppercase tracking-wider mb-3">Gold Line — Trennlinie (zentriert / linksbündig)</p>
              <div className="flex gap-12 items-start">
                <div>
                  <GoldLine />
                  <p className="text-small text-foreground/40 mt-2">centered (default)</p>
                </div>
                <div>
                  <GoldLine centered={false} />
                  <p className="text-small text-foreground/40 mt-2">centered=false</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-small text-foreground/40 uppercase tracking-wider mb-3">Quote Rays — Strahlengrafik</p>
              <div className="flex gap-8 items-center">
                <Image src="/images/quote-rays.svg" alt="Strahlen oben" width={280} height={80} className="w-[200px] h-auto" />
                <Image src="/images/quote-rays.svg" alt="Strahlen unten" width={280} height={80} className="w-[200px] h-auto rotate-180" />
              </div>
            </div>
            <div>
              <p className="text-small text-foreground/40 uppercase tracking-wider mb-3">Testimonial Quote Icon</p>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor" className="text-gold">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z"/>
              </svg>
            </div>
            <div>
              <p className="text-small text-foreground/40 uppercase tracking-wider mb-3">Gold Checkmark — Bedingungen / Features</p>
              <svg className="w-10 h-10 text-gold" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </Section>

        {/* ─── Icons ─── */}
        <Section title="5. Icons">
          <h3 className="font-display text-body-lg font-bold mb-4">Service Icons (Homepage)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
            {[
              { src: "/images/icon-yogaklassen.svg", label: "Yogaklassen" },
              { src: "/images/icon-therapie.svg", label: "Therapie" },
              { src: "/images/icon-kleingruppen.svg", label: "Kleingruppen" },
              { src: "/images/icon-gruppen.svg", label: "Für Gruppen" },
            ].map((icon) => (
              <div key={icon.label} className="text-center">
                <Image src={icon.src} alt={icon.label} width={120} height={120} className="w-[100px] h-[100px] mx-auto" />
                <p className="mt-3 text-small text-foreground/60">{icon.label}</p>
              </div>
            ))}
          </div>

          <h3 className="font-display text-body-lg font-bold mb-4">Feature Icons (Yogaklassen) — Gold #D19C1D, 80/100px</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
            {[
              { src: "/images/icon-entspannung.svg", label: "Entspannung" },
              { src: "/images/icon-funktionalitaet.svg", label: "Funktionalität" },
              { src: "/images/icon-exploration.svg", label: "Exploration" },
              { src: "/images/icon-bewusstsein.svg", label: "Bewusstsein" },
              { src: "/images/icon-empowerment.svg", label: "Empowerment" },
              { src: "/images/icon-akzeptanz.svg", label: "Akzeptanz" },
            ].map((icon) => (
              <div key={icon.label} className="text-center">
                <Image src={icon.src} alt={icon.label} width={100} height={100} className="w-[80px] h-[80px] mx-auto" />
                <p className="mt-3 text-small text-foreground/60">{icon.label}</p>
              </div>
            ))}
          </div>

          <h3 className="font-display text-body-lg font-bold mb-4">Hero Icons — Gold, h-[240px] / sm:h-[320px]</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
            {[
              { src: "/images/yoga-pose-028.svg", label: "Yogaklassen" },
              { src: "/images/stones.svg", label: "Yogatherapie" },
              { src: "/images/icon-kleingruppen.svg", label: "Kleingruppen" },
              { src: "/images/ginkoblatt.svg", label: "Gelenkschmerzen" },
            ].map((icon) => (
              <div key={icon.label} className="text-center">
                <Image src={icon.src} alt={icon.label} width={120} height={120} className="h-[100px] w-auto mx-auto" />
                <p className="mt-3 text-small text-foreground/60">{icon.label}</p>
              </div>
            ))}
          </div>

          <h3 className="font-display text-body-lg font-bold mb-4">Medizinische Icons (Yogatherapie) — Gold Stroke, 80/100px</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { src: "/images/icon-muskel-skelett.svg", label: "Muskel-Skelett" },
              { src: "/images/icon-nervensystem.svg", label: "Nervensystem" },
              { src: "/images/icon-verdauung.svg", label: "Verdauung" },
              { src: "/images/icon-atmung.svg", label: "Atmung" },
              { src: "/images/icon-herz-kreislauf.svg", label: "Herz-Kreislauf" },
              { src: "/images/icon-immun-hormon.svg", label: "Immun/Hormon" },
            ].map((icon) => (
              <div key={icon.label} className="text-center">
                <Image src={icon.src} alt={icon.label} width={100} height={100} className="w-[80px] h-[80px] mx-auto" />
                <p className="mt-3 text-small text-foreground/60">{icon.label}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            3. KARTEN & CONTAINER
        ═══════════════════════════════════════════ */}

        <Section title="6. Karten &amp; Container">
          <div className="space-y-10">
            <div>
              <p className="text-small text-foreground/40 uppercase tracking-wider mb-3">GlassCard — Glasmorphism Container</p>
              <GlassCard>
                <p className="text-foreground text-body">Alternierend mit transparenten Sektionen. Verwendet für: Features, Stundenplan, Preise, Feedbacks, Kursdetails.</p>
              </GlassCard>
            </div>

            <div>
              <p className="text-small text-foreground/40 uppercase tracking-wider mb-3">SectionHeading — Titel + GoldLine + optionale Beschreibung</p>
              <div className="rounded-[16px] border border-foreground/10 p-8">
                <SectionHeading title="Beispiel Überschrift" description="Beschreibungstext der Sektion, max-w-[768px] und zentriert." />
              </div>
            </div>

            <div>
              <p className="text-small text-foreground/40 uppercase tracking-wider mb-3">Border Card — border-2 border-primary rounded-[16px]</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[800px]">
                <div className="rounded-[16px] border-2 border-primary p-7 text-center">
                  <h3 className="font-display text-body-lg font-bold text-primary mb-3">Kursinhalt</h3>
                  <p className="text-body text-foreground leading-relaxed">Beschreibung des Inhalts.</p>
                </div>
                <div className="rounded-[16px] border-2 border-primary p-7">
                  <p className="text-small text-foreground/60 uppercase tracking-wider mb-2">Label</p>
                  <p className="text-h6 font-bold text-foreground">Wert</p>
                </div>
                <div className="rounded-[16px] border-2 border-primary p-6 text-center">
                  <p className="text-body text-foreground">Freitag</p>
                  <p className="text-body-lg font-bold text-primary mt-1">30.01.2026</p>
                  <p className="text-body text-foreground mt-1">08:30–10:00</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-small text-foreground/40 uppercase tracking-wider mb-3">Pricing Card — mit optionalem Gold Badge</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[500px]">
                <div className="rounded-[16px] bg-white/60 backdrop-blur-sm border border-foreground/10 flex flex-col overflow-hidden">
                  <div className="py-2 text-body invisible" aria-hidden="true">&nbsp;</div>
                  <div className="p-7 flex flex-col flex-1">
                    <div className="text-center">
                      <h3 className="font-display text-h5 font-bold text-primary mb-4">Einzelklasse</h3>
                      <p className="text-primary leading-none">
                        <span className="text-body font-semibold">CHF </span>
                        <span className="text-h2 font-bold">32.–</span>
                      </p>
                      <p className="text-body text-foreground/60 mt-2">CHF 27.–*</p>
                    </div>
                    <div className="mt-auto pt-6 flex flex-col items-center">
                      <p className="text-body text-foreground flex items-center gap-2">
                        <svg className="w-4 h-4 text-gold" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        1 Lektion
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[16px] bg-white/60 backdrop-blur-sm border border-foreground/10 flex flex-col overflow-hidden">
                  <div className="bg-gold text-white text-body font-bold text-center py-2">Spare CHF 10.–</div>
                  <div className="p-7 flex flex-col flex-1">
                    <div className="text-center">
                      <h3 className="font-display text-h5 font-bold text-primary mb-4">5er Abo</h3>
                      <p className="text-primary leading-none">
                        <span className="text-body font-semibold">CHF </span>
                        <span className="text-h2 font-bold">150.–</span>
                      </p>
                      <p className="text-body text-foreground/60 mt-2">CHF 135.–*</p>
                    </div>
                    <div className="mt-auto pt-6 flex flex-col items-center space-y-1">
                      <p className="text-body text-foreground flex items-center gap-2">
                        <svg className="w-4 h-4 text-gold" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        5 Lektionen
                      </p>
                      <p className="text-body text-foreground flex items-center gap-2">
                        <svg className="w-4 h-4 text-gold" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Gültig 6 Monate
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-small text-foreground/40 uppercase tracking-wider mb-3">Image Card — 3:2 Ratio mit Schatten</p>
              <div className="max-w-[400px]">
                <div className="rounded-[12px] overflow-hidden relative" style={{ boxShadow: imageShadow }}>
                  <div className="aspect-[3/2]" />
                  <Image src="/images/studio.png" alt="Studio" width={400} height={267} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            4. LAYOUT & SPACING
        ═══════════════════════════════════════════ */}

        <Section title="7. Abstände &amp; Layout-Tokens">
          <div className="space-y-4 text-body">
            <div className="flex items-center gap-4">
              <div className="w-[64px] h-4 bg-primary/20 rounded" />
              <span className="text-foreground"><strong>py-section</strong> — Sektionsabstand (128px total)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-[32px] h-4 bg-primary/20 rounded" />
              <span className="text-foreground"><strong>p-8 / sm:p-12 / lg:p-16</strong> — GlassCard Padding (responsive)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-[24px] h-4 bg-primary/20 rounded" />
              <span className="text-foreground"><strong>max-w-[1280px]</strong> — Maximale Seitenbreite</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-[20px] h-4 bg-gold/30 rounded" />
              <span className="text-foreground"><strong>max-w-[768px]</strong> — Text-Container (optimale Lesebreite)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-[16px] h-4 bg-gold/30 rounded" />
              <span className="text-foreground"><strong>max-w-[640px]</strong> — H1 gerade Titel (mit text-balance)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-[14px] h-4 bg-primary/20 rounded" />
              <span className="text-foreground"><strong>rounded-[16px]</strong> — Karten / Container</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-[10px] h-4 bg-primary/20 rounded" />
              <span className="text-foreground"><strong>rounded-[6px]</strong> — Buttons / Inputs</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-[8px] h-4 bg-primary/20 rounded" />
              <span className="text-foreground"><strong>gap-6 bis gap-10</strong> — Grid-Abstände</span>
            </div>
          </div>
        </Section>

        {/* ─── Layout Patterns ─── */}
        <Section title="8. Layout-Patterns">
          <div className="space-y-6 text-body text-foreground">
            <h3 className="font-display text-body-lg font-bold">Hero-Varianten</h3>
            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-gold mt-1 shrink-0" />
              <div><strong>Curved + Icon (100dvh):</strong> SVG textPath Titel + Hero-Icon darunter, vertikal zentriert. Seiten: Homepage, Yogaklassen, Yogatherapie, Über mich.</div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-gold mt-1 shrink-0" />
              <div><strong>Gerade + Icon (100dvh):</strong> H1 text-balance + Icon darunter, vertikal zentriert. Seiten: Kleingruppen, Gelenkschmerzen.</div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-gold mt-1 shrink-0" />
              <div><strong>Gerade ohne Icon:</strong> Nur H1 Titel, nicht 100dvh. Seiten: Stundenplan, Kontakt, Datenschutz, Impressum.</div>
            </div>

            <h3 className="font-display text-body-lg font-bold mt-8">Seitenstruktur</h3>
            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-gold mt-1 shrink-0" />
              <div><strong>Alternierend:</strong> GlassCard und transparente Sektionen wechseln sich konsequent ab.</div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-gold mt-1 shrink-0" />
              <div><strong>2-Spalten:</strong> Bild (3:2) + Text, items-stretch, für Personen- und Studio-Sektionen.</div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-gold mt-1 shrink-0" />
              <div><strong>Grids:</strong> 1 → 2 → 3 Spalten (Features, Bedingungen), 1 → 2 → 4 Spalten (Stundenplan, Preise), 1 → 2 → 5 Spalten (Termine).</div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-gold mt-1 shrink-0" />
              <div><strong>Navbar:</strong> HeroNavbar (oben sichtbar) + StickyNavbar (erscheint nach 50vh Scroll mit 700ms Fade).</div>
            </div>
          </div>
        </Section>

        {/* ─── Background Animation ─── */}
        <Section title="9. Hintergrund-Animation">
          <div className="space-y-4 text-body text-foreground">
            <p>6 Blobs mit <strong>blur(80px)</strong>, je mit eigenem Drift-Keyframe (16–24s Zyklen).</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { color: "rgb(160, 200, 240)", label: "Hellblau" },
                { color: "rgb(235, 215, 190)", label: "Beige" },
                { color: "rgb(240, 190, 155)", label: "Peach" },
                { color: "rgb(220, 185, 235)", label: "Lavender" },
                { color: "rgb(196, 140, 230)", label: "Purple" },
                { color: "rgb(180, 210, 240)", label: "Blau" },
              ].map((blob) => (
                <div key={blob.label} className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto" style={{ background: blob.color }} />
                  <p className="mt-2 text-small text-foreground/60">{blob.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            5. REFERENZ
        ═══════════════════════════════════════════ */}

        <Section title="10. Seitenübersicht">
          <div className="space-y-2 text-body text-foreground">
            <p className="font-bold text-primary mb-3">Hauptseiten (mit Hero)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
              <p><code className="text-small font-mono bg-foreground/5 px-1.5 py-0.5 rounded">/</code> Homepage — Curved + Lottie</p>
              <p><code className="text-small font-mono bg-foreground/5 px-1.5 py-0.5 rounded">/yoga-klassen-bern</code> Yogaklassen — Curved + Icon</p>
              <p><code className="text-small font-mono bg-foreground/5 px-1.5 py-0.5 rounded">/yogatherapie-bern</code> Yogatherapie — Curved + Icon</p>
              <p><code className="text-small font-mono bg-foreground/5 px-1.5 py-0.5 rounded">/kleingruppen</code> Burnout — Gerade + Icon</p>
              <p><code className="text-small font-mono bg-foreground/5 px-1.5 py-0.5 rounded">/kleingruppen-arthritis</code> Gelenke — Gerade + Icon</p>
              <p><code className="text-small font-mono bg-foreground/5 px-1.5 py-0.5 rounded">/uber-mich</code> Über mich — Curved + Foto</p>
              <p><code className="text-small font-mono bg-foreground/5 px-1.5 py-0.5 rounded">/stundenplan</code> Stundenplan — Gerade, kein Icon</p>
              <p><code className="text-small font-mono bg-foreground/5 px-1.5 py-0.5 rounded">/kontakt</code> Kontakt — Gerade, kein Icon</p>
              <p><code className="text-small font-mono bg-foreground/5 px-1.5 py-0.5 rounded">/datenschutz</code> Datenschutz — Gerade, kein Icon</p>
              <p><code className="text-small font-mono bg-foreground/5 px-1.5 py-0.5 rounded">/impressum</code> Impressum — Gerade, kein Icon</p>
            </div>
            <p className="font-bold text-primary mt-6 mb-3">Anmeldeseiten (mit Navbar + Formular)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
              <p><code className="text-small font-mono bg-foreground/5 px-1.5 py-0.5 rounded">/anmeldung-yoga-klasse</code></p>
              <p><code className="text-small font-mono bg-foreground/5 px-1.5 py-0.5 rounded">/anmeldung-yogatherapie</code></p>
              <p><code className="text-small font-mono bg-foreground/5 px-1.5 py-0.5 rounded">/anmeldung-kleingruppe</code></p>
              <p><code className="text-small font-mono bg-foreground/5 px-1.5 py-0.5 rounded">/anmeldung-kleingruppe-gelenkschmerzen</code></p>
            </div>
          </div>
        </Section>

        <Section title="11. Dateistruktur">
          <pre className="text-small text-foreground bg-foreground/5 rounded-[12px] p-6 overflow-x-auto font-mono">{`app/
├── globals.css              # Design Tokens, Animationen
├── layout.tsx               # Fraunces + Work Sans, AnimatedGradientBg
├── page.tsx                 # Homepage
├── yoga-klassen-bern/       # Yogaklassen (Curved Hero + Icon)
├── yogatherapie-bern/       # Yogatherapie (Curved Hero + Icon)
├── kleingruppen/            # Burnout Kleingruppe (Gerade Hero + Icon)
├── kleingruppen-arthritis/  # Gelenkschmerzen (Gerade Hero + Icon)
├── uber-mich/               # Über mich (Curved Hero + Foto)
├── stundenplan/             # Stundenplan (Gerade Hero)
├── kontakt/                 # Kontakt (Gerade Hero)
├── datenschutz/             # Datenschutz (Gerade Hero)
├── impressum/               # Impressum (Gerade Hero)
├── anmeldung-yoga-klasse/   # Anmeldeformular
├── anmeldung-yogatherapie/  # Anmeldeformular
├── anmeldung-kleingruppe/   # Anmeldeformular
├── anmeldung-kleingruppe-gelenkschmerzen/
└── styleguide/              # Diese Seite

components/
├── ui.tsx                   # Design System Komponenten
│   ├── GoldLine             # Trennlinie (centered/left)
│   ├── GlassCard            # Glasmorphism Container
│   ├── SectionHeading       # H2 + GoldLine + Description
│   ├── ImageCard            # 3:2 Bild mit Schatten
│   ├── QuoteSection         # Zitat mit Strahlen
│   ├── StudioSection        # Studio 2-Spalten
│   ├── KarinSection         # Karin 2-Spalten
│   ├── primaryBtnClass      # Button Token
│   └── secondaryBtnClass    # Button Token
├── Navbar.tsx               # HeroNavbar + StickyNavbar
├── Footer.tsx               # Footer
├── AnimatedGradientBg.tsx   # 6 Blob-Animationen
├── HeroLottie.tsx           # Lottie Animation
├── AnmeldungForm.tsx        # Formular-Komponente (alle Formulare)
└── AnmeldenModal.tsx        # Anmelde-Modal

public/images/
├── logo-v2.svg              # KALIYOGA Logo
├── grain-texture.webp       # Hintergrund-Textur
├── quote-rays.svg           # Strahlen-Dekoration
├── yoga-pose-028.svg        # Hero: Yogaklassen (Gold)
├── stones.svg               # Hero: Yogatherapie (Gold)
├── ginkoblatt.svg           # Hero: Gelenkschmerzen (Gold)
├── icon-kleingruppen.svg    # Hero: Kleingruppen (Gold)
├── icon-yogaklassen.svg     # Service Icon
├── icon-therapie.svg        # Service Icon
├── icon-gruppen.svg         # Service Icon
├── icon-entspannung.svg     # Feature Icon (Gold)
├── icon-funktionalitaet.svg # Feature Icon (Gold)
├── icon-exploration.svg     # Feature Icon (Gold)
├── icon-bewusstsein.svg     # Feature Icon (Gold)
├── icon-empowerment.svg     # Feature Icon (Gold)
├── icon-akzeptanz.svg       # Feature Icon (Gold)
├── icon-muskel-skelett.svg  # Medical Icon (Gold Stroke)
├── icon-nervensystem.svg    # Medical Icon (Gold Stroke)
├── icon-verdauung.svg       # Medical Icon (Gold Stroke)
├── icon-atmung.svg          # Medical Icon (Gold Stroke)
├── icon-herz-kreislauf.svg  # Medical Icon (Gold Stroke)
└── icon-immun-hormon.svg    # Medical Icon (Gold Stroke)`}</pre>
        </Section>

      </div>
    </div>
  );
}
