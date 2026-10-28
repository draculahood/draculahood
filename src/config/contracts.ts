import { isAddress } from "@/config/brand";

/*
 * Draculahood contract address on Robinhood Chain.
 *   book  DraculahoodCovenBook, no constructor arguments, no owner, does not need the $DRACULA token,
 *         so it can be deployed before the token launches (from /deploy on localhost).
 * Empty => signing the Coven Ledger runs in practice mode (a wallet signature kept in this browser, nothing sent).
 * Filled => the same button sends a real transaction from the visitor's wallet and the Castle Hall reads the chain.
 * Check a deployment any time: `npm run verify-deployment -- --book <address> --book-tx <tx>`.
 */
const DEPLOYED = {
  book: "0x52e7229001f29f1f98a6e305df55884376bc3eda",
  /** Block of the DraculahoodCovenBook deployment (first block worth reading its events from). */
  bookBlock: 100091544,
};

/**
 * Local end-to-end tests only: NEXT_PUBLIC_DRACULAHOOD_TEST_CONTRACTS='{"book":"0x…","bookBlock":1}' at build time
 * points a second build at a contract deployed on an anvil chain. Never set it on Vercel.
 */
function testOverride(): typeof DEPLOYED | null {
  const raw = process.env.NEXT_PUBLIC_DRACULAHOOD_TEST_CONTRACTS;
  if (!raw) return null;
  try {
    const v = { ...DEPLOYED, ...(JSON.parse(raw) as Partial<typeof DEPLOYED>) };
    return isAddress(v.book) ? v : null;
  } catch {
    return null;
  }
}

export const CONTRACTS = testOverride() ?? DEPLOYED;

export const bookLive = () => isAddress(CONTRACTS.book);

export const CONTRACT_NAMES = { book: "DraculahoodCovenBook" } as const;

/** Gas measured on a local Robinhood Chain fork (first join with a 13-char name; update renaming + new crest). */
export const GAS = { deploy: 1_127_836, join: 218_718, update: 125_203 } as const;
