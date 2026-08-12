"use client";

import Image from "next/image";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { GalleryMemory } from "../../content/invitation";
import {
  requestScrollFrame,
  subscribeToScrollFrame,
} from "../../lib/scroll-frame";
import { GalleryLightbox } from "./GalleryLightbox";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const GALLERY_ENTRANCE_END = 0.035;
const GALLERY_TRAVEL_END = 0.85;
const GALLERY_HANDOFF_START = 0.93;

type HorizontalStoryGalleryProps = {
  ariaLabel: string;
  heading: string;
  hint: string;
  openPhotoLabel: string;
  closePhotoLabel: string;
  lightboxLabel: string;
  items: GalleryMemory[];
  invitation: {
    mark: readonly [string, string];
    sectionLabel: string;
    title: readonly [string, string];
    body: readonly [string, string];
  };
};

export function HorizontalStoryGallery({
  ariaLabel,
  heading,
  hint,
  openPhotoLabel,
  closePhotoLabel,
  lightboxLabel,
  items,
  invitation,
}: HorizontalStoryGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const handoffRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const render = () => {
      const range = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = clamp(-section.getBoundingClientRect().top / range);
      const entranceProgress = clamp(progress / GALLERY_ENTRANCE_END);
      const horizontalProgress = clamp(
        (progress - GALLERY_ENTRANCE_END) /
          (GALLERY_TRAVEL_END - GALLERY_ENTRANCE_END),
      );
      const handoffProgress = clamp(
        (progress - GALLERY_HANDOFF_START) / (1 - GALLERY_HANDOFF_START),
      );
      const invitationProgress = clamp((handoffProgress - 0.16) / 0.7);
      const galleryOpacity = 1 - handoffProgress;
      const viewportWidth = section.clientWidth;
      const maxX = Math.max(0, track.scrollWidth - viewportWidth);

      if (stickyRef.current) {
        stickyRef.current.style.opacity = String(entranceProgress);
      }
      track.style.transform = `translate3d(${-horizontalProgress * maxX}px, 0, 0)`;
      track.style.opacity = String(galleryOpacity);
      if (headingRef.current) {
        headingRef.current.style.opacity = String(galleryOpacity);
      }
      if (ruleRef.current) {
        ruleRef.current.style.opacity = String(galleryOpacity);
      }
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${horizontalProgress})`;
      }
      if (handoffRef.current) {
        handoffRef.current.style.setProperty(
          "--handoff-surface-opacity",
          String(handoffProgress),
        );
        handoffRef.current.style.setProperty(
          "--handoff-copy-opacity",
          String(invitationProgress),
        );
        handoffRef.current.style.setProperty(
          "--handoff-copy-offset",
          `${(1 - invitationProgress) * 24}px`,
        );
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
    <section
      ref={sectionRef}
      className="timeline-scroll"
      aria-label={ariaLabel}
      style={{ "--gallery-items": Math.max(items.length, 1) } as CSSProperties}
    >
      <div ref={stickyRef} className="timeline-sticky">
        <header ref={headingRef} className="timeline-heading">
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
                {memory.body ? <p className="memory-body">{memory.body}</p> : null}
              </div>
              <div className="timeline-point">
                <i />
                <strong>{memory.year}</strong>
              </div>
            </article>
          ))}
          <div className="timeline-spacer timeline-spacer--end" aria-hidden="true" />
        </div>

        <div ref={ruleRef} className="timeline-rule" aria-hidden="true">
          <span ref={progressRef} />
        </div>

        <article
          ref={handoffRef}
          className="gallery-invitation-handoff"
          aria-labelledby="gallery-invitation-title"
        >
          <div className="gallery-invitation-handoff__surface" aria-hidden="true" />
          <div className="hanji-mark" aria-hidden="true">
            <span>{invitation.mark[0]}</span>
            <span>{invitation.mark[1]}</span>
          </div>
          <div className="gallery-invitation-handoff__content">
            <p className="section-number">{invitation.sectionLabel}</p>
            <h2 id="gallery-invitation-title">
              {invitation.title[0]}
              <br />{" "}
              {invitation.title[1]}
            </h2>
            <p className="gallery-invitation-handoff__body">
              {invitation.body[0]}
              <br />{" "}
              {invitation.body[1]}
            </p>
          </div>
        </article>
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
