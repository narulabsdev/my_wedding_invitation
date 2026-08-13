import assert from "node:assert/strict";
import test from "node:test";

import {
  AUTO_GALLERY_SCROLL_HINT_DURATION_MS,
  AUTO_SCROLL_VIEWPORTS_PER_SECOND,
  buildInstantAutoScrollOptions,
  mapAutoScrollStep,
  resolveTimedAutoScrollPixelsPerSecond,
} from "../app/lib/auto-scroll-timing.ts";

test("keeps the automatic gallery scroll hint visible for four seconds", () => {
  assert.equal(AUTO_GALLERY_SCROLL_HINT_DURATION_MS, 4000);
});

test("overrides global smooth scrolling for every automatic step", () => {
  assert.deepEqual(buildInstantAutoScrollOptions(420), {
    top: 420,
    left: 0,
    behavior: "instant",
  });
});

test("moves the automatic invitation at one viewport per second", () => {
  assert.equal(AUTO_SCROLL_VIEWPORTS_PER_SECOND, 1);
  assert.equal(mapAutoScrollStep(100, 1000, 800, 1000), 900);
});

test("caps delayed frames and stops exactly at the gallery", () => {
  assert.equal(mapAutoScrollStep(100, 5000, 800, 1000), 151.2);
  assert.equal(mapAutoScrollStep(995, 1000, 800, 1000), 1000);
  assert.equal(mapAutoScrollStep(1000, 16, 800, 1000), 1000);
});

test("crosses each video scroll section in the source video duration", () => {
  const viewportHeight = 800;
  const sectionRange = viewportHeight * 760;
  const videoDurationSeconds = 8;
  const pixelsPerSecond = resolveTimedAutoScrollPixelsPerSecond(
    sectionRange,
    videoDurationSeconds,
    viewportHeight,
  );
  let currentY = 0;

  for (let elapsedSeconds = 0; elapsedSeconds < videoDurationSeconds; elapsedSeconds += 1) {
    currentY = mapAutoScrollStep(
      currentY,
      1000,
      viewportHeight,
      sectionRange,
      { pixelsPerSecond },
    );
  }

  assert.equal(currentY, sectionRange);
});
