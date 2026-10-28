import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { Shell } from "@/components/site/Page";
import { PfpMaker } from "@/components/pfp/PfpMaker";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/pfp",
  title: `Vampire Portrait Maker | ${BRAND.name}`,
  description: `Build a ${BRAND.name} vampire profile picture from parts (skin, hair, eyes, fangs, cape, extras, backdrop) and save it as PNG or WebP. Nothing is uploaded.`,
});

export default function PfpPage() {
  return (
    <Shell>
      <JsonLd data={breadcrumbLd([{ name: "Portraits", path: "/pfp" }])} />
      <header style={{ maxWidth: 760, marginBottom: 28 }}>
        <p className="dh-kicker">Portrait gallery</p>
        <h1 className="dh-h2">Paint your vampire</h1>
        <p className="dh-tag" style={{ maxWidth: "52ch" }}>
          Mix pale skin, a widow&apos;s peak, red eyes and a high collar until the portrait looks like it belongs on the castle wall.
        </p>
      </header>
      <PfpMaker />
    </Shell>
  );
}
