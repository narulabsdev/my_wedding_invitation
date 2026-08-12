export type ViewportSize = {
  width: number;
  height: number;
};

const WIDTH_CHANGE_THRESHOLD = 1;
const STABLE_VIEWPORT_PROPERTY = "--stable-scroll-vh";

export const shouldStabilizeKakaoViewport = (userAgent: string) =>
  /KAKAOTALK|KAKAOSTORY/i.test(userAgent) && /Android/i.test(userAgent);

export const resolveStableViewport = (
  current: ViewportSize,
  next: ViewportSize,
) => Math.abs(next.width - current.width) > WIDTH_CHANGE_THRESHOLD
  ? next
  : current;

export const toStableViewportUnit = ({ height }: ViewportSize) =>
  `${Math.max(1, height) / 100}px`;

const readViewport = (): ViewportSize => ({
  width: window.visualViewport?.width ?? window.innerWidth,
  height: window.visualViewport?.height ?? window.innerHeight,
});

export const installStableKakaoScrollViewport = () => {
  if (!shouldStabilizeKakaoViewport(navigator.userAgent)) return () => {};

  const root = document.documentElement;
  let stableViewport = readViewport();
  let resizeFrame = 0;

  const applyStableViewport = () => {
    root.style.setProperty(
      STABLE_VIEWPORT_PROPERTY,
      toStableViewportUnit(stableViewport),
    );
  };
  const syncStableViewport = () => {
    resizeFrame = 0;
    const nextViewport = resolveStableViewport(stableViewport, readViewport());
    if (nextViewport === stableViewport) return;
    stableViewport = nextViewport;
    applyStableViewport();
  };
  const requestStableViewportSync = () => {
    if (resizeFrame) return;
    resizeFrame = window.requestAnimationFrame(syncStableViewport);
  };

  applyStableViewport();
  window.addEventListener("resize", requestStableViewportSync);
  window.visualViewport?.addEventListener("resize", requestStableViewportSync);

  return () => {
    window.removeEventListener("resize", requestStableViewportSync);
    window.visualViewport?.removeEventListener("resize", requestStableViewportSync);
    if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
    root.style.removeProperty(STABLE_VIEWPORT_PROPERTY);
  };
};
