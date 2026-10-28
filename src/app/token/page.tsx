import type { Metadata } from "next";
import { BRAND, CHAIN, LAUNCHPAD, TOKEN, chartUrl, explorerToken } from "@/config/brand";
import { ASSETS } from "@/config/assets";
import { Shell } from "@/components/site/Page";
import { BuyButton } from "@/components/site/BuyButton";
import { CaBlock } from "@/components/site/CopyCa";
import { TokenStats } from "@/components/home/TokenStats";
import { NightClock } from "@/components/home/NightClock";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/token",
  title: `${BRAND.name} (${BRAND.symbol}) Token`,
  description: `${BRAND.name} (${BRAND.symbol}) on ${CHAIN.name}: contract address, live supply and ${LAUNCHPAD.name} curve data, how to buy and the risks in plain words.`,
});

export default function TokenPage() {
  const chart = TOKEN.isLive ? chartUrl(BRAND.ca) : null;
  return (
    <Shell>
      <JsonLd data={breadcrumbLd([{ name: "Token", path: "/token" }])} />
      <div className="dh-grid2">
        <div className="dh-card">
          <p className="dh-kicker">
            {BRAND.symbol} · {CHAIN.name}
          </p>
          <h1 className="dh-h2">{BRAND.name} token</h1>
          <p>
            {BRAND.symbol} is the memecoin of the castle. It launches on {LAUNCHPAD.name}&apos;s bonding curve on {CHAIN.name} (chain id {CHAIN.id}). It has no promised value, pays nothing and gives no rights; the Coven Ledger and the portrait maker work the same with or without it.
          </p>
          <CaBlock label={`${BRAND.symbol} contract address`} />
          <div className="dh-cta">
            <BuyButton />
            {chart ? (
              <a className="dh-btn" href={chart} target="_blank" rel="noopener noreferrer">
                Chart on DEXTools
              </a>
            ) : null}
            {TOKEN.isLive ? (
              <a className="dh-btn" href={explorerToken(BRAND.ca)} target="_blank" rel="noopener noreferrer">
                Explorer
              </a>
            ) : null}
          </div>
          {!TOKEN.isLive ? <p className="dh-note">Contract address coming soon. Until it is published here and on {BRAND.xHandle}, any token using this name is not ours.</p> : null}
          <TokenStats />
        </div>
        <div className="dh-card">
          <img src={ASSETS.count.src} alt={ASSETS.count.alt} width={ASSETS.count.w} height={ASSETS.count.h} style={{ width: "100%", height: "auto", border: "1px solid var(--line)" }} />
          <h2 className="dh-h2" style={{ fontSize: "clamp(30px,4vw,42px)", marginTop: 22 }}>
            Live from the chain
          </h2>
          <NightClock />
          <h3 className="dh-h3">Before you buy</h3>
          <p className="dh-muted" style={{ fontSize: 17 }}>
            Copy the address only from this page. Check it in your wallet prompt. Keep the amount small enough that losing all of it would not hurt, and never share your recovery phrase.
          </p>
        </div>
      </div>
    </Shell>
  );
}
