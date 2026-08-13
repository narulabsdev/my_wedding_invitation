import assert from "node:assert/strict";
import test from "node:test";

import { resolveGalleryScrollTimeline } from "../app/lib/gallery-scroll-timeline.ts";

test("holds the final gallery card for two viewports before invitation handoff", () => {
  const viewportHeight = 730;
  const timeline = resolveGalleryScrollTimeline(11242, viewportHeight);

  assert.ok(
    timeline.handoffStartPixels - timeline.travelEndPixels >= viewportHeight * 2,
  );
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
