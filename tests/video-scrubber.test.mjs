import assert from "node:assert/strict";
import test from "node:test";

import {
  chooseCanvasPlaybackAction,
  isKakaoInAppBrowser,
  quantizeVideoTime,
  resolveDesiredVideoTime,
  shouldRevealVideoFrame,
  shouldUseCanvasVideoFrames,
} from "../app/lib/video-scrubber.ts";
import { hasPassedDoorOpening } from "../app/lib/door-visibility.ts";

test("preserves scroll progress until delayed video metadata is available", () => {
  assert.equal(resolveDesiredVideoTime(0.5, 9.417), 4.6885);
  assert.equal(resolveDesiredVideoTime(1.5, 9.417), 9.377);
});

const androidKakao =
  "Mozilla/5.0 (Linux; Android 16) AppleWebKit/537.36 Mobile Safari/537.36 KAKAOTALK";
const iosKakao =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 KAKAOTALK";

test("uses canvas for Android and iOS Kakao browsers", () => {
  assert.equal(isKakaoInAppBrowser(androidKakao), true);
  assert.equal(isKakaoInAppBrowser(iosKakao), true);
  assert.equal(shouldUseCanvasVideoFrames(androidKakao), true);
  assert.equal(shouldUseCanvasVideoFrames(iosKakao), true);
});

test("quantizes seek targets to the source frame rate", () => {
  assert.equal(quantizeVideoTime(1.02, 6.58), 1);
  assert.ok(Math.abs(quantizeVideoTime(1.03, 6.58) - 25 / 24) < 1e-12);
  assert.equal(quantizeVideoTime(99, 6.58), 6.54);
});

test("keeps the white placeholder until a non-zero frame is presented", () => {
  assert.equal(shouldRevealVideoFrame("video", false, 1), false);
  assert.equal(shouldRevealVideoFrame("video", true, 0), false);
  assert.equal(shouldRevealVideoFrame("video", true, 1 / 24), true);
  assert.equal(shouldRevealVideoFrame("canvas", false, 0), false);
  assert.equal(shouldRevealVideoFrame("canvas", false, 1 / 24), true);
  assert.equal(shouldRevealVideoFrame("canvas", false, 0, 24, true), true);
});

test("uses continuous playback for nearby forward canvas progress", () => {
  assert.equal(chooseCanvasPlaybackAction(0.32, 1 / 24), "play");
  assert.equal(chooseCanvasPlaybackAction(-0.32, 1 / 24), "seek");
  assert.equal(chooseCanvasPlaybackAction(1.6, 1 / 24), "seek");
  assert.equal(chooseCanvasPlaybackAction(0.01, 1 / 24), "hold");
});

test("hides the traditional opening independently of dynamic viewport refresh", () => {
  assert.equal(hasPassedDoorOpening(500, 700), false);
  assert.equal(hasPassedDoorOpening(1600, 700), true);
  assert.equal(hasPassedDoorOpening(1600, 620), true);
});
