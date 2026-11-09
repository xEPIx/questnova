import { test } from "node:test";
import assert from "node:assert/strict";
import { percentOf } from "../lib/percent.ts";

test("percent basic", () => {
  assert.equal(percentOf(100, 50), 50);
});
test("invalid", () => {
  assert.throws(() => percentOf(NaN, 10));
});
