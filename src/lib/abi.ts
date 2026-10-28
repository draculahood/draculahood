import { parseAbi } from "viem";

/*
 * ABIs the site needs. BOOK_ABI mirrors contracts/src/DraculahoodCovenBook.sol (src/lib/abi.test.ts checks it
 * against the compiled artifact so the two cannot drift apart).
 */
export const ERC20_ABI = parseAbi([
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function owner() view returns (address)",
  "function getOwner() view returns (address)",
]);

export const FEED_ABI = parseAbi([
  "function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
]);

/** Pons V2 launch token: points at its bonding curve. */
export const PONS_TOKEN_ABI = parseAbi(["function curve() view returns (address)"]);

/** Pons V2 bonding curve, read side only (price, graduation progress). */
export const PONS_CURVE_ABI = parseAbi([
  "function getReserves() view returns (uint256 quoteReserve, uint256 tokenReserve)",
  "function realQuoteReserve() view returns (uint256)",
  "function graduationThreshold() view returns (uint256)",
  "function graduated() view returns (bool)",
  "function isNativeQuote() view returns (bool)",
]);

export const BOOK_ABI = parseAbi([
  "struct Entry { string name; uint8 crest; uint32 changes; uint64 joinedAt; uint64 joinedBlock; uint64 updatedAt; uint64 updatedBlock; }",
  "function MAX_NAME() view returns (uint256)",
  "function CREST_COUNT() view returns (uint8)",
  "function MAX_PAGE() view returns (uint256)",
  "function totalChanges() view returns (uint256)",
  "function join(string name, uint8 crest) returns (uint256 position)",
  "function update(string name, uint8 crest)",
  "function isValid(string name, uint8 crest) pure returns (bool)",
  "function memberCount() view returns (uint256)",
  "function isMember(address member) view returns (bool)",
  "function positionOf(address member) view returns (uint256)",
  "function entryOf(address member) view returns (Entry)",
  "function crestCounts() view returns (uint256[8])",
  "function members(uint256 offset, uint256 limit) view returns (address[] wallets, Entry[] entries)",
  "function chainBlock() view returns (uint64)",
  "event Joined(address indexed member, uint256 indexed position, string name, uint8 crest, uint64 chainBlock)",
  "event Updated(address indexed member, uint256 indexed position, string name, uint8 crest, uint32 changes, uint64 chainBlock)",
  "error AlreadyMember()",
  "error NotMember()",
  "error BadName()",
  "error BadCrest(uint8 crest)",
  "error NothingChanged()",
]);

export const ALL_ERRORS = BOOK_ABI.filter((x) => x.type === "error");

/** Plain words for each custom error, shown instead of a selector. */
export const ERROR_WORDS: Record<string, string> = {
  AlreadyMember: "This wallet already signed the ledger. Use Update to change your nickname or crest.",
  NotMember: "This wallet has not signed the ledger yet. Sign it first.",
  BadName: "Nicknames are 1 to 24 plain characters (letters, digits, basic punctuation), no space at either end and no double spaces.",
  BadCrest: "Pick one of the eight crests.",
  NothingChanged: "That is already your nickname and crest. Change one of them first.",
};
