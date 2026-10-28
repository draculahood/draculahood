import Link from "next/link";
import { BRAND, hasGithub } from "@/config/brand";
import { BuyButton } from "@/components/site/BuyButton";
import { CopyCaButton } from "@/components/site/CopyCa";
import { FOOT_LINKS } from "@/components/site/links";
import { END } from "@/content/castle";

/** "End of the hall" card: buy, X, copy CA, the plain-words note and the page links. */
export function Footer() {
  return (
    <footer className="dh-foot" id="end">
      <div className="dh-card">
        <p className="dh-kicker">{END.eyebrow}</p>
        <h2 className="dh-h2">{END.title}</h2>
        <div className="dh-socials">
          <BuyButton />
          <a className="dh-btn" href={BRAND.x} target="_blank" rel="noopener noreferrer">
            X / Twitter
          </a>
          {hasGithub ? (
            <a className="dh-btn" href={BRAND.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          ) : null}
          <CopyCaButton />
        </div>
        <p className="dh-fine">{END.disclaimer}</p>
        <nav className="dh-footlinks" aria-label="Pages">
          {FOOT_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
