import { BRAND, CHAIN, LAUNCHPAD } from "@/config/brand";

/*
 * All long copy of the castle walk in one place, shared by the home page, the docs page and the structured data.
 * Written for Draculahood; nothing here promises value, returns or rewards.
 */

const T = BRAND.symbol;
const N = BRAND.name;

export const HERO = {
  eyebrowLive: `${CHAIN.name} · trading on ${LAUNCHPAD.name}`,
  eyebrowSoon: `${CHAIN.name} · ${LAUNCHPAD.name} launch pending`,
  line: "A castle rose on Robinhood Chain one night and the lights never went out. The count kept the guestbook open. Sign it.",
  scroll: "Scroll to walk the castle hall",
};

export const LORE = {
  eyebrow: "Hall 01 · The Legend",
  title: "Who keeps the castle?",
  paragraphs: [
    "Every block on Robinhood Chain passes under one old stone arch. Behind it runs a long hall with red candles, crooked portraits and a carpet nobody remembers laying. The far door is always closed. The count lives somewhere past it, and he does not sleep, because on this chain the night simply never ends.",
    `We call the castle ${N}. The count has no plan for your money and no speech about the future. He keeps a guestbook, lights the candles and watches who walks in. Each visitor who signs gets a crest beside their name, and the book is public for anyone to read.`,
  ],
  tip: "Tip: tap the count. He hates being disturbed during supper.",
};

export const TOKENOMICS = {
  eyebrow: "Hall 02 · Tokenomics",
  title: "The count's ledger",
  note: `${T} launches on ${LAUNCHPAD.name}, the Robinhood Chain launchpad, with a bonding curve: buys push the price up the curve, sells pull it down, and every buyer comes in by one gate. When the curve fills, ${LAUNCHPAD.name} moves the liquidity into a DEX pool. Every figure in this table is read live from the chain once the contract address is published; until then it shows a dash.`,
};

export const STEPS = {
  eyebrow: "Hall 03 · How to Buy",
  title: "Past the gate in four moves",
  items: [
    { h: "Pick an EVM wallet", p: "MetaMask, Rabby, OKX, Coinbase Wallet or any wallet that can add a custom network. The Connect button adds Robinhood Chain for you." },
    { h: "Move ETH onto Robinhood Chain", p: "Robinhood Chain charges its fees in ETH. Bridge a small amount over from Ethereum or another network you already use." },
    { h: `Open ${N} on ${LAUNCHPAD.name}`, p: `Only use the Buy button on this site or the link posted by ${BRAND.xHandle}. Compare the contract address with the one printed here before you confirm anything.` },
    { h: `Swap ETH for ${T}`, p: `Type an amount, read the wallet prompt and confirm. After the curve fills, ${T} trades in the DEX pool that ${LAUNCHPAD.name} creates.` },
  ],
};

export const LEDGER = {
  eyebrow: "Hall 04 · The Coven Ledger",
  title: "Sign the castle guestbook",
  paragraphs: [
    "The Coven Ledger is a small contract on Robinhood Chain. A wallet signs it once with a nickname of up to 24 plain characters and one of eight crests, and can change both later. Every entry is public, in the order wallets first signed, with the block it was written in.",
    "It costs only gas. There is no fee, no owner, no admin key and no token involved, and an entry earns nothing: it is a name in a guestbook, nothing more.",
  ],
};

export const NIGHT = {
  eyebrow: "Hall 05 · Night Clock",
  title: "The night, measured",
  note: "A clock for your own time zone counts down to the next midnight while the chain keeps writing blocks. Block height, gas, ETH price and transactions are read live from Robinhood Chain.",
};

export type Tab = { id: string; label: string; blocks: { h?: string; p: string }[] };

export const SCROLL = {
  eyebrow: "Hall 06 · The Castle Scroll",
  title: "The Castle Scroll",
  meta: ["v1.0", "Robinhood Chain", "Kept under the stairs"],
  tabs: [
    {
      id: "abstract",
      label: "Abstract",
      blocks: [
        { p: `${N} (${T}) is a community memecoin on ${CHAIN.name} about a vampire who never leaves his castle. It has no promised value and no product to sell. What it has is a story, a castle hall to walk, a guestbook on chain and tools to make vampire pictures.` },
        { p: "Anything we build is small, open and free to use: the guestbook contract, the portrait maker and this site. None of it pays anyone, and none of it changes what the token is." },
        { h: "In one line", p: "A fair launch, a public guestbook and a count who keeps the candles lit." },
      ],
    },
    {
      id: "mechanics",
      label: "Mechanics",
      blocks: [
        { h: `Launch on ${LAUNCHPAD.name}`, p: `${T} begins life on a bonding curve run by ${LAUNCHPAD.name}. The price follows the curve as people buy and sell; there is no presale on this site and no private round we know of.` },
        { h: "When the curve fills", p: `${LAUNCHPAD.name} moves liquidity into a DEX pool on ${CHAIN.name}. The pool and its rules are ${LAUNCHPAD.name}'s, not ours; read them on the launchpad page.` },
        { h: "Reading the numbers", p: "Supply, holders, curve progress and price on this site are read from the chain and the public explorer. When a number cannot be read, it shows a dash rather than a guess." },
      ],
    },
    {
      id: "coven",
      label: "The Coven",
      blocks: [
        { h: "The guestbook", p: "DraculahoodCovenBook stores one entry per wallet: nickname, crest, when it joined and how often it changed. Anyone can read it; only the wallet itself can change its own entry." },
        { h: "Portraits", p: "The vampire maker draws your portrait from parts in the browser and exports PNG or WebP. Nothing is uploaded." },
        { h: "What comes later", p: "Lore contests, a community lore archive and seasonal castle rooms are planned ideas, not features. If they happen, they will be announced on X and listed here first." },
      ],
    },
    {
      id: "risks",
      label: "Risks",
      blocks: [
        { p: `${T} is a memecoin. It carries no claim on anything, pays nothing and has no company behind it promising work or results. The price can fall to almost nothing and stay there.` },
        { p: "Bonding-curve tokens on young chains swing hard in minutes. Spend only an amount you can lose without trouble, check the contract address every time and never type your recovery phrase into any site or message." },
        { p: "The guestbook contract has no owner and cannot be changed or paused; that also means a mistake in it cannot be patched. It holds no funds." },
      ],
    },
  ] as Tab[],
};

export type Phase = { name: string; chip: string; live?: boolean; items: string[] };

export const ROADMAP = {
  eyebrow: "Hall 07 · Roadmap",
  title: "Hours of the night",
  phases: [
    { name: "Dusk", chip: "Live", live: true, items: ["Castle site and hall walk open", "Coven Ledger contract written and tested", "Vampire portrait maker"] },
    { name: "Midnight", chip: "Next", items: [`${T} launch on ${LAUNCHPAD.name}`, "Coven Ledger deployed on Robinhood Chain", "Official X account active"] },
    { name: "Witching Hour", chip: "Planned", items: ["Lore contest run by the community", "Community lore archive on this site"] },
    { name: "Endless Night", chip: "Someday", items: ["Whatever the coven agrees on next"] },
  ] as Phase[],
};

export type Qa = { q: string; a: string };

export const FAQ: Qa[] = [
  { q: `What is ${N}?`, a: `${N} is a community memecoin on ${CHAIN.name} with a vampire castle theme. Besides the token there is a public on-chain guestbook (the Coven Ledger) and a vampire portrait maker. It promises no value and no returns.` },
  { q: `How does ${N} work?`, a: `${T} launches on ${LAUNCHPAD.name}'s bonding curve. Separately, any wallet can sign the Coven Ledger with a nickname and crest; that only costs gas and earns nothing.` },
  { q: `How do I buy ${T}?`, a: `Get an EVM wallet, bridge a little ETH to ${CHAIN.name}, then use the Buy button here, which opens ${LAUNCHPAD.name}. Before launch the button opens the launchpad home and says "At launch".` },
  { q: `Which network is ${N} on?`, a: `${CHAIN.name} (chain id ${CHAIN.id}), an Ethereum layer 2 that charges fees in ETH.` },
  { q: "Does signing the ledger give me anything?", a: "No tokens, no allowance and no priority of any kind. It writes your nickname and crest into a public guestbook. You can change them later, and every change is public too." },
  { q: "What are the risks?", a: `${T} can lose all of its price. Fake tokens with the same name will appear: copy the address only from this site or ${BRAND.xHandle}, and never share your recovery phrase.` },
];

export const END = {
  eyebrow: "End of the hall",
  title: "Join the coven",
  disclaimer: `${N} (${T}) is a memecoin with no promised value and no expected return. It is not connected to Robinhood Markets, Inc. This site gives no advice of any kind; check everything yourself before you buy.`,
};
