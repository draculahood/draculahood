/*
 * The Draculahood mark: a bat in bone white with two blood-red eyes, drawn by us (256 x 256 box). Readable at 16 px.
 * Replace it by putting the owner's files at the paths in src/config/assets.ts.
 */
export const BAT_PATH =
  "M128 92 C121 74 112 66 102 70 C101 84 92 94 74 90 C70 104 60 112 40 112 C54 122 64 140 64 156 C78 146 94 146 104 156 C110 142 118 138 128 146 C138 138 146 142 152 156 C162 146 178 146 192 156 C192 140 202 122 216 112 C196 112 186 104 182 90 C164 94 155 84 154 70 C144 66 135 74 128 92 Z";

export function markSvg({ size = 256, plate = false }: { size?: number; plate?: boolean } = {}) {
  const bg = plate ? `<rect width="256" height="256" rx="48" fill="#040605"/><circle cx="128" cy="124" r="96" fill="#a8ffc4" opacity=".10"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 256 256">${bg}<g transform="translate(128 118) scale(${plate ? 1.05 : 1.25}) translate(-128 -118)"><path d="${BAT_PATH}" fill="#dfe7e1"/><path d="M128 92 L122 108 L128 114 L134 108 Z" fill="#dfe7e1"/><ellipse cx="119" cy="112" rx="5" ry="4" fill="#c2364a"/><ellipse cx="137" cy="112" rx="5" ry="4" fill="#c2364a"/><path d="M122 126 L125 134 L128 126 M128 126 L131 134 L134 126" fill="#040605"/></g></svg>`;
}
