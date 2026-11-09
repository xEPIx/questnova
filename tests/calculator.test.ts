import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateDamage } from "../lib/calculator.ts";

test("basic damage", () => {
  assert.equal(calculateDamage({ base: 100, multiplier: 1, defense: 0 }), 100);
});

test("defense mitigates", () => {
  assert.equal(calculateDamage({ base: 100, multiplier: 1, defense: 50 }), 50);
});

test("negative throws", () => {
  assert.throws(() => calculateDamage({ base: -1, multiplier: 1, defense: 0 }));
});

test("invalid throws", () => {
  assert.throws(() => calculateDamage({ base: NaN, multiplier: 1, defense: 0 }));
});
