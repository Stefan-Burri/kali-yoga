import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ghs7plqm",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-06-01",
  useCdn: true,
});

/* ─── Image URL helper ─── */

import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

export function urlFor(source: Parameters<ReturnType<typeof imageUrlBuilder>["image"]>[0]) {
  return builder.image(source);
}
