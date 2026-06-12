"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GoldLine,
  ChevronRight,
  GlassCard,
  SectionHeading,
  ImageCard,
  primaryBtnClass,
  secondaryBtnClass,
  submitBtnClass,
  inputClass,
  selectChevron,
  imageShadow,
} from "@/components/ui";
import AnmeldungForm from "@/components/AnmeldungForm";
import type { FormField } from "@/components/AnmeldungForm";
import AnmeldenModal from "@/components/AnmeldenModal";

/* ─── Showcase Helpers ─── */

function ShowcaseSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-12 border-b border-foreground/10">
      <h2 className="font-display text-h4 font-bold text-primary mb-2">{title}</h2>
      <div className="w-14 h-[3px] bg-gold mb-8" />
      {children}
    </section>
  );
}

function Variant({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <p className="text-small text-foreground/40 uppercase tracking-wider mb-3">{label}</p>
      {children}
    </div>
  );
}

function PropTable({ rows }: { rows: { name: string; type: string; default?: string; description: string }[] }) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-small text-foreground">
        <thead>
          <tr className="border-b border-foreground/10">
            <th className="text-left py-2 pr-4 font-semibold">Prop</th>
            <th className="text-left py-2 pr-4 font-semibold">Type</th>
            <th className="text-left py-2 pr-4 font-semibold">Default</th>
            <th className="text-left py-2 font-semibold">Beschreibung</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-foreground/5">
              <td className="py-2 pr-4 font-mono text-primary">{row.name}</td>
              <td className="py-2 pr-4 font-mono text-foreground/60">{row.type}</td>
              <td className="py-2 pr-4 font-mono text-foreground/40">{row.default || "—"}</td>
              <td className="py-2 text-foreground/70">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="text-small text-foreground bg-foreground/5 rounded-[8px] px-4 py-3 overflow-x-auto font-mono mb-4">{code}</pre>
  );
}

/* ─── Nav Data ─── */
const sections = [
  { id: "tokens", label: "Tokens" },
  { id: "goldline", label: "GoldLine" },
  { id: "chevron", label: "ChevronRight" },
  { id: "glasscard", label: "GlassCard" },
  { id: "imagecard", label: "ImageCard" },
  { id: "sectionheading", label: "SectionHeading" },
  { id: "quotesection", label: "QuoteSection" },
  { id: "form", label: "AnmeldungForm" },
  { id: "modal", label: "AnmeldenModal" },
  { id: "page-sections", label: "Page Sections" },
];

/* ─── Demo Form Fields ─── */
const demoFields: FormField[] = [
  { name: "name", label: "Name", type: "text", required: true, placeholder: "Dein Name" },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "option", label: "Auswahl", type: "select", options: [
    { value: "", label: "Bitte wählen...", disabled: true },
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ]},
  { name: "message", label: "Nachricht", type: "textarea", placeholder: "Deine Nachricht..." },
];

/* ─── Page ─── */

export default function ComponentsShowcase() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1280px] px-6 py-16">

        {/* Header */}
        <div className="mb-8">
          <Link href="/styleguide" className="text-small text-primary hover:text-secondary transition-colors mb-4 inline-block">&larr; Zum Styleguide</Link>
          <h1 className="font-display text-h2 font-bold text-primary">Komponenten</h1>
          <p className="mt-2 text-h6 text-foreground">Alle Komponenten mit Props, Varianten und Live-Vorschau.</p>
          <div className="w-14 h-[3px] bg-gold mt-5" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap gap-2 mb-12 pb-8 border-b border-foreground/10">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="text-small px-3 py-1.5 rounded-[6px] border border-foreground/10 text-foreground hover:text-primary hover:border-primary/30 transition-colors">
              {s.label}
            </a>
          ))}
        </nav>

        {/* ═══════════════════════════════════════
            1. DESIGN TOKENS
        ═══════════════════════════════════════ */}

        <ShowcaseSection id="tokens" title="1. Design Tokens">
          <p className="text-body text-foreground mb-6">Zentral exportierte CSS-Klassen aus <code className="font-mono bg-foreground/5 px-1.5 py-0.5 rounded text-small">components/ui.tsx</code>. Single source of truth für alle Seiten.</p>

          <Variant label="primaryBtnClass">
            <div className="flex flex-wrap gap-4 items-center">
              <button className={primaryBtnClass}>Anmeldung</button>
              <button className={primaryBtnClass}>Mehr Erfahren</button>
            </div>
            <CodeBlock code={`import { primaryBtnClass } from "@/components/ui";`} />
          </Variant>

          <Variant label="secondaryBtnClass">
            <div className="flex flex-wrap gap-4 items-center">
              <button className={secondaryBtnClass}>Mehr Erfahren <ChevronRight /></button>
              <button className={secondaryBtnClass}>Kontakt</button>
            </div>
            <CodeBlock code={`import { secondaryBtnClass } from "@/components/ui";`} />
          </Variant>

          <Variant label="submitBtnClass (Formulare, mit disabled State)">
            <div className="flex flex-wrap gap-4 items-center">
              <button className={submitBtnClass}>Senden</button>
              <button className={submitBtnClass} disabled>Wird gesendet...</button>
            </div>
            <CodeBlock code={`import { submitBtnClass } from "@/components/ui";`} />
          </Variant>

          <Variant label="inputClass + selectChevron">
            <div className="max-w-[400px] space-y-4">
              <input className={inputClass} placeholder="Text Input" readOnly />
              <select className={`${inputClass} ${selectChevron}`} defaultValue="">
                <option value="" disabled>Select Input</option>
                <option>Option A</option>
                <option>Option B</option>
              </select>
              <textarea className={`${inputClass} resize-y`} rows={3} placeholder="Textarea" readOnly />
            </div>
            <CodeBlock code={`import { inputClass, selectChevron } from "@/components/ui";`} />
          </Variant>

          <Variant label="imageShadow">
            <div className="w-32 h-20 rounded-[12px] bg-white" style={{ boxShadow: imageShadow }} />
            <CodeBlock code={`import { imageShadow } from "@/components/ui";`} />
          </Variant>
        </ShowcaseSection>

        {/* ═══════════════════════════════════════
            2. PRIMITIVE COMPONENTS
        ═══════════════════════════════════════ */}

        <ShowcaseSection id="goldline" title="2. GoldLine">
          <CodeBlock code={`import { GoldLine } from "@/components/ui";`} />
          <PropTable rows={[
            { name: "centered", type: "boolean", default: "true", description: "Zentriert die Linie horizontal (mx-auto)" },
          ]} />
          <Variant label="centered (default)">
            <div className="border border-foreground/10 rounded-[8px] p-4">
              <GoldLine />
            </div>
          </Variant>
          <Variant label="centered={false} (linksbündig)">
            <div className="border border-foreground/10 rounded-[8px] p-4">
              <GoldLine centered={false} />
            </div>
          </Variant>
        </ShowcaseSection>

        <ShowcaseSection id="chevron" title="3. ChevronRight">
          <CodeBlock code={`import { ChevronRight } from "@/components/ui";`} />
          <p className="text-body text-foreground mb-4">SVG-Icon, 14x14px. Erbt die Textfarbe (currentColor). Wird in Secondary Buttons verwendet.</p>
          <div className="flex items-center gap-4">
            <div className="text-primary"><ChevronRight /></div>
            <div className="text-gold"><ChevronRight /></div>
            <div className="text-foreground"><ChevronRight /></div>
            <button className={secondaryBtnClass}>Mit Button <ChevronRight /></button>
          </div>
        </ShowcaseSection>

        <ShowcaseSection id="glasscard" title="4. GlassCard">
          <CodeBlock code={`import { GlassCard } from "@/components/ui";`} />
          <PropTable rows={[
            { name: "children", type: "ReactNode", description: "Inhalt der Karte" },
            { name: "className", type: "string", default: '""', description: "Zusätzliche CSS-Klassen" },
          ]} />
          <Variant label="Standard">
            <GlassCard>
              <p className="text-foreground text-body">Glasmorphism-Container. Backdrop-blur, halbtransparenter weisser Hintergrund, weicher Schatten. Responsive Padding (p-8 / sm:p-12 / lg:p-16).</p>
            </GlassCard>
          </Variant>
          <Variant label="Mit className Override">
            <GlassCard className="p-4 sm:p-4 lg:p-4">
              <p className="text-foreground text-body">Kompaktes Padding via className.</p>
            </GlassCard>
          </Variant>
        </ShowcaseSection>

        <ShowcaseSection id="imagecard" title="5. ImageCard">
          <CodeBlock code={`import { ImageCard } from "@/components/ui";`} />
          <PropTable rows={[
            { name: "src", type: "string", description: "Bildpfad" },
            { name: "alt", type: "string", description: "Alt-Text" },
            { name: "width", type: "number", description: "Bildbreite (für Next.js Image)" },
            { name: "height", type: "number", description: "Bildhöhe (für Next.js Image)" },
          ]} />
          <Variant label="3:2 Ratio mit Schatten">
            <div className="max-w-[400px]">
              <ImageCard src="/images/studio.png" alt="Demo" width={800} height={533} />
            </div>
          </Variant>
        </ShowcaseSection>

        {/* ═══════════════════════════════════════
            3. COMPOSITE COMPONENTS
        ═══════════════════════════════════════ */}

        <ShowcaseSection id="sectionheading" title="6. SectionHeading">
          <CodeBlock code={`import { SectionHeading } from "@/components/ui";`} />
          <PropTable rows={[
            { name: "title", type: "string", description: "Titel der Sektion (H2)" },
            { name: "description", type: "ReactNode", default: "undefined", description: "Optionaler Beschreibungstext" },
          ]} />
          <Variant label="Nur Titel">
            <div className="border border-foreground/10 rounded-[8px] p-8">
              <SectionHeading title="Preise" />
            </div>
          </Variant>
          <Variant label="Mit Beschreibung">
            <div className="border border-foreground/10 rounded-[8px] p-8">
              <SectionHeading
                title="Harmonie für Körper, Atem und Geist"
                description="Die Yogaklassen eignen sich für Einsteiger*innen sowie Fortgeschrittene."
              />
            </div>
          </Variant>
        </ShowcaseSection>

        <ShowcaseSection id="quotesection" title="7. QuoteSection">
          <CodeBlock code={`import { QuoteSection } from "@/components/ui";`} />
          <PropTable rows={[
            { name: "quote", type: "string", description: "Zitattext (ohne Guillemets)" },
            { name: "author", type: "string", description: "Autor des Zitats" },
          ]} />
          <Variant label="Live-Vorschau (als eigenständige Section)">
            <p className="text-body text-foreground/60 mb-4">Rendert eine vollständige Section mit Strahlen-Grafik, Zitat und Autorenangabe. Verwendet max-w-[768px] und zentrierten Text.</p>
            <div className="border border-foreground/10 rounded-[8px] overflow-hidden">
              <div className="p-8 sm:p-12 max-w-[768px] mx-auto text-center">
                <div className="flex justify-center mb-6">
                  <Image src="/images/quote-rays.svg" alt="" width={320} height={100} className="w-[200px] h-auto" />
                </div>
                <blockquote className="font-display text-h4 font-bold text-primary leading-snug">
                  &laquo;Beispielzitat für die Vorschau&raquo;
                </blockquote>
                <p className="mt-5 text-body text-foreground italic">– Autor –</p>
                <div className="flex justify-center mt-6">
                  <Image src="/images/quote-rays.svg" alt="" width={320} height={100} className="w-[200px] h-auto rotate-180" />
                </div>
              </div>
            </div>
          </Variant>
        </ShowcaseSection>

        <ShowcaseSection id="form" title="8. AnmeldungForm">
          <CodeBlock code={`import AnmeldungForm from "@/components/AnmeldungForm";
import type { FormField } from "@/components/AnmeldungForm";`} />
          <PropTable rows={[
            { name: "type", type: "string", description: "Formulartyp (wird im POST mitgesendet)" },
            { name: "fields", type: "FormField[]", description: "Array von Felddefinitionen" },
            { name: "submitLabel", type: "string", default: '"Senden"', description: "Text des Submit-Buttons" },
          ]} />

          <Variant label="FormField Interface">
            <CodeBlock code={`interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string; disabled?: boolean }[];
}`} />
          </Variant>

          <Variant label="Live-Vorschau">
            <div className="max-w-[600px]">
              <AnmeldungForm type="demo" fields={demoFields} submitLabel="Demo senden" />
            </div>
          </Variant>

          <Variant label="Verwendung: Kontakt (3 Felder)">
            <CodeBlock code={`const fields: FormField[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "message", label: "Nachricht", type: "textarea" },
];
<AnmeldungForm type="contact" fields={fields} />`} />
          </Variant>

          <Variant label="Verwendung: Anmeldung (mit Select + Details)">
            <CodeBlock code={`const fields: FormField[] = [
  { name: "klasse", label: "Klasse", type: "select", required: true,
    options: [
      { value: "", label: "Datum wählen...", disabled: true },
      { value: "12.06.2026", label: "12.06.2026 | Abend" },
    ]},
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Telefon", type: "tel" },
  { name: "message", label: "Bemerkungen", type: "textarea" },
];
<AnmeldungForm type="yoga-klasse" fields={fields} submitLabel="Anmelden" />`} />
          </Variant>
        </ShowcaseSection>

        <ShowcaseSection id="modal" title="9. AnmeldenModal">
          <CodeBlock code={`import AnmeldenModal from "@/components/AnmeldenModal";`} />
          <PropTable rows={[
            { name: "open", type: "boolean", description: "Steuert die Sichtbarkeit" },
            { name: "onClose", type: "() => void", description: "Callback beim Schliessen" },
          ]} />
          <Variant label="Live-Vorschau (klicken zum Öffnen)">
            <button onClick={() => setModalOpen(true)} className={primaryBtnClass}>Modal öffnen</button>
          </Variant>
          <p className="text-body text-foreground/60 mt-4">4 hardcodierte Optionen: Yoga Klassen, Yoga Therapie, Kleingruppe Burnout, Kleingruppe Gelenkschmerzen. Jede Option verlinkt zur entsprechenden Anmeldeseite.</p>
        </ShowcaseSection>

        {/* ═══════════════════════════════════════
            4. PAGE SECTIONS
        ═══════════════════════════════════════ */}

        <ShowcaseSection id="page-sections" title="10. Page Sections (vorgefertigte Sektionen)">
          <p className="text-body text-foreground mb-8">Diese Komponenten rendern vollständige Seitenabschnitte mit festen Inhalten. Sie werden auf mehreren Seiten wiederverwendet.</p>

          <Variant label="StudioSection — Keine Props">
            <CodeBlock code={`import { StudioSection } from "@/components/ui";
// Rendert: 2-Spalten Layout mit Studio-Bild, Adresse, Link`} />
            <p className="text-body text-foreground/60">Verwendet auf: Homepage, Yogaklassen, Yogatherapie, Über mich</p>
          </Variant>

          <Variant label="KarinSection — Optionale Bio">
            <CodeBlock code={`import { KarinSection } from "@/components/ui";
<KarinSection /> // Default-Bio
<KarinSection description="Eigener Text..." />`} />
            <PropTable rows={[
              { name: "description", type: "string", default: "Default-Bio", description: "Überschreibt den Standard-Biotext" },
            ]} />
            <p className="text-body text-foreground/60">Verwendet auf: Homepage, Yogaklassen, Yogatherapie</p>
          </Variant>

          <Variant label="QuoteSection — Zitat + Autor">
            <p className="text-body text-foreground/60">Verwendet auf: Yogaklassen, Yogatherapie, Kleingruppen, Gelenkschmerzen</p>
          </Variant>
        </ShowcaseSection>

        {/* ═══════════════════════════════════════
            5. COMPONENT MAP
        ═══════════════════════════════════════ */}

        <section className="py-12">
          <h2 className="font-display text-h4 font-bold text-primary mb-2">Komponentenbaum</h2>
          <div className="w-14 h-[3px] bg-gold mb-8" />
          <pre className="text-small text-foreground bg-foreground/5 rounded-[12px] p-6 overflow-x-auto font-mono">{`components/ui.tsx (Design System Core)
├── Tokens
│   ├── primaryBtnClass      → Seiten-CTAs, Links
│   ├── secondaryBtnClass    → Outline-Buttons mit Chevron
│   ├── submitBtnClass       → Formular-Submit (disabled State)
│   ├── inputClass           → Text/Email/Tel/Textarea Inputs
│   ├── selectChevron        → Select-Dropdown Styling
│   └── imageShadow          → Bildschatten für ImageCard
│
├── Primitives
│   ├── GoldLine             → Dekorative Trennlinie
│   ├── ChevronRight         → Pfeil-Icon (14x14)
│   ├── GlassCard            → Glasmorphism Container
│   └── ImageCard            → 3:2 Bild mit Schatten
│
├── Composites
│   └── SectionHeading       → H2 + GoldLine + Description
│       └── uses: GoldLine
│
└── Page Sections
    ├── QuoteSection          → Zitat mit Strahlen
    ├── StudioSection         → Studio-Info 2-Spalten
    │   └── uses: ImageCard, GoldLine, ChevronRight
    └── KarinSection          → Karin-Bio 2-Spalten
        └── uses: ImageCard, GoldLine, ChevronRight

components/AnmeldungForm.tsx (Formular-System)
├── uses: inputClass, selectChevron, submitBtnClass
└── exports: FormField (Interface)

components/AnmeldenModal.tsx (Anmelde-Overlay)
└── 4 hardcodierte Optionen → Anmeldeseiten

components/Navbar.tsx (Navigation)
├── HeroNavbar              → Oben im Hero, transparent
├── StickyNavbar            → Erscheint ab 50vh Scroll
└── uses: AnmeldenModal

components/Footer.tsx (Footer)
└── Statisch: Kontakt, Links, Social Media

components/AnimatedGradientBg.tsx (Hintergrund)
└── 6 Blobs mit CSS Keyframes

components/HeroLottie.tsx (Animation)
└── Lottie Player für Homepage Hero`}</pre>
        </section>

      </div>

      <AnmeldenModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
