type FetchVideo = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

type PreloadVideoOptions = {
  signal?: AbortSignal;
  onProgress?: (progress: number) => void;
  fetchVideo?: FetchVideo;
};

export const INITIAL_VIDEO_PRELOAD_COUNT = 4;

export const getInitialVideoPreloadSources = (
  sources: readonly string[],
) => sources.slice(0, INITIAL_VIDEO_PRELOAD_COUNT);

const parseContentLength = (response: Response) => {
  const value = Number(response.headers.get("content-length"));
  return Number.isFinite(value) && value > 0 ? value : 0;
};

export async function preloadVideoFiles(
  sources: readonly string[],
  {
    signal,
    onProgress = () => {},
    fetchVideo = fetch,
  }: PreloadVideoOptions = {},
) {
  const uniqueSources = [...new Set(sources)];
  if (uniqueSources.length === 0) {
    onProgress(1);
    return;
  }

  const progressByVideo = uniqueSources.map(() => 0);
  let lastReportedProgress = -1;
  const reportProgress = () => {
    const progress = progressByVideo.reduce((sum, value) => sum + value, 0) /
      progressByVideo.length;
    if (progress === 1 || progress - lastReportedProgress >= 0.002) {
      lastReportedProgress = progress;
      onProgress(progress);
    }
  };

  reportProgress();

  await Promise.all(
    uniqueSources.map(async (src, index) => {
      const response = await fetchVideo(src, {
        cache: "force-cache",
        credentials: "same-origin",
        signal,
      });
      if (!response.ok) {
        throw new Error(`Failed to preload video: ${src} (${response.status})`);
      }

      const contentLength = parseContentLength(response);
      const reader = response.body?.getReader();

      if (!reader) {
        await response.arrayBuffer();
        progressByVideo[index] = 1;
        reportProgress();
        return;
      }

      let loaded = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        loaded += value.byteLength;
        if (contentLength > 0) {
          progressByVideo[index] = Math.min(0.999, loaded / contentLength);
          reportProgress();
        }
      }

      progressByVideo[index] = 1;
      reportProgress();
    }),
  );
}
