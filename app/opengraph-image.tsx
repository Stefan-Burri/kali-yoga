import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "Kali Yoga – Yoga für «Every Body» – Yoga Studio in Bern";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Vorschaubild beim Teilen (WhatsApp, Instagram, Google & Co.):
   sanfter Verlauf in den Markenfarben, Logo, Tagline, Goldlinie. */
export default async function OgImage() {
  const svg = await readFile(path.join(process.cwd(), "public", "images", "logo-v2.svg"), "utf8");
  const logoSrc = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f0f8 0%, #e9def2 40%, #dfe6f3 75%, #f2ecdf 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={620} height={83} />
        <div style={{ marginTop: 24, width: 110, height: 5, background: "#D4A843", display: "flex" }} />
        <div style={{ marginTop: 40, fontSize: 36, color: "#4a3f5c", display: "flex" }}>
          Yoga für «Every Body» · Yoga Studio in Bern
        </div>
      </div>
    ),
    { ...size }
  );
}
