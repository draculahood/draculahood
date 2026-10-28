"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/config/brand";
import { storageKey } from "@/config/storage";
import { startSound } from "@/components/castle/sound";

const SEEN = storageKey("gate", "seen");

/**
 * The black gate before the hall: the name materialises letter by letter, then "Enter the castle" starts the sound
 * and opens the page. Shown once per browser session; the page content is in the HTML underneath all along.
 */
export function Gate() {
  const [state, setState] = useState<"wait" | "show" | "ready" | "out" | "gone">("wait");

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN) === "1";
    } catch {
      // storage blocked: show the gate
    }
    if (seen) {
      const t = window.setTimeout(() => setState("gone"), 0);
      return () => window.clearTimeout(t);
    }
    document.body.classList.add("dh-locked");
    const a = window.setTimeout(() => setState("show"), 900);
    const b = window.setTimeout(() => setState("ready"), 2600);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
      document.body.classList.remove("dh-locked");
    };
  }, []);

  if (state === "gone") return null;

  const enter = () => {
    startSound();
    try {
      sessionStorage.setItem(SEEN, "1");
    } catch {
      // ignore
    }
    document.body.classList.remove("dh-locked");
    window.scrollTo(0, 0);
    setState("out");
    window.setTimeout(() => setState("gone"), 1700);
  };

  const letters = BRAND.name.toUpperCase().split("");
  return (
    <div className={`dh-gate ${state === "show" || state === "ready" || state === "out" ? "show" : ""} ${state === "ready" || state === "out" ? "ready" : ""} ${state === "out" ? "out" : ""}`} role="dialog" aria-label={`Enter ${BRAND.name}`} data-testid="gate">
      <div className="dh-gate-inner">
        <p className="dh-gate-title" aria-label={BRAND.name}>
          {letters.map((ch, i) => (
            <span key={i} aria-hidden="true" style={{ animationDelay: `${i * 0.1}s, ${2.4 + i * 0.33}s` }}>
              {ch}
            </span>
          ))}
        </p>
        <button type="button" className="dh-gate-enter" onClick={enter} data-testid="enter">
          Enter the castle
        </button>
        <div className="dh-gate-note">{state === "ready" ? "the count is awake" : "lighting the candles"}</div>
      </div>
    </div>
  );
}
