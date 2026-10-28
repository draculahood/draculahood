import { CRESTS, SHIELD } from "@/lib/art/crests";

/** One of the eight Coven Ledger crests (inline SVG). */
export function Crest({ id, size = 40, title }: { id: number; size?: number; title?: string }) {
  const c = CRESTS[id] ?? CRESTS[0];
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path d={SHIELD} fill="#0b120f" stroke={c.tint} strokeWidth="2" />
      <path d={SHIELD} fill="none" stroke={c.tint} strokeOpacity=".25" transform="translate(32 33) scale(.84) translate(-32 -33)" />
      <path d={c.emblem} fill={c.tint} fillRule="evenodd" />
    </svg>
  );
}
