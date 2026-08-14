import assert from "node:assert/strict";
import test from "node:test";

import {
  mapFirstDateCopyOpacity,
  mapStoryEntranceOpacity,
  mapStoryExitOpacity,
} from "../app/lib/story-video-timing.ts";

test("keeps the first-date label visible longer", () => {
  assert.ok(mapFirstDateCopyOpacity(0.25) >= 0.74);
  assert.equal(mapFirstDateCopyOpacity(0.34), 0);
});

test("fades the wedding out before the birth video fades in", () => {
  assert.equal(mapStoryExitOpacity("canada-wedding", 0.86), 1);
  assert.ok(mapStoryExitOpacity("canada-wedding", 0.92) < 1);
  assert.equal(mapStoryExitOpacity("canada-wedding", 0.98), 0);
  assert.equal(mapStoryEntranceOpacity("youngjoon-birth", 0), 0);
  assert.equal(mapStoryEntranceOpacity("youngjoon-birth", 0.035), 1);
});
