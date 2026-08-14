"use client";

import { useEffect, useRef } from "react";
import type { EndingVideo } from "../../content/invitation";
import {
  buildInstantAutoScrollOptions,
  mapAutoScrollStep,
  resolveTimedAutoScrollPixelsPerSecond,
} from "../../lib/auto-scroll-timing";
import {
  resolveEndingVideoProgress,
  shouldStartEndingVideoAutoPlayback,
} from "../../lib/ending-video-timing";
import {
  requestScrollFrame,
  subscribeToScrollFrame,
} from "../../lib/scroll-frame";
import { readStableScrollViewportHeight } from "../../lib/stable-scroll-viewport";
import { createVideoScrubber } from "../../lib/video-scrubber";

type EndingScrollVideoProps = {
  scene: EndingVideo;
};

export function EndingScrollVideo({ scene }: EndingScrollVideoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!section || !frame || !video || !canvas) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const videoScrubber = createVideoScrubber({
      video,
      canvas,
      frame,
      fit: "contain",
      contentScale: 1.2,
      contentPositionX: 1,
      revealInitialFrame: true,
    });
    let hasAutoStarted = false;
    let autoFrame = 0;
    let previousFrameTime = 0;
    let autoActive = false;
    let autoScrollY = 0;

    const readMetrics = () => {
      const viewportHeight = readStableScrollViewportHeight();
      const sectionTop = section.getBoundingClientRect().top;
      const scrollRange = Math.max(1, section.offsetHeight - viewportHeight);
      const sectionStartY = sectionTop + window.scrollY;

      return {
        viewportHeight,
        sectionTop,
        scrollRange,
        sectionStartY,
        progress: resolveEndingVideoProgress(sectionTop, scrollRange),
      };
    };

    const renderProgress = (progress: number) => {
      videoScrubber.seek(progress);
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    const stopAutoPlayback = () => {
      autoActive = false;
      previousFrameTime = 0;
      if (autoFrame) window.cancelAnimationFrame(autoFrame);
      autoFrame = 0;
    };

    const advanceAutoPlayback = (frameTime: number) => {
      if (!autoActive) return;

      const metrics = readMetrics();
      const targetY = metrics.sectionStartY + metrics.scrollRange;
      const elapsedMs = previousFrameTime === 0
        ? 0
        : frameTime - previousFrameTime;
      previousFrameTime = frameTime;
      const nextY = mapAutoScrollStep(
        autoScrollY,
        elapsedMs,
        metrics.viewportHeight,
        targetY,
        {
          pixelsPerSecond: resolveTimedAutoScrollPixelsPerSecond(
            metrics.scrollRange,
            scene.durationSeconds,
            metrics.viewportHeight,
          ),
        },
      );

      autoScrollY = nextY;
      window.scrollTo(buildInstantAutoScrollOptions(nextY));
      renderProgress(
        (nextY - metrics.sectionStartY) / metrics.scrollRange,
      );

      if (nextY >= targetY - 0.5) {
        stopAutoPlayback();
        renderProgress(1);
        return;
      }
      autoFrame = window.requestAnimationFrame(advanceAutoPlayback);
    };

    const startAutoPlayback = () => {
      hasAutoStarted = true;
      autoActive = true;
      autoScrollY = window.scrollY;
      previousFrameTime = 0;
      autoFrame = window.requestAnimationFrame(advanceAutoPlayback);
    };

    const render = () => {
      const metrics = readMetrics();
      renderProgress(reducedMotion ? 1 : metrics.progress);

      if (shouldStartEndingVideoAutoPlayback({
        sectionTop: metrics.sectionTop,
        progress: metrics.progress,
        hasStarted: hasAutoStarted,
        reducedMotion,
      })) {
        startAutoPlayback();
      }
    };

    const cancelForTouch = () => {
      if (autoActive) stopAutoPlayback();
    };
    const cancelForReverseWheel = (event: WheelEvent) => {
      if (autoActive && event.deltaY < 0) stopAutoPlayback();
    };
    const preloadObserver = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      video.preload = "auto";
      video.load();
      preloadObserver.disconnect();
    }, { rootMargin: "200% 0px" });
    const unsubscribe = subscribeToScrollFrame(render);
    const resizeObserver = new ResizeObserver(requestScrollFrame);

    preloadObserver.observe(section);
    resizeObserver.observe(section);
    window.addEventListener("wheel", cancelForReverseWheel, { passive: true });
    window.addEventListener("touchstart", cancelForTouch, { passive: true });
    render();

    return () => {
      stopAutoPlayback();
      preloadObserver.disconnect();
      resizeObserver.disconnect();
      unsubscribe();
      window.removeEventListener("wheel", cancelForReverseWheel);
      window.removeEventListener("touchstart", cancelForTouch);
      videoScrubber.destroy();
    };
  }, [scene.durationSeconds, scene.src]);

  return (
    <footer
      ref={sectionRef}
      className="ending-video-scroll"
      aria-label={scene.ariaLabel}
      data-ending-video
    >
      <div className="ending-video-sticky">
        <div ref={frameRef} className="scrub-video-frame ending-video-frame">
          <video
            ref={videoRef}
            className="scrub-video-media ending-video-media"
            src={scene.src}
            poster={scene.poster}
            muted
            playsInline
            preload="metadata"
            tabIndex={-1}
            aria-hidden="true"
          />
          <canvas
            ref={canvasRef}
            className="scrub-video-canvas"
            aria-hidden="true"
          />
          {/* Exact first-frame fallback for WebViews before video decoding. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="scrub-video-poster ending-video-poster"
            src={scene.poster}
            alt=""
            aria-hidden="true"
          />
        </div>

        <div className="ending-video-label">
          <p>
            {scene.title[0]}
            <br />
            {scene.title[1]}
          </p>
        </div>

        <div className="ending-video-progress" aria-hidden="true">
          <span ref={progressRef} />
        </div>
      </div>
    </footer>
  );
}
