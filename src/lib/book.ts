import { encodeFunctionData, type Abi } from "viem";
import { CONTRACTS, bookLive } from "@/config/contracts";
import { BOOK_ABI } from "@/lib/abi";
import { read, rpcCall, waitForReceipt } from "@/lib/client";

/*
 * Reads and the two writes the site sends to DraculahoodCovenBook. Reads use the book's view functions through the
 * site relay (the same data the Joined / Updated events carry, without scanning log ranges). A write is dry-run first,
 * so a transaction that would revert is explained before the wallet asks for a signature.
 */

const abi = BOOK_ABI as Abi;
const to = () => CONTRACTS.book;

export type ChainEntry = {
  wallet: string;
  position: number;
  name: string;
  crest: number;
  changes: number;
  joinedAt: number;
  joinedBlock: number;
  updatedAt: number;
  updatedBlock: number;
};

type RawEntry = { name: string; crest: number; changes: number; joinedAt: bigint; joinedBlock: bigint; updatedAt: bigint; updatedBlock: bigint };

const toEntry = (wallet: string, position: number, e: RawEntry): ChainEntry => ({
  wallet,
  position,
  name: e.name,
  crest: Number(e.crest),
  changes: Number(e.changes),
  joinedAt: Number(e.joinedAt),
  joinedBlock: Number(e.joinedBlock),
  updatedAt: Number(e.updatedAt),
  updatedBlock: Number(e.updatedBlock),
});

/** The sender's entry, or null when the wallet has not signed. */
export async function entryOf(wallet: string): Promise<ChainEntry | null> {
  const pos = Number(await read<bigint>({ to: to(), abi, fn: "positionOf", args: [wallet] }));
  if (pos === 0) return null;
  const e = await read<RawEntry>({ to: to(), abi, fn: "entryOf", args: [wallet] });
  return toEntry(wallet, pos, e);
}

/** The newest `max` members by signing order (newest first) and the total. */
export async function latestMembers(max = 200): Promise<{ rows: ChainEntry[]; total: number; crests: number[] }> {
  const [total, crests] = await Promise.all([
    read<bigint>({ to: to(), abi, fn: "memberCount" }).then(Number),
    read<readonly bigint[]>({ to: to(), abi, fn: "crestCounts" }).then((c) => c.map(Number)),
  ]);
  const start = Math.max(0, total - max);
  const rows: ChainEntry[] = [];
  for (let offset = start; offset < total; offset += 100) {
    const [wallets, entries] = await read<readonly [string[], RawEntry[]]>({ to: to(), abi, fn: "members", args: [BigInt(offset), 100n] });
    wallets.forEach((w, i) => rows.push(toEntry(w, offset + i + 1, entries[i])));
  }
  return { rows: rows.reverse(), total, crests };
}

type Send = (tx: { to?: string; data: string }) => Promise<string>;

/** Signs the ledger (join) or changes the entry (update) in one transaction from the visitor's wallet. */
export async function sendEntry(from: string, kind: "join" | "update", name: string, crest: number, send: Send) {
  const data = encodeFunctionData({ abi, functionName: kind, args: [name, crest] } as never);
  await rpcCall("eth_call", [{ from, to: to(), data }, "latest"]);
  const hash = await send({ to: to(), data });
  const r = await waitForReceipt(hash);
  if (!r.ok) throw new Error("The transaction reverted on chain.");
  return { hash, block: r.blockNumber };
}

export { bookLive };
