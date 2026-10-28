"use client";

import { useState } from "react";
import { BRAND, TOKEN, explorerToken, isAddress, shortAddress } from "@/config/brand";
import { ArrowUpRight, CheckIcon, CopyIcon } from "@/components/site/Icons";
import { toast } from "@/components/site/Toast";

/* Contract address of $DRACULA from BRAND.ca. Until it is a real address every copy button says "At launch". */

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!isAddress(BRAND.ca)) return;
    try {
      await navigator.clipboard.writeText(BRAND.ca);
      toast("CA copied");
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard refused; the address stays visible.
    }
  };
  return { copied, copy };
}

/** Navbar pill: "$DRACULA 0x12…abcd [Copy]"; on narrow screens only the short "CA" button. */
export function CaPill({ compact = false }: { compact?: boolean }) {
  const { copied, copy } = useCopy();
  const live = TOKEN.isLive;
  return (
    <span className={`dh-ca ${compact ? "compact" : ""}`} data-testid={compact ? "ca-chip" : "ca-pill"}>
      {compact ? null : (
        <>
          <b>{BRAND.symbol}</b>
          <span>{live ? shortAddress(BRAND.ca, 4, 4) : "TBA"}</span>
        </>
      )}
      <button type="button" onClick={copy} disabled={!live} aria-label={live ? `Copy the ${BRAND.symbol} contract address` : `${BRAND.symbol} contract address: at launch`} title={live ? BRAND.ca : "The contract address is published at launch"}>
        {live && !compact ? copied ? <CheckIcon size={12} /> : <CopyIcon size={12} /> : null}
        {compact ? (live && copied ? "Copied" : "CA") : live ? (copied ? "Copied" : "Copy") : "At launch"}
      </button>
    </span>
  );
}

/** Full address row: label, address, Copy and View (home token block, footer, token page). */
export function CaBlock({ label = "Contract address", dark = false }: { label?: string; dark?: boolean }) {
  const { copied, copy } = useCopy();
  const live = TOKEN.isLive;
  return (
    <div data-testid="ca-block">
      <div className="flex items-center justify-between gap-3">
        <span className="dh-kicker">{label}</span>
        <span className="dh-kicker">Robinhood Chain</span>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <span className={`dh-code text-[11px] ${dark ? "" : "text-fg"}`} data-testid="ca-value">
          {live ? BRAND.ca : "Contract address coming soon"}
        </span>
        <span className="flex items-center gap-3">
          <button type="button" className="dh-mini" onClick={copy} disabled={!live} data-testid="ca-copy">
            {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
            {live ? (copied ? "Copied" : "Copy") : "At launch"}
          </button>
          {live ? (
            <a className="dh-mini" href={explorerToken(BRAND.ca)} target="_blank" rel="noreferrer">
              View <ArrowUpRight size={12} />
            </a>
          ) : null}
        </span>
      </div>
    </div>
  );
}

/** Hero row: "CA | address | Copy". Before launch the field reads "At launch" and the button is disabled. */
export function CaRow() {
  const { copied, copy } = useCopy();
  const live = TOKEN.isLive;
  return (
    <div className="dh-carow" data-testid="ca-row">
      <span className="lbl">CA</span>
      <input readOnly aria-label={`${BRAND.symbol} contract address`} value={live ? BRAND.ca : "Published at launch"} onFocus={(e) => e.currentTarget.select()} />
      <button type="button" onClick={copy} disabled={!live} data-testid="ca-row-copy">
        {live ? (copied ? "Copied" : "Copy") : "At launch"}
      </button>
    </div>
  );
}

/** A plain "Copy CA" button (how-to-buy and footer). */
export function CopyCaButton({ className = "dh-btn" }: { className?: string }) {
  const { copied, copy } = useCopy();
  const live = TOKEN.isLive;
  return (
    <button type="button" className={className} onClick={copy} disabled={!live} data-testid="copy-ca">
      {live ? (copied ? "Copied" : "Copy CA") : "CA at launch"}
    </button>
  );
}
