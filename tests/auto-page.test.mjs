import assert from "node:assert/strict";
import test from "node:test";

test("renders an automatic route without scroll instructions", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("auto-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/auto", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /data-auto-mode="true"/);
  assert.doesNotMatch(html, /Scroll down slowly to play the video/);
  assert.doesNotMatch(html, /SCROLL TO OPEN/);
  assert.doesNotMatch(html, /Scroll to explore our photos/);
});
