import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { Shell } from "@/components/site/Page";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ path: "/privacy", title: `Privacy | ${BRAND.name}`, description: `What the ${BRAND.name} site stores and sends: browser storage only, chain reads through a relay, no accounts and no uploads.` });

export default function Privacy() {
  return (
    <Shell>
      <article className="dh-card dh-prose" style={{ maxWidth: 820, margin: "0 auto" }}>
        <p className="dh-kicker">Privacy</p>
        <h1 className="dh-h2">What the castle remembers</h1>
        <h2>No accounts</h2>
        <p>There is no sign-up and no email. Connecting a wallet shares only its public address with this page.</p>
        <h2>Stored in your browser</h2>
        <p>Your wallet choice, practice ledger entries and whether you already passed the entrance gate are kept in your browser&apos;s storage. Clearing site data removes them.</p>
        <h2>Sent to our server</h2>
        <p>Chain reads go through this site&apos;s read-only relay, which sees your IP address to rate-limit requests and keeps short-lived counters only. Portraits are drawn on your device and never uploaded.</p>
        <h2>On chain</h2>
        <p>Anything you sign into the Coven Ledger is public forever, together with your wallet address. Do not write personal information there.</p>
      </article>
    </Shell>
  );
}
