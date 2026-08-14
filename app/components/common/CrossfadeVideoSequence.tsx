"use client";

import { useEffect, useRef } from "react";
import type { StoryVideo } from "../../content/invitation";
import {
  requestScrollFrame,
  subscribeToScrollFrame,
} from "../../lib/scroll-frame";
import { StoryVideoCopy } from "./StoryVideoCopy";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

type CrossfadeVideoSequenceProps = {
  scenes: StoryVideo[];
  ariaLabel: string;
};

export function CrossfadeVideoSequence({
  scenes,
  ariaLabel,
}: CrossfadeVideoSequenceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky || scenes.length < 2) return;

    const layers = sticky.querySelectorAll<HTMLElement>("[data-sequence-layer]");
    const copies = sticky.querySelectorAll<HTMLElement>("[data-story-video-copy]");

    const render = () => {
      const range = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = clamp(-section.getBoundingClientRect().top / range);
      const entrance = clamp(progress / 0.065);
      const firstVideoProgress = clamp((progress - 0.065) / 0.355);
      const crossfade = clamp((progress - 0.42) / 0.13);
      const secondVideoProgress = clamp((progress - 0.55) / 0.37);

      sticky.style.opacity = String(entrance);
      if (layers[0]) layers[0].style.opacity = String(1 - crossfade);
      if (layers[1]) layers[1].style.opacity = String(crossfade);

      if (copies[0]) {
        copies[0].style.opacity = String(
          Math.min(
            clamp((firstVideoProgress - 0.03) * 4),
            clamp(1 - crossfade * 2.5),
          ),
        );
      }
      if (copies[1]) {
        copies[1].style.opacity = String(
          Math.min(
            clamp((crossfade - 0.55) / 0.45),
            clamp(1 - secondVideoProgress * 2.2),
          ),
        );
      }

      const videoProgresses = [firstVideoProgress, secondVideoProgress];
      videoRefs.current.forEach((video, index) => {
        if (!video || video.readyState < HTMLMediaElement.HAVE_METADATA) return;
        const targetTime = videoProgresses[index] * Math.max(0, video.duration - 0.04);
        if (Number.isFinite(targetTime) && Math.abs(video.currentTime - targetTime) > 0.025) {
          video.currentTime = targetTime;
        }
      });
    };

    const videos = videoRefs.current.filter(
      (video): video is HTMLVideoElement => video !== null,
    );
    videos.forEach((video) => {
      video.pause();
      video.addEventListener("loadedmetadata", requestScrollFrame);
    });
    const observer = new ResizeObserver(requestScrollFrame);
    observer.observe(section);
    const unsubscribe = subscribeToScrollFrame(render);

    return () => {
      observer.disconnect();
      videos.forEach((video) => {
        video.removeEventListener("loadedmetadata", requestScrollFrame);
      });
      unsubscribe();
    };
  }, [scenes.length]);

  return (
    <section
      ref={sectionRef}
      className="video-sequence-scroll"
      aria-label={ariaLabel}
    >
      <div ref={stickyRef} className="video-sequence-sticky">
        {scenes.slice(0, 2).map((scene, index) => (
          <div
            className="video-sequence-layer"
            data-sequence-layer
            data-sequence-scene={scene.id}
            key={scene.id}
          >
            <video
              ref={(element) => {
                videoRefs.current[index] = element;
              }}
              className="video-sequence-media"
              src={scene.src}
              poster={scene.poster}
              muted
              playsInline
              preload={index === 0 ? "auto" : "metadata"}
              tabIndex={-1}
              aria-hidden="true"
            />
          </div>
        ))}

        <div className="video-sequence-shade" />
        <div className="grain" />
        {scenes.slice(0, 2).map((scene) => (
          <StoryVideoCopy
            key={scene.id}
            scene={scene}
            className={`scrub-video-copy scrub-video-copy--${scene.id} video-sequence-copy`}
          />
        ))}
      </div>
    </section>
  );
}
