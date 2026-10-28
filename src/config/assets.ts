/*
 * Every image path in one place. The brand files are prebuilt from the project's own artwork (revised 28 Oct 2026: the
 * full-length vampire figure, his portrait before the castle and the banner); replace a file at its path to change it, no code edits needed. Crests and the /pfp
 * portrait parts are code-drawn in src/lib/art.
 */
export const ASSETS = {
  /** Round badge of the owner's vampire (head and collar from the portrait), transparent outside (top bar). */
  mark: "/brand/mark.webp",
  /** The owner's portrait of the count, square (wallet avatar, token page). */
  markSquare: "/brand/mark-square.webp",
  /** The count as a still: the owner's portrait (token page, round portrait of the no-WebGL fallback). */
  count: {
    src: "/brand/count.webp",
    w: 720,
    h: 720,
    alt: "The count: a pale vampire with dark hair, red eyes and fangs, in a black cape with a crimson high collar and a white jabot with a red brooch, before a castle under a full moon",
  },
  /** The owner's figure, transparent and trimmed: the billboard of the count in the WebGL hall. */
  figure: { src: "/brand/figure.webp", w: 820, h: 1024 },
  /** Square PNG served by Next from src/app/icon.png (structured data needs a PNG logo). */
  logoPng: "/icon.png",
  /** Share card served from src/app/opengraph-image.jpg. */
  og: "/opengraph-image.jpg",
} as const;
