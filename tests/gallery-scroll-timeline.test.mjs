import assert from "node:assert/strict";
import test from "node:test";

import {
  GALLERY_ENTRANCE_END,
  resolveGalleryAutoStopY,
  resolveGalleryScrollTimeline,
} from "../app/lib/gallery-scroll-timeline.ts";

test("stops automatic playback after the first gallery frame is revealed", () => {
  const galleryStartY = 12000;
  const galleryScrollRange = 11242;

  assert.equal(
    resolveGalleryAutoStopY(galleryStartY, galleryScrollRange),
    galleryStartY + galleryScrollRange * GALLERY_ENTRANCE_END,
  );
});

test("holds the final gallery card for one viewport before invitation handoff", () => {
  const viewportHeight = 730;
  const timeline = resolveGalleryScrollTimeline(11242, viewportHeight);
  const holdPixels = timeline.handoffStartPixels - timeline.travelEndPixels;

  assert.ok(holdPixels >= viewportHeight * 0.95);
  assert.ok(holdPixels <= viewportHeight * 1.05);
  assert.ok(timeline.travelEnd < timeline.handoffStart);
  assert.ok(timeline.handoffStart < 1);
});

test("keeps a useful handoff duration after the final-card hold", () => {
  const viewportHeight = 730;
  const timeline = resolveGalleryScrollTimeline(11242, viewportHeight);

  assert.ok(
    timeline.handoffFadeEndPixels - timeline.handoffStartPixels >=
      viewportHeight * 0.7,
  );
});

test("holds the fully revealed invitation long enough to read", () => {
  const viewportHeight = 730;
  const scrollRange = 11242;
  const timeline = resolveGalleryScrollTimeline(scrollRange, viewportHeight);

  assert.ok(
    scrollRange - timeline.handoffFadeEndPixels >= viewportHeight * 1.5,
  );
});
