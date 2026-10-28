"use client";

import { explorerAddress, explorerBlock, shortAddress } from "@/config/brand";
import { Crest } from "@/components/coven/Crest";
import { crestName } from "@/lib/art/crests";
import { displayName } from "@/lib/coven";
import type { HallRow } from "@/components/coven/useCoven";

/** Castle Hall rows: crest, nickname (word-filtered), wallet, position and block. */
export function HallList({ rows, limit }: { rows: HallRow[]; limit?: number }) {
  const shown = limit ? rows.slice(0, limit) : rows;
  return (
    <div data-testid="hall-list">
      {shown.map((r) => (
        <div className="dh-row" key={`${r.wallet}-${r.position}`}>
          <Crest id={r.crest} size={40} title={`${crestName(r.crest)} crest`} />
          <div className="min-w-0">
            <div className="nm">{displayName(r.name)}</div>
            <a className="ad" href={explorerAddress(r.wallet)} target="_blank" rel="noreferrer">
              {shortAddress(r.wallet, 6, 4)}
            </a>
            {r.changes > 0 ? <span className="ad"> · changed {r.changes}×</span> : null}
          </div>
          <div className="bk">
            #{r.position}
            <br />
            {r.practice ? "practice" : r.block ? (
              <a href={explorerBlock(r.block)} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
                blk {r.block.toLocaleString("en-US")}
              </a>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
