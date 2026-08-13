import assert from "node:assert/strict";
import test from "node:test";

import { mapGalleryPreludeOpacity } from "../app/lib/gallery-prelude-timing.ts";

test("fades the gallery prelude in, holds it for reading, then fades it out", () => {
  assert.equal(mapGalleryPreludeOpacity(0), 0);
  assert.equal(mapGalleryPreludeOpacity(0.18), 1);
  assert.equal(mapGalleryPreludeOpacity(0.5), 1);
  assert.equal(mapGalleryPreludeOpacity(0.82), 1);
  assert.equal(mapGalleryPreludeOpacity(1), 0);
});
