const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const GALLERY_PRELUDE_FADE_IN_END = 0.18;
const GALLERY_PRELUDE_FADE_OUT_START = 0.82;

export const mapGalleryPreludeOpacity = (progress: number) => Math.min(
  clamp(progress / GALLERY_PRELUDE_FADE_IN_END),
  clamp(
    (1 - progress) /
      (1 - GALLERY_PRELUDE_FADE_OUT_START),
  ),
);
