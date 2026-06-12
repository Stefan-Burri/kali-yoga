import Link from "next/link";
import Image from "next/image";
import { HeroNavbar } from "@/components/Navbar";
import HeroLottie from "@/components/HeroLottie";
import { primaryBtnClass, secondaryBtnClass } from "@/components/ui";
import type { Hero, HeroButton, Lang, NavigationDoc } from "@/lib/builder";

/* ─── Widened hero shape ───
   The deployed schema added the 'straight' variant and the `fullHeight`
   toggle; lib/builder's Hero type doesn't know them yet, so widen locally.
   Plain `Hero` values stay assignable. */

export type HeroData =
  | (Omit<NonNullable<Hero>, "variant"> & {
      variant?: "curved" | "simple" | "home" | "straight" | null;
      /** false → compact hero (legal-page style), default true. */
      fullHeight?: boolean | null;
    })
  | null;

/* ─── Buttons ─── */

function HeroButtons({ buttons }: { buttons?: HeroButton[] | null }) {
  if (!buttons || buttons.length === 0) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-4 justify-center">
      {buttons.map((btn, i) => {
        const href = btn.href ?? "/";
        const className = btn.style === "secondary" ? secondaryBtnClass : primaryBtnClass;
        const key = btn._key ?? `${btn.label}-${i}`;
        if (href.startsWith("#")) {
          return (
            <a key={key} href={href} className={className}>
              {btn.label}
            </a>
          );
        }
        return (
          <Link key={key} href={href} className={className}>
            {btn.label}
          </Link>
        );
      })}
    </div>
  );
}

/* ─── Curved-title SVG (shared by curved + home variants) ───
   Full-height heroes crop the viewBox to "-50 75 700 205" so the image can
   overlap the arc; the compact (legal-page) hero keeps the original
   "-50 0 700 280" box. When `title` is set an sr-only h1 is rendered. */

function CurvedTitle({
  curvedTitle,
  title,
  pathId,
  viewBox = "-50 75 700 205",
}: {
  curvedTitle: string;
  title?: string;
  pathId: string;
  viewBox?: string;
}) {
  return (
    <>
      <p aria-hidden="true" className="sm:hidden font-display text-h2 font-bold text-primary text-center mb-6">
        {curvedTitle}
      </p>
      {title !== undefined ? <h1 className="sr-only">{title}</h1> : null}
      <svg
        viewBox={viewBox}
        className="w-[600px] sm:w-[800px] lg:w-[1060px] h-auto hidden sm:block"
        role="img"
        aria-label={curvedTitle}
      >
        <defs>
          <path id={pathId} d="M 0,280 Q 300,-10 600,280" fill="none" />
        </defs>
        <text className="fill-primary font-display" style={{ fontSize: "54px", fontWeight: 700 }}>
          <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
            {curvedTitle}
          </textPath>
        </text>
      </svg>
    </>
  );
}

/* ─── Hero ─── */

export default function BuilderHero({
  hero,
  slug,
  withNavbar = true,
  lang = "de",
  nav,
  translationHref,
}: {
  hero: HeroData;
  slug: string;
  /** The page decides whether the hero renders the top navbar inside itself. */
  withNavbar?: boolean;
  lang?: Lang;
  /** CMS navigation doc, threaded into the HeroNavbar. */
  nav?: NavigationDoc;
  /** Exact language-switch target, threaded into the HeroNavbar. */
  translationHref?: string;
}) {
  if (!hero) return null;

  const variant = hero.variant ?? "curved";
  const fullHeight = hero.fullHeight !== false;
  const pathId = `curve-${slug}`;
  const title = hero.title ?? "";
  const curvedTitle = hero.curvedTitle ?? title;
  const navbar = <HeroNavbar lang={lang} nav={nav} translationHref={translationHref} />;

  /* ── 'simple': centered h1 hero (stundenplan style) ── */
  if (variant === "simple") {
    return (
      <section className="pt-3 pb-[64px]">
        {withNavbar ? navbar : null}
        <div className="flex flex-col items-center text-center px-6 pt-16 sm:pt-24 lg:pt-32 pb-8">
          <h1 className="font-display text-h1 font-bold text-primary w-full text-balance">{title}</h1>
          {hero.text ? (
            <p className="text-body-lg text-foreground max-w-[640px] mt-6">{hero.text}</p>
          ) : null}
          <HeroButtons buttons={hero.buttons} />
        </div>
      </section>
    );
  }

  /* ── 'home': curved title + Lottie animation (homepage style) ── */
  if (variant === "home") {
    return (
      <section className="relative min-h-[100dvh] flex flex-col overflow-hidden">
        {withNavbar ? navbar : null}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="relative max-w-[768px] mx-auto flex flex-col items-center">
            <CurvedTitle curvedTitle={curvedTitle} pathId={pathId} />
            <div className="mt-8 sm:mt-0 lg:-mt-28">
              <HeroLottie />
            </div>
            <h1 className="mt-8 font-display text-h5 font-bold text-primary">{title}</h1>
            {hero.text ? (
              <p className="mt-3 text-h6 text-foreground max-w-[768px] mx-auto leading-relaxed">{hero.text}</p>
            ) : null}
            <HeroButtons buttons={hero.buttons} />
          </div>
        </div>
      </section>
    );
  }

  /* ── Compact wrapper (fullHeight === false) for curved/straight: legal-page
        hero. Same `pt-3 pb-[64px]` shell as the original Impressum/Datenschutz
        pages – no min-h-[100dvh], no flex centering. ('simple' is inherently
        compact and 'home' always full-height – both returned above.) ── */
  if (!fullHeight) {
    return (
      <section className="pt-3 pb-[64px]">
        {withNavbar ? navbar : null}
        <div className="flex flex-col items-center text-center px-6 pt-16 sm:pt-24 lg:pt-32 pb-8">
          <div className={`${variant === "straight" ? "w-full" : "max-w-[768px]"} mx-auto flex flex-col items-center`}>
            {variant === "straight" ? (
              <h1 className="font-display text-h1 font-bold text-primary w-full text-balance">{title}</h1>
            ) : (
              <CurvedTitle curvedTitle={curvedTitle} title={title} pathId={pathId} viewBox="-50 0 700 280" />
            )}
            {hero.imagePath ? (
              <div className="mt-6">
                <Image
                  src={hero.imagePath}
                  alt={title}
                  width={320}
                  height={320}
                  className="h-[240px] sm:h-[320px] w-auto"
                />
              </div>
            ) : null}
            {hero.text ? (
              <p className="mt-6 text-h6 text-foreground max-w-[768px] mx-auto leading-relaxed">{hero.text}</p>
            ) : null}
            <HeroButtons buttons={hero.buttons} />
          </div>
        </div>
      </section>
    );
  }

  /* ── 'straight': full-height hero with a straight h1 (kleingruppen style) ── */
  if (variant === "straight") {
    return (
      <section className="min-h-[100dvh] flex flex-col">
        {withNavbar ? (
          <div className="pt-3 shrink-0">
            {navbar}
          </div>
        ) : null}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full mx-auto flex flex-col items-center text-center">
            <h1 className="font-display text-h1 font-bold text-primary w-full text-balance">
              {title}
            </h1>
            {hero.imagePath ? (
              <div className="mt-6 sm:mt-8 lg:mt-10">
                <Image
                  src={hero.imagePath}
                  alt={title}
                  width={200}
                  height={200}
                  className="h-[240px] sm:h-[320px] w-auto"
                />
              </div>
            ) : null}
            {hero.text ? (
              <p className="mt-10 text-h6 text-foreground max-w-[768px] mx-auto leading-relaxed">{hero.text}</p>
            ) : null}
            <HeroButtons buttons={hero.buttons} />
          </div>
        </div>
      </section>
    );
  }

  /* ── 'curved' (default): curved title + image (yoga-klassen style) ── */
  return (
    <section className="min-h-[100dvh] flex flex-col">
      {withNavbar ? (
        <div className="pt-3 shrink-0">
          {navbar}
        </div>
      ) : null}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-[768px] mx-auto flex flex-col items-center text-center">
          <CurvedTitle curvedTitle={curvedTitle} title={title} pathId={pathId} />
          {hero.imagePath ? (
            <div className="-mt-8 sm:-mt-16 lg:-mt-44">
              <Image
                src={hero.imagePath}
                alt={title}
                width={320}
                height={320}
                className="h-[240px] sm:h-[320px] w-auto"
              />
            </div>
          ) : null}
          {hero.text ? (
            <p className="mt-6 text-h6 text-foreground max-w-[768px] mx-auto leading-relaxed">{hero.text}</p>
          ) : null}
          <HeroButtons buttons={hero.buttons} />
        </div>
      </div>
    </section>
  );
}
