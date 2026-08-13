import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveEndingVideoProgress,
  shouldStartEndingVideoAutoPlayback,
} from "../app/lib/ending-video-timing.ts";

test("maps upward scrolling back through the ending video", () => {
  assert.equal(resolveEndingVideoProgress(-500, 1000), 0.5);
  assert.equal(resolveEndingVideoProgress(-1000, 1000), 1);
  assert.equal(resolveEndingVideoProgress(-250, 1000), 0.25);
});

test("starts automatic playback only when the ending fills the viewport", () => {
  assert.equal(shouldStartEndingVideoAutoPlayback({
    sectionTop: 20,
    progress: 0,
    hasStarted: false,
    reducedMotion: false,
  }), false);
  assert.equal(shouldStartEndingVideoAutoPlayback({
    sectionTop: 0,
    progress: 0,
    hasStarted: false,
    reducedMotion: false,
  }), true);
  assert.equal(shouldStartEndingVideoAutoPlayback({
    sectionTop: 0,
    progress: 0,
    hasStarted: true,
    reducedMotion: false,
  }), false);
});
