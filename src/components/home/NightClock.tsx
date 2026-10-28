"use client";

import { useEffect, useState } from "react";
import { explorerBlock } from "@/config/brand";
import { useChain } from "@/components/providers/ChainProvider";

const pad = (n: number) => String(n).padStart(2, "0");

/** Countdown to the next local midnight, next to live Robinhood Chain facts (block, gas, ETH price, txs). */
export function NightClock() {
  const { facts, failed } = useChain();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const first = window.setTimeout(() => setNow(Date.now()), 0);
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(t);
    };
  }, []);
  let left = "--:--:--";
  if (now !== null) {
    const d = new Date(now);
    const midnight = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
    const s = Math.max(0, Math.floor((midnight - now) / 1000));
    left = `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
  }
  const dash = "—";
  return (
    <div data-testid="night-clock">
      <div className="dh-stats">
        <div className="dh-stat full">
          <div className="k">Until your next midnight</div>
          <div className="v" data-testid="countdown" suppressHydrationWarning>
            {left}
          </div>
          <div className="s">Your own time zone. At midnight the count simply starts counting again.</div>
        </div>
        <div className="dh-stat">
          <div className="k">Robinhood Chain block</div>
          <div className="v" data-testid="block">
            {facts?.block ? (
              <a href={explorerBlock(facts.block)} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                {facts.block.toLocaleString("en-US")}
              </a>
            ) : (
              dash
            )}
          </div>
          <div className="s">{facts?.blockPace ? `about ${facts.blockPace.toFixed(2)} s per block` : failed ? "chain not reachable right now" : "reading…"}</div>
        </div>
        <div className="dh-stat">
          <div className="k">ETH / USD</div>
          <div className="v">{facts?.ethUsd ? `$${facts.ethUsd.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : dash}</div>
          <div className="s">Chainlink feed on chain</div>
        </div>
        <div className="dh-stat">
          <div className="k">Gas price</div>
          <div className="v">{facts?.gasGwei != null ? `${facts.gasGwei < 0.1 ? facts.gasGwei.toFixed(4) : facts.gasGwei.toFixed(2)} gwei` : dash}</div>
        </div>
        <div className="dh-stat">
          <div className="k">Txs in latest block</div>
          <div className="v">{facts?.txs != null ? facts.txs : dash}</div>
        </div>
      </div>
    </div>
  );
}
