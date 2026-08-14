import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_LOCALE,
  resolveDeviceLocale,
} from "../app/lib/locale.ts";

test("resolves supported device languages and falls back to English", () => {
  assert.equal(resolveDeviceLocale(["ko-KR"]), "ko");
  assert.equal(resolveDeviceLocale(["ja-JP"]), "ja");
  assert.equal(resolveDeviceLocale(["en-CA"]), "en");
  assert.equal(resolveDeviceLocale(["fr-CA", "ja-JP"]), "ja");
  assert.equal(resolveDeviceLocale(["fr-CA"]), DEFAULT_LOCALE);
  assert.equal(DEFAULT_LOCALE, "en");
});
