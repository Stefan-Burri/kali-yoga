"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Setzt die Sprach-Kennzeichnung des Dokuments passend zur Route:
   /en-Seiten melden «en», alle anderen «de». Wichtig für Suchmaschinen
   und Screenreader (die Wurzel-<html> ist statisch auf «de»). */
export default function LangAttribute() {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    const isEn = pathname === "/en" || pathname.startsWith("/en/");
    document.documentElement.lang = isEn ? "en" : "de";
  }, [pathname]);

  return null;
}
