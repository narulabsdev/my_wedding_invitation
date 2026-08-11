"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryMemory } from "../../content/invitation";
import {
  requestScrollFrame,
  subscribeToScrollFrame,
} from "../../lib/scroll-frame";
import { GalleryLightbox } from "./GalleryLightbox";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

type HorizontalStoryGalleryProps = {
  ariaLabel: string;
  heading: string;
  hint: string;
  openPhotoLabel: string;
  closePhotoLabel: string;
  lightboxLabel: string;
  items: GalleryMemory[];
};

export function HorizontalStoryGallery({
  ariaLabel,
  heading,
  hint,
  openPhotoLabel,
  closePhotoLabel,
  lightboxLabel,
  items,
}: HorizontalStoryGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const render = () => {
      const range = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = clamp(-section.getBoundingClientRect().top / range);
      const entranceProgress = clamp(progress / 0.085);
      const horizontalProgress = clamp((progress - 0.085) / 0.695);
      const viewportWidth = section.clientWidth;
      const maxX = Math.max(0, track.scrollWidth - viewportWidth);

      if (stickyRef.current) {
        stickyRef.current.style.opacity = String(entranceProgress);
      }
      track.style.transform = `translate3d(${-horizontalProgress * maxX}px, 0, 0)`;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${horizontalProgress})`;
      }

      track.querySelectorAll<HTMLElement>("[data-memory-card]").forEach((card) => {
        const center = card.offsetLeft - horizontalProgress * maxX + card.offsetWidth / 2;
        const distance = Math.abs(center - viewportWidth / 2);
        const focus = clamp(1 - distance / (viewportWidth * 0.82));
        const frameElement = card.querySelector<HTMLElement>("[data-memory-frame]");
        const copy = card.querySelector<HTMLElement>("[data-memory-copy]");

        if (frameElement) {
          frameElement.style.transform = `translate3d(0, ${(1 - focus) * 30}px, 0) rotate(${(0.5 - focus) * 3.2}deg) scale(${0.93 + focus * 0.07})`;
          frameElement.style.opacity = String(0.36 + focus * 0.64);
        }
        if (copy) {
          copy.style.opacity = String(0.35 + focus * 0.65);
          copy.style.transform = `translate3d(0, ${(1 - focus) * 20}px, 0)`;
        }
      });
    };

    const observer = new ResizeObserver(requestScrollFrame);
    observer.observe(section);
    observer.observe(track);
    const unsubscribe = subscribeToScrollFrame(render);

    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }, []);

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
    window.requestAnimationFrame(() => openerRef.current?.focus());
  }, []);

  return (
    <section ref={sectionRef} className="timeline-scroll" aria-label={ariaLabel}>
      <div ref={stickyRef} className="timeline-sticky">
        <header className="timeline-heading">
          <span>{heading}</span>
          <span>{hint}</span>
        </header>

        <div ref={trackRef} className="timeline-track">
          <div className="timeline-spacer" aria-hidden="true" />
          {items.map((memory, index) => (
            <article
              className={`memory-card ${memory.className}`}
              data-memory-card
              key={`${memory.kicker}-${index}`}
            >
              {memory.image ? (
                <button
                  className="memory-visual"
                  data-memory-frame
                  type="button"
                  aria-label={`${openPhotoLabel}: ${memory.alt}`}
                  aria-haspopup="dialog"
                  onClick={(event) => {
                    openerRef.current = event.currentTarget;
                    setActiveIndex(index);
                  }}
                >
                  <Image
                    src={memory.image}
                    alt={memory.alt}
                    fill
                    unoptimized
                    sizes="(max-width: 480px) 74vw, 355px"
                    className="memory-image"
                  />
                  <span className="memory-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </button>
              ) : (
                <div
                  className="memory-visual memory-visual--empty"
                  data-memory-frame
                  aria-hidden="true"
                >
                  <span className="memory-placeholder-mark" />
                  <span className="memory-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              )}
              <div className="memory-copy" data-memory-copy>
                <p>{memory.kicker}</p>
                <h3>
                  {memory.title.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h3>
                <p className="memory-body">{memory.body}</p>
              </div>
              <div className="timeline-point">
                <i />
                <strong>{memory.year}</strong>
              </div>
            </article>
          ))}
          <div className="timeline-spacer timeline-spacer--end" aria-hidden="true" />
        </div>

        <div className="timeline-rule" aria-hidden="true">
          <span ref={progressRef} />
        </div>
      </div>

      {activeIndex === null || !items[activeIndex]?.image ? null : (
        <GalleryLightbox
          item={items[activeIndex]}
          dialogLabel={lightboxLabel}
          closeLabel={closePhotoLabel}
          onClose={closeLightbox}
        />
      )}
    </section>
  );
}
