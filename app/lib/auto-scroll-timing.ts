export const AUTO_SCROLL_START_DELAY_MS = 1600;
export const AUTO_SCROLL_VIEWPORTS_PER_SECOND = 1;
export const AUTO_GALLERY_PRELUDE_DURATION_SECONDS = 5;
export const AUTO_GALLERY_SCROLL_HINT_DURATION_MS = 4000;
const MAX_AUTO_SCROLL_FRAME_MS = 64;

type AutoScrollStepOptions = {
  pixelsPerSecond?: number;
  boundaryY?: number;
};

export const buildInstantAutoScrollOptions = (top: number) => ({
  top,
  left: 0,
  behavior: "instant" as const,
});

export const resolveTimedAutoScrollPixelsPerSecond = (
  scrollRange: number,
  durationSeconds: number,
  viewportHeight: number,
) => Number.isFinite(durationSeconds) && durationSeconds > 0
  ? Math.max(0, scrollRange) / durationSeconds
  : Math.max(1, viewportHeight) * AUTO_SCROLL_VIEWPORTS_PER_SECOND;

export const mapAutoScrollStep = (
  currentY: number,
  elapsedMs: number,
  viewportHeight: number,
  targetY: number,
  options: AutoScrollStepOptions = {},
) => {
  if (currentY >= targetY) return targetY;

  const normalizedElapsedMs = Math.max(elapsedMs, 0);
  const safeElapsedMs = normalizedElapsedMs > 1000
    ? MAX_AUTO_SCROLL_FRAME_MS
    : normalizedElapsedMs;
  const fallbackPixelsPerSecond =
    viewportHeight * AUTO_SCROLL_VIEWPORTS_PER_SECOND;
  const pixelsPerSecond = Number.isFinite(options.pixelsPerSecond) &&
      (options.pixelsPerSecond ?? 0) > 0
    ? options.pixelsPerSecond as number
    : fallbackPixelsPerSecond;
  const distance = pixelsPerSecond * safeElapsedMs / 1000;
  const boundaryY = Math.min(targetY, options.boundaryY ?? targetY);

  return Math.min(boundaryY, currentY + distance);
};
