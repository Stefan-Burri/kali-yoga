"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { inputClass, submitBtnClass } from "@/components/ui";

/**
 * NewsletterForm — first name, last name and email fields + submit button.
 * Submissions go through /api/contact (Resend → info@kali-yoga.ch) with the
 * same honeypot and timing spam guards as the other forms.
 */
export default function NewsletterForm({
  firstNamePlaceholder = "Vorname",
  lastNamePlaceholder = "Nachname",
  placeholder = "Deine E-Mail-Adresse",
  buttonLabel = "Anmelden",
  sendingLabel = "Wird gesendet...",
  successMessage = "Danke! Deine Newsletter-Anmeldung ist bei mir eingegangen.",
  errorMessage = "Es ist ein Fehler aufgetreten. Bitte versuche es noch einmal.",
  privacyText = "Mit der Anmeldung akzeptierst du die",
  privacyLinkLabel = "Datenschutzerklärung",
  privacyHref = "/datenschutz",
}: {
  firstNamePlaceholder?: string;
  lastNamePlaceholder?: string;
  placeholder?: string;
  buttonLabel?: string;
  sendingLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  privacyText?: string;
  privacyLinkLabel?: string;
  privacyHref?: string;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const startTime = useRef<number>(Date.now());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          email,
          type: "Newsletter Anmeldung",
          website,
          _elapsedMs: Date.now() - startTime.current,
        }),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p className="mt-8 text-body text-foreground leading-relaxed">{successMessage}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto">
        <input
          type="text"
          name="firstName"
          required
          autoComplete="given-name"
          placeholder={firstNamePlaceholder}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className={`${inputClass} flex-1`}
          aria-label={firstNamePlaceholder}
        />
        <input
          type="text"
          name="lastName"
          required
          autoComplete="family-name"
          placeholder={lastNamePlaceholder}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className={`${inputClass} flex-1`}
          aria-label={lastNamePlaceholder}
        />
      </div>
      <div className="mt-3 flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${inputClass} flex-1`}
          aria-label={placeholder}
        />
        <button type="submit" disabled={status === "sending"} className={submitBtnClass}>
          {status === "sending" ? sendingLabel : buttonLabel}
        </button>
      </div>

      {/* Honeypot: invisible to people, tempting for bots. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website-newsletter">Website</label>
        <input
          id="website-newsletter"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {status === "error" && <p className="mt-3 text-small text-red-700">{errorMessage}</p>}

      <p className="mt-4 text-small text-foreground/60">
        {privacyText}{" "}
        <Link href={privacyHref} className="underline underline-offset-2 hover:text-primary transition-colors">
          {privacyLinkLabel}
        </Link>
        .
      </p>
    </form>
  );
}
