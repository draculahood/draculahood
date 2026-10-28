"use client";

import { BRAND, TOKEN, explorerToken } from "@/config/brand";
import { useChain } from "@/components/providers/ChainProvider";
import { compact } from "@/lib/format";

/** The tokenomics grid, filled from the chain: supply, curve progress, market cap, holders. A dash until readable. */
export function TokenStats() {
  const { facts } = useChain();
  const live = TOKEN.isLive;
  const t = facts?.token;
  const supply = t?.supply && t.decimals !== null ? Number(BigInt(t.supply) / 10n ** BigInt(t.decimals)) : null;
  const m = facts?.market;
  const pct = m ? Math.min(100, m.progressBps / 100) : null;
  const dash = "—";
  return (
    <div className="dh-stats" data-testid="token-stats">
      <div className="dh-stat full">
        <div className="k">Total supply</div>
        <div className="v">
          {supply !== null ? `${supply.toLocaleString("en-US")} ${BRAND.symbol}` : dash}
        </div>
        <div className="dh-bar" aria-hidden="true">
          <span style={{ width: `${pct ?? 0}%` }} />
        </div>
        <div className="s">{live ? (pct !== null ? `Bonding curve ${pct.toFixed(1)}% filled${m?.graduated ? " · graduated" : ""}` : "Curve progress not readable right now") : "Read from the chain once the contract address is published"}</div>
      </div>
      <div className="dh-stat">
        <div className="k">Curve price</div>
        <div className="v">{m ? `${m.priceEth.toPrecision(3)} ETH` : dash}</div>
      </div>
      <div className="dh-stat">
        <div className="k">Market cap</div>
        <div className="v">{m && facts?.ethUsd ? `$${compact(m.marketCapEth * facts.ethUsd)}` : m ? `${compact(m.marketCapEth)} ETH` : dash}</div>
      </div>
      <div className="dh-stat">
        <div className="k">Holders</div>
        <div className="v">{facts?.holders != null ? facts.holders.toLocaleString("en-US") : dash}</div>
      </div>
      <div className="dh-stat">
        <div className="k">Contract</div>
        <div className="v">
          {live ? (
            <a href={explorerToken(BRAND.ca)} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
              Explorer
            </a>
          ) : (
            "At launch"
          )}
        </div>
      </div>
    </div>
  );
}
