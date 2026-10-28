"use client";

import { useState } from "react";
import { CONTRACTS } from "@/config/contracts";
import { explorerAddress, explorerTx } from "@/config/brand";
import { Crest } from "@/components/coven/Crest";
import { HallList } from "@/components/coven/HallList";
import { useCoven } from "@/components/coven/useCoven";
import { CRESTS } from "@/lib/art/crests";
import { MAX_NAME, nameProblem } from "@/lib/coven";

/** The Coven Ledger: sign or update your entry, then read the Castle Hall. */
export function CovenApp() {
  const c = useCoven(200);
  const [name, setName] = useState("");
  const [crest, setCrest] = useState(0);
  const [filter, setFilter] = useState("");
  const [seeded, setSeeded] = useState(false);

  // Fill the form with the existing entry once it is known (state adjusted during render, not in an effect).
  if (c.myEntry && !seeded) {
    setSeeded(true);
    setName(c.myEntry.name);
    setCrest(c.myEntry.crest);
  }

  const problem = name ? nameProblem(name) : null;
  const rows = (c.rows ?? []).filter((r) => !filter || r.name.toLowerCase().includes(filter.toLowerCase()) || r.wallet.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="dh-grid2">
      <div className="dh-card" data-testid="coven-form">
        <p className="dh-kicker">{c.myEntry ? `Your entry · #${c.myEntry.position}` : "New entry"}</p>
        <h2 className="dh-h2" style={{ fontSize: "clamp(34px,4vw,48px)" }}>
          {c.myEntry ? "Change your line" : "Write your name"}
        </h2>
        {c.live ? (
          <p className="dh-note ok">
            Live on Robinhood Chain:{" "}
            <a href={explorerAddress(CONTRACTS.book)} target="_blank" rel="noreferrer">
              DraculahoodCovenBook
            </a>
            . Signing sends one transaction from your wallet and costs only gas.
          </p>
        ) : (
          <p className="dh-note" data-testid="practice-note">
            Practice mode. The ledger contract is written and tested but not deployed yet, so signing here asks your wallet for a free signature and keeps the entry in this browser only. Nothing goes on chain.
          </p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            c.sign(name.trim() === name ? name : name.trim(), crest);
          }}
        >
          <div className="dh-field">
            <label htmlFor="nick">Nickname · 1 to {MAX_NAME} plain characters</label>
            <input id="nick" className="dh-input" value={name} maxLength={MAX_NAME + 4} autoComplete="off" spellCheck={false} placeholder="Countess Vale" onChange={(e) => setName(e.target.value)} data-testid="nick" />
            <span className="dh-label" style={{ letterSpacing: ".08em", textTransform: "none", color: problem ? "var(--color-ember)" : undefined }}>
              {problem ?? `${name.length} / ${MAX_NAME}`}
            </span>
          </div>
          <div className="dh-field">
            <span className="dh-label">Crest</span>
            <div className="dh-crests" role="group" aria-label="Choose a crest">
              {CRESTS.map((k) => (
                <button type="button" key={k.id} className="dh-crest" aria-pressed={crest === k.id} onClick={() => setCrest(k.id)} data-testid={`crest-${k.id}`}>
                  <Crest id={k.id} size={40} />
                  {k.name}
                </button>
              ))}
            </div>
            <span className="dh-label" style={{ textTransform: "none", letterSpacing: ".06em" }}>
              {CRESTS[crest].name}: “{CRESTS[crest].motto}”
            </span>
          </div>
          <button type="submit" className="dh-btn buy" disabled={c.busy} data-testid="sign">
            {c.busy ? "Check your wallet…" : !c.address ? "Connect to sign" : c.myEntry ? "Update my entry" : c.live ? "Sign the ledger" : "Sign (practice)"}
          </button>
        </form>
        {c.msg ? (
          <p className={`dh-note ${c.msg.ok ? "ok" : "bad"}`} style={{ marginTop: 16 }} role="status" data-testid="sign-msg">
            {c.msg.text}{" "}
            {c.msg.hash ? (
              <a href={explorerTx(c.msg.hash)} target="_blank" rel="noreferrer">
                View transaction
              </a>
            ) : null}
          </p>
        ) : null}
        <p className="dh-muted" style={{ fontSize: 15, marginTop: 18 }}>
          Your entry is public and tied to your wallet address. The nickname is decoration, not proof of who you are; anyone can pick any free-text name. An entry earns nothing and grants nothing.
        </p>
      </div>

      <div className="dh-card" data-testid="hall">
        <p className="dh-kicker">Castle Hall</p>
        <h2 className="dh-h2" style={{ fontSize: "clamp(34px,4vw,48px)" }}>
          Who signed
        </h2>
        <p className="dh-label" style={{ marginBottom: 10 }}>
          {c.live ? `Members: ${c.total ?? "—"} · newest first` : `Practice entries in this browser: ${c.total ?? 0}`}
        </p>
        <input className="dh-input" placeholder="Filter by nickname or address" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter the hall" style={{ marginBottom: 12 }} />
        {c.readError ? <p className="dh-note bad">The ledger could not be read: {c.readError}</p> : null}
        {c.rows === null ? (
          <p className="dh-muted">Reading the ledger…</p>
        ) : rows.length ? (
          <HallList rows={rows} />
        ) : (
          <p className="dh-muted">{filter ? "No entry matches that filter." : c.live ? "Nobody has signed yet." : "No practice entries yet. Sign on the left to see how a line looks."}</p>
        )}
        {c.live ? (
          <button type="button" className="dh-mini" style={{ marginTop: 12 }} onClick={() => c.reload()}>
            Refresh
          </button>
        ) : null}
        <p className="dh-muted" style={{ fontSize: 14, marginTop: 14 }}>
          Names that trip this site&apos;s word filter are hidden here. The contract itself cannot read words, so the original text stays on chain.
        </p>
      </div>
    </div>
  );
}
