import { storageKey } from "@/config/storage";

/*
 * Nickname rules for the Coven Ledger. They mirror DraculahoodCovenBook._validName exactly (1 to 24 printable ASCII
 * characters, no space at either end, no double space), so the form refuses what the contract would revert on.
 * The word guard is a client-side courtesy on top: the contract cannot read words, so it never blocks a name, but the
 * form refuses listed words and the hall masks them when someone signs from another tool.
 */

export const MAX_NAME = 24;
export const CREST_COUNT = 8;

export function nameProblem(name: string): string | null {
  if (name.length === 0) return "Write a nickname first.";
  if (name.length > MAX_NAME) return `Keep it to ${MAX_NAME} characters.`;
  if (!/^[\x20-\x7e]+$/.test(name)) return "Plain characters only: letters, digits and basic punctuation (no emoji or accents).";
  if (name.startsWith(" ") || name.endsWith(" ")) return "No space at the start or the end.";
  if (name.includes("  ")) return "No double spaces.";
  return null;
}

export const isValidName = (name: string) => nameProblem(name) === null;

// Short, deliberately plain list. Matching ignores case, digits standing in for letters and separators.
const BLOCKED = ["fuck", "shit", "cunt", "nigger", "nigga", "faggot", "retard", "whore", "slut", "rape", "nazi", "hitler", "kike", "spic", "chink"];

function fold(s: string) {
  return s
    .toLowerCase()
    .replace(/[0@]/g, "o")
    .replace(/[1!|]/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/[5$]/g, "s")
    .replace(/7/g, "t")
    .replace(/[^a-z]/g, "");
}

export function isRude(name: string) {
  const f = fold(name);
  return BLOCKED.some((w) => f.includes(w));
}

/** What the hall shows for a name: the name itself, or a mask when the word guard matches. */
export const displayName = (name: string) => (isRude(name) ? "(name hidden by the word filter)" : name);

/** Practice entries live only in this browser until the book is deployed. */
export type PracticeEntry = { wallet: string; name: string; crest: number; at: number; signature: string; changes: number };
export const PRACTICE_KEY = storageKey("coven", "practice");

/** The exact message a wallet signs for a practice entry. */
export function practiceMessage(wallet: string, name: string, crest: number, at: number) {
  return [
    "Draculahood Coven Ledger (practice entry)",
    `Wallet: ${wallet.toLowerCase()}`,
    `Nickname: ${name}`,
    `Crest: ${crest}`,
    `Time: ${new Date(at).toISOString()}`,
    "This signature sends nothing and costs nothing. It is kept in this browser only.",
  ].join("\n");
}
