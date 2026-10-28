import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { Shell } from "@/components/site/Page";
import { CovenApp } from "@/components/coven/CovenApp";
import { NightClock } from "@/components/home/NightClock";
import { JsonLd } from "@/components/JsonLd";
import { appLd, breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/coven",
  title: `Coven Ledger | ${BRAND.name}`,
  description: `Sign the ${BRAND.name} castle guestbook on Robinhood Chain with a nickname and one of eight crests, then read every entry in the Castle Hall.`,
});

export default function CovenPage() {
  return (
    <Shell>
      <JsonLd data={[appLd, breadcrumbLd([{ name: "Coven Ledger", path: "/coven" }])]} />
      <header style={{ maxWidth: 760, marginBottom: 28 }}>
        <p className="dh-kicker">The Coven Ledger</p>
        <h1 className="dh-h2">Sign the castle guestbook</h1>
        <p className="dh-tag" style={{ maxWidth: "52ch" }}>
          One line per wallet: a nickname and a crest, written on Robinhood Chain for anyone to read. Change it whenever you like.
        </p>
      </header>
      <CovenApp />
      <section className="dh-card" style={{ marginTop: 22 }}>
        <p className="dh-kicker">Night Clock</p>
        <h2 className="dh-h2" style={{ fontSize: "clamp(32px,4vw,44px)" }}>
          Hours left in your night
        </h2>
        <NightClock />
      </section>
    </Shell>
  );
}
