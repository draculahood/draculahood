import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, CHAIN, LAUNCHPAD, explorerAddress } from "@/config/brand";
import { CONTRACTS, CONTRACT_NAMES, GAS, bookLive } from "@/config/contracts";
import { Shell } from "@/components/site/Page";
import { Crest } from "@/components/coven/Crest";
import { JsonLd } from "@/components/JsonLd";
import { CRESTS } from "@/lib/art/crests";
import { FAQ, LORE, SCROLL, STEPS } from "@/content/castle";
import { breadcrumbLd, faqLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/docs",
  title: `Docs | ${BRAND.name}`,
  description: `How ${BRAND.name} works: the ${BRAND.symbol} launch on ${LAUNCHPAD.name}, the Coven Ledger contract on ${CHAIN.name}, the portrait maker, live data sources and risks.`,
});

export default function DocsPage() {
  const live = bookLive();
  return (
    <Shell>
      <JsonLd data={[breadcrumbLd([{ name: "Docs", path: "/docs" }]), faqLd(FAQ)]} />
      <article className="dh-card dh-prose" style={{ maxWidth: 900, margin: "0 auto" }}>
        <p className="dh-kicker">The Castle Scroll · full text</p>
        <h1 className="dh-h2">How the castle works</h1>
        <p>{LORE.paragraphs[0]}</p>

        {SCROLL.tabs.map((t) => (
          <section key={t.id}>
            <h2>{t.label}</h2>
            {t.blocks.map((b, i) => (
              <div key={i}>
                {b.h ? <h3>{b.h}</h3> : null}
                <p>{b.p}</p>
              </div>
            ))}
          </section>
        ))}

        <h2>Buying {BRAND.symbol}</h2>
        <ol>
          {STEPS.items.map((s) => (
            <li key={s.h}>
              <strong>{s.h}.</strong> {s.p}
            </li>
          ))}
        </ol>

        <h2>The Coven Ledger contract</h2>
        <p>
          <code>{CONTRACT_NAMES.book}</code> is a guestbook on {CHAIN.name}. It has no owner, no admin, no fee, no pause and no upgrade path, takes no constructor arguments and never holds ETH or tokens.{" "}
          {live ? (
            <>
              It is deployed at{" "}
              <a href={explorerAddress(CONTRACTS.book)} target="_blank" rel="noreferrer">
                <code>{CONTRACTS.book}</code>
              </a>
              .
            </>
          ) : (
            <>It is written and tested but not deployed yet; until then the ledger page runs in practice mode and nothing goes on chain.</>
          )}
        </p>
        <h3>Functions</h3>
        <ul>
          <li>
            <code>join(string name, uint8 crest)</code>: signs the book once per wallet. Names are 1 to 24 printable ASCII characters, with no space at either end and no double spaces. Crest ids run from 0 to 7.
          </li>
          <li>
            <code>update(string name, uint8 crest)</code>: changes your own entry; reverts when nothing changes.
          </li>
          <li>
            <code>entryOf(address)</code>, <code>positionOf(address)</code>, <code>isMember(address)</code>, <code>memberCount()</code>, <code>members(offset, limit)</code> (pages of up to 100), <code>crestCounts()</code>, <code>isValid(name, crest)</code>.
          </li>
          <li>
            <code>chainBlock()</code>: the chain&apos;s own block number, read from the ArbSys precompile, because on Robinhood Chain <code>block.number</code> inside a contract reports the parent chain&apos;s block.
          </li>
        </ul>
        <h3>Events</h3>
        <ul>
          <li>
            <code>Joined(address member, uint256 position, string name, uint8 crest, uint64 chainBlock)</code>
          </li>
          <li>
            <code>Updated(address member, uint256 position, string name, uint8 crest, uint32 changes, uint64 chainBlock)</code>
          </li>
        </ul>
        <h3>Cost</h3>
        <p>
          Deploying takes about {GAS.deploy.toLocaleString("en-US")} gas. Signing and updating cost ordinary gas paid in ETH; the contract charges nothing on top.
        </p>
        <h3>What it does not do</h3>
        <p>
          A nickname is not an identity check: anyone can write any allowed text. The contract cannot read words, so this site hides names that trip a short word filter, while the original text stays on chain. An entry carries no reward, allowance or priority.
        </p>

        <h2>The eight crests</h2>
        <div className="dh-crests" style={{ marginBottom: 12 }}>
          {CRESTS.map((c) => (
            <div key={c.id} className="dh-crest" style={{ cursor: "default" }}>
              <Crest id={c.id} size={40} />
              {c.id} · {c.name}
            </div>
          ))}
        </div>

        <h2>Live data</h2>
        <p>
          Block height, block pace, gas and transactions per block come from {CHAIN.name} RPC; ETH / USD from the Chainlink feed on {CHAIN.name}. Once the {BRAND.symbol} address is published, supply comes from the token contract, price and curve progress from its {LAUNCHPAD.name} bonding curve, and the holder count from the public explorer. Anything that cannot be read shows a dash.
        </p>

        <h2>Questions</h2>
        {FAQ.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
        <p>
          Ready? <Link href="/coven">Sign the Coven Ledger</Link> or <Link href="/pfp">paint your vampire</Link>.
        </p>
      </article>
    </Shell>
  );
}
