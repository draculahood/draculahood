"use client";

import { useEffect, useMemo, useState } from "react";
import { BRAND } from "@/config/brand";
import { toast } from "@/components/site/Toast";
import { PARTS, PART_KEYS, decodeVampire, encodeVampire, randomVampire, vampireSvg, type PartKey, type VampireConfig } from "@/lib/art/vampire";

const LABELS: Record<PartKey, string> = { skin: "Skin", hair: "Hair", eyes: "Eyes", mouth: "Mouth", cape: "Cape", extra: "Extra", backdrop: "Backdrop" };

/** Vampire portrait maker: pick parts, share by link, export PNG or WebP. Everything happens in the browser. */
export function PfpMaker() {
  const [cfg, setCfg] = useState<VampireConfig>(() => decodeVampire(null));
  const svg = useMemo(() => vampireSvg(cfg, 512), [cfg]);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("v");
    if (!code) return;
    const t = window.setTimeout(() => setCfg(decodeVampire(code)), 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("v", encodeVampire(cfg));
    window.history.replaceState(null, "", url.toString());
  }, [cfg]);

  async function exportAs(type: "image/png" | "image/webp", size = 1024) {
    const img = new Image();
    const blobUrl = URL.createObjectURL(new Blob([vampireSvg(cfg, size)], { type: "image/svg+xml" }));
    try {
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error("render failed"));
        img.src = blobUrl;
      });
      const c = document.createElement("canvas");
      c.width = c.height = size;
      c.getContext("2d")!.drawImage(img, 0, 0, size, size);
      const out = await new Promise<Blob | null>((res) => c.toBlob(res, type, 0.92));
      if (!out) throw new Error("export failed");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(out);
      a.download = `${BRAND.slug}-vampire-${encodeVampire(cfg)}.${type === "image/png" ? "png" : "webp"}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      toast("Portrait saved");
    } catch {
      toast("Export failed in this browser");
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  }

  return (
    <div className="dh-grid2">
      <div className="dh-card">
        <div className="dh-portrait" role="img" aria-label="Your vampire portrait" data-testid="portrait" dangerouslySetInnerHTML={{ __html: svg }} />
        <div className="dh-cta" style={{ marginBottom: 0 }}>
          <button type="button" className="dh-btn buy" onClick={() => exportAs("image/png")} data-testid="export-png">
            Save PNG
          </button>
          <button type="button" className="dh-btn" onClick={() => exportAs("image/webp")}>
            Save WebP
          </button>
          <button type="button" className="dh-btn" onClick={() => setCfg(randomVampire())} data-testid="random">
            Surprise me
          </button>
        </div>
      </div>
      <div className="dh-card" data-testid="parts">
        <p className="dh-kicker">Parts · code {encodeVampire(cfg)}</p>
        {PART_KEYS.map((k) => (
          <div className="dh-field" key={k}>
            <span className="dh-label">{LABELS[k]}</span>
            <div className="dh-swatches" role="group" aria-label={LABELS[k]}>
              {PARTS[k].map((p, i) => (
                <button key={p.name} type="button" className="dh-swatch" aria-pressed={cfg[k] === i} onClick={() => setCfg((c) => ({ ...c, [k]: i }))}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="dh-mini"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(window.location.href);
              toast("Link copied");
            } catch {
              toast("Copy the address bar instead");
            }
          }}
        >
          Copy share link
        </button>
        <p className="dh-muted" style={{ fontSize: 15, marginTop: 16 }}>
          The portrait is drawn on your device and never uploaded. It is a picture for your profile, not an NFT and not a ticket to anything.
        </p>
      </div>
    </div>
  );
}
