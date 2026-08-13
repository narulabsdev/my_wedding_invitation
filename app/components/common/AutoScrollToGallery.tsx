"use client";

import { useEffect, useState } from "react";
import {
  AUTO_GALLERY_SCROLL_HINT_DURATION_MS,
  AUTO_SCROLL_START_DELAY_MS,
  AUTO_SCROLL_VIEWPORTS_PER_SECOND,
  buildInstantAutoScrollOptions,
  mapAutoScrollStep,
  resolveTimedAutoScrollPixelsPerSecond,
} from "../../lib/auto-scroll-timing";
import { resolveOpeningAutoPageProgressPerSecond } from "../../lib/opening-video-timing";
import { resolveGalleryAutoStopY } from "../../lib/gallery-scroll-timeline";
import { readStableScrollViewportHeight } from "../../lib/stable-scroll-viewport";

type AutoScrollToGalleryProps = {
  enabled: boolean;
  ready: boolean;
  hint: string;
};

export function AutoScrollToGallery({
  enabled,
  ready,
  hint,
}: AutoScrollToGalleryProps) {
  const [showGalleryHint, setShowGalleryHint] = useState(false);

  useEffect(() => {
    if (!enabled || !ready) return;

    let animationFrame = 0;
    let previousFrameTime = 0;
    let cancelled = false;
    let hintTimer = 0;
    const timedSections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-auto-duration-seconds]"),
    );

    const render = (frameTime: number) => {
      if (cancelled) return;

      const gallery = document.querySelector<HTMLElement>(".timeline-scroll");
      if (!gallery) {
        animationFrame = window.requestAnimationFrame(render);
        return;
      }

      const viewportHeight = readStableScrollViewportHeight();
      const galleryStartY = gallery.getBoundingClientRect().top + window.scrollY;
      const galleryScrollRange = Math.max(
        1,
        gallery.offsetHeight - viewportHeight,
      );
      const targetY = resolveGalleryAutoStopY(
        galleryStartY,
        galleryScrollRange,
      );
      if (window.scrollY >= targetY - 1) {
        window.scrollTo(buildInstantAutoScrollOptions(targetY));
        setShowGalleryHint(true);
        hintTimer = window.setTimeout(() => {
          setShowGalleryHint(false);
        }, AUTO_GALLERY_SCROLL_HINT_DURATION_MS);
        return;
      }

      const elapsedMs = previousFrameTime === 0 ? 0 : frameTime - previousFrameTime;
      previousFrameTime = frameTime;
      const currentY = window.scrollY;
      let pixelsPerSecond =
        viewportHeight * AUTO_SCROLL_VIEWPORTS_PER_SECOND;
      let boundaryY = targetY;

      timedSections.forEach((section) => {
        const startY = section.getBoundingClientRect().top + currentY;
        const scrollRange = Math.max(1, section.offsetHeight - viewportHeight);
        const endY = startY + scrollRange;
        if (currentY < startY - 0.5 || currentY >= endY - 0.5) return;

        const durationSeconds = Number(section.dataset.autoDurationSeconds);
        const sectionProgress = Math.min(
          1,
          Math.max(0, (currentY - startY) / scrollRange),
        );
        pixelsPerSecond = section.dataset.autoScrollKind === "opening-video"
          ? scrollRange * resolveOpeningAutoPageProgressPerSecond(
            sectionProgress,
            durationSeconds,
          )
          : resolveTimedAutoScrollPixelsPerSecond(
            scrollRange,
            durationSeconds,
            viewportHeight,
          );
        boundaryY = Math.min(targetY, endY);
      });

      window.scrollTo(
        buildInstantAutoScrollOptions(mapAutoScrollStep(
          currentY,
          elapsedMs,
          viewportHeight,
          targetY,
          { pixelsPerSecond, boundaryY },
        )),
      );
      animationFrame = window.requestAnimationFrame(render);
    };

    const startTimer = window.setTimeout(() => {
      animationFrame = window.requestAnimationFrame(render);
    }, AUTO_SCROLL_START_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(startTimer);
      window.clearTimeout(hintTimer);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [enabled, ready]);

  return showGalleryHint ? (
    <div
      className="auto-gallery-scroll-hint"
      role="status"
      aria-live="polite"
    >
      <p>{hint}</p>
    </div>
  ) : null;
}
