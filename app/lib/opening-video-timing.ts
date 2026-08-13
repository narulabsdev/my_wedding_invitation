const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const OPENING_VIDEO_START = 0.34;
export const OPENING_VIDEO_END = 0.9;
export const OPENING_AUTO_INTRO_SECONDS = 2.5;
export const OPENING_AUTO_EXIT_SECONDS = 1;

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

export const resolveOpeningAutoPageProgressPerSecond = (
  pageProgress: number,
  videoDurationSeconds: number,
) => {
  const safeDuration = Math.max(0.1, videoDurationSeconds);
  const videoScrollRange = OPENING_VIDEO_END - OPENING_VIDEO_START;
  const introScrollEnd =
    OPENING_VIDEO_START + videoScrollRange * INTRO_SCROLL_SHARE;

  if (pageProgress < OPENING_VIDEO_START) {
    return OPENING_VIDEO_START / OPENING_AUTO_INTRO_SECONDS;
  }
  if (pageProgress < introScrollEnd) {
    return videoScrollRange * INTRO_SCROLL_SHARE /
      (safeDuration * INTRO_VIDEO_SHARE);
  }
  if (pageProgress < OPENING_VIDEO_END) {
    return videoScrollRange * (1 - INTRO_SCROLL_SHARE) /
      (safeDuration * (1 - INTRO_VIDEO_SHARE));
  }
  return (1 - OPENING_VIDEO_END) / OPENING_AUTO_EXIT_SECONDS;
};

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
