import assert from "node:assert/strict";
import test from "node:test";

import {
  OPENING_VIDEO_END,
  OPENING_VIDEO_START,
  mapOpeningVideoCopyOpacity,
  mapOpeningVideoGuideOpacity,
  mapOpeningVideoProgress,
} from "../app/lib/opening-video-timing.ts";

test("starts the opening video after the scroll-guide hold", () => {
  assert.equal(mapOpeningVideoProgress(OPENING_VIDEO_START), 0);
  assert.ok(mapOpeningVideoProgress(OPENING_VIDEO_START + 0.02) > 0);
});

test("shows the scroll guide before the opening video starts", () => {
  assert.equal(mapOpeningVideoGuideOpacity(0.145), 0);
  assert.ok(mapOpeningVideoGuideOpacity(0.17) > 0.99);
  assert.ok(mapOpeningVideoGuideOpacity(0.3) > 0.99);
  assert.equal(mapOpeningVideoGuideOpacity(OPENING_VIDEO_START), 0);
  assert.equal(mapOpeningVideoProgress(0.3), 0);
});

test("keeps the Vancouver opening label visible through most of the video", () => {
  assert.equal(mapOpeningVideoCopyOpacity(0.2), 0);
  assert.equal(mapOpeningVideoCopyOpacity(0.3), 1);
  assert.equal(mapOpeningVideoCopyOpacity(0.5), 1);
  assert.equal(mapOpeningVideoCopyOpacity(0.86), 1);
  assert.equal(mapOpeningVideoCopyOpacity(0.96), 0);
});

test("slows the opening video intro and finishes before the white cover", () => {
  const scrollProgress = 0.2;
  const pageProgress = OPENING_VIDEO_START +
    (OPENING_VIDEO_END - OPENING_VIDEO_START) * scrollProgress;

  assert.ok(mapOpeningVideoProgress(pageProgress) < scrollProgress);
  assert.equal(mapOpeningVideoProgress(OPENING_VIDEO_END), 1);
});
