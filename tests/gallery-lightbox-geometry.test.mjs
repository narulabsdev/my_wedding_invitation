import assert from "node:assert/strict";
import test from "node:test";

import { isPointInsideContainedImage } from "../app/lib/gallery-lightbox-geometry.ts";

test("treats object-fit letterbox space as outside the selected image", () => {
  const box = { left: 20, top: 72, width: 372, height: 702 };

  assert.equal(
    isPointInsideContainedImage({ x: 206, y: 80 }, box, 1284, 963),
    false,
  );
  assert.equal(
    isPointInsideContainedImage({ x: 206, y: 423 }, box, 1284, 963),
    true,
  );
});
