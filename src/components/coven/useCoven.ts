"use client";

import { useCallback, useEffect, useState } from "react";
import { bookLive } from "@/config/contracts";
import { useWallet } from "@/components/wallet/WalletProvider";
import { useWalletModal } from "@/components/wallet/WalletButton";
import { useLocalStore } from "@/components/wallet/useLocalStore";
import { entryOf, latestMembers, sendEntry, type ChainEntry } from "@/lib/book";
import { explain } from "@/lib/client";
import { PRACTICE_KEY, isRude, nameProblem, practiceMessage, type PracticeEntry } from "@/lib/coven";

export type HallRow = { wallet: string; name: string; crest: number; position: number; changes: number; at: number; block: number | null; practice: boolean };

/**
 * The Coven Ledger state for any page. With DraculahoodCovenBook deployed: entries read from the contract and signing
 * sends a transaction from the visitor's wallet. Before that: practice mode, a free wallet signature kept in this
 * browser only, clearly labelled.
 */
export function useCoven(max = 200) {
  const live = bookLive();
  const { address, onRobinhoodChain, switchNetwork, sendTransaction, signMessage } = useWallet();
  const { open } = useWalletModal();
  const [practice, setPractice] = useLocalStore<PracticeEntry[]>(PRACTICE_KEY, []);
  const [rows, setRows] = useState<HallRow[] | null>(live ? null : []);
  const [total, setTotal] = useState<number | null>(null);
  const [crests, setCrests] = useState<number[] | null>(null);
  const [mine, setMine] = useState<ChainEntry | null>(null);
  const [readError, setReadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string; hash?: string } | null>(null);

  const load = useCallback(async () => {
    if (!live) return;
    try {
      const r = await latestMembers(max);
      setRows(r.rows.map((e) => ({ wallet: e.wallet, name: e.name, crest: e.crest, position: e.position, changes: e.changes, at: e.updatedAt, block: e.updatedBlock, practice: false })));
      setTotal(r.total);
      setCrests(r.crests);
      setReadError(null);
    } catch (e) {
      setReadError(explain(e));
    }
  }, [live, max]);

  useEffect(() => {
    const t = window.setTimeout(load, 0);
    return () => window.clearTimeout(t);
  }, [load]);

  useEffect(() => {
    let gone = false;
    const run = async () => {
      const e = live && address ? await entryOf(address).catch(() => null) : null;
      if (!gone) setMine(e);
    };
    run();
    return () => {
      gone = true;
    };
  }, [live, address]);

  const practiceRows: HallRow[] = practice.map((p, i) => ({ wallet: p.wallet, name: p.name, crest: p.crest, position: i + 1, changes: p.changes, at: Math.floor(p.at / 1000), block: null, practice: true })).reverse();
  const myPractice = address ? practice.find((p) => p.wallet.toLowerCase() === address.toLowerCase()) ?? null : null;
  const myEntry = live ? (mine ? { name: mine.name, crest: mine.crest, position: mine.position, changes: mine.changes } : null) : myPractice ? { name: myPractice.name, crest: myPractice.crest, position: practice.indexOf(myPractice) + 1, changes: myPractice.changes } : null;

  async function sign(name: string, crest: number) {
    setMsg(null);
    if (!address) return open();
    const problem = nameProblem(name);
    if (problem) return setMsg({ ok: false, text: problem });
    if (isRude(name)) return setMsg({ ok: false, text: "That nickname trips the word filter. Pick another one." });
    if (crest < 0 || crest > 7) return setMsg({ ok: false, text: "Pick one of the eight crests." });
    if (myEntry && myEntry.name === name && myEntry.crest === crest) return setMsg({ ok: false, text: "That is already your nickname and crest." });
    setBusy(true);
    try {
      if (live) {
        if (!onRobinhoodChain) await switchNetwork();
        const r = await sendEntry(address, myEntry ? "update" : "join", name, crest, (tx) => sendTransaction(tx));
        setMsg({ ok: true, text: myEntry ? `Entry updated in block ${r.block}.` : `Signed into the ledger in block ${r.block}.`, hash: r.hash });
        setMine(await entryOf(address).catch(() => null));
        await load();
      } else {
        const at = Date.now();
        const signature = await signMessage(practiceMessage(address, name, crest, at));
        setPractice((prev) => {
          const others = prev.filter((p) => p.wallet.toLowerCase() !== address.toLowerCase());
          const old = prev.find((p) => p.wallet.toLowerCase() === address.toLowerCase());
          const next = { wallet: address, name, crest, at, signature: signature.slice(0, 20), changes: old ? old.changes + 1 : 0 };
          return old ? prev.map((p) => (p === old ? next : p)) : [...others, next].slice(-200);
        });
        setMsg({ ok: true, text: "Practice entry signed and kept in this browser. Nothing was sent on chain; the real ledger opens once the contract is deployed." });
      }
    } catch (e) {
      setMsg({ ok: false, text: explain(e) });
    } finally {
      setBusy(false);
    }
  }

  return {
    live,
    address,
    rows: live ? rows : practiceRows,
    total: live ? total : practice.length,
    crests: live ? crests : practice.reduce((acc, p) => ((acc[p.crest] = (acc[p.crest] ?? 0) + 1), acc), [0, 0, 0, 0, 0, 0, 0, 0] as number[]),
    myEntry,
    sign,
    busy,
    msg,
    readError,
    reload: load,
  };
}
