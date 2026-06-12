import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnmeldungForm from "@/components/AnmeldungForm";
import type { FormField } from "@/components/AnmeldungForm";
import { GoldLine, GlassCard } from "@/components/ui";

/* ─── Form Fields ─── */

const fields: FormField[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Telefon", type: "tel" },
  { name: "message", label: "Bemerkung", type: "textarea", placeholder: "Bemerkung..." },
];

/* ─── Page ─── */

export default function AnmeldungYogatherapie() {
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
              <p className="text-body text-foreground/60 uppercase tracking-wider mb-3">Yoga Therapie</p>
              <h1 className="font-display text-h2 font-bold text-primary">Anmeldung Yoga Therapie</h1>
              <GoldLine />
              <p className="mt-4 text-body text-foreground leading-relaxed">
                Ich freue mich, dich auf deinem Weg zu begleiten. Zusammen werden wir die Kraft des Yoga nutzen, um Gesundheit und Wohlbefinden zu fördern.
              </p>
            </div>

            <AnmeldungForm type="Anmeldung Yoga Therapie" fields={fields} />
          </GlassCard>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
