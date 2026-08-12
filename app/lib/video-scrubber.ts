const DEFAULT_SCRUB_FPS = 24;
const MAX_CANVAS_PIXEL_RATIO = 1.5;
const MAX_CONTINUOUS_PLAY_GAP = 1.25;

type VideoFit = "cover" | "contain";
export type VideoRenderMode = "canvas" | "video";
export type CanvasPlaybackAction = "hold" | "play" | "seek";

type VideoScrubberOptions = {
  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;
  frame: HTMLElement;
  fit?: VideoFit;
  fps?: number;
};

export type VideoScrubber = {
  seek: (progress: number) => void;
  destroy: () => void;
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const isKakaoInAppBrowser = (userAgent: string) =>
  /KAKAOTALK|KAKAOSTORY/i.test(userAgent);

export const shouldUseCanvasVideoFrames = (userAgent: string) =>
  isKakaoInAppBrowser(userAgent) && /Android/i.test(userAgent);

export const shouldRevealVideoFrame = (
  renderMode: VideoRenderMode,
  hasPresentedFrame: boolean,
  currentTime: number,
  fps = DEFAULT_SCRUB_FPS,
) => currentTime >= 0.5 / fps && (
  renderMode === "canvas" || hasPresentedFrame
);

export const chooseCanvasPlaybackAction = (
  timeDelta: number,
  frameDuration: number,
): CanvasPlaybackAction => {
  if (Math.abs(timeDelta) <= frameDuration * 1.5) return "hold";
  if (timeDelta > 0 && timeDelta <= MAX_CONTINUOUS_PLAY_GAP) return "play";
  return "seek";
};

export const quantizeVideoTime = (
  time: number,
  duration: number,
  fps = DEFAULT_SCRUB_FPS,
) => {
  const safeDuration = Math.max(0, duration - 0.04);
  const frameDuration = 1 / fps;
  return clamp(Math.round(time / frameDuration) * frameDuration, 0, safeDuration);
};

const drawVideoFrame = (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  fit: VideoFit,
) => {
  if (
    video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
    video.videoWidth === 0 ||
    video.videoHeight === 0
  ) {
    return false;
  }

  const bounds = canvas.getBoundingClientRect();
  if (bounds.width === 0 || bounds.height === 0) return false;

  const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_CANVAS_PIXEL_RATIO);
  const width = Math.max(1, Math.round(bounds.width * pixelRatio));
  const height = Math.max(1, Math.round(bounds.height * pixelRatio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return false;

  const scale = fit === "contain"
    ? Math.min(width / video.videoWidth, height / video.videoHeight)
    : Math.max(width / video.videoWidth, height / video.videoHeight);
  const drawWidth = video.videoWidth * scale;
  const drawHeight = video.videoHeight * scale;
  const offsetX = (width - drawWidth) / 2;
  const offsetY = (height - drawHeight) / 2;

  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);
  context.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
  return true;
};

export function createVideoScrubber({
  video,
  canvas,
  frame,
  fit = "cover",
  fps = DEFAULT_SCRUB_FPS,
}: VideoScrubberOptions): VideoScrubber {
  const frameDuration = 1 / fps;
  const minimumSeekInterval = 1000 / fps;
  const useCanvas = shouldUseCanvasVideoFrames(navigator.userAgent);
  const renderMode: VideoRenderMode = useCanvas ? "canvas" : "video";
  let desiredTime = 0;
  let lastSeekAt = Number.NEGATIVE_INFINITY;
  let animationFrame = 0;
  let presentedFrameCallback = 0;
  let timer = 0;
  let playPending = false;
  let hasPresentedFrame = false;
  let destroyed = false;

  frame.dataset.scrubRenderer = renderMode;
  frame.removeAttribute("data-scrub-ready");
  video.controls = false;
  video.disablePictureInPicture = true;
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("x-webkit-airplay", "deny");
  video.pause();

  const revealCurrentFrame = (wasPresented = false) => {
    hasPresentedFrame ||= wasPresented;
    if (useCanvas && !drawVideoFrame(video, canvas, fit)) return;
    if (!shouldRevealVideoFrame(renderMode, hasPresentedFrame, video.currentTime, fps)) {
      return;
    }
    frame.dataset.scrubReady = "true";
  };

  const requestPresentedFrame = () => {
    if (
      destroyed ||
      presentedFrameCallback ||
      typeof video.requestVideoFrameCallback !== "function"
    ) {
      return;
    }

    presentedFrameCallback = video.requestVideoFrameCallback(() => {
      presentedFrameCallback = 0;
      revealCurrentFrame(true);
      schedule();
      requestPresentedFrame();
    });
  };

  const schedule = () => {
    if (destroyed || animationFrame || timer) return;
    animationFrame = window.requestAnimationFrame(flush);
  };

  const seekToTarget = (targetTime: number) => {
    const now = performance.now();
    const remaining = minimumSeekInterval - (now - lastSeekAt);
    if (remaining > 0) {
      timer = window.setTimeout(() => {
        timer = 0;
        schedule();
      }, remaining);
      return;
    }

    lastSeekAt = now;
    video.currentTime = targetTime;
    requestPresentedFrame();
  };

  const playTowardTarget = (timeDelta: number, targetTime: number) => {
    video.playbackRate = clamp(timeDelta * 5, 0.5, 4);
    if (!video.paused || playPending) return;

    playPending = true;
    requestPresentedFrame();
    void video.play()
      .catch(() => {
        if (!destroyed) seekToTarget(targetTime);
      })
      .finally(() => {
        playPending = false;
      });
  };

  const flush = () => {
    animationFrame = 0;
    if (
      destroyed ||
      video.readyState < HTMLMediaElement.HAVE_METADATA ||
      !Number.isFinite(video.duration)
    ) {
      return;
    }

    if (video.seeking) {
      requestPresentedFrame();
      return;
    }

    const targetTime = quantizeVideoTime(desiredTime, video.duration, fps);
    const timeDelta = targetTime - video.currentTime;

    if (useCanvas) {
      const action = chooseCanvasPlaybackAction(timeDelta, frameDuration);
      if (action === "play") {
        playTowardTarget(timeDelta, targetTime);
        return;
      }
      if (!video.paused) video.pause();
      if (action === "hold") {
        revealCurrentFrame();
        return;
      }
      seekToTarget(targetTime);
      return;
    }

    if (Math.abs(timeDelta) < frameDuration * 0.5) {
      return;
    }

    seekToTarget(targetTime);
  };

  const handleLoadedData = () => {
    if (useCanvas) revealCurrentFrame();
    requestPresentedFrame();
    schedule();
  };
  const handleMetadata = () => {
    requestPresentedFrame();
    schedule();
  };
  const handleSeeked = () => {
    if (typeof video.requestVideoFrameCallback !== "function") {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => revealCurrentFrame(true));
      });
    }
    requestPresentedFrame();
    if (Math.abs(video.currentTime - desiredTime) >= frameDuration * 0.5) {
      schedule();
    }
  };
  const handleResize = () => {
    if (useCanvas && frame.dataset.scrubReady === "true") {
      revealCurrentFrame();
    }
  };

  video.addEventListener("loadeddata", handleLoadedData);
  video.addEventListener("loadedmetadata", handleMetadata);
  video.addEventListener("seeked", handleSeeked);
  const resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(frame);
  requestPresentedFrame();

  if (useCanvas && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    revealCurrentFrame();
  }

  return {
    seek(progress) {
      if (
        video.readyState >= HTMLMediaElement.HAVE_METADATA &&
        Number.isFinite(video.duration)
      ) {
        desiredTime = clamp(progress) * Math.max(0, video.duration - 0.04);
      }
      schedule();
    },
    destroy() {
      destroyed = true;
      resizeObserver.disconnect();
      if (useCanvas) video.pause();
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("seeked", handleSeeked);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      if (presentedFrameCallback) {
        video.cancelVideoFrameCallback(presentedFrameCallback);
      }
      if (timer) window.clearTimeout(timer);
    },
  };
}
