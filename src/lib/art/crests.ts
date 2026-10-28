/*
 * The eight Coven Ledger crests, drawn by us as plain SVG in a 64 x 64 box. The crest id stored on chain is the
 * index into CRESTS (0 to 7), so the order never changes; only the drawing may be restyled.
 */

export type Crest = { id: number; name: string; motto: string; tint: string; emblem: string };

/** Shield outline shared by every crest. */
export const SHIELD = "M32 4 L56 11 V29 C56 45 46 55 32 61 C18 55 8 45 8 29 V11 Z";

export const CRESTS: Crest[] = [
  {
    id: 0,
    name: "Bat",
    motto: "Wings at dusk",
    tint: "#c2364a",
    emblem:
      "M32 26 C30 22 28 21 26 22 C26 25 24 27 20 26 C19 29 17 31 13 31 C16 33 18 37 18 40 C21 38 24 38 26 40 C27 37 29 36 32 38 C35 36 37 37 38 40 C40 38 43 38 46 40 C46 37 48 33 51 31 C47 31 45 29 44 26 C40 27 38 25 38 22 C36 21 34 22 32 26 Z",
  },
  {
    id: 1,
    name: "Rose",
    motto: "Thorns first",
    tint: "#c2364a",
    emblem:
      "M32 20 C37 20 41 24 41 29 C41 34 37 37 32 37 C27 37 23 34 23 29 C23 24 27 20 32 20 Z M32 24 C29 24 27 26 27 29 C29 28 31 28 32 30 C33 28 35 28 37 29 C37 26 35 24 32 24 Z M31 37 H33 V50 H31 Z M33 43 C36 41 39 41 41 43 C38 45 35 45 33 44 Z M31 46 C28 44 25 44 23 46 C26 48 29 48 31 47 Z",
  },
  {
    id: 2,
    name: "Fang",
    motto: "One bite, one name",
    tint: "#dfe7e1",
    emblem: "M18 20 H46 V25 C46 27 44 28 42 28 H22 C20 28 18 27 18 25 Z M22 28 H29 L25.5 46 Z M35 28 H42 L38.5 46 Z",
  },
  {
    id: 3,
    name: "Moon",
    motto: "Never set",
    tint: "#ffb46b",
    emblem: "M36 18 C27 19 21 26 21 34 C21 43 28 50 37 50 C40 50 43 49 45 47 C37 47 31 41 31 33 C31 26 35 20 41 18 C39 17.5 37.5 17.6 36 18 Z M43 26 L44 28.5 L46.5 29 L44 30 L43 32.5 L42 30 L39.5 29 L42 28.5 Z",
  },
  {
    id: 4,
    name: "Coffin",
    motto: "Rest is optional",
    tint: "#8da397",
    emblem: "M27 16 H37 L43 24 L39 50 H25 L21 24 Z M31 23 H33 V28 H37 V30 H33 V40 H31 V30 H27 V28 H31 Z",
  },
  {
    id: 5,
    name: "Candle",
    motto: "Keep it lit",
    tint: "#ffb46b",
    emblem: "M32 14 C35 18 36 21 34 24 C33 25.5 31 25.5 30 24 C28 21 29 18 32 14 Z M27 27 H37 V48 H27 Z M23 48 H41 V52 H23 Z M27 31 C29 32 30 34 29 36 C28 34 27.5 33 27 31 Z",
  },
  {
    id: 6,
    name: "Raven",
    motto: "Watching the hall",
    tint: "#a8ffc4",
    emblem: "M40 19 C44 19 47 22 47 25 L51 26 L47 28 C47 31 45 33 43 34 L46 46 L41 40 L38 46 L37 38 C30 39 22 36 17 30 C23 31 28 30 32 28 C33 23 36 19 40 19 Z M41 23 A1.5 1.5 0 1 0 41.1 23 Z",
  },
  {
    id: 7,
    name: "Key",
    motto: "The far door",
    tint: "#dfe7e1",
    emblem: "M32 15 C36.4 15 40 18.6 40 23 C40 26.4 37.9 29.3 35 30.4 V48 H39 V51 H35 V53 H29 V30.4 C26.1 29.3 24 26.4 24 23 C24 18.6 27.6 15 32 15 Z M32 19.5 C30 19.5 28.5 21 28.5 23 C28.5 25 30 26.5 32 26.5 C34 26.5 35.5 25 35.5 23 C35.5 21 34 19.5 32 19.5 Z M35 41 H39 V44 H35 Z",
  },
];

export const crestName = (id: number) => CRESTS[id]?.name ?? "Unknown";

/** A crest as a standalone SVG string (generator, exports). */
export function crestSvg(id: number, size = 64) {
  const c = CRESTS[id] ?? CRESTS[0];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64"><path d="${SHIELD}" fill="#0b120f" stroke="${c.tint}" stroke-width="2"/><path d="${SHIELD}" fill="none" stroke="${c.tint}" stroke-opacity=".25" stroke-width="1" transform="translate(32 33) scale(.84) translate(-32 -33)"/><path d="${c.emblem}" fill="${c.tint}" fill-rule="evenodd"/></svg>`;
}
