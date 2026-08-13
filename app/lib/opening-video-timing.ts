const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const OPENING_VIDEO_START = 0.34;
export const OPENING_VIDEO_END = 0.9;

export const mapOpeningVideoGuideOpacity = (pageProgress: number) => {
  const fadeIn = clamp((pageProgress - 0.145) / 0.025);
  const fadeOut = clamp((OPENING_VIDEO_START - pageProgress) / 0.03);

  return Math.min(fadeIn, fadeOut);
};

const OPENING_COPY_FADE_IN_START = 0.22;
const OPENING_COPY_FADE_IN_END = 0.3;
const OPENING_COPY_FADE_OUT_START = 0.86;
const OPENING_COPY_FADE_OUT_END = 0.96;

export const mapOpeningVideoCopyOpacity = (videoProgress: number) => {
  const fadeIn = clamp(
    (videoProgress - OPENING_COPY_FADE_IN_START) /
      (OPENING_COPY_FADE_IN_END - OPENING_COPY_FADE_IN_START),
  );
  const fadeOut = clamp(
    (OPENING_COPY_FADE_OUT_END - videoProgress) /
      (OPENING_COPY_FADE_OUT_END - OPENING_COPY_FADE_OUT_START),
  );

  return Math.min(fadeIn, fadeOut);
};

const INTRO_SCROLL_SHARE = 0.34;
const INTRO_VIDEO_SHARE = 0.17;

export const mapOpeningVideoProgress = (pageProgress: number) => {
  const progress = clamp(
    (pageProgress - OPENING_VIDEO_START) /
      (OPENING_VIDEO_END - OPENING_VIDEO_START),
  );

  if (progress <= INTRO_SCROLL_SHARE) {
    return progress / INTRO_SCROLL_SHARE * INTRO_VIDEO_SHARE;
  }

  return INTRO_VIDEO_SHARE +
    (progress - INTRO_SCROLL_SHARE) /
      (1 - INTRO_SCROLL_SHARE) *
      (1 - INTRO_VIDEO_SHARE);
};
