type ScrollFrameListener = () => void;

const listeners = new Set<ScrollFrameListener>();
let frame = 0;

export function requestScrollFrame() {
  if (frame || typeof window === "undefined") return;
  frame = window.requestAnimationFrame(() => {
    frame = 0;
    listeners.forEach((listener) => listener());
  });
}

export function subscribeToScrollFrame(listener: ScrollFrameListener) {
  listeners.add(listener);

  if (listeners.size === 1) {
    window.addEventListener("scroll", requestScrollFrame, { passive: true });
    window.addEventListener("resize", requestScrollFrame);
  }

  requestScrollFrame();

  return () => {
    listeners.delete(listener);
    if (listeners.size > 0) return;

    window.removeEventListener("scroll", requestScrollFrame);
    window.removeEventListener("resize", requestScrollFrame);
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
  };
}
