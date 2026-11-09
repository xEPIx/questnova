import { test } from "node:test";
import assert from "node:assert/strict";
import { validateContent, validateFreshness, validatePageContent } from "../lib/validation.ts";
import { contentManifest } from "../lib/content/manifest.ts";

test("manifest has no duplicates or missing fields", () => {
  const r = validateContent(contentManifest);
  assert.equal(r.valid, true, r.errors.join("; "));
});

test("freshness accepts current dates", () => {
  const errs = validateFreshness(contentManifest, 30);
  assert.equal(errs.length, 0, errs.join("; "));
});

test("page content validation accepts known pages", () => {
  for (const c of contentManifest) {
    assert.deepEqual(validatePageContent(c), []);
  }
});

test("future date detected", () => {
  const future = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const errs = validateFreshness([{ ...contentManifest[0], lastVerified: future } as any], 30);
  assert.ok(errs.some((e) => e.includes("future date")));
});

test("stale content detected", () => {
  const old = new Date(Date.now() - 60 * 86400000).toISOString().slice(0, 10);
  const errs = validateFreshness([{ ...contentManifest[0], lastVerified: old } as any], 30);
  assert.ok(errs.some((e) => e.includes("stale content")));
});

test("invalid date detected", () => {
  const errs = validateFreshness([{ ...contentManifest[0], lastVerified: "not-a-date" } as any], 30);
  assert.ok(errs.some((e) => e.includes("invalid lastVerified")));
});

test("duplicate slug detected", () => {
  const dup = [contentManifest[0], { ...contentManifest[0] }];
  const r = validateContent(dup as any);
  assert.equal(r.valid, false);
  assert.ok(r.errors.some((e) => e.includes("duplicate slug")));
});

test("missing source detected", () => {
  const bad = [{ ...contentManifest[0], source: "" }];
  const r = validateContent(bad as any);
  assert.equal(r.valid, false);
  assert.ok(r.errors.some((e) => e.includes("missing source")));
});

test("malformed source URL detected", () => {
  const bad = [{ ...contentManifest[0], source: "not-a-url" }];
  const r = validateContent(bad as any);
  assert.equal(r.valid, false);
  assert.ok(r.errors.some((e) => e.includes("invalid source URL")));
});

test("invalid freshness window handling", () => {
  // maxDays negative should still run; stale logic uses > maxDays, so all current dates stale
  const errs = validateFreshness(contentManifest, -1);
  assert.ok(errs.length > 0);
});
