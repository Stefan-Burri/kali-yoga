import Link from "next/link";
import Image from "next/image";
import { HeroNavbar } from "@/components/Navbar";
import HeroLottie from "@/components/HeroLottie";
import { primaryBtnClass, secondaryBtnClass } from "@/components/ui";
import type { Hero, HeroButton } from "@/lib/builder";

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

/* ─── Curved-title SVG (shared by curved + home variants) ─── */

function CurvedTitle({ curvedTitle, pathId }: { curvedTitle: string; pathId: string }) {
  return (
    <>
      <p aria-hidden="true" className="sm:hidden font-display text-h2 font-bold text-primary text-center mb-6">
        {curvedTitle}
      </p>
      <svg
        viewBox="-50 75 700 205"
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

export default function BuilderHero({ hero, slug }: { hero: Hero; slug: string }) {
  if (!hero) return null;

  const variant = hero.variant ?? "curved";
  const pathId = `curve-${slug}`;
  const title = hero.title ?? "";
  const curvedTitle = hero.curvedTitle ?? title;

  /* ── 'simple': centered h1 hero (stundenplan style) ── */
  if (variant === "simple") {
    return (
      <section className="pt-3 pb-[64px]">
        <HeroNavbar />
        <div className="flex flex-col items-center text-center px-6 pt-16 sm:pt-24 lg:pt-32 pb-8">
          <h1 className="font-display text-h1 font-bold text-primary max-w-[640px] text-balance">{title}</h1>
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
        <HeroNavbar />
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

  /* ── 'curved' (default): curved title + image (yoga-klassen style) ── */
  return (
    <section className="min-h-[100dvh] flex flex-col">
      <div className="pt-3 shrink-0">
        <HeroNavbar />
      </div>
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-[768px] mx-auto flex flex-col items-center text-center">
          <p aria-hidden="true" className="sm:hidden font-display text-h2 font-bold text-primary text-center mb-6">
            {curvedTitle}
          </p>
          <h1 className="sr-only">{title}</h1>
          <svg
            viewBox="-50 75 700 205"
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
