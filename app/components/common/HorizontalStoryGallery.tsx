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
  GALLERY_ENTRANCE_END,
  resolveGalleryScrollTimeline,
} from "../../lib/gallery-scroll-timeline";
import {
  requestScrollFrame,
  subscribeToScrollFrame,
} from "../../lib/scroll-frame";
import { readStableScrollViewportHeight } from "../../lib/stable-scroll-viewport";
import { GalleryLightbox } from "./GalleryLightbox";
import { InvitationSeal } from "./InvitationSeal";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const GALLERY_FRAME_BASE_OFFSET = 28;
const GALLERY_FRAME_ZIGZAG_OFFSET = 34;

type HorizontalStoryGalleryProps = {
  ariaLabel: string;
  heading: string;
  hint: string;
  openPhotoLabel: string;
  closePhotoLabel: string;
  lightboxLabel: string;
  items: GalleryMemory[];
  invitation: {
    sectionLabel: string;
    title: readonly [string, string];
    body: readonly [string, string];
  };
  personalizedInvitation?: {
    greeting: string;
    message: string;
  } | null;
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
  personalizedInvitation,
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
  const lightboxScrollTopRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const render = () => {
      const viewportHeight = readStableScrollViewportHeight();
      const range = Math.max(1, section.offsetHeight - viewportHeight);
      const progress = clamp(-section.getBoundingClientRect().top / range);
      const timeline = resolveGalleryScrollTimeline(range, viewportHeight);
      const entranceProgress = clamp(progress / GALLERY_ENTRANCE_END);
      const horizontalProgress = clamp(
        (progress - GALLERY_ENTRANCE_END) /
          (timeline.travelEnd - GALLERY_ENTRANCE_END),
      );
      const handoffProgress = clamp(
        (progress - timeline.handoffStart) /
          (timeline.handoffFadeEnd - timeline.handoffStart),
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
        const cardIndex = Number(card.dataset.memoryIndex ?? 0);
        const center = card.offsetLeft - horizontalProgress * maxX + card.offsetWidth / 2;
        const distance = Math.abs(center - viewportWidth / 2);
        const focus = clamp(1 - distance / (viewportWidth * 0.82));
        const zigzagOffset = cardIndex % 2 === 0
          ? -GALLERY_FRAME_ZIGZAG_OFFSET
          : GALLERY_FRAME_ZIGZAG_OFFSET;
        const frameElement = card.querySelector<HTMLElement>("[data-memory-frame]");
        const copy = card.querySelector<HTMLElement>("[data-memory-copy]");

        if (frameElement) {
          frameElement.style.transform = `translate3d(0, ${GALLERY_FRAME_BASE_OFFSET + zigzagOffset + (1 - focus) * 18}px, 0) rotate(${cardIndex % 2 === 0 ? -0.8 : 0.8}deg) scale(${0.94 + focus * 0.06})`;
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
    const scrollTop = lightboxScrollTopRef.current;
    setActiveIndex(null);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: scrollTop, left: 0, behavior: "instant" });
      openerRef.current?.focus({ preventScroll: true });
      requestScrollFrame();
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: scrollTop, left: 0, behavior: "instant" });
        requestScrollFrame();
      });
    });
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
          {hint ? <span>{hint}</span> : null}
        </header>

        <div ref={trackRef} className="timeline-track">
          <div className="timeline-spacer" aria-hidden="true" />
          {items.map((memory, index) => (
            <article
              className={`memory-card ${memory.className}`}
              data-memory-card
              data-memory-index={index}
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
                    lightboxScrollTopRef.current = window.scrollY;
                    openerRef.current = event.currentTarget;
                    setActiveIndex(index);
                  }}
                >
                  <span className="memory-photo">
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
                  </span>
                </button>
              ) : (
                <div
                  className="memory-visual memory-visual--empty"
                  data-memory-frame
                  aria-hidden="true"
                >
                  <span className="memory-photo memory-photo--empty">
                    <span className="memory-placeholder-mark" />
                    <span className="memory-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
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
          className={`gallery-invitation-handoff${personalizedInvitation ? " is-personalized" : ""}`}
          aria-labelledby="gallery-invitation-title"
        >
          <div className="gallery-invitation-handoff__surface" aria-hidden="true" />
          <div className="gallery-invitation-handoff__frame" aria-hidden="true">
            <span />
            <span />
          </div>
          <div className="gallery-invitation-handoff__content">
            <InvitationSeal className="gallery-invitation-handoff__seal" />
            <p className="section-number">{invitation.sectionLabel}</p>
            {personalizedInvitation ? (
              <p className="gallery-invitation-handoff__recipient">
                {personalizedInvitation.greeting}
              </p>
            ) : null}
            <h2 id="gallery-invitation-title">
              {invitation.title[0]}
              <br />{" "}
              {invitation.title[1]}
            </h2>
            <p className="gallery-invitation-handoff__body">
              {personalizedInvitation ? (
                personalizedInvitation.message
              ) : (
                <>
                  {invitation.body[0]}
                  <br />{" "}
                  {invitation.body[1]}
                </>
              )}
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
