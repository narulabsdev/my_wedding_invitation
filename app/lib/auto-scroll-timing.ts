export const AUTO_SCROLL_START_DELAY_MS = 1600;
export const AUTO_SCROLL_VIEWPORTS_PER_SECOND = 0.3;
const MAX_AUTO_SCROLL_FRAME_MS = 64;

export const mapAutoScrollStep = (
  currentY: number,
  elapsedMs: number,
  viewportHeight: number,
  targetY: number,
) => {
  if (currentY >= targetY) return targetY;

  const normalizedElapsedMs = Math.max(elapsedMs, 0);
  const safeElapsedMs = normalizedElapsedMs > 1000
    ? MAX_AUTO_SCROLL_FRAME_MS
    : normalizedElapsedMs;
  const distance =
    viewportHeight * AUTO_SCROLL_VIEWPORTS_PER_SECOND * safeElapsedMs / 1000;

  return Math.min(targetY, currentY + distance);
};
