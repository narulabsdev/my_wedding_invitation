"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { CeremonyMapDialogCopy } from "../../content/invitation";

type MapChooserProps = {
  actionLabel: string;
  copy: CeremonyMapDialogCopy;
};

export function MapChooser({ actionLabel, copy }: MapChooserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      window.requestAnimationFrame(() => trigger?.focus());
    };
  }, [isOpen]);

  return (
    <>
      <button ref={triggerRef} type="button" onClick={() => setIsOpen(true)}>
        {actionLabel}
      </button>

      {isOpen ? (
        <div
          className="map-chooser-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            className="map-chooser-modal"
            role="dialog"
            aria-modal="true"
            aria-label={copy.ariaLabel}
            aria-labelledby={titleId}
          >
            <button
              ref={closeRef}
              type="button"
              className="map-chooser-modal__close"
              aria-label={copy.closeLabel}
              onClick={() => setIsOpen(false)}
            >
              <span aria-hidden="true">×</span>
            </button>

            <div className="map-chooser-modal__pin" aria-hidden="true" />
            <h2 id={titleId}>{copy.title}</h2>
            <p className="map-chooser-modal__description">{copy.description}</p>
            <div className="map-chooser-modal__venue">
              <strong>{copy.venue}</strong>
              <span>{copy.address}</span>
            </div>
            <div className="map-chooser-modal__options">
              {copy.options.map((option) => (
                <a
                  href={option.url}
                  key={option.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsOpen(false)}
                >
                  {/* Official app icon served by the app's Google Play listing. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={option.iconSrc} alt="" width="48" height="48" />
                  <span>{option.label}</span>
                  <i aria-hidden="true">↗</i>
                </a>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
