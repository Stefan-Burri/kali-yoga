import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnmeldungForm from "@/components/AnmeldungForm";
import type { FormField } from "@/components/AnmeldungForm";
import ScrollReveal from "@/components/ScrollReveal";
import { GlassCard } from "@/components/ui";
import { getEnglishEnabled } from "@/lib/i18n";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact | Kali Yoga Bern",
    description: "Get in touch with Kali Yoga Bern. Send a message and I will get back to you as soon as possible.",
  };
}

const fields: FormField[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "message", label: "Message", type: "textarea", placeholder: "Your message..." },
];

export default async function Contact() {
  if (!(await getEnglishEnabled())) notFound();

  return (
    <div className="min-h-screen">
      <StickyNavbar lang="en" />

      {/* ─── Hero ─── */}
      <section className="pt-3 pb-[64px]">
        <HeroNavbar lang="en" />
        <div className="flex flex-col items-center text-center px-6 pt-16 sm:pt-24 lg:pt-32 pb-8">
          <h1 className="font-display text-h1 font-bold text-primary max-w-[640px] text-balance">
            Contact Form
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
              submitLabel="Send"
              sendingLabel="Sending..."
              successTitle="Thank you!"
              successMessage="Your message has been sent. I will get back to you as soon as possible."
              errorMessage="An error occurred. Please try again."
              privacyText="I accept the"
              privacyLinkLabel="privacy policy"
            />
          </GlassCard></ScrollReveal>
        </div>
      </section>

      <Footer lang="en" />
    </div>
  );
}
