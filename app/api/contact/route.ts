import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = process.env.CONTACT_EMAIL || "info@kali-yoga.ch";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, type, ...rest } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name und Email sind erforderlich." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY ist nicht konfiguriert — E-Mail kann nicht gesendet werden.");
      return NextResponse.json({ error: "E-Mail-Versand ist noch nicht eingerichtet." }, { status: 500 });
    }
    const resend = new Resend(process.env.RESEND_API_KEY);

    const subject = type
      ? `${type} — ${name}`
      : `Kontaktanfrage von ${name}`;

    // Build email body from ALL submitted fields — known fields get a readable
    // label, unknown fields fall back to their name so nothing is ever dropped.
    const FIELD_LABELS: Record<string, string> = {
      klasse: "Klasse",
      phone: "Telefon",
      address: "Adresse",
      plz: "PLZ | Ort",
      teilnahme: "Teilnahme",
      date: "Gewünschtes Datum",
    };
    const lines = [
      `Name: ${name}`,
      `Email: ${email}`,
      ...Object.entries(rest)
        .filter(([key, value]) => key !== "message" && typeof value === "string" && value.trim() !== "")
        .map(([key, value]) => `${FIELD_LABELS[key] ?? key}: ${value}`),
      type ? `Typ: ${type}` : null,
      rest.message ? `\nNachricht:\n${rest.message}` : null,
    ].filter(Boolean).join("\n");

    const { error } = await resend.emails.send({
      from: `Kali Yoga Website <noreply@kali-yoga.ch>`,
      to: TO_EMAIL,
      replyTo: email,
      subject,
      text: lines,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "E-Mail konnte nicht gesendet werden." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Nachricht wurde gesendet." });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten." }, { status: 500 });
  }
}
