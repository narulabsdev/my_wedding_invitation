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
  const homeAndCookieVideo = html.indexOf("/videos/003-scroll.mp4");
  const ringExchangeVideo = html.indexOf("/videos/004-scroll.mp4");
  const canadaWeddingVideo = html.indexOf("/videos/005-scroll.mp4");
  const gallery = html.indexOf("OUR GALLERY");
  const invitation = html.indexOf('class="gallery-invitation-handoff"');

  assert.ok(firstVideo >= 0, "renders the first scroll-scrub video");
  assert.ok(firstDateVideo > firstVideo, "renders the first-date video after video one");
  assert.ok(
    homeAndCookieVideo > firstDateVideo,
    "renders the moving-in and Cookie video after the first-date video",
  );
  assert.ok(
    ringExchangeVideo > homeAndCookieVideo,
    "renders the ring-exchange video after the moving-in and Cookie video",
  );
  assert.ok(
    canadaWeddingVideo > ringExchangeVideo,
    "renders the Canada wedding video after the ring-exchange video",
  );
  assert.ok(
    gallery > canadaWeddingVideo,
    "renders the horizontal gallery after the Canada wedding video",
  );
  assert.ok(invitation > gallery, "renders the invitation message after the gallery");
  assert.doesNotMatch(html, /\/videos\/(?:canada-wedding|family-home)\.mp4/);
  const videoTags = html.match(/<video\b[^>]*>/g) ?? [];
  assert.equal(videoTags.length, 5, "renders all five scroll-scrub videos");
  videoTags.forEach((videoTag) => {
    assert.match(
      videoTag,
      /\bposter="\/images\/video-posters\/00[1-5]\.webp"/,
      "gives every scrub video a static poster fallback",
    );
    assert.match(videoTag, /\bplaysinline=""/i, "keeps videos inline on mobile");
    assert.doesNotMatch(videoTag, /\bcontrols(?:=|\s|>)/, "does not expose native video controls");
  });
  assert.match(html, /VANCOUVER/);
  assert.match(html, /data-locale="en"/);
  assert.match(html, /Where our story begins/);
  assert.match(html, /Our first date/);
  assert.match(html, /2022 · 10 · 08/);
  assert.match(html, /The day we began our life together/);
  assert.match(html, /2023\.03\.04/);
  assert.match(html, /The day Cookie joined our family/);
  assert.match(html, /2023\.04\.06/);
  assert.match(html, /The proposal/);
  assert.match(html, /2024\.10\.08/);
  assert.match(html, /Our Canadian wedding/);
  assert.match(html, /2025\.05\.05/);
  assert.match(html, /--gallery-items:20/);
  assert.equal(
    (html.match(/class="memory-card[^"]*"/g) ?? []).length,
    20,
    "renders all 20 gallery photos",
  );
  assert.match(html, /\/images\/gallery\/gallery-01\.jpg/);
  assert.match(html, /\/images\/gallery\/gallery-20\.jpg/);
  assert.doesNotMatch(html, /Our story · Vancouver to Seoul/);
  assert.doesNotMatch(
    html,
    /\/images\/(?:vancouver-story|canada-wedding|family-three)\.webp/,
  );
});
