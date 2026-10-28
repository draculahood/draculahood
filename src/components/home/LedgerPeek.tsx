"use client";

import Link from "next/link";
import { Crest } from "@/components/coven/Crest";
import { HallList } from "@/components/coven/HallList";
import { useCoven } from "@/components/coven/useCoven";
import { CRESTS } from "@/lib/art/crests";

/** Home preview of the Coven Ledger: the eight crests, counts and the newest three entries. */
export function LedgerPeek() {
  const c = useCoven(3);
  return (
    <div data-testid="ledger-peek">
      <div className="dh-crests" aria-label="The eight crests">
        {CRESTS.map((k) => (
          <div key={k.id} className="dh-crest" style={{ cursor: "default" }}>
            <Crest id={k.id} size={36} />
            {k.name}
            <span style={{ color: "var(--color-ecto)" }}>{c.crests ? c.crests[k.id] : "—"}</span>
          </div>
        ))}
      </div>
      <p className="dh-label" style={{ margin: "16px 0 4px" }}>
        {c.live ? `Signed so far: ${c.total ?? "—"}` : "Practice mode: the contract is not deployed yet, entries stay in your browser"}
      </p>
      {c.rows && c.rows.length ? <HallList rows={c.rows} limit={3} /> : <p className="dh-muted" style={{ fontSize: 16 }}>{c.live ? (c.readError ? "The ledger could not be read right now." : "No one has signed yet. The first line is yours.") : "No practice entries in this browser yet."}</p>}
      <div className="dh-cta" style={{ marginBottom: 0 }}>
        <Link className="dh-btn buy" href="/coven">
          Sign the ledger
        </Link>
        <Link className="dh-btn" href="/pfp">
          Make your vampire
        </Link>
      </div>
    </div>
  );
}
