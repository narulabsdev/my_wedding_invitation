const FINAL_CARD_HOLD_VIEWPORTS = 2;
const INVITATION_FADE_VIEWPORTS = 0.8;
const INVITATION_READ_HOLD_VIEWPORTS = 1.5;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const resolveGalleryScrollTimeline = (
  scrollRange: number,
  viewportHeight: number,
) => {
  const safeRange = Math.max(1, scrollRange);
  const safeViewport = Math.max(1, viewportHeight);
  const handoffFadeEndPixels = Math.max(
    0,
    safeRange - safeViewport * INVITATION_READ_HOLD_VIEWPORTS,
  );
  const handoffStartPixels = Math.max(
    0,
    handoffFadeEndPixels - safeViewport * INVITATION_FADE_VIEWPORTS,
  );
  const travelEndPixels = Math.max(
    0,
    handoffStartPixels - safeViewport * FINAL_CARD_HOLD_VIEWPORTS,
  );

  return {
    travelEnd: clamp(travelEndPixels / safeRange),
    handoffStart: clamp(handoffStartPixels / safeRange),
    handoffFadeEnd: clamp(handoffFadeEndPixels / safeRange),
    travelEndPixels,
    handoffStartPixels,
    handoffFadeEndPixels,
  };
};
