import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnmeldungForm from "@/components/AnmeldungForm";
import type { FormField } from "@/components/AnmeldungForm";
import ScrollReveal from "@/components/ScrollReveal";
import { GlassCard } from "@/components/ui";

const fields: FormField[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "message", label: "Nachricht", type: "textarea", placeholder: "Deine Nachricht..." },
];

export default function Kontakt() {
  return (
    <div className="min-h-screen">
      <StickyNavbar />

      {/* ─── Hero ─── */}
      <section className="pt-3 pb-[64px]">
        <HeroNavbar />
        <div className="flex flex-col items-center text-center px-6 pt-16 sm:pt-24 lg:pt-32 pb-8">
          <h1 className="font-display text-h1 font-bold text-primary max-w-[640px] text-balance">
            Kontaktformular
          </h1>
        </div>
      </section>

      {/* ─── Contact Form ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <AnmeldungForm
              type="contact"
              fields={fields}
              submitLabel="Senden"
            />
          </GlassCard></ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
