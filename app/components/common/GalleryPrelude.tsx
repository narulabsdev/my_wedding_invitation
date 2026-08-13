"use client";

import { useEffect, useRef } from "react";
import { mapGalleryPreludeOpacity } from "../../lib/gallery-prelude-timing";
import {
  requestScrollFrame,
  subscribeToScrollFrame,
} from "../../lib/scroll-frame";
import { readStableScrollViewportHeight } from "../../lib/stable-scroll-viewport";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

type GalleryPreludeProps = {
  ariaLabel: string;
  eyebrow: string;
  title: readonly [string, string];
  body: string;
};

export function GalleryPrelude({
  ariaLabel,
  eyebrow,
  title,
  body,
}: GalleryPreludeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const render = () => {
      const range = Math.max(
        1,
        section.offsetHeight - readStableScrollViewportHeight(),
      );
      const progress = clamp(-section.getBoundingClientRect().top / range);
      const opacity = mapGalleryPreludeOpacity(progress);

      content.style.opacity = String(opacity);
      content.style.transform = `translate3d(0, ${(1 - opacity) * 22}px, 0)`;
    };

    const observer = new ResizeObserver(requestScrollFrame);
    observer.observe(section);
    const unsubscribe = subscribeToScrollFrame(render);
    render();

    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="gallery-prelude"
      aria-label={ariaLabel}
      data-gallery-prelude
    >
      <div className="gallery-prelude__sticky">
        <div className="grain" aria-hidden="true" />
        <div ref={contentRef} className="gallery-prelude__content">
          <p>{eyebrow}</p>
          <h2>
            <span>{title[0]}</span>
            <span>{title[1]}</span>
          </h2>
          <i aria-hidden="true" />
          <p>{body}</p>
        </div>
      </div>
    </section>
  );
}
