"use client";

import { useState } from "react";
import Link from "next/link";
import { inputClass, selectChevron, submitBtnClass } from "@/components/ui";

/* Browser-Autofill: maps our field names to standard autocomplete tokens. */
const AUTOCOMPLETE: Record<string, string> = {
  name: "name",
  email: "email",
  phone: "tel",
  address: "street-address",
  plz: "postal-code",
};

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string; disabled?: boolean }[];
}

interface AnmeldungFormProps {
  type: string;
  fields: FormField[];
  submitLabel?: string;
  sendingLabel?: string;
  successTitle?: string;
  successMessage?: string;
  errorMessage?: string;
  privacyText?: string;
  privacyLinkLabel?: string;
}

export default function AnmeldungForm({
  type,
  fields,
  submitLabel = "Senden",
  sendingLabel = "Wird gesendet...",
  successTitle = "Vielen Dank!",
  successMessage = "Deine Anmeldung wurde gesendet. Ich melde mich so bald wie möglich bei dir.",
  errorMessage = "Ein Fehler ist aufgetreten. Bitte versuche es erneut.",
  privacyText = "Ich akzeptiere die",
  privacyLinkLabel = "Datenschutzbestimmungen",
}: AnmeldungFormProps) {
  const [form, setForm] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.type !== "checkbox") {
        initial[f.name] = f.type === "select" && f.options?.[0]?.disabled ? "" : (f.options?.[0]?.value ?? "");
      }
    });
    return initial;
  });
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  /* Spam-Schutz: unsichtbares Honeypot-Feld + Zeitmessung seit Seitenaufbau. */
  const [website, setWebsite] = useState("");
  const [startTime] = useState(() => Date.now());

  const updateField = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type, website, _elapsedMs: Date.now() - startTime }),
      });
      if (res.ok) {
        setStatus("success");
        const reset: Record<string, string> = {};
        fields.forEach((f) => {
          if (f.type !== "checkbox") reset[f.name] = "";
        });
        setForm(reset);
        setAccepted(false);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <h2 className="font-display text-h4 font-bold text-primary mb-4">{successTitle}</h2>
        <p className="text-foreground">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6 max-w-[600px] mx-auto">
      {fields.map((field) => {
        if (field.type === "checkbox") return null;

        if (field.type === "select") {
          return (
            <div key={field.name}>
              <label className="block text-body font-medium text-foreground mb-2">{field.label}</label>
              <select
                name={field.name}
                required={field.required}
                value={form[field.name] || ""}
                onChange={(e) => updateField(field.name, e.target.value)}
                className={`${inputClass} ${selectChevron}`}
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (field.type === "textarea") {
          return (
            <div key={field.name}>
              <label className="block text-body font-medium text-foreground mb-2">{field.label}</label>
              <textarea
                rows={6}
                name={field.name}
                required={field.required}
                value={form[field.name] || ""}
                onChange={(e) => updateField(field.name, e.target.value)}
                className={`${inputClass} resize-y`}
                placeholder={field.placeholder}
              />
            </div>
          );
        }

        return (
          <div key={field.name}>
            <label className="block text-body font-medium text-foreground mb-2">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              autoComplete={AUTOCOMPLETE[field.name]}
              required={field.required}
              value={form[field.name] || ""}
              onChange={(e) => updateField(field.name, e.target.value)}
              className={inputClass}
              placeholder={field.placeholder}
            />
          </div>
        );
      })}

      {/* Honeypot: für Menschen unsichtbar — füllt es ein Roboter aus, wird die
          Nachricht serverseitig verworfen. */}
      <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`website-${type}`}>Website</label>
        <input
          id={`website-${type}`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={`privacy-${type}`}
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 w-4 h-4 accent-primary"
        />
        <label htmlFor={`privacy-${type}`} className="text-body text-foreground">
          {privacyText}{" "}
          <Link href="/datenschutz" className="font-bold hover:text-primary transition-colors">
            {privacyLinkLabel}
          </Link>
        </label>
      </div>

      {status === "error" && (
        <p className="text-red-600 text-body">{errorMessage}</p>
      )}

      <div className="text-center pt-2">
        <button type="submit" disabled={!accepted || status === "sending"} className={submitBtnClass}>
          {status === "sending" ? sendingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
