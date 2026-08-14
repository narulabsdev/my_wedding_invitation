"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { GalleryMemory } from "../../content/invitation";
import { isPointInsideContainedImage } from "../../lib/gallery-lightbox-geometry";

type GalleryLightboxProps = {
  item: GalleryMemory;
  dialogLabel: string;
  closeLabel: string;
  onClose: () => void;
};

export function GalleryLightbox({
  item,
  dialogLabel,
  closeLabel,
  onClose,
}: GalleryLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (typeof document === "undefined" || !item.image) return null;

  return createPortal(
    <div
      className="gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${dialogLabel}: ${item.alt}`}
      onClick={(event) => {
        const target = event.target as Element;
        if (target.closest(".gallery-lightbox__close")) return;

        const image = imageRef.current;
        if (image && isPointInsideContainedImage(
          { x: event.clientX, y: event.clientY },
          image.getBoundingClientRect(),
          image.naturalWidth,
          image.naturalHeight,
        )) return;

        onClose();
      }}
    >
      <button
        ref={closeButtonRef}
        className="gallery-lightbox__close"
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
      >
        <span aria-hidden="true">×</span>
      </button>
      <div className="gallery-lightbox__image-wrap">
        <Image
          ref={imageRef}
          src={item.image}
          alt={item.alt}
          fill
          unoptimized
          sizes="100vw"
          className="gallery-lightbox__image"
        />
      </div>
      <div className="gallery-lightbox__caption">
        <span>{item.kicker}</span>
        <strong>{item.year}</strong>
      </div>
    </div>,
    document.body,
  );
}
