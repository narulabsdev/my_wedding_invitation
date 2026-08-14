import assert from "node:assert/strict";
import test from "node:test";

import {
  getInitialVideoPreloadSources,
  preloadVideoFiles,
} from "../app/lib/preload-videos.ts";

test("finishes the initial loading gate after videos 001 through 004", () => {
  assert.deepEqual(
    getInitialVideoPreloadSources([
      "/001.mp4",
      "/002.mp4",
      "/003.mp4",
      "/004.mp4",
      "/005.mp4",
      "/006.mp4",
    ]),
    ["/001.mp4", "/002.mp4", "/003.mp4", "/004.mp4"],
  );
});

test("finishes only after every video response body is consumed", async () => {
  const consumed = [];
  const progress = [];
  const fetchVideo = async (src) => {
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array([1, 2]));
        controller.enqueue(new Uint8Array([3, 4]));
        controller.close();
      },
      cancel() {},
    });
    const response = new Response(body, {
      headers: { "content-length": "4" },
    });
    const originalReader = response.body.getReader.bind(response.body);
    response.body.getReader = () => {
      const reader = originalReader();
      const originalRead = reader.read.bind(reader);
      reader.read = async () => {
        const result = await originalRead();
        if (result.done) consumed.push(src);
        return result;
      };
      return reader;
    };
    return response;
  };

  await preloadVideoFiles(["/one.mp4", "/two.mp4"], {
    fetchVideo,
    onProgress: (value) => progress.push(value),
  });

  assert.deepEqual(consumed.sort(), ["/one.mp4", "/two.mp4"]);
  assert.equal(progress.at(-1), 1);
  assert.ok(progress.some((value) => value > 0 && value < 1));
});

test("does not complete when a required video request fails", async () => {
  await assert.rejects(
    preloadVideoFiles(["/missing.mp4"], {
      fetchVideo: async () => new Response(null, { status: 503 }),
    }),
    /Failed to preload video/,
  );
});
