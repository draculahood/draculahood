/*
 * The Draculahood vampire, drawn by us from parts as SVG (512 x 512). The portrait maker, the brand generator and the
 * 2D fallback of the castle hall all use this one function, so the character looks the same everywhere.
 */

export type VampireConfig = {
  skin: number;
  hair: number;
  eyes: number;
  mouth: number;
  cape: number;
  extra: number;
  backdrop: number;
};

export const PARTS = {
  skin: [
    { name: "Moon pale", fill: "#e4ece6", shade: "#b9c8bf" },
    { name: "Ash grey", fill: "#c9cfd2", shade: "#9aa3a8" },
    { name: "Candle warm", fill: "#ead9c4", shade: "#c2ab92" },
    { name: "Crypt green", fill: "#cfe8d6", shade: "#9cc2a8" },
    { name: "Dusk violet", fill: "#d8cfe6", shade: "#ab9ec2" },
    { name: "Umber", fill: "#9b6b4f", shade: "#74503b" },
  ],
  hair: [
    { name: "Widow's peak" },
    { name: "Slicked back" },
    { name: "Long and loose" },
    { name: "Silver peak" },
    { name: "Bald" },
  ],
  eyes: [
    { name: "Blood red", color: "#c2364a" },
    { name: "Ember gold", color: "#ffb46b" },
    { name: "Ghost green", color: "#a8ffc4" },
    { name: "Half asleep", color: "#c2364a" },
    { name: "Wink", color: "#c2364a" },
  ],
  mouth: [{ name: "Two fangs" }, { name: "Smirk" }, { name: "Hungry" }, { name: "Shut" }],
  cape: [
    { name: "Crimson lining", outer: "#0a0d0c", inner: "#8f1d2e" },
    { name: "Midnight blue", outer: "#0b0f1c", inner: "#26386b" },
    { name: "Royal violet", outer: "#120a16", inner: "#5b2a73" },
    { name: "Crypt green", outer: "#070c0a", inner: "#2f6b4c" },
  ],
  extra: [{ name: "None" }, { name: "Monocle" }, { name: "Rose" }, { name: "Pet bat" }, { name: "Crown" }],
  backdrop: [
    { name: "Full moon", a: "#14211a", b: "#040605" },
    { name: "Blood sky", a: "#3a0d16", b: "#0a0304" },
    { name: "Castle stone", a: "#1d2421", b: "#070908" },
    { name: "Ghost light", a: "#1f4a33", b: "#050907" },
  ],
} as const;

export type PartKey = keyof VampireConfig;
export const PART_KEYS: PartKey[] = ["skin", "hair", "eyes", "mouth", "cape", "extra", "backdrop"];

export const DEFAULT_VAMPIRE: VampireConfig = { skin: 0, hair: 0, eyes: 0, mouth: 0, cape: 0, extra: 0, backdrop: 0 };

const clampPart = (k: PartKey, v: unknown) => {
  const n = typeof v === "number" && Number.isInteger(v) ? v : 0;
  return Math.min(Math.max(n, 0), PARTS[k].length - 1);
};

export function normalise(cfg: Partial<Record<PartKey, unknown>>): VampireConfig {
  const out = { ...DEFAULT_VAMPIRE };
  for (const k of PART_KEYS) out[k] = clampPart(k, cfg[k]);
  return out;
}

/** Short share code: one base-36 digit per part, e.g. "0000000". */
export const encodeVampire = (c: VampireConfig) => PART_KEYS.map((k) => c[k].toString(36)).join("");
export function decodeVampire(code: string | null | undefined): VampireConfig {
  if (!code || !/^[0-9a-z]{7}$/.test(code)) return { ...DEFAULT_VAMPIRE };
  const raw: Partial<Record<PartKey, unknown>> = {};
  PART_KEYS.forEach((k, i) => (raw[k] = parseInt(code[i], 36)));
  return normalise(raw);
}

export function randomVampire(rand: () => number = Math.random): VampireConfig {
  const out = { ...DEFAULT_VAMPIRE };
  for (const k of PART_KEYS) out[k] = Math.floor(rand() * PARTS[k].length);
  return out;
}

function hairSvg(i: number) {
  const dark = i === 3 ? "#b9c2c7" : "#0d0f10";
  const shine = i === 3 ? "#e7edf0" : "#2a3033";
  switch (i) {
    case 0:
    case 3:
      return `<path d="M164 214 C160 140 206 104 256 104 C306 104 352 140 348 214 C334 184 312 170 290 168 L256 214 L222 168 C200 170 178 184 164 214 Z" fill="${dark}"/><path d="M214 128 C236 118 270 116 296 126" stroke="${shine}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    case 1:
      return `<path d="M162 210 C158 140 204 100 256 100 C312 100 356 142 350 212 C336 176 300 160 256 160 C212 160 176 176 162 210 Z" fill="${dark}"/><path d="M196 128 C230 112 286 112 320 132 M190 146 C228 128 290 128 330 150" stroke="${shine}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    case 2:
      return `<path d="M150 330 C138 250 148 150 200 116 C226 100 286 100 312 116 C364 150 374 250 362 330 L340 330 C350 260 342 210 326 184 C306 168 280 162 256 166 L256 210 L226 168 C204 172 184 184 176 200 C164 230 162 270 172 330 Z" fill="${dark}"/><path d="M206 128 C234 116 280 116 306 128" stroke="${shine}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    default:
      return `<path d="M196 132 C220 120 292 120 316 132" stroke="#ffffff" stroke-opacity=".35" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  }
}

function eyesSvg(i: number, color: string) {
  const brow = `<path d="M198 222 L238 232 M314 222 L274 232" stroke="#0d0f10" stroke-width="8" stroke-linecap="round"/>`;
  if (i === 3)
    return `${brow}<path d="M206 250 Q222 244 238 250" stroke="#0d0f10" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M274 250 Q290 244 306 250" stroke="#0d0f10" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M210 252 Q222 258 236 252 M276 252 Q290 258 302 252" stroke="${color}" stroke-width="4" fill="none"/>`;
  const eye = (cx: number) =>
    `<ellipse cx="${cx}" cy="250" rx="18" ry="13" fill="#0b0b0b"/><circle cx="${cx}" cy="250" r="8" fill="${color}"/><circle cx="${cx - 3}" cy="246" r="3" fill="#ffffff"/>`;
  if (i === 4) return `${brow}${eye(222)}<path d="M274 252 Q290 242 306 252" stroke="#0d0f10" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  const glow = `<circle cx="222" cy="250" r="26" fill="${color}" opacity=".18"/><circle cx="290" cy="250" r="26" fill="${color}" opacity=".18"/>`;
  return `${brow}${glow}${eye(222)}${eye(290)}`;
}

function mouthSvg(i: number) {
  switch (i) {
    case 0:
      return `<path d="M222 318 Q256 336 290 318" stroke="#3a0d16" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M232 322 L238 342 L244 326 Z M268 326 L274 342 L280 322 Z" fill="#ffffff"/>`;
    case 1:
      return `<path d="M228 322 Q262 334 292 312" stroke="#3a0d16" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M276 322 L281 340 L287 318 Z" fill="#ffffff"/>`;
    case 2:
      return `<path d="M222 312 Q256 360 290 312 Z" fill="#3a0d16"/><path d="M226 314 L234 336 L242 318 Z M270 318 L278 336 L286 314 Z" fill="#ffffff"/><path d="M240 340 Q256 348 272 340" stroke="#c2364a" stroke-width="5" fill="none"/>`;
    default:
      return `<path d="M232 322 L280 322" stroke="#3a0d16" stroke-width="7" stroke-linecap="round"/>`;
  }
}

function extraSvg(i: number) {
  switch (i) {
    case 1:
      return `<circle cx="290" cy="250" r="27" fill="none" stroke="#ffb46b" stroke-width="5"/><path d="M314 262 Q330 300 318 360" stroke="#ffb46b" stroke-width="2.5" fill="none"/>`;
    case 2:
      return `<g transform="translate(300 400) rotate(-20)"><path d="M0 -26 C14 -26 22 -16 22 -6 C22 6 12 12 0 12 C-12 12 -22 6 -22 -6 C-22 -16 -14 -26 0 -26 Z" fill="#c2364a"/><path d="M0 -18 C-8 -18 -12 -12 -10 -6 C-6 -10 -2 -10 0 -6 C2 -10 6 -10 10 -6 C12 -12 8 -18 0 -18 Z" fill="#7d1525"/><path d="M0 12 V60" stroke="#2f6b4c" stroke-width="5"/></g>`;
    case 3:
      return `<g transform="translate(380 300)"><path d="M0 0 C-6 -10 -14 -12 -20 -8 C-20 -2 -26 2 -34 0 C-34 8 -40 12 -48 12 C-40 16 -36 24 -36 30 C-30 26 -22 26 -18 30 C-14 24 -6 22 0 28 C6 22 14 24 18 30 C22 26 30 26 36 30 C36 24 40 16 48 12 C40 12 34 8 34 0 C26 2 20 -2 20 -8 C14 -12 6 -10 0 0 Z" fill="#0d0f10"/><circle cx="-5" cy="10" r="3" fill="#c2364a"/><circle cx="5" cy="10" r="3" fill="#c2364a"/></g>`;
    case 4:
      return `<path d="M206 112 L216 68 L236 96 L256 58 L276 96 L296 68 L306 112 Z" fill="#ffb46b" stroke="#7a4a1c" stroke-width="3"/><circle cx="256" cy="92" r="6" fill="#c2364a"/>`;
    default:
      return "";
  }
}

/** The full portrait as an SVG string. */
export function vampireSvg(input: Partial<VampireConfig> = {}, size = 512): string {
  const c = normalise(input);
  const skin = PARTS.skin[c.skin];
  const cape = PARTS.cape[c.cape];
  const bd = PARTS.backdrop[c.backdrop];
  const eyeColor = PARTS.eyes[c.eyes].color;
  const moon = c.backdrop === 0 ? `<circle cx="392" cy="112" r="64" fill="#dfe7e1" opacity=".9"/><circle cx="372" cy="98" r="10" fill="#b9c8bf" opacity=".6"/><circle cx="410" cy="132" r="7" fill="#b9c8bf" opacity=".6"/>` : "";
  const stones =
    c.backdrop === 2
      ? `<g stroke="#2a332f" stroke-width="3" fill="none"><path d="M0 120 H512 M0 220 H512 M0 320 H512 M90 20 V120 M260 120 V220 M420 20 V120 M150 220 V320 M360 220 V320"/></g>`
      : "";
  const ghost = c.backdrop === 3 ? `<circle cx="256" cy="230" r="210" fill="#a8ffc4" opacity=".08"/>` : "";
  const ears = `<path d="M160 236 L134 206 L170 252 Z M352 236 L378 206 L342 252 Z" fill="${skin.fill}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
<defs><radialGradient id="bg" cx="50%" cy="35%" r="75%"><stop offset="0" stop-color="${bd.a}"/><stop offset="1" stop-color="${bd.b}"/></radialGradient></defs>
<rect width="512" height="512" fill="url(#bg)"/>${moon}${stones}${ghost}
<path d="M40 512 C60 400 120 360 176 344 L256 400 L336 344 C392 360 452 400 472 512 Z" fill="${cape.outer}"/>
<path d="M96 512 C110 430 150 392 190 378 L256 430 L322 378 C362 392 402 430 416 512 Z" fill="${cape.inner}"/>
<path d="M150 300 L106 210 C150 236 176 270 196 330 Z M362 300 L406 210 C362 236 336 270 316 330 Z" fill="${cape.inner}" stroke="${cape.outer}" stroke-width="6"/>
<path d="M226 350 H286 L300 512 H212 Z" fill="#f2f2ee"/><path d="M244 360 L256 380 L268 360 L262 420 H250 Z" fill="#8f1d2e"/>
<rect x="224" y="300" width="64" height="62" rx="20" fill="${skin.shade}"/>
${ears}
<path d="M164 230 C164 160 204 120 256 120 C308 120 348 160 348 230 C348 300 304 346 256 346 C208 346 164 300 164 230 Z" fill="${skin.fill}"/>
<path d="M190 300 C210 330 236 344 256 346 C230 334 210 316 196 290 Z" fill="${skin.shade}" opacity=".6"/>
${hairSvg(c.hair)}
${eyesSvg(c.eyes, eyeColor)}
<path d="M256 262 L248 292 Q256 298 264 292 Z" fill="${skin.shade}"/>
${mouthSvg(c.mouth)}
${extraSvg(c.extra)}
</svg>`;
}
