"use client";

import { useEffect, useState } from "react";

/* One toast for the whole site: call toast("CA copied") from anywhere. */

const EVENT = "dh-toast";
export function toast(message: string) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: message }));
}

export function Toast() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    let t: number | undefined;
    const on = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      window.clearTimeout(t);
      t = window.setTimeout(() => setMsg(null), 1800);
    };
    window.addEventListener(EVENT, on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.clearTimeout(t);
    };
  }, []);
  return (
    <div className={`dh-toast ${msg ? "on" : ""}`} role="status" aria-live="polite">
      {msg ?? ""}
    </div>
  );
}
