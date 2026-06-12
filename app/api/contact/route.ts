import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = process.env.CONTACT_EMAIL || "info@kali-yoga.ch";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, type, ...rest } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name und Email sind erforderlich." }, { status: 400 });
    }

    const subject = type
      ? `${type} — ${name}`
      : `Kontaktanfrage von ${name}`;

    // Build email body from all fields
    const lines = [
      `Name: ${name}`,
      `Email: ${email}`,
      rest.phone ? `Telefon: ${rest.phone}` : null,
      rest.address ? `Adresse: ${rest.address}` : null,
      rest.plz ? `PLZ | Ort: ${rest.plz}` : null,
      rest.teilnahme ? `Teilnahme: ${rest.teilnahme}` : null,
      rest.date ? `Gewünschtes Datum: ${rest.date}` : null,
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
