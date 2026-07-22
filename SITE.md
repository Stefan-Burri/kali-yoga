# Kali Yoga

> Yoga für «Every Body» — Yoga Studio in Bern

## Brand Identity
- **Business:** Yoga Studio in Bern (Yogaklassen, Yoga Therapie, Gruppen-Yoga)
- **Owner:** Karin Liechti — Yogalehrerin mit Fokus auf restauratives und therapeutisches Yoga
- **Personality:** Warm, einladend, inklusiv, ruhig, zugänglich
- **Colors:** Sanftes Violett (#9B8AB8), Gold (#D4A843), Off-White (#FAFAF7)
- **Fonts:** Playfair Display (Display), Cormorant Garamond (Headings), DM Sans (Body)
- **Typografie:** 9 fluide Tokens (360px–1440px) in `app/globals.css`: `text-h1` (40→76) bis `text-h6` (16→19) für Überschriften, `text-body-lg` (17→21), `text-body` (15→17.5), `text-small` (13→15) für Text. Alle H1–H6 sind automatisch aubergine (globale CSS-Regel). Jede Seite hat genau eine H1 mit lückenloser H-Hierarchie (SEO-optimiert). Grössen ändern: Token-Werte in globals.css anpassen
- **Language:** German (Swiss German audience)

## Pages
- **Homepage** (`/`) — Hero, Angebote, Zitat, Stundenplan, Über mich, Feedbacks, Studio, Footer
- **Yogaklassen** (`/yoga-klassen-bern`) — Hero, 6 Feature-Karten (Harmonie für Körper, Atem und Geist), Zitat, Stundenplan-Grid, Karin Liechti Teaser, Preise (4 Karten), Studio, Feedbacks
- **Yoga Therapie** (`/yogatherapie-bern`) — Hero, 3-Schritt-Ablauf, Kosten, Zusatzversicherung mit Logos, Zitat, 6 Anwendungsgebiete-Karten, 6 Feedbacks, Karin Liechti Teaser, Studio
- **Stundenplan** (`/stundenplan`) — Hero mit Titel/Beschreibung, Stundenplan-Grid mit Event-Karten
- **Kleingruppe Burnout** (`/kleingruppen`) — Hero, 5 Symptom-Karten, Zitat, Kurserwartungen, 7 Kursinhalte, Kursdetails mit 5 Terminen, Zusatzversicherung, Karin Liechti Teaser
- **Über mich** (`/uber-mich`) — Hero with round portrait, Diplome (4 cards), Über mich bio with 3 photos, Aus- und Weiterbildungen timeline, Studio section
- **Kontakt** (`/kontakt`) — Hero, Contact form (Name, Email, Message + privacy checkbox)
- **Datenschutz** (`/datenschutz`) — Hero, Privacy policy with 8 numbered sections
- **Impressum** (`/impressum`) — Hero, Legal info (contact, liability, copyright, privacy link)
- **Kleingruppe Gelenkschmerzen** (`/kleingruppen-arthritis`) — Yoga Therapie & Ernährungstherapie bei Gelenkbeschwerden (10-Wochen-Kurs mit Dr. Daniela Zölly)
- **Anmeldung Yogaklasse** (`/anmeldung-yoga-klasse`) — Registrierungsformular mit Klassen-Dropdown
- **Anmeldung Yogatherapie** (`/anmeldung-yogatherapie`) — Registrierungsformular für Einzeltherapie
- **Anmeldung Kleingruppe** (`/anmeldung-kleingruppe`) — Registrierungsformular Burnout-Kleingruppe (mit Adresse/PLZ)
- **Anmeldung Kleingruppe Gelenkschmerzen** (`/anmeldung-kleingruppe-gelenkschmerzen`) — Registrierungsformular mit vor-Ort/online Auswahl

## Components
- **Navbar** — Logo links, Navigation (Yoga, Yoga Therapie, Über mich, Kontakt), Anmelden-Button rechts. Unter 1024px Fensterbreite erscheint das Hamburger-Menü (vorher 768px — die Navigation war bei mittleren Breiten gequetscht)
- **Footer** — Logo, Adresse, Kontakt, Social Media, Navigation. Adresse/Telefon/E-Mail/Facebook/Instagram werden im Studio direkt im **Footer-Dokument** gepflegt (je DE + EN)
- **CookieBanner** — Dezenter Hinweis unten rechts («nur technisch notwendige Cookies»), Link zur Datenschutzerklärung, DE/EN automatisch. Nach Klick auf «Alles klar» erscheint er auf diesem Gerät nicht mehr (im Browser gespeichert)
- **AnmeldungForm** — Flexible registration form component supporting text, email, tel, textarea, select fields with Datenschutz checkbox and /api/contact POST

## ⭐ Der Seiten-Baukasten (aktuelles System, seit 12.06.2026)

**Die ganze Website besteht aus Baukasten-Seiten.** Bearbeitung: **https://kali-yoga-cms.sanity.studio** (das EINE Studio — die früher dokumentierte Adresse kali-yoga-studio.sanity.studio existiert nicht mehr)

Das Studio zeigt genau 6 Bereiche: **🇩🇪 Seiten – Deutsch** · **🇬🇧 Seiten – English** · Navigation (Menü) · Footer · Stundenplan-Eintrag (zentrale Tabelle) · Allgemein

- **Jede Seite** = ein Dokument mit Titel, Sprache (DE/EN), Adresse (Slug) und einer **Sektionen-Liste** (Drag & Drop sortieren, hinzufügen, entfernen)
- **Sektions-Typen:** Hero (3 Varianten, weglassbar) · About/Text & Bild (kann via «Weitere Einträge» mehrere Bild-Text-Einträge in derselben Box zeigen, z.B. zwei Kursleiterinnen) · Feature-Karten · Zitat · **Stundenplan (einzige zentrale Tabelle!)** · Feedbacks (inline) · Preise inkl. Bezahlung (inline) · Kursdetails+Termine · Anmelde-Aufruf · Formular (5 Typen)
- **Glas/Transparent:** Jede Sektion (ausser Hero) hat das Feld «Darstellung»
- **Neue Seite:** Dokument anlegen, Slug vergeben, Sektionen bauen, Publish → sofort unter /slug (DE) bzw. /en/slug (EN) online
- **Navigation & Footer:** eigene Dokumente «Navigation (Menü)» und «Footer» (je DE + EN) — Menüpunkte/Spalten frei editierbar (interner Pfad oder externe URL, Dropdowns)
- **Sprachschalter:** läuft über das Feld «Slug der Schwesterseite» der Seiten-Dokumente
- **Technik:** Routen `app/[slug]` + `app/en/[slug]` (+ Homepages), Renderer `components/builder/`, Daten `lib/builder.ts`. Stundenplan-Tabelle + Allgemein bleiben zentrale Dokumente.

## Inhalte bearbeiten (Sanity CMS)
Alle Texte werden im **einen** Studio gepflegt — ohne Code:

- **Studio:** https://kali-yoga-cms.sanity.studio (Login mit dem Sanity-Konto). Das ist das einzige existierende Studio — erreichbar auch über das Sanity-Dashboard («Kali Yoga»). Die früher dokumentierte Adresse kali-yoga-studio.sanity.studio wurde gelöscht und ist tot. Schema-Änderungen werden seit 22.07.2026 auf derselben Adresse aktualisiert (kein Adresswechsel mehr nötig).
- **So geht's:** Seite anklicken → Sektion öffnen → Text ändern → unten rechts auf **Publish** klicken → die Website aktualisiert sich innert ca. 1 Minute
- **Logos hochladen (z.B. Zusatzversicherung):** Seite öffnen (z.B. «Yoga Therapie») → Sektion «Kostenübernahme Zusatzversicherung» anklicken → Feld **«Logos hochladen (optional)»** → «Add item» → Bild hochladen → Publish. Die hochgeladenen Logos erscheinen in der Logo-Reihe unter dem Text, nach den bestehenden Logo-Dateien. (Das Feld «Logo-Reihe» darüber ist nur für Dateipfade aus dem Code, z.B. /images/emr-logo.svg — dort nichts hochladen.)
- **Sicherheitsnetz:** Wird ein Feld in Sanity geleert, zeigt die Website automatisch den ursprünglichen Text. Nichts kann kaputtgehen.

### Englische Version (zweisprachige Website)
Die Website gibt es auf Deutsch und Englisch:

- **Ein/Aus:** Im Studio unter «Allgemein» → Schalter **«Englische Version aktiv»**. Ausgeschaltet = Sprachschalter verschwindet und alle /en-Seiten zeigen «Seite nicht gefunden».
- **Sprachschalter:** «DE | EN» in der Navigation (Desktop und Mobile), wechselt zur gleichen Seite in der anderen Sprache.
- **Englische Adressen:** /en, /en/yoga-classes-bern, /en/yoga-therapy-bern, /en/schedule, /en/small-group-burnout, /en/small-group-joint-pain, /en/about-me, /en/contact + 4 Anmeldeformulare unter /en/registration-...
- **Bearbeiten im Studio:** Die englischen Seiten sind eigene Einträge, mit 🇬🇧 gekennzeichnet (z.B. «🇬🇧 Startseite (English)»). Bei Stundenplan, Feedbacks, Preisen und Allgemeinen Angaben gibt es 🇬🇧-Felder direkt am gleichen Eintrag — Termine/Preise werden nur EINMAL gepflegt, die englischen Textfelder sind optional (leer = automatische Übersetzung der Standardwörter wie Freitag→Friday).
- **Nur Deutsch:** Impressum (rechtlich massgebend); der englische Footer verlinkt darauf. Die Datenschutzerklärung gibt es seit 22.07.2026 auch auf Englisch (/en/privacy-policy, mit Hinweis, dass die deutsche Fassung rechtlich massgebend ist).
- **Technik:** Sprach-Hilfen in `lib/i18n.ts` (Routen-Zuordnung, Wort-Übersetzungen, Englisch-Schalter-Abfrage); englische Seiten in `app/en/`.

### Neue Seiten selber anlegen (Baukasten)
1. Im Studio unter **🇩🇪 Seiten – Deutsch** (oder 🇬🇧 English) → neues Dokument → Titel und Adresse (Slug) eingeben
2. Beliebige **Sektionen** hinzufügen und per Drag & Drop ordnen (Hero, About/Text & Bild, Feature-Karten, Zitat, Stundenplan, Feedbacks, Preise, Kursdetails, Anmelde-Aufruf, Formular)
3. **Publish** klicken → Seite erscheint sofort unter `/slug` (DE) bzw. `/en/slug` (EN) im Kali-Yoga-Design

- **Technik:** Sanity-Projekt `ghs7plqm`, Dataset `production`, Verbindung in `lib/sanity.ts`, Zugangsdaten in `.env.local`. Bilder/Icons liegen weiterhin in `public/` (nicht im CMS).

## Veröffentlichung
- **Live-Website:** https://kali-yoga.vercel.app
- **Code:** github.com/Stefan-Burri/kali-yoga — jeder Push auf `main` löst automatisch einen neuen Vercel-Build aus
- **E-Mail-Versand (Formulare):** ✅ eingerichtet (22.07.2026) — `RESEND_API_KEY` ist auf Vercel (Production) und lokal in `.env.local` hinterlegt, Domain kali-yoga.ch bei Resend verifiziert, Versand getestet. Alle 5 Formulare senden an info@kali-yoga.ch (Absender noreply@kali-yoga.ch, Antworten gehen direkt an die Adresse aus dem Formular)
- **✅ LIVE seit 22.07.2026 auf https://www.kali-yoga.ch** (kali-yoga.ch leitet auf www um). Go-Live-Abnahme komplett: alle 5 Formulare auf der Live-Domain getestet, Sitemap in der Google Search Console eingereicht, DMARC-Eintrag gesetzt (`_dmarc` TXT, p=none, Berichte an info@kali-yoga.ch). DNS läuft über Cloudflare (nur als DNS, Proxy aus), Auslieferung zu 100 % über Vercel. **Noch offen:** Webflow-Abo nach ein paar stabilen Tagen kündigen; Search-Console-Indexierung in der ersten Woche beobachten

## Tracking & Cookie-Einwilligung
- **Custom Code** (Studio → «Allgemein»): z.B. das Google-Tag-Manager-Snippet einfügen und publizieren
- Sobald Custom Code hinterlegt ist, wechselt der Cookie-Banner automatisch in den **Einwilligungs-Modus** («Einverstanden» / «Nur notwendige», DE + EN). Das Snippet wird **erst nach Zustimmung** geladen — konform mit dem Schweizer Datenschutzrecht. Ohne Custom Code bleibt der bisherige Hinweis-Banner («nur technisch notwendige Cookies»)
- Die Datenschutzerklärung (CMS-Seite Datenschutz) wurde ergänzt: Cookies mit Einwilligung, externe Dienste (Vercel, Sanity, Resend) und Abschnitt «Google Tag Manager und Webanalyse»
- Widerruf: Cookies der Website im Browser löschen → Banner fragt beim nächsten Besuch neu

## Contact Info
- **Address:** Aarbergergasse 40, 4. Stock, 3011 Bern
- **Phone:** 076 262 05 62
- **Email:** info@kali-yoga.ch
- **Facebook:** facebook.com/KaliYogaBern
- **Instagram:** instagram.com/kali_yogabern

## Stundenplan aufräumen (vergangene Termine)
Vergangene Termine werden auf der Website automatisch ausgeblendet, bleiben aber im CMS. Aufräumen von Hand im Studio (Bereich «Stundenplan-Eintrag»):
1. Die Einträge zeigen in der Liste jetzt **Datum + Klassen-Name** (seit 22.07.2026) — vergangene sind so sofort erkennbar
2. Eintrag öffnen → Menü **⋮** oben rechts → **Duplicate** → die Kopie ist ein unpublizierter Entwurf (= Vorlage, falls der nächste Termin noch nicht sicher ist)
3. Alten Eintrag löschen (Menü ⋮ → Delete)
4. Sobald der neue Termin feststeht: Entwurf öffnen, Datum anpassen, **Publish**

## Recent Changes
- 2026-07-22 (spät): Go-Live auf kali-yoga.ch — Cloudflare-DNS umgestellt (Apex + www als CNAME auf Vercel, Proxy aus; E-Mail-Einträge unangetastet; alter Webflow-Wildcard-Eintrag `*` gelöscht — bei Bedarf wiederherstellbar mit Typ A, Name `*`, 99.83.190.102). kali-yoga.ch leitet auf www.kali-yoga.ch um, www liefert die neue Website. Favicon der alten Website übernommen (Kali-Auge, app/icon.png + app/favicon.ico — ersetzt den Platzhalter). Alle deutschen Adressen (Slugs) sind identisch mit der alten Website — kein SEO-Verlust, keine Weiterleitungen nötig; die /en-Seiten sind neu dazugekommen
- 2026-07-22 (spät): Stundenplan-Einträge zeigen im Studio jetzt Datum + Klassen-Name in der Liste (vorher nur «class» — Einträge waren nicht unterscheidbar). Anleitung zum Aufräumen vergangener Termine oben ergänzt
- 2026-07-22 (spät): Feinschliff-Paket wie alte Website — (1) Startseiten-Bogentitel «Yoga for Every Body» etwas kleiner (48px statt 54px, Handy eine Stufe kleiner). (2) Karten-Buttons («Mehr Erfahren»/«Kontakt») stehen jetzt in jeder Kartenreihe auf gleicher Höhe (unten angepinnt). (3) Kursdetails: statt automatisch «5 Termine» steht neu ein bearbeitbarer Text über den Terminen («Der Kurs umfasst **fünf Termine:**», CMS-Feld «Text über den Terminen»); der Hinweistext unter den Terminen ist neu formatierbar (CMS-Feld «Hinweistext» mit Fett-Knopf) — Texte samt Fettungen von der alten Website übernommen (Burnout + Gelenkschmerzen, DE + EN; Gelenkschmerzen hat zusätzlich den Absatz zur ernährungstherapeutischen Begleitung mit 25 % Rabatt). (4) «Kostenbeteiligung/Kostenübernahme Zusatzversicherung»-Überschriften eine Stufe kleiner wie im Original (neuer Schalter «Kleinere Überschrift» in der About-Sektion; gesetzt auf Yoga Therapie + beiden Kleingruppen, DE + EN). Ausserdem: leerer Logo-Eintrag im Yoga-Therapie-Entwurf entfernt
- 2026-07-22 (abends): Datenschutzerklärung fürs Google-Tracking nachgeschärft (revDSG) — Garantien für USA-Übermittlungen ergänzt (Swiss–U.S. Data Privacy Framework, anerkannt seit 15.09.2024, bzw. Standardvertragsklauseln); Kontakt-E-Mail für Datenschutzanfragen (Ziffern 2 + 7); Google-Abschnitt präzisiert (Google Analytics 4, keine vollständigen IP-Adressen, Löschung nach 14 Monaten); Formular-Feldliste an die echten Formulare angepasst; Newsletter-Abschnitt bleibt (Newsletter ist geplant). Neu: englische Datenschutzerklärung unter /en/privacy-policy (deutsche Fassung bleibt rechtlich massgebend), englischer Footer + Cookie-Banner verlinken darauf, Sprachschalter verbindet beide Seiten. WICHTIG vor Tracking-Start: In Google Analytics die Aufbewahrung auf 14 Monate stellen und die Google-Datenverarbeitungsbedingungen akzeptieren
- 2026-07-22 (abends): Anmelden-Overlay 2-spaltig — die 4 Auswahlkarten waren zu schmal (Beschriftung «Kleingruppe Gelenkschmerzen» abgeschnitten); jetzt 2×2 auf Tablet/Desktop, 1 Spalte auf dem Handy (geprüft auf 390/768/1440px)
- 2026-07-22 (abends): Formulare verbessert — (1) Alle Felder sind jetzt Pflicht ausser «Bemerkung» (Telefon und Vor-Ort/Online-Auswahl waren vorher optional; DE + EN). (2) Browser-Autofill funktioniert: Name, E-Mail, Telefon, Adresse und PLZ können vom Browser automatisch ausgefüllt werden. (3) Unsichtbarer Spam-Schutz: verstecktes Honeypot-Feld + Zeitprüfung (Absenden unter 2 Sekunden = Roboter) — Spam wird serverseitig verworfen, ohne Captcha und ohne Cookies. Falls später doch Spam durchkommt: Cloudflare Turnstile wäre die nächste Stufe. (4) Kontaktformular-Bestätigung sagt jetzt «Deine Nachricht wurde gesendet» statt «Deine Anmeldung»
- 2026-07-22 (abends): Formular-E-Mails vollständig — die E-Mail übermittelt jetzt **alle** ausgefüllten Formularfelder. Vorher fehlte beim Yogaklassen-Formular das Feld «Klasse» (gewähltes Datum), weil die E-Mail-Vorlage nur eine feste Feldliste kannte. Neu werden auch künftige/unbekannte Felder automatisch mitgeschickt
- 2026-07-22 (abends): E-Mail-Versand aktiviert — Resend-API-Schlüssel auf Vercel (Production) und lokal hinterlegt, Domain war bei Resend bereits verifiziert, Testversand erfolgreich. Die 5 Formulare (Kontakt, Yogaklasse, Yoga Therapie, 2× Kleingruppe) senden jetzt E-Mails an info@kali-yoga.ch
- 2026-07-22 (abends): Logos hochladen im CMS — die «About-Sektion (Text & Bild)» hat ein neues Feld **«Logos hochladen (optional)»**: eigene Logo-Bilder direkt im Studio hochladen, sie erscheinen in der Logo-Reihe unter dem Text (z.B. Zusatzversicherung auf Yoga Therapie / Kleingruppen-Seiten), nach den bestehenden Logo-Dateien. Dabei entdeckt und korrigiert: Die dokumentierte Studio-Adresse kali-yoga-studio.sanity.studio existierte nicht mehr — das aktive Studio läuft unter **https://kali-yoga-cms.sanity.studio** und wurde mit dem aktuellen Schema neu veröffentlicht (gleiche Adresse; zusätzlich abgeglichen: Footer-Kontaktfelder, «Allgemein» mit Custom Code, «Weitere Einträge» und Aufzählungs-Stil in der About-Sektion). Hochgeladene Galerie-Bilder («Weitere Bilder hochladen») werden jetzt ebenfalls korrekt von der Website geladen.
- 2026-07-22: AEO (Antwortmaschinen wie ChatGPT/Perplexity) — Kurs-Seiten liefern maschinenlesbare Kurs-Daten (schema.org Course: Preise, Start-/Enddatum, Ort — automatisch aus der Kursdetails-Sektion jeder Seite, DE + EN); neue Übersichtsdatei /llms.txt für KI-Crawler (Angebote, Kontakt, Qualifikationen — bewusst ohne Preise/Termine, die stehen auf den verlinkten Seiten)
- 2026-07-22: SEO-Maximierung — Canonical-URLs und DE↔EN-Verknüpfung (hreflang) auf allen Seiten; englische Seiten melden jetzt Sprache «en»; strukturierte Daten (schema.org LocalBusiness mit Adresse/Kontakt aus dem Footer-Dokument) für die lokale Google-Suche; Startseiten-Animation lädt erst nach dem Seitenaufbau (PageSpeed: weniger blockierendes JavaScript, schnelleres grösstes Element); Footer-Kontaktlinks mit grösseren Touch-Flächen (Barrierefreiheit)
- 2026-07-21 (Go-Live-Vorbereitung): sitemap.xml + robots.txt (alle CMS-Seiten automatisch, DE + EN); eigene 404-Seite im Kali-Design mit Link zur Startseite; Vorschaubild beim Teilen (OG-Image, automatisch aus Logo + Markenfarben generiert); Cookie-Banner mit echter Einwilligung sobald Tracking-Code hinterlegt ist (Snippet lädt erst nach «Einverstanden»); Datenschutzerklärung ergänzt (Cookies, externe Dienste, Google Tag Manager)
- 2026-07-21 (spät): Studio neu veröffentlicht unter **https://kali-yoga-studio.sanity.studio** — die alte Adresse kali-yoga-cms zeigte noch das eingefrorene alte Schema («Unknown fields»-Warnungen, alter Name «Allgemeine Angaben») und liess sich nicht überschreiben. Alte Adresse im Sanity-Dashboard löschen!
- 2026-07-21 (spät): CMS aufgeräumt + Custom Code: «Allgemeine Angaben» heisst jetzt **«Allgemein»** und enthält nur noch den Englisch-Schalter und das neue Feld **«Custom Code»** (z.B. Google-Tag-Manager-Snippet einfügen → läuft auf allen Seiten). Die Kontaktdaten (Adresse, Telefon, E-Mail, Facebook, Instagram) sind ins **Footer-Dokument** umgezogen, wo sie auch angezeigt werden — vorher waren sie im Code fest hinterlegt und die CMS-Werte wurden ignoriert. Ausserdem Hero-Abstände vereinheitlicht: randlose Bilder (Steine-Icon, Karin-Porträt) bekommen unten gleich viel Luft zum Text wie die anderen Icons, und der Bild-Hochzug wächst mit der Fensterbreite (behebt Überlappung von «Karin» um 640px)
- 2026-07-21 (abends): Hero-Feinschliff — Steine-Icon (Yoga Therapie) mit gleichem Abstand zum Bogen-Titel wie das Yogaklassen-Icon; gerade Hero-Titel auf max. 960px begrenzt (brechen ausgewogen um statt volle Breite); auf dem Handy mehr Abstand zwischen Titel und Bild (Karin-Porträt überlappte)
- 2026-07-21: Grosses Feinschliff-Paket nach Vergleich mit der alten Website:
  - **Kurs-Seiten (Burnout + Gelenkschmerzen, DE+EN):** keine gebogenen Titel mehr (zu lang); neues Hero-Feld «Untertitel» (fette Zeile, z.B. «Yoga Therapie & Ernährungstherapie bei Gelenkbeschwerden»); Kursdetails als übersichtliche Zeilen mit fetten Beschriftungen statt Kärtchen (Doppelpunkt gehört zur Beschriftung im CMS); Termin-Kärtchen: Uhrzeit im gleichen Stil wie Wochentag; neues Feld «Einleitung über den Terminen» (ersetzt «5 Termine», auf Gelenkschmerzen gesetzt); neues Feld «Hinweistext mit Formatierung» (Absätze + fette Stellen, von der alten Website übernommen); «Dieser Kurs ist hilfreich bei:» mit Gutzeichen (✓) linksbündig (neues Feld «Aufzählungs-Stil» in Text-Sektionen)
  - **Über mich:** Bildergalerie endet bündig mit dem Text (grosses Bild dehnt sich); Diplome-Logos gross wie auf der alten Seite (160px); Abstand «Karin»-Titel zum Porträt auf Handy/Tablet reduziert; Titelbogen passt sich schmalen Fenstern an (kein abgeschnittener Text mehr)
  - **Formulare:** Kontaktformular mit Untertitel «Ich freue mich über deine Nachricht» (neues Feld «Untertitel» in Formular-Sektionen, Kontakt-Hero entfernt); Anmeldung Yogaklassen mit Absätzen wie auf der alten Website (Zeilenumbrüche im Einleitungstext werden übernommen)
  - **Startseite:** 404-Links repariert («Mehr Erfahren» bei Yogaklassen → /yoga-klassen-bern, Yoga Therapie → /yogatherapie-bern)
  - **Preis-Karten:** «Schnupperklasse» bricht nicht mehr mitten im Wort um
- 2026-07-20: Studio-Adresse repariert — kali-yoga-cms.sanity.studio existierte nicht mehr (nur das veraltete kali-yoga-baukasten.sanity.studio war erreichbar und kannte die Hero-Sektion nicht; dabei ging kurzzeitig der Hero der Kleingruppen-Seite verloren → wiederhergestellt). Das Studio wurde mit dem aktuellen Schema neu auf https://kali-yoga-cms.sanity.studio deployt. Alte Studios im Sanity-Dashboard löschen!
- 2026-07-20: Feinschliff-Paket — Cookie-Banner (DE/EN); Startseiten-Animation langsamer; Stundenplan-Karten: Abstand zwischen Tag und Zeit, Zeit bricht nicht mehr um, mehr vertikaler Abstand zwischen Kartenreihen und nach dem Einleitungstext; Preis-Karten: «CHF» immer vor dem Preis auf einer Zeile, Haken bei zweizeiligem Text oben ausgerichtet; Yogaklassen-Icons Entspannung/Funktionalität getauscht (Dateien getauscht, wirkt auf DE+EN); Steine-Icon im Hero kleiner (Yoga Therapie + Kleingruppe); Kleingruppe Burnout: runder Hero-Titel mit Steine-Icon (im CMS publiziert, DE+EN); Buttons «Anmeldung»/«Mehr Erfahren» gleiche Schriftgrösse; Hamburger-Menü schon unter 1024px; Feedbacks und Bild-Text-Sektionen (Studio, Karin) erst ab 1024px zweispaltig; Hero-Texte respektieren Zeilenumbrüche aus dem CMS; CORS-Freigabe für lokale Vorschau (Port 3640)
- 2026-06-12: About-Sektion mit «Weitere Einträge»: mehrere Bild-Text-Einträge in EINER Box (Kursleiterinnen Daniela + Karin auf der Gelenkschmerzen-Seite DE + EN zusammengeführt); gerade Hero-Titel (H1) nutzen die volle Breite (keine unglücklichen Worttrennungen mehr)
- 2026-06-12: Studio finalisiert — EIN sauberes Studio (kali-yoga-cms.sanity.studio) mit zwei Seiten-Ordnern 🇩🇪/🇬🇧, klaren Seitentiteln, ohne Alt-Typen; englische Seiten als eigener Typ (kein doppelter Bearbeitungsort)
- 2026-06-12: KOMPLETT-UMBAU zum Page-Builder — alle 26 Seiten sind Baukasten-Dokumente (Sektionen per Drag & Drop), Navigation/Footer aus dem CMS, nur der Stundenplan bleibt zentrale Tabelle, 22 statische Seitendateien und 34 Alt-Dokumente entfernt
- 2026-06-12: Studio in 3 getrennte Bereiche aufgeteilt (Zweisprachige Inhalte / Deutsch / English, je eigene URL) und alle 14 SEO-Felder mit suchmaschinenoptimierten Titeln und Beschreibungen befüllt
- 2026-06-12: PageSpeed-Optimierung — SEO-Felder (🔎 Titel + Beschreibung) in allen Seiten-Dokumenten im Studio bearbeitbar, <main>-Landmarke und korrekte Überschriften-Reihenfolge auf allen Seiten (Barrierefreiheit), Live-Domain bei Sanity freigeschaltet (behebt Konsolenfehler + Sprachschalter auf der Live-Site)
- 2026-06-12: Studio-Struktur aufgeräumt — Zitate sind jetzt eine eigene Sektion «Zitat» (5 Einträge mit Seiten-Zuordnung statt versteckter Felder), der gebogene Titel der Startseite ist neu in Sanity bearbeitbar («Seite: Startseite» → Gebogener Titel), alle Seiten-Typen einheitlich als «Seite: …» benannt
- 2026-06-12: Typografie konsolidiert: 16 → 9 Tokens (text-h1…h6, body-lg, body, small), alle Überschriften aubergine, H1–H6 semantisch korrekt auf allen 20 Seiten (genau 1 H1 pro Seite, SEO-Audit), Hinweistexte unter Kursterminen zentriert (DE + EN)
- 2026-06-12: Alle 8 Hero-Sektionen mit gebogenem Titel optisch korrekt zentriert — unsichtbarer Leerraum über dem Bogen (SVG-viewBox) beschnitten (Startseite, Yogaklassen, Yoga Therapie, Über mich, je DE + EN)
- 2026-06-12: Scroll-Navbar (erscheint beim Hochscrollen) im Glas-Look der durchlässigen Boxen (transparent, Weichzeichner, heller Rand)
- 2026-06-12: Sprachwahl in der Navigation ist jetzt ein Dropdown (DE/EN mit Pfeil) rechts vom Anmelden-Button; im Mobile-Menü weiterhin als DE | EN
- 2026-06-12: Fluide Typografie eingeführt — zentrale clamp()-Skala (360–1440px) in globals.css, Fliesstext neu 15→16px statt 14px, Kleintext angehoben, Überschriften skalieren stufenlos (Desktop-Grössen unverändert), Abschnitts-Abstände moderat fluid (48→64px). ~495 Stellen umgestellt, visuell bei 360px und 1440px geprüft
- 2026-06-12: Preis-Karten an Stundenplan-Karten angeglichen: transparent mit violettem Rand (zentral + Baukasten)
- 2026-06-12: Alle 12 Hero-Sektionen (mit Icon/Animation) vereinheitlicht: min-height 100dvh inkl. Navbar, Inhalt vertikal zentriert
- 2026-06-12: Startseiten-Hero: Animation 64px nach unten verschoben (mehr Abstand zum gebogenen Titel) und mehr Abstand zwischen Animation und Titel/Untertitel (DE + EN)
- 2026-06-12: Code aufgeräumt — 21 ungenutzte Dateien gelöscht, doppelter Code zusammengelegt (Stundenplan-Raster, Feedback-Karten, Preis-Karten, Studio-/Karin-Abschnitte sind jetzt zentrale Komponenten in components/ui.tsx). Erscheinungsbild per HTML-Vergleich verifiziert: pixelgenau unverändert. /styleguide und /components sind für Suchmaschinen gesperrt
- 2026-06-12: Englische Version der Website gebaut — alle Inhalte übersetzt, 12 Seiten unter /en/..., Sprachschalter DE|EN in der Navigation, ein-/ausschaltbar im Studio («Allgemeine Angaben» → «Englische Version aktiv»)
- 2026-06-12: Vergangene Termine werden jetzt automatisch ausgeblendet (Stundenplan auf allen Seiten) und das Anmeldeformular für Yogaklassen zieht seine Datumsauswahl direkt aus dem Stundenplan im Studio
- 2026-06-12: Seiten-Baukasten eingebaut — neue Seiten können im Studio unter «Eigene Seite» aus 6 Bausteinen zusammengestellt werden (Beispiel: /beispiel-workshop)
- 2026-06-12: Sanity CMS integriert — alle Inhalte (Stundenplan, Preise, Feedbacks, Kurse, Seitentexte, Kontaktangaben) sind jetzt im Studio unter kali-yoga.sanity.studio bearbeitbar; bisherige Texte dienen als Fallback
- 2026-06-06: Project created, brand analysis from kali-yoga.ch
- 2026-06-06: Created 4 subpages: /uber-mich, /kontakt, /datenschutz, /impressum
- 2026-06-06: Created AnmeldungForm component and 5 new pages: /kleingruppen-arthritis, /anmeldung-yoga-klasse, /anmeldung-yogatherapie, /anmeldung-kleingruppe, /anmeldung-kleingruppe-gelenkschmerzen
- 2026-06-06: Created 4 content pages: /yoga-klassen-bern (Yogaklassen), /yogatherapie-bern (Yoga Therapie), /stundenplan (Stundenplan), /kleingruppen (Kleingruppe Burnout)
