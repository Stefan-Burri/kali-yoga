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
    title: "Yoga Therapy Registration | Kali Yoga Bern",
    description: "Register for yoga therapy at Kali Yoga Bern. Together we will use the power of yoga to support your health and well-being.",
  };
}

/* ─── Form Fields ─── */

const fields: FormField[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "message", label: "Remarks", type: "textarea", placeholder: "Remarks..." },
];

/* ─── Page ─── */

export default async function RegistrationYogaTherapy() {
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
              <p className="text-body text-foreground/60 uppercase tracking-wider mb-3">Yoga Therapy</p>
              <h1 className="font-display text-h2 font-bold text-primary">Yoga Therapy Registration</h1>
              <GoldLine />
              <p className="mt-4 text-body text-foreground leading-relaxed">
                I look forward to accompanying you on your journey. Together we will use the power of yoga to support your health and well-being.
              </p>
            </div>

            <AnmeldungForm
              type="Anmeldung Yoga Therapie"
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
