const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const STORY_WHITE_ENTRANCE_END = 0.035;
const FIRST_DATE_COPY_FADE_OUT_START = 0.22;
const FIRST_DATE_COPY_FADE_OUT_END = 0.34;
const CANADA_WEDDING_FADE_OUT_START = 0.86;
const CANADA_WEDDING_FADE_OUT_END = 0.98;

const whiteEntranceScenes = new Set(["first-date", "youngjoon-birth"]);

export const mapStoryEntranceOpacity = (
  sceneId: string,
  progress: number,
) => whiteEntranceScenes.has(sceneId)
  ? clamp(progress / STORY_WHITE_ENTRANCE_END)
  : 1;

export const mapStoryExitOpacity = (
  sceneId: string,
  progress: number,
) => sceneId === "canada-wedding"
  ? clamp(
    (CANADA_WEDDING_FADE_OUT_END - progress) /
      (CANADA_WEDDING_FADE_OUT_END - CANADA_WEDDING_FADE_OUT_START),
  )
  : 1;

export const mapFirstDateCopyOpacity = (progress: number) => {
  const entrance = clamp(progress / STORY_WHITE_ENTRANCE_END);
  const exit = clamp(
    (FIRST_DATE_COPY_FADE_OUT_END - progress) /
      (FIRST_DATE_COPY_FADE_OUT_END - FIRST_DATE_COPY_FADE_OUT_START),
  );
  return entrance * exit;
};
