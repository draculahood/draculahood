import { test } from "node:test";
import assert from "node:assert/strict";
import { CRESTS, crestSvg } from "./art/crests";
import { PARTS, PART_KEYS, decodeVampire, encodeVampire, normalise, randomVampire, vampireSvg } from "./art/vampire";

test("eight crests with stable ids 0..7", () => {
  assert.equal(CRESTS.length, 8);
  CRESTS.forEach((c, i) => assert.equal(c.id, i));
  for (let i = 0; i < 8; i++) assert.match(crestSvg(i), /^<svg[\s\S]*<\/svg>$/);
});

test("every part combination renders without gaps", () => {
  for (const k of PART_KEYS) {
    for (let v = 0; v < PARTS[k].length; v++) {
      const svg = vampireSvg({ [k]: v });
      assert.doesNotMatch(svg, /undefined|NaN/);
    }
  }
});

test("share code round-trips and refuses junk", () => {
  for (let i = 0; i < 50; i++) {
    const c = randomVampire();
    assert.deepEqual(decodeVampire(encodeVampire(c)), c);
  }
  assert.deepEqual(decodeVampire("zzzzzzz"), normalise({ skin: 35, hair: 35, eyes: 35, mouth: 35, cape: 35, extra: 35, backdrop: 35 }));
  assert.deepEqual(decodeVampire("<script>"), normalise({}));
});
