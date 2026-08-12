import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveStableViewport,
  shouldStabilizeKakaoViewport,
  toStableViewportUnit,
} from "../app/lib/stable-scroll-viewport.ts";

const androidKakao =
  "Mozilla/5.0 (Linux; Android 16) AppleWebKit/537.36 Mobile KAKAOTALK";
const iosKakao =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 Mobile KAKAOTALK";

test("stabilizes only Android Kakao app viewports", () => {
  assert.equal(shouldStabilizeKakaoViewport(androidKakao), true);
  assert.equal(shouldStabilizeKakaoViewport(iosKakao), false);
});

test("keeps the scroll viewport stable for height-only toolbar changes", () => {
  const initial = { width: 393, height: 730 };

  assert.deepEqual(
    resolveStableViewport(initial, { width: 393, height: 650 }),
    initial,
  );
  assert.equal(toStableViewportUnit(initial), "7.3px");
});

test("updates the stable viewport after an orientation or width change", () => {
  const initial = { width: 393, height: 730 };
  const rotated = { width: 730, height: 393 };

  assert.deepEqual(resolveStableViewport(initial, rotated), rotated);
  assert.equal(toStableViewportUnit(rotated), "3.93px");
});
