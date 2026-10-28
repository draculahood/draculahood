import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Grain } from "@/components/castle/CastleWorld";

/** App pages: the same night background as the hall (flat, no 3D), the top bar and the closing card. */
export function Shell({ children, footer = true }: { children: React.ReactNode; footer?: boolean }) {
  return (
    <>
      <div className="dh-flat" aria-hidden="true" />
      <div className="dh-vignette" aria-hidden="true" />
      <Grain />
      <Nav />
      <main className="dh-page">{children}</main>
      {footer ? <Footer /> : null}
    </>
  );
}
