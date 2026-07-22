import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

/* llms.txt — kompakte Übersicht für KI-Crawler (ChatGPT, Perplexity & Co.).
   Bewusst ohne Preise/Termine (die ändern sich — dafür sind die verlinkten
   Seiten und die strukturierten Daten da). */
export async function GET() {
  const body = `# Kali Yoga

> Yoga Studio in Bern, Schweiz — Yoga für «Every Body»: Yogaklassen, Yoga Therapie (Einzelsitzungen und Kleingruppen-Kurse), unabhängig von Alter, Geschlecht, Körperform oder körperlicher Verfassung.

Inhaberin: Karin Liechti — Yoga Therapeutin C-IAYT, KomplementärTherapeutin Methode Yoga Therapie mit Branchenzertifikat OdA KT, EMR- und EGK-anerkannt (Teilrückerstattung über Zusatzversicherung für KomplementärTherapie möglich).

Adresse: Aarbergergasse 40 (4. Stock), 3011 Bern, Schweiz
Telefon: 076 262 05 62 · E-Mail: info@kali-yoga.ch
Instagram: https://www.instagram.com/kali_yogabern/ · Facebook: https://www.facebook.com/KaliYogaBern/

## Angebote

- [Yogaklassen](${SITE_URL}/yoga-klassen-bern): Gruppenklassen im Studio (75 Minuten, max. 10 Teilnehmer*innen), Preise und Abos auf der Seite
- [Stundenplan](${SITE_URL}/stundenplan): aktuelle Klassen-Termine
- [Yoga Therapie Einzelsitzungen](${SITE_URL}/yogatherapie-bern): ganzheitliche Einzeltherapie, krankenkassenanerkannt (EMR/EGK)
- [Kleingruppe Stress, Erschöpfung & Burnout](${SITE_URL}/kleingruppen): Kursreihe mit 5 Live-Terminen und persönlicher Begleitung
- [Kleingruppe Gelenkschmerzen](${SITE_URL}/kleingruppen-arthritis): 10-Wochen-Kurs, Yoga Therapie kombiniert mit Ernährungstherapie (mit Dr. Daniela Zölly), vor Ort oder online
- [Über Karin Liechti](${SITE_URL}/uber-mich): Ausbildung, Diplome, Werdegang
- [Kontakt](${SITE_URL}/kontakt)

## English

- [English version of the website](${SITE_URL}/en): yoga classes, yoga therapy and small-group courses in Bern, Switzerland
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
