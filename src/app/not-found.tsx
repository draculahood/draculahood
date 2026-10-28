import Link from "next/link";
import { Shell } from "@/components/site/Page";

export default function NotFound() {
  return (
    <Shell footer={false}>
      <div className="dh-card" style={{ maxWidth: 640 }}>
        <p className="dh-kicker">404 · Locked room</p>
        <h1 className="dh-h2">This door stays shut</h1>
        <p>There is no room at this address. The hall, the ledger and the portrait maker are still open.</p>
        <div className="dh-cta">
          <Link className="dh-btn buy" href="/">
            Back to the hall
          </Link>
          <Link className="dh-btn" href="/coven">
            Coven Ledger
          </Link>
        </div>
      </div>
    </Shell>
  );
}
