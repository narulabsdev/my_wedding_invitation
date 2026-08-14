"use client";

import { useEffect, useRef } from "react";
import type { StoryVideo } from "../../content/invitation";
import { readStableScrollViewportHeight } from "../../lib/stable-scroll-viewport";
import {
  mapFirstDateCopyOpacity,
  mapStoryEntranceOpacity,
  mapStoryExitOpacity,
} from "../../lib/story-video-timing";
import { createVideoScrubber } from "../../lib/video-scrubber";
import { StoryVideoCopy } from "./StoryVideoCopy";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));
const STORY_LABEL_FADE_RANGE = 0.055;

type ScrollScrubVideoProps = {
  scene: StoryVideo;
  priority?: boolean;
};

export function ScrollScrubVideo({
  scene,
  priority = false,
}: ScrollScrubVideoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaFrameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const mediaFrame = mediaFrameRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!section || !mediaFrame || !video || !canvas) return;
    const sticky = section.querySelector<HTMLElement>(".scrub-video-sticky");
    const autoMode = section.closest<HTMLElement>("[data-auto-mode=\"true\"]") !== null;
    let cancelled = false;
    let destroyScrollScrub = () => {};
    let refreshScrollScrub = () => {};
    const playhead = { progress: 0 };
    const videoScrubber = createVideoScrubber({
      video,
      canvas,
      frame: mediaFrame,
    });

    const render = (progress: number) => {
      const copy = section.querySelector<HTMLElement>("[data-story-video-copy]");

      videoScrubber.seek(progress);

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      if (copy) {
        const opacity = scene.id === "first-date"
          ? mapFirstDateCopyOpacity(progress)
          : scene.id === "vancouver"
            ? clamp(1 - progress * 2.2)
            : Math.min(clamp((progress - 0.06) * 4), clamp((1.04 - progress) * 4));
        copy.style.opacity = String(opacity);
        copy.style.transform = scene.id === "first-date"
          ? `translate3d(0, ${progress * -18}px, 0)`
          : `translate3d(0, ${(0.5 - progress) * 30}px, 0)`;
      }

      section
        .querySelectorAll<HTMLElement>("[data-story-video-label]")
        .forEach((label, index) => {
          const labelWindow = scene.labels?.[index];
          if (!labelWindow) return;
          const fadeRange = Math.min(
            STORY_LABEL_FADE_RANGE,
            (labelWindow.end - labelWindow.start) / 2,
          );
          const opacity = Math.min(
            clamp((progress - labelWindow.start) / fadeRange),
            clamp((labelWindow.end - progress) / fadeRange),
          );

          label.style.opacity = String(opacity);
          label.style.transform = `translate3d(0, ${(1 - opacity) * 18}px, 0)`;
        });

      if (sticky) {
        const storyOpacity =
          mapStoryEntranceOpacity(scene.id, progress) *
            mapStoryExitOpacity(scene.id, progress);
        sticky.style.opacity = String(storyOpacity);
        sticky.style.visibility = storyOpacity <= 0.001 ? "hidden" : "visible";
      }
    };

    const setupScrollScrub = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        render(scene.id === "home-and-cookie" ? 0.45 : 0.08);
        return;
      }

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });
      const tween = gsap.to(playhead, {
        progress: 1,
        ease: "none",
        onUpdate: () => render(playhead.progress),
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: autoMode ? true : 0.45,
          invalidateOnRefresh: true,
          onRefresh: (trigger) => {
            playhead.progress = trigger.progress;
            render(trigger.progress);
          },
        },
      });

      const entranceWipe = { progress: 0 };
      const renderEntranceWipe = (progress: number) => {
        const isWiping = progress < 0.999;
        sticky?.style.setProperty(
          "transform",
          isWiping
            ? `translate3d(0, ${-(1 - progress) * readStableScrollViewportHeight()}px, 0)`
            : "",
        );
        sticky?.style.setProperty(
          "clip-path",
          isWiping ? `inset(0 0 ${(1 - progress) * 100}% 0)` : "",
        );
      };
      const entranceTween = scene.id === "home-and-cookie"
        ? gsap.to(entranceWipe, {
          progress: 1,
          ease: "none",
          onUpdate: () => renderEntranceWipe(entranceWipe.progress),
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top top",
            scrub: autoMode ? true : 0.45,
            invalidateOnRefresh: true,
            onRefresh: (trigger) => {
              entranceWipe.progress = trigger.progress;
              renderEntranceWipe(trigger.progress);
            },
          },
        })
        : null;

      refreshScrollScrub = () => ScrollTrigger.refresh();
      destroyScrollScrub = () => {
        entranceTween?.scrollTrigger?.kill();
        entranceTween?.kill();
        tween.scrollTrigger?.kill();
        tween.kill();
        sticky?.style.removeProperty("transform");
        sticky?.style.removeProperty("clip-path");
      };
      ScrollTrigger.refresh();
      if (entranceTween?.scrollTrigger) {
        entranceWipe.progress = entranceTween.scrollTrigger.progress;
        renderEntranceWipe(entranceWipe.progress);
      }
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
      videoScrubber.destroy();
      destroyScrollScrub();
    };
  }, [scene.id, scene.labels]);

  return (
    <section
      ref={sectionRef}
      className={`scrub-video-scroll scrub-video-scroll--${scene.id}`}
      aria-label={scene.ariaLabel}
      data-scroll-video={scene.id}
      data-auto-duration-seconds={scene.durationSeconds}
    >
      <div
        className={`scrub-video-sticky${
          scene.id === "youngjoon-birth" ? " scrub-video-sticky--deferred" : ""
        }`}
      >
        <div ref={mediaFrameRef} className="scrub-video-frame">
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
          <canvas ref={canvasRef} className="scrub-video-canvas" aria-hidden="true" />
          {scene.poster ? (
            // Raw posters are already tiny, exact video frames and must work before hydration.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="scrub-video-poster"
              src={scene.poster}
              alt=""
              aria-hidden="true"
            />
          ) : null}
        </div>
        <div className={`scrub-video-shade scrub-video-shade--${scene.id}`} />
        <div className="grain" />

        <StoryVideoCopy
          scene={scene}
          className={`scrub-video-copy scrub-video-copy--${scene.id}`}
        />

        {scene.labels?.length ? (
          <div
            className={`scrub-video-labels scrub-video-labels--${scene.id}`}
            aria-hidden="true"
          >
            {scene.labels.map((label) => (
              <p
                className="scrub-video-label"
                data-story-video-label
                data-placement={label.placement}
                key={label.id}
              >
                <span>{label.text}</span>
                <small>{label.date}</small>
              </p>
            ))}
          </div>
        ) : null}

        <div className="scrub-video-progress" aria-hidden="true">
          <span ref={progressRef} />
        </div>
      </div>
    </section>
  );
}
