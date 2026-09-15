import { notFound, permanentRedirect } from "next/navigation";
import { getRedirectTarget } from "@/lib/builder";

export const revalidate = 60;

/* Catch-all for paths with several segments (e.g. /alte-seite/unterseite), which the
   single-segment [slug] route cannot match. Its only job is following CMS-managed
   redirects («Allgemein» → Weiterleitungen); everything else stays a 404. */
export default async function CatchAllRedirect({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const path = `/${slug.join("/")}`;
  const redirectTarget = await getRedirectTarget(path);
  if (redirectTarget) permanentRedirect(redirectTarget);
  notFound();
}
