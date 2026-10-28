"use client";

import { useState } from "react";
import type { Tab } from "@/content/castle";

/** The Castle Scroll chapters. Every chapter is in the HTML; only the chosen one is visible. Arrow keys switch tabs. */
export function ScrollTabs({ tabs }: { tabs: Tab[] }) {
  const [on, setOn] = useState(tabs[0].id);
  return (
    <>
      <div className="dh-tabs" role="tablist" aria-label="Castle Scroll chapters">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-controls={`panel-${t.id}`}
            aria-selected={on === t.id}
            tabIndex={on === t.id ? 0 : -1}
            onClick={() => setOn(t.id)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              const n = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
              setOn(n.id);
              document.getElementById(`tab-${n.id}`)?.focus();
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} className="dh-tabpanel" role="tabpanel" id={`panel-${t.id}`} aria-labelledby={`tab-${t.id}`} hidden={on !== t.id}>
          {t.blocks.map((b, k) => (
            <div key={k}>
              {b.h ? <h3 className="dh-h3">{b.h}</h3> : null}
              <p>{b.p}</p>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
