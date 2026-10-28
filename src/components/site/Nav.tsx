"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { ASSETS } from "@/config/assets";
import { APP_LINKS, HALL_LINKS } from "@/components/site/links";
import { BuyButton } from "@/components/site/BuyButton";
import { CaPill } from "@/components/site/CopyCa";
import { NavWallet } from "@/components/wallet/WalletButton";
import { CloseIcon, MenuIcon } from "@/components/site/Icons";
import { onSound, soundOn, toggleSound } from "@/components/castle/sound";

/** Top bar. On the castle hall it links the hall's rooms and carries the sound switch; elsewhere it links the app pages. */
export function Nav({ home = false }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  const sound = useSyncExternalStore(
    (fn) => onSound(() => fn()),
    soundOn,
    () => true,
  );
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!home) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { threshold: 0.5 },
    );
    document.querySelectorAll("main section[id]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [home]);

  const links = home ? HALL_LINKS : [{ href: "/", label: "Hall" }, ...APP_LINKS];
  const drawer = home ? [...HALL_LINKS, ...APP_LINKS] : links;

  return (
    <>
      <nav className="dh-nav" aria-label="Main">
        <Link className="dh-logo" href={home ? "#home" : "/"} aria-label={`${BRAND.name} home`}>
          <img src={ASSETS.mark} alt="" width={30} height={30} />
          {BRAND.name}
        </Link>
        <div className="dh-links">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`${active === l.href ? "on" : ""} ${"minor" in l && l.minor ? "minor" : ""}`}>
              {l.label}
            </Link>
          ))}
          {home ? (
            <Link href="/coven" className="app">
              Coven
            </Link>
          ) : null}
        </div>
        <div className="dh-right">
          {home ? (
            <button type="button" className="dh-iconbtn dh-sound" aria-pressed={!sound} onClick={toggleSound} data-testid="sound">
              Sound: {sound ? "on" : "off"}
            </button>
          ) : null}
          <CaPill />
          <NavWallet />
          <BuyButton sm />
          <button type="button" className="dh-iconbtn dh-menu-btn" aria-expanded={open} aria-label="Menu" onClick={() => setOpen((v) => !v)} data-testid="menu">
            {open ? <CloseIcon size={14} /> : <MenuIcon size={14} />}
          </button>
        </div>
      </nav>
      {open ? (
        <div className="dh-drawer" data-testid="drawer">
          {drawer.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <CaPill compact />
            <BuyButton sm />
            {home ? (
              <button type="button" className="dh-iconbtn" aria-pressed={!sound} onClick={toggleSound}>
                Sound: {sound ? "on" : "off"}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
