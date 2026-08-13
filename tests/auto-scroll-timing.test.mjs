import assert from "node:assert/strict";
import test from "node:test";

import {
  AUTO_SCROLL_VIEWPORTS_PER_SECOND,
  mapAutoScrollStep,
} from "../app/lib/auto-scroll-timing.ts";

test("moves the automatic invitation at a calm viewport-based speed", () => {
  assert.equal(AUTO_SCROLL_VIEWPORTS_PER_SECOND, 0.3);
  assert.equal(mapAutoScrollStep(100, 1000, 800, 1000), 340);
});

test("caps delayed frames and stops exactly at the gallery", () => {
  assert.equal(mapAutoScrollStep(100, 5000, 800, 1000), 115.36);
  assert.equal(mapAutoScrollStep(995, 1000, 800, 1000), 1000);
  assert.equal(mapAutoScrollStep(1000, 16, 800, 1000), 1000);
});
