const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const resolveEndingVideoProgress = (
  sectionTop: number,
  scrollRange: number,
) => clamp(-sectionTop / Math.max(1, scrollRange));

export const shouldStartEndingVideoAutoPlayback = ({
  sectionTop,
  progress,
  hasStarted,
  reducedMotion,
}: {
  sectionTop: number;
  progress: number;
  hasStarted: boolean;
  reducedMotion: boolean;
}) => !hasStarted && !reducedMotion && sectionTop <= 0.5 && progress < 1;
