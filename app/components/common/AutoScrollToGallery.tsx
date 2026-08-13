"use client";

import { useEffect } from "react";
import {
  AUTO_SCROLL_START_DELAY_MS,
  mapAutoScrollStep,
} from "../../lib/auto-scroll-timing";
import { readStableScrollViewportHeight } from "../../lib/stable-scroll-viewport";

type AutoScrollToGalleryProps = {
  enabled: boolean;
  ready: boolean;
};

export function AutoScrollToGallery({
  enabled,
  ready,
}: AutoScrollToGalleryProps) {
  useEffect(() => {
    if (!enabled || !ready) return;

    let animationFrame = 0;
    let previousFrameTime = 0;
    let cancelled = false;

    const render = (frameTime: number) => {
      if (cancelled) return;

      const gallery = document.querySelector<HTMLElement>(".timeline-scroll");
      if (!gallery) {
        animationFrame = window.requestAnimationFrame(render);
        return;
      }

      const targetY = gallery.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY >= targetY - 1) {
        window.scrollTo(0, targetY);
        return;
      }

      const elapsedMs = previousFrameTime === 0 ? 0 : frameTime - previousFrameTime;
      previousFrameTime = frameTime;
      window.scrollTo(
        0,
        mapAutoScrollStep(
          window.scrollY,
          elapsedMs,
          readStableScrollViewportHeight(),
          targetY,
        ),
      );
      animationFrame = window.requestAnimationFrame(render);
    };

    const startTimer = window.setTimeout(() => {
      animationFrame = window.requestAnimationFrame(render);
    }, AUTO_SCROLL_START_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(startTimer);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [enabled, ready]);

  return null;
}
