import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("renders a rotating loading ring instead of animated dots", async () => {
  const component = await readFile(
    new URL("../app/WeddingInvitation.tsx", import.meta.url),
    "utf8",
  );
  const styles = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(component, /className="loading-spinner"/);
  assert.doesNotMatch(component, /className="loading-dots"/);
  assert.match(styles, /@keyframes loading-spin/);
  assert.doesNotMatch(styles, /@keyframes loading-dot/);
});
