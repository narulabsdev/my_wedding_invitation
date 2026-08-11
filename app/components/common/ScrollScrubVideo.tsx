"use client";

import { useEffect, useRef } from "react";
import type { StoryVideo } from "../../content/invitation";
import { StoryVideoCopy } from "./StoryVideoCopy";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));
const FIRST_DATE_ENTRANCE_END = 0.035;
const FIRST_DATE_COPY_FADE_OUT_START = 0.08;
const FIRST_DATE_COPY_FADE_OUT_END = 0.18;

type ScrollScrubVideoProps = {
  scene: StoryVideo;
  priority?: boolean;
};

export function ScrollScrubVideo({
  scene,
  priority = false,
}: ScrollScrubVideoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    const sticky = section.querySelector<HTMLElement>(".scrub-video-sticky");
    let cancelled = false;
    let destroyScrollScrub = () => {};
    let refreshScrollScrub = () => {};
    const playhead = { progress: 0 };

    const render = (progress: number) => {
      const copy = section.querySelector<HTMLElement>("[data-story-video-copy]");
      const entrance = clamp(progress / FIRST_DATE_ENTRANCE_END);

      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        const targetTime = progress * Math.max(0, video.duration - 0.04);
        if (Number.isFinite(targetTime) && Math.abs(video.currentTime - targetTime) > 0.025) {
          video.currentTime = targetTime;
        }
      }

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      if (copy) {
        const opacity = scene.id === "first-date"
          ? entrance * clamp(
            (FIRST_DATE_COPY_FADE_OUT_END - progress) /
              (FIRST_DATE_COPY_FADE_OUT_END - FIRST_DATE_COPY_FADE_OUT_START),
          )
          : scene.id === "vancouver"
            ? clamp(1 - progress * 2.2)
            : Math.min(clamp((progress - 0.06) * 4), clamp((1.04 - progress) * 4));
        copy.style.opacity = String(opacity);
        copy.style.transform = scene.id === "first-date"
          ? `translate3d(0, ${progress * -18}px, 0)`
          : `translate3d(0, ${(0.5 - progress) * 30}px, 0)`;
      }

      if (sticky && scene.id === "first-date") {
        sticky.style.opacity = String(entrance);
      }
    };

    video.pause();
    const setupScrollScrub = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        render(0.08);
        return;
      }

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const tween = gsap.to(playhead, {
        progress: 1,
        ease: "none",
        onUpdate: () => render(playhead.progress),
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });

      refreshScrollScrub = () => ScrollTrigger.refresh();
      destroyScrollScrub = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
      ScrollTrigger.refresh();
    };

    const handleMetadata = () => render(playhead.progress);
    const observer = new ResizeObserver(() => refreshScrollScrub());
    observer.observe(section);
    video.addEventListener("loadedmetadata", handleMetadata);
    render(0);
    void setupScrollScrub();

    return () => {
      cancelled = true;
      observer.disconnect();
      video.removeEventListener("loadedmetadata", handleMetadata);
      destroyScrollScrub();
    };
  }, [scene.id]);

  return (
    <section
      ref={sectionRef}
      className={`scrub-video-scroll scrub-video-scroll--${scene.id}`}
      aria-label={scene.ariaLabel}
      data-scroll-video={scene.id}
    >
      <div className="scrub-video-sticky">
        <video
          ref={videoRef}
          className="scrub-video-media"
          src={scene.src}
          poster={scene.poster}
          muted
          playsInline
          preload={priority ? "auto" : "metadata"}
          tabIndex={-1}
          aria-hidden="true"
        />
        <div className={`scrub-video-shade scrub-video-shade--${scene.id}`} />
        <div className="grain" />

        <StoryVideoCopy
          scene={scene}
          className={`scrub-video-copy scrub-video-copy--${scene.id}`}
        />

        <div className="scrub-video-progress" aria-hidden="true">
          <span ref={progressRef} />
        </div>
      </div>
    </section>
  );
}
