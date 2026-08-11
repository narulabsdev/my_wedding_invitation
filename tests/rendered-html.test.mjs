import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
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
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, developmentPreviewMeta);

  const firstVideo = html.indexOf("/videos/001-scroll.mp4");
  const firstDateVideo = html.indexOf("/videos/002-scroll.mp4");
  const gallery = html.indexOf("OUR GALLERY");
  const secondVideo = html.indexOf("/videos/canada-wedding.mp4");
  const thirdVideo = html.indexOf("/videos/family-home.mp4");

  assert.ok(firstVideo >= 0, "renders the first scroll-scrub video");
  assert.ok(firstDateVideo > firstVideo, "renders the first-date video after video one");
  assert.ok(gallery > firstDateVideo, "renders the horizontal gallery after the first-date video");
  assert.ok(secondVideo > gallery, "renders video two after the gallery");
  assert.ok(thirdVideo > secondVideo, "renders video three after video two");
  assert.match(html, /VANCOUVER/);
  assert.match(html, /data-locale="en"/);
  assert.match(html, /Where our story begins/);
  assert.match(html, /Our first date/);
  assert.doesNotMatch(html, /Our story · Vancouver to Seoul/);
  assert.doesNotMatch(
    html,
    /\/images\/(?:vancouver-story|canada-wedding|family-three)\.webp/,
  );
});
