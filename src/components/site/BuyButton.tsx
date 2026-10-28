import { BRAND, LAUNCHPAD, TOKEN, buyUrl } from "@/config/brand";

/** Buy button for the own token: Pons token page once the CA is real, else the Pons home with an "At launch" note. */
export function BuyButton({ label, sm = false, className = "" }: { label?: string; sm?: boolean; className?: string }) {
  const live = TOKEN.isLive;
  return (
    <a
      className={`dh-btn buy ${sm ? "sm" : ""} ${className}`}
      href={buyUrl()}
      target="_blank"
      rel="noopener noreferrer"
      title={live ? `Open ${BRAND.symbol} on ${LAUNCHPAD.name}` : `${BRAND.symbol} is not on ${LAUNCHPAD.name} yet; this opens the launchpad`}
      data-testid="buy"
    >
      {label ?? (sm ? "Buy" : `Buy ${BRAND.symbol}`)}
      {!live && !sm ? <small>At launch</small> : null}
    </a>
  );
}
