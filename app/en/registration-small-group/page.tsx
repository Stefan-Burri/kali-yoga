import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnmeldungForm from "@/components/AnmeldungForm";
import type { FormField } from "@/components/AnmeldungForm";
import { GoldLine, GlassCard } from "@/components/ui";
import { getEnglishEnabled } from "@/lib/i18n";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Small Group Registration – Stress, Exhaustion & Burnout | Kali Yoga Bern",
    description: "Register for the small group course on stress, exhaustion and burnout at Kali Yoga Bern.",
  };
}

/* ─── Form Fields ─── */

const fields: FormField[] = [
  { name: "name", label: "First and last name", type: "text", required: true },
  { name: "address", label: "Address", type: "text", required: true },
  { name: "plz", label: "Postcode | City", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "message", label: "Remarks", type: "textarea", placeholder: "Remarks..." },
];

/* ─── Page ─── */

export default async function RegistrationSmallGroup() {
  if (!(await getEnglishEnabled())) notFound();

  return (
    <div className="min-h-screen">
      <StickyNavbar lang="en" />

      <main>
      <div className="pt-3">
        <HeroNavbar lang="en" />
      </div>

      <section className="pt-10 pb-[64px]">
        <div className="mx-auto max-w-[1280px] px-6">
          <GlassCard>
            <div className="text-center max-w-[768px] mx-auto mb-12">
              <p className="text-body text-foreground/60 uppercase tracking-wider mb-3">Stress, Exhaustion & Burnout</p>
              <h1 className="font-display text-h2 font-bold text-primary">Small Group Registration</h1>
              <GoldLine />
              <p className="mt-4 text-body text-foreground leading-relaxed">
                After registering, you will receive a confirmation by email. I will also send you suggested dates for the one-on-one conversation, which will take place before the course starts, <strong>between 20.08. and 25.08.2026</strong>.
              </p>
            </div>

            <AnmeldungForm
              type="Anmeldung Kleingruppe Burnout"
              fields={fields}
              submitLabel="Send"
              sendingLabel="Sending..."
              successTitle="Thank you!"
              successMessage="Your registration has been sent. I will get back to you as soon as possible."
              errorMessage="An error occurred. Please try again."
              privacyText="I accept the"
              privacyLinkLabel="privacy policy"
            />
          </GlassCard>
        </div>
      </section>

      </main>

      <Footer lang="en" />
    </div>
  );
}
