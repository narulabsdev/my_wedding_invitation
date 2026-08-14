const FINAL_CARD_HOLD_VIEWPORTS = 1;
const INVITATION_FADE_VIEWPORTS = 0.8;
const INVITATION_READ_HOLD_VIEWPORTS = 1.5;

export const GALLERY_ENTRANCE_END = 0.035;

export const resolveGalleryAutoStopY = (
  galleryStartY: number,
  galleryScrollRange: number,
) => galleryStartY + Math.max(0, galleryScrollRange) * GALLERY_ENTRANCE_END;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const resolveGalleryScrollTimeline = (
  scrollRange: number,
  viewportHeight: number,
  options: { invitationReadHoldViewports?: number } = {},
) => {
  const safeRange = Math.max(1, scrollRange);
  const safeViewport = Math.max(1, viewportHeight);
  const invitationReadHoldViewports = Math.max(
    0,
    options.invitationReadHoldViewports ?? INVITATION_READ_HOLD_VIEWPORTS,
  );
  const handoffFadeEndPixels = Math.max(
    0,
    safeRange - safeViewport * invitationReadHoldViewports,
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
