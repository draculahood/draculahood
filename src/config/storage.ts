/*
 * Browser storage keys. Deliberately neutral (not the brand name), so renaming the project never
 * orphans what visitors' browsers already hold: practice ledger entries, saved portraits, the wallet choice.
 */
const PREFIX = "dh1";
export const storageKey = (...parts: string[]) => [PREFIX, ...parts].join(".");
