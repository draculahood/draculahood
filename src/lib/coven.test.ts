import { test } from "node:test";
import assert from "node:assert/strict";
import { displayName, isRude, isValidName, nameProblem, practiceMessage } from "./coven";

// Must agree with DraculahoodCovenBook._validName (see contracts/test/DraculahoodCovenBook.t.sol).
test("names the contract accepts", () => {
  for (const n of ["Vale", "~", "abcdefghijklmnopqrstuvwx", "A b-c_d.e!?~", "Count No. 7"]) assert.equal(isValidName(n), true, n);
});

test("names the contract refuses", () => {
  for (const n of ["", " Vale", "Vale ", "Va  le", "Vale\n", "Valé", "abcdefghijklmnopqrstuvwxy", "tab\there", "\x7f", "🦇"]) assert.equal(isValidName(n), false, JSON.stringify(n));
  assert.match(nameProblem("Va  le") ?? "", /double/);
});

test("word guard folds case and digits", () => {
  assert.equal(isRude("FUCK"), true);
  assert.equal(isRude("sh1t lord"), true);
  assert.equal(isRude("Count Ash"), false);
  assert.equal(displayName("Count Ash"), "Count Ash");
  assert.notEqual(displayName("f.u.c.k"), "f.u.c.k");
});

test("practice message names wallet, nickname and crest", () => {
  const m = practiceMessage("0xABCDEF0000000000000000000000000000000001", "Vale", 3, 0);
  assert.match(m, /0xabcdef0000000000000000000000000000000001/);
  assert.match(m, /Nickname: Vale/);
  assert.match(m, /Crest: 3/);
  assert.match(m, /sends nothing/);
});
