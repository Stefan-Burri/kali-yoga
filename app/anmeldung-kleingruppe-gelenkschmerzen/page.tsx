import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnmeldungForm from "@/components/AnmeldungForm";
import type { FormField } from "@/components/AnmeldungForm";
import { GoldLine, GlassCard } from "@/components/ui";

/* ─── Form Fields ─── */

const fields: FormField[] = [
  { name: "name", label: "Vor- und Nachname", type: "text", required: true },
  { name: "address", label: "Adresse", type: "text", required: true },
  { name: "plz", label: "PLZ | Ort", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Telefon", type: "tel" },
  {
    name: "teilnahme",
    label: "Vor Ort / online (Aufzeichnung)",
    type: "select",
    options: [
      { value: "Vor Ort", label: "Vor Ort" },
      { value: "Online", label: "Online" },
    ],
  },
  { name: "message", label: "Bemerkung", type: "textarea", placeholder: "Bemerkung..." },
];

/* ─── Page ─── */

export default function AnmeldungKleingruppeGelenkschmerzen() {
  return (
    <div className="min-h-screen">
      <StickyNavbar />
      <main>
      <div className="pt-3">
        <HeroNavbar />
      </div>

      <section className="pt-10 pb-[64px]">
        <div className="mx-auto max-w-[1280px] px-6">
          <GlassCard>
            <div className="text-center max-w-[768px] mx-auto mb-12">
              <p className="text-body text-foreground/60 uppercase tracking-wider mb-3">Gelenkschmerzen ganzheitlich begleiten</p>
              <h1 className="font-display text-h2 font-bold text-primary">Anmeldung Kleingruppe</h1>
              <GoldLine />
              <p className="mt-4 text-body text-foreground leading-relaxed">
                Nach deiner Anmeldung erhältst du eine Bestätigung per E-Mail. Ausserdem senden wir dir Terminvorschläge für das <strong>Einzelgespräch,</strong> das vor dem Kursbeginn im Zeitraum <strong>vom 20.08. bis 25.08.2026</strong> satt finden wird.
              </p>
            </div>

            <AnmeldungForm type="Anmeldung Kleingruppe Gelenkschmerzen" fields={fields} />
          </GlassCard>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
