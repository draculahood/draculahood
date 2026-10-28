import Link from "next/link";
import { BRAND, CHAIN, LAUNCHPAD, TOKEN } from "@/config/brand";
import { CastleWorld } from "@/components/castle/CastleWorld";
import { Gate } from "@/components/castle/Gate";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { BuyButton } from "@/components/site/BuyButton";
import { CaRow, CopyCaButton } from "@/components/site/CopyCa";
import { TokenStats } from "@/components/home/TokenStats";
import { NightClock } from "@/components/home/NightClock";
import { LedgerPeek } from "@/components/home/LedgerPeek";
import { ScrollTabs } from "@/components/home/ScrollTabs";
import { JsonLd } from "@/components/JsonLd";
import { FAQ, HERO, LEDGER, LORE, NIGHT, ROADMAP, SCROLL, STEPS, TOKENOMICS } from "@/content/castle";
import { faqLd } from "@/lib/seo";

/*
 * The castle hall: one long page, each room a card that floats on the side opposite the count.
 * data-side tells the 3D scene where the count should drift while that room is in view.
 */
export default function Home() {
  return (
    <>
      <Gate />
      <CastleWorld />
      <Nav home />
      <JsonLd data={faqLd(FAQ)} />
      <main className="dh-main">
        <section id="home" className="dh-sec l dh-hero-sec" data-side="1.3">
          <div className="dh-hero">
            <p className="dh-kicker">{TOKEN.isLive ? HERO.eyebrowLive : HERO.eyebrowSoon}</p>
            <h1>{BRAND.name}</h1>
            <p className="dh-tag">{HERO.line}</p>
            <div className="dh-cta">
              <BuyButton />
              <a className="dh-btn" href="#how-to-buy">
                How to buy
              </a>
            </div>
            <CaRow />
            <div className="dh-hint">
              <i />
              {HERO.scroll}
            </div>
          </div>
        </section>

        <section id="lore" className="dh-sec l" data-side="1.9">
          <div className="dh-card">
            <p className="dh-kicker">{LORE.eyebrow}</p>
            <h2 className="dh-h2">{LORE.title}</h2>
            {LORE.paragraphs.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
            <p className="dh-muted">
              <em>{LORE.tip}</em>
            </p>
          </div>
        </section>

        <section id="tokenomics" className="dh-sec r" data-side="-1.9">
          <div className="dh-card">
            <p className="dh-kicker">{TOKENOMICS.eyebrow}</p>
            <h2 className="dh-h2">{TOKENOMICS.title}</h2>
            <TokenStats />
            <p className="dh-muted">{TOKENOMICS.note}</p>
          </div>
        </section>

        <section id="how-to-buy" className="dh-sec l" data-side="1.9">
          <div className="dh-card wide">
            <p className="dh-kicker">{STEPS.eyebrow}</p>
            <h2 className="dh-h2">{STEPS.title}</h2>
            <ol className="dh-steps">
              {STEPS.items.map((s, i) => (
                <li key={s.h}>
                  <span className="n">{i + 1}</span>
                  <div>
                    <h3 className="dh-h3">{s.h}</h3>
                    <p>{s.p}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div style={{ overflowX: "auto" }}>
              <table className="dh-table">
                <tbody>
                  <tr>
                    <td>Ticker</td>
                    <td>{BRAND.symbol}</td>
                  </tr>
                  <tr>
                    <td>Chain</td>
                    <td>{CHAIN.name}</td>
                  </tr>
                  <tr>
                    <td>Chain id</td>
                    <td>{CHAIN.id}</td>
                  </tr>
                  <tr>
                    <td>Fees paid in</td>
                    <td>{CHAIN.nativeSymbol}</td>
                  </tr>
                  <tr>
                    <td>Launch venue</td>
                    <td>{LAUNCHPAD.name}</td>
                  </tr>
                  <tr>
                    <td>Contract</td>
                    <td className="dh-code">{TOKEN.isLive ? BRAND.ca : "At launch"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="dh-cta" style={{ marginBottom: 0 }}>
              <BuyButton label={`Buy on ${LAUNCHPAD.name}`} />
              <CopyCaButton />
            </div>
          </div>
        </section>

        <section id="ledger" className="dh-sec r" data-side="-1.9">
          <div className="dh-card wide">
            <p className="dh-kicker">{LEDGER.eyebrow}</p>
            <h2 className="dh-h2">{LEDGER.title}</h2>
            {LEDGER.paragraphs.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
            <LedgerPeek />
          </div>
        </section>

        <section id="night" className="dh-sec l" data-side="1.9">
          <div className="dh-card">
            <p className="dh-kicker">{NIGHT.eyebrow}</p>
            <h2 className="dh-h2">{NIGHT.title}</h2>
            <NightClock />
            <p className="dh-muted">{NIGHT.note}</p>
          </div>
        </section>

        <section id="scroll" className="dh-sec r" data-side="-2">
          <div className="dh-card wide">
            <p className="dh-kicker">{SCROLL.eyebrow}</p>
            <h2 className="dh-h2">{SCROLL.title}</h2>
            <div className="dh-meta">
              {SCROLL.meta.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
            <ScrollTabs tabs={SCROLL.tabs} />
            <p className="dh-muted" style={{ fontSize: 16 }}>
              The full write-up, contract reference and every question live in the <Link href="/docs">docs</Link>.
            </p>
          </div>
        </section>

        <section id="roadmap" className="dh-sec l" data-side="1.9">
          <div className="dh-card">
            <p className="dh-kicker">{ROADMAP.eyebrow}</p>
            <h2 className="dh-h2">{ROADMAP.title}</h2>
            <div className="dh-phases">
              {ROADMAP.phases.map((ph) => (
                <div key={ph.name} className={`dh-phase ${ph.live ? "live" : ""}`}>
                  <span className="dot" />
                  <div>
                    <h3 className="dh-h3">
                      {ph.name} <span className="dh-chip">{ph.chip}</span>
                    </h3>
                    <ul>
                      {ph.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <p className="dh-muted" style={{ fontSize: 16 }}>
              Planned means an idea, not a promise. Nothing here has a date.
            </p>
          </div>
        </section>

        <section id="faq" className="dh-sec r" data-side="-1.9">
          <div className="dh-card dh-faq">
            <p className="dh-kicker">Hall 08 · Questions</p>
            <h2 className="dh-h2">Asked after dark</h2>
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
