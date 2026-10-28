import type { Metadata } from "next";
import { BRAND, CHAIN } from "@/config/brand";
import { Shell } from "@/components/site/Page";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ path: "/terms", title: `Terms | ${BRAND.name}`, description: `Plain-words terms for using the ${BRAND.name} site, the Coven Ledger and the portrait maker on ${CHAIN.name}.` });

export default function Terms() {
  return (
    <Shell>
      <article className="dh-card dh-prose" style={{ maxWidth: 820, margin: "0 auto" }}>
        <p className="dh-kicker">Terms</p>
        <h1 className="dh-h2">House rules of the castle</h1>
        <p>{BRAND.name} is a community memecoin site. Using it means you accept the points below.</p>
        <h2>No advice, no promises</h2>
        <p>Nothing here is financial, legal or tax advice. {BRAND.symbol} has no promised value, pays nothing and gives no claim on anything. Its price can drop to almost nothing.</p>
        <h2>Your wallet, your actions</h2>
        <p>Every transaction is created and signed in your own wallet. This site never holds keys or funds and cannot undo a transaction. Check every prompt before you confirm.</p>
        <h2>The Coven Ledger</h2>
        <p>Entries are public and permanent on {CHAIN.name}. Do not write personal data, slurs or someone else&apos;s name. The site may hide names from its own pages; it cannot remove them from the chain.</p>
        <h2>Third parties</h2>
        <p>Buying happens on a third-party launchpad and DEX, and charts open on a third-party site. Their rules and fees are theirs.</p>
        <h2>No warranty</h2>
        <p>The site and contracts are provided as they are. They may contain mistakes; the ledger contract cannot be changed once deployed.</p>
        <p>{BRAND.name} is not connected to Robinhood Markets, Inc.</p>
      </article>
    </Shell>
  );
}
