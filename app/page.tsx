"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { HorizontalStoryGallery } from "./components/common/HorizontalStoryGallery";
import { ScrollScrubVideo } from "./components/common/ScrollScrubVideo";
import { getInvitationContent } from "./content/invitation";
import { useDeviceLocale } from "./lib/use-device-locale";

const doorSealSrc = "/wedding/seals/sangho-steph-square-tassel.png";
const criticalAssets = [doorSealSrc];
// Keep the door/entry travel close to its original distance while giving the
// video more scroll room inside the taller 900svh section.
const DOOR_OPENING_START = 0.013;
const DOOR_OPENING_RANGE = 0.168;
const DOOR_ENTRY_START = 0.168;
const DOOR_ENTRY_RANGE = 0.105;
const FIRST_VIDEO_START = 0.273;
const FIRST_VIDEO_RANGE = 0.727;
const OPENING_COPY_FADE_IN_START = 0.56;
const OPENING_COPY_FADE_IN_END = 0.64;
const OPENING_COPY_FADE_OUT_START = 0.74;
const OPENING_COPY_FADE_OUT_END = 0.82;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

type WanjaOpening = {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type WanjaSegment = {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  startDistance: number;
  length: number;
};

const WANJA_WIDTH = 7;
const WANJA_HEIGHT = 15;
const WANJA_SEGMENT_SIZE = 0.5;
const WANJA_DRAW_SECONDS_PER_UNIT = 0.46;

const makeRow = (
  key: string,
  y: number,
  height: number,
  widths: number[],
) => {
  let x = 0;

  return widths.map((width, index) => {
    const opening = {
      key: `${key}-${index}`,
      x,
      y,
      width,
      height,
    };
    x += width;
    return opening;
  });
};

const mirrorOpening = (
  key: string,
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  const opening = { key: `${key}-left`, x, y, width, height };

  return [
    opening,
    {
      ...opening,
      key: `${key}-right`,
      x: WANJA_WIDTH - x - width,
    },
  ];
};

/*
 * The reference panel is a seven-unit rectilinear tessellation.
 * Side cells are reflected across x = 3.5, while the two large
 * 3 × 3.5 paper fields are repeated by vertical translation.
 */
const wanjaOpenings: WanjaOpening[] = [
  ...makeRow("top-cap", 0, 1, [1, 2, 1, 2, 1]),
  ...makeRow("top-grid", 1, 1, [1, 1, 1, 1, 1, 1, 1]),
  ...mirrorOpening("top-upper-outer", 0, 2, 1, 1),
  ...mirrorOpening("top-upper-inner", 1, 2, 1, 1),
  { key: "top-center", x: 2, y: 2, width: 3, height: 3.5 },
  ...mirrorOpening("top-side-wide", 0, 3, 2, 1.5),
  ...mirrorOpening("top-lower-outer", 0, 4.5, 1, 1),
  ...mirrorOpening("top-lower-inner", 1, 4.5, 1, 1),
  ...makeRow("middle-grid-top", 5.5, 1, [1, 1, 1, 1, 1, 1, 1]),
  ...makeRow("middle-turn-top", 6.5, 1, [1, 2, 1, 2, 1]),
  ...makeRow("middle-turn-bottom", 7.5, 1, [1, 2, 1, 2, 1]),
  ...makeRow("middle-grid-bottom", 8.5, 1, [1, 1, 1, 1, 1, 1, 1]),
  ...mirrorOpening("bottom-upper-outer", 0, 9.5, 1, 1),
  ...mirrorOpening("bottom-upper-inner", 1, 9.5, 1, 1),
  { key: "bottom-center", x: 2, y: 9.5, width: 3, height: 3.5 },
  ...mirrorOpening("bottom-side-wide", 0, 10.5, 2, 1.5),
  ...mirrorOpening("bottom-lower-outer", 0, 12, 1, 1),
  ...mirrorOpening("bottom-lower-inner", 1, 12, 1, 1),
  ...makeRow("bottom-grid", 13, 1, [1, 1, 1, 1, 1, 1, 1]),
  ...makeRow("bottom-cap", 14, 1, [1, 2, 1, 2, 1]),
];

const makeWanjaSegments = (openings: WanjaOpening[]) => {
  const segments = new Map<
    string,
    Omit<WanjaSegment, "startDistance" | "length">
  >();

  const addSegment = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ) => {
    const horizontal = y1 === y2;
    const fixed = horizontal ? y1 : x1;
    const start = horizontal ? Math.min(x1, x2) : Math.min(y1, y2);
    const end = horizontal ? Math.max(x1, x2) : Math.max(y1, y2);

    for (let position = start; position < end; position += WANJA_SEGMENT_SIZE) {
      const next = Math.min(position + WANJA_SEGMENT_SIZE, end);
      const key = horizontal
        ? `h-${fixed}-${position}-${next}`
        : `v-${fixed}-${position}-${next}`;

      if (segments.has(key)) continue;

      if (horizontal) {
        if (fixed === 0 || fixed === WANJA_HEIGHT) continue;

        const midpoint = (position + next) / 2;
        const fromLeft = midpoint <= WANJA_WIDTH / 2;
        segments.set(key, {
          key,
          x1: fromLeft ? position : next,
          y1: fixed,
          x2: fromLeft ? next : position,
          y2: fixed,
        });
      } else {
        if (fixed === 0 || fixed === WANJA_WIDTH) continue;

        const midpoint = (position + next) / 2;
        const fromTop = midpoint <= WANJA_HEIGHT / 2;
        segments.set(key, {
          key,
          x1: fixed,
          y1: fromTop ? position : next,
          x2: fixed,
          y2: fromTop ? next : position,
        });
      }
    }
  };

  openings.forEach((opening) => {
    addSegment(
      opening.x,
      opening.y,
      opening.x + opening.width,
      opening.y,
    );
    addSegment(
      opening.x,
      opening.y + opening.height,
      opening.x + opening.width,
      opening.y + opening.height,
    );
    addSegment(
      opening.x,
      opening.y,
      opening.x,
      opening.y + opening.height,
    );
    addSegment(
      opening.x + opening.width,
      opening.y,
      opening.x + opening.width,
      opening.y + opening.height,
    );
  });

  const rawSegments = Array.from(segments.values());
  const pointKey = (x: number, y: number) => `${x},${y}`;
  const adjacency = new Map<
    string,
    Array<{ key: string; length: number }>
  >();

  const connect = (
    from: string,
    to: string,
    length: number,
  ) => {
    const neighbors = adjacency.get(from) ?? [];
    neighbors.push({ key: to, length });
    adjacency.set(from, neighbors);
  };

  rawSegments.forEach((segment) => {
    const from = pointKey(segment.x1, segment.y1);
    const to = pointKey(segment.x2, segment.y2);
    const length = Math.hypot(
      segment.x2 - segment.x1,
      segment.y2 - segment.y1,
    );
    connect(from, to, length);
    connect(to, from, length);
  });

  const distances = new Map<string, number>();
  const unvisited = new Set(adjacency.keys());

  rawSegments.forEach((segment) => {
    [
      [segment.x1, segment.y1],
      [segment.x2, segment.y2],
    ].forEach(([x, y]) => {
      if (x === 0 || x === WANJA_WIDTH || y === 0 || y === WANJA_HEIGHT) {
        distances.set(pointKey(x, y), 0);
      }
    });
  });

  while (unvisited.size > 0) {
    let current: string | null = null;
    let currentDistance = Number.POSITIVE_INFINITY;

    unvisited.forEach((key) => {
      const distance = distances.get(key) ?? Number.POSITIVE_INFINITY;
      if (distance < currentDistance) {
        current = key;
        currentDistance = distance;
      }
    });

    if (!current || !Number.isFinite(currentDistance)) break;

    unvisited.delete(current);
    (adjacency.get(current) ?? []).forEach((neighbor) => {
      if (!unvisited.has(neighbor.key)) return;
      const nextDistance = currentDistance + neighbor.length;
      if (nextDistance < (distances.get(neighbor.key) ?? Number.POSITIVE_INFINITY)) {
        distances.set(neighbor.key, nextDistance);
      }
    });
  }

  return rawSegments.map((segment) => {
    const firstKey = pointKey(segment.x1, segment.y1);
    const secondKey = pointKey(segment.x2, segment.y2);
    const firstDistance =
      distances.get(firstKey) ?? Number.POSITIVE_INFINITY;
    const secondDistance =
      distances.get(secondKey) ?? Number.POSITIVE_INFINITY;

    if (!Number.isFinite(firstDistance) || !Number.isFinite(secondDistance)) {
      throw new Error(`Disconnected wanjassal segment: ${segment.key}`);
    }

    const useFirstAsStart = firstDistance <= secondDistance;
    const length = Math.hypot(
      segment.x2 - segment.x1,
      segment.y2 - segment.y1,
    );

    return {
      ...segment,
      x1: useFirstAsStart ? segment.x1 : segment.x2,
      y1: useFirstAsStart ? segment.y1 : segment.y2,
      x2: useFirstAsStart ? segment.x2 : segment.x1,
      y2: useFirstAsStart ? segment.y2 : segment.y1,
      startDistance: Math.min(firstDistance, secondDistance),
      length,
    };
  });
};

const wanjaSegments = makeWanjaSegments(wanjaOpenings);

export default function Home() {
  const locale = useDeviceLocale();
  const {
    storyVideos,
    gallery: galleryCopy,
    openingVideo: openingVideoCopy,
    galleryMemories,
    door: doorCopy,
    transition: transitionCopy,
    ceremony: ceremonyCopy,
    details: detailsCopy,
    ending: endingCopy,
  } = getInvitationContent(locale);
  const [loadProgress, setLoadProgress] = useState(2);
  const [isReady, setIsReady] = useState(false);
  const doorRef = useRef<HTMLElement>(null);
  const doorVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let cancelled = false;
    let readyTimer = 0;
    let revealTimer = 0;
    let progressTimer = 0;
    const startedAt = performance.now();
    document.body.classList.add("invitation-loading");
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    progressTimer = window.setInterval(() => {
      setLoadProgress((current) => {
        const increment = Math.max(0.42, (92 - current) * 0.045);
        return Math.min(92, current + increment);
      });
    }, 50);

    const assetPromises = criticalAssets.map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new window.Image();
          let settled = false;
          const complete = () => {
            if (settled) return;
            settled = true;
            resolve();
          };
          image.onload = complete;
          image.onerror = complete;
          image.src = src;
          if (image.complete) complete();
        }),
    );

    const fontPromise = document.fonts?.ready ?? Promise.resolve();

    Promise.allSettled([...assetPromises, fontPromise]).then(() => {
      const minimumDuration = 2400;
      const remaining = Math.max(0, minimumDuration - (performance.now() - startedAt));

      readyTimer = window.setTimeout(() => {
        if (cancelled) return;
        window.clearInterval(progressTimer);
        setLoadProgress(100);
        revealTimer = window.setTimeout(() => {
          if (cancelled) return;
          setIsReady(true);
          document.body.classList.remove("invitation-loading");
        }, 520);
      }, remaining);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(readyTimer);
      window.clearTimeout(revealTimer);
      window.clearInterval(progressTimer);
      document.body.classList.remove("invitation-loading");
    };
  }, []);

  useEffect(() => {
    const door = doorRef.current;
    if (!door) return;

    const leftDoor = door.querySelector<HTMLElement>("[data-door-left]");
    const rightDoor = door.querySelector<HTMLElement>("[data-door-right]");
    const knot = door.querySelector<HTMLElement>("[data-door-knot]");
    const invitation = door.querySelector<HTMLElement>("[data-door-invitation]");
    const status = door.querySelector<HTMLElement>("[data-door-status]");
    const prompt = door.querySelector<HTMLElement>("[data-door-prompt]");
    const reveal = door.querySelector<HTMLElement>("[data-door-reveal]");
    const ambient = door.querySelector<HTMLElement>(".door-ambient");
    const behindCopy = door.querySelector<HTMLElement>("[data-door-behind-copy]");
    const treeShadow = door.querySelector<HTMLElement>("[data-tree-shadow]");
    const videoProgressBar = door.querySelector<HTMLElement>("[data-door-video-progress]");
    const doorVideo = doorVideoRef.current;
    let cancelled = false;
    let destroyScrollScrub = () => {};
    let refreshScrollScrub = () => {};
    const playhead = { progress: 0 };

    const render = (progress: number) => {
      const opening = clamp(
        (progress - DOOR_OPENING_START) / DOOR_OPENING_RANGE,
      );
      const entry = clamp(
        (progress - DOOR_ENTRY_START) / DOOR_ENTRY_RANGE,
      );
      const videoProgress = clamp(
        (progress - FIRST_VIDEO_START) / FIRST_VIDEO_RANGE,
      );
      const eased = 1 - Math.pow(1 - opening, 3);

      if (leftDoor) {
        leftDoor.style.transform = `perspective(1100px) translate3d(${-eased * 38 - entry * 34}%, 0, ${entry * 90}px) rotateY(${eased * 68 + entry * 12}deg)`;
        leftDoor.style.filter = `brightness(${1 - eased * 0.25})`;
        leftDoor.style.opacity = String(1 - entry);
      }
      if (rightDoor) {
        rightDoor.style.transform = `perspective(1100px) translate3d(${eased * 38 + entry * 34}%, 0, ${entry * 90}px) rotateY(${-eased * 68 - entry * 12}deg)`;
        rightDoor.style.filter = `brightness(${1 - eased * 0.25})`;
        rightDoor.style.opacity = String(1 - entry);
      }
      if (knot) {
        knot.style.opacity = String(clamp(1 - opening * 2.6));
        knot.style.transform = `translate3d(-50%, -50%, 0) scale(${1 - opening * 0.18}) rotate(${opening * 5}deg)`;
      }
      if (invitation) {
        invitation.style.opacity = String(clamp(1 - opening * 2.1));
        invitation.style.transform = `translate3d(-50%, ${opening * -22}px, 0)`;
      }
      if (prompt) {
        prompt.style.opacity = String(clamp(1 - opening * 4));
      }
      if (status) {
        status.style.opacity = String(clamp(1 - opening * 3));
      }
      if (treeShadow) {
        treeShadow.style.opacity = String(clamp(1 - opening * 2.2));
      }
      if (reveal) {
        const revealScale = 1.08 + Math.sin(entry * Math.PI) * 0.16 - entry * 0.08;
        reveal.style.transform = `scale(${revealScale})`;
        reveal.style.filter = `saturate(${0.62 + eased * 0.26}) brightness(${0.72 + eased * 0.16})`;
      }
      if (ambient) {
        ambient.style.opacity = String(1 - entry);
      }
      if (behindCopy) {
        const copyEntrance = clamp(
          (videoProgress - OPENING_COPY_FADE_IN_START) /
            (OPENING_COPY_FADE_IN_END - OPENING_COPY_FADE_IN_START),
        );
        const copyExit = clamp(
          (OPENING_COPY_FADE_OUT_END - videoProgress) /
            (OPENING_COPY_FADE_OUT_END - OPENING_COPY_FADE_OUT_START),
        );
        behindCopy.style.opacity = String(
          Math.min(copyEntrance, copyExit),
        );
        behindCopy.style.transform = `translate3d(0, ${(0.69 - videoProgress) * 24}px, 0)`;
      }
      if (videoProgressBar) {
        if (videoProgressBar.parentElement) {
          videoProgressBar.parentElement.style.opacity = String(clamp((entry - 0.58) * 3));
        }
        videoProgressBar.style.transform = `scaleX(${videoProgress})`;
      }
      if (doorVideo?.readyState && doorVideo.readyState >= HTMLMediaElement.HAVE_METADATA) {
        const targetTime = videoProgress * Math.max(0, doorVideo.duration - 0.04);
        if (Number.isFinite(targetTime) && Math.abs(doorVideo.currentTime - targetTime) > 1 / 120) {
          doorVideo.currentTime = targetTime;
        }
      }
    };

    const setupScrollScrub = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        render(isReady ? 1 : 0);
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
        onUpdate: () => render(isReady ? playhead.progress : 0),
        scrollTrigger: {
          trigger: door,
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
    observer.observe(door);
    doorVideo?.addEventListener("loadedmetadata", handleMetadata);
    render(0);
    void setupScrollScrub();

    return () => {
      cancelled = true;
      observer.disconnect();
      doorVideo?.removeEventListener("loadedmetadata", handleMetadata);
      destroyScrollScrub();
    };
  }, [isReady]);

  const wanjassalProgress = loadProgress / 100;
  const treeRevealRaw = clamp((wanjassalProgress - 0.76) / 0.24);
  const treeRevealProgress =
    treeRevealRaw * treeRevealRaw * (3 - 2 * treeRevealRaw);

  const renderWanjassal = (panel: "left" | "right") => {
    const renderSegments = () =>
      wanjaSegments.map((segment) => {
        const horizontal = segment.y1 === segment.y2;
        const delay =
          0.06 + segment.startDistance * WANJA_DRAW_SECONDS_PER_UNIT;
        const duration = segment.length * WANJA_DRAW_SECONDS_PER_UNIT;

        return (
          <line
            className="wanjassal-line"
            key={`${panel}-${segment.key}`}
            x1={segment.x1}
            y1={segment.y1}
            x2={horizontal ? segment.x1 : segment.x2}
            y2={horizontal ? segment.y2 : segment.y1}
            opacity="0"
          >
            <set
              attributeName="opacity"
              to="1"
              begin={`${delay.toFixed(3)}s`}
              fill="freeze"
            />
            <animate
              attributeName={horizontal ? "x2" : "y2"}
              from={horizontal ? segment.x1 : segment.y1}
              to={horizontal ? segment.x2 : segment.y2}
              begin={`${delay.toFixed(3)}s`}
              dur={`${duration.toFixed(3)}s`}
              calcMode="linear"
              fill="freeze"
            />
          </line>
        );
      });

    return (
      <svg
        className="wanjassal"
        viewBox={`0 0 ${WANJA_WIDTH} ${WANJA_HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter
            id={`wanjassal-shadow-${panel}`}
            x="-18%"
            y="-10%"
            width="136%"
            height="122%"
            colorInterpolationFilters="sRGB"
          >
            <feDropShadow
              dx="0.05"
              dy="0.07"
              stdDeviation="0.032"
              floodColor="#2d1b10"
              floodOpacity="0.4"
            />
          </filter>
        </defs>

        <rect
          className="wanjassal-paper-wash"
          x="0"
          y="0"
          width={WANJA_WIDTH}
          height={WANJA_HEIGHT}
        />

        <g
          className="wanjassal-face-layer"
          filter={`url(#wanjassal-shadow-${panel})`}
        >
          <rect
            className="wanjassal-outer-rail"
            x="0.06"
            y="0.06"
            width={WANJA_WIDTH - 0.12}
            height={WANJA_HEIGHT - 0.12}
          />
          {renderSegments()}
        </g>
      </svg>
    );
  };

  return (
    <main className="mobile-invitation" lang={locale} data-locale={locale}>
      <section
        ref={doorRef}
        className="door-scroll"
        aria-label={doorCopy.ariaLabel}
        data-scroll-video={storyVideos[0].id}
      >
        <div
          className={`door-sticky ${isReady ? "is-ready" : "is-loading"}`}
          style={
            {
              "--load-progress": loadProgress / 100,
              "--tree-reveal": treeRevealProgress,
            } as CSSProperties
          }
        >
          <div className="door-reveal" data-door-reveal>
            <video
              ref={doorVideoRef}
              className="door-reveal__video"
              src={storyVideos[0].src}
              poster={storyVideos[0].poster}
              muted
              playsInline
              preload="auto"
              tabIndex={-1}
              aria-hidden="true"
            />
            <div className="door-reveal__shade" />
            <div className="door-behind-copy" data-door-behind-copy>
              <span>{openingVideoCopy.eyebrow}</span>
              <p>{openingVideoCopy.title}</p>
            </div>
            <div className="scrub-video-progress door-video-progress" aria-hidden="true">
              <span data-door-video-progress />
            </div>
          </div>

          <div className="door-ambient" aria-hidden="true" />

          <div className="door-panel door-panel--left" data-door-left>
            <div className="door-panel__surface">
              <div className="door-panel__paper">
                {renderWanjassal("left")}
              </div>
              <span className="door-handle door-handle--left" />
            </div>
          </div>

          <div className="door-panel door-panel--right" data-door-right>
            <div className="door-panel__surface">
              <div className="door-panel__paper">
                {renderWanjassal("right")}
              </div>
              <span className="door-handle door-handle--right" />
            </div>
          </div>

          <div
            className="tree-shadow"
            data-tree-shadow
            aria-hidden="true"
          >
            <div className="tree-shadow__motion">
              <Image
                src="/images/tree-shadow.png"
                alt=""
                fill
                unoptimized
                sizes="(max-width: 480px) 112vw, 540px"
                className="tree-shadow__image"
              />
            </div>
          </div>

          <div className="traditional-knot" data-door-knot aria-hidden="true">
            <span className="knot-loop knot-loop--red" />
            <span className="knot-loop knot-loop--blue" />
            <span className="knot-center" />
            <i className="knot-tail knot-tail--red" />
            <i className="knot-tail knot-tail--blue" />
          </div>

          <div className="door-invitation" data-door-invitation>
            <span className="door-seal" aria-hidden="true">
              <Image
                src={doorSealSrc}
                alt=""
                width={1536}
                height={1024}
                priority
                unoptimized
                sizes="92px"
                className="door-seal__image"
              />
            </span>
            <p>{doorCopy.coupleNames}</p>
            <h1>{doorCopy.invitationTitle}</h1>
            <small>{doorCopy.invitationDate}</small>
          </div>

          <div
            className="door-status"
            data-door-status
            role="status"
            aria-live="polite"
            aria-label={
              isReady
                ? doorCopy.readyAriaLabel
                : doorCopy.loadingAriaLabel(Math.round(loadProgress))
            }
          >
            <p>
              {isReady ? (
                <>
                  {doorCopy.readyPrompt}
                  <span>{doorCopy.readyPromptEyebrow}</span>
                </>
              ) : (
                <>
                  {doorCopy.loadingPrompt}
                  <span className="loading-dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                </>
              )}
            </p>
            <div className="door-progress" aria-hidden="true">
              <span />
            </div>
          </div>

          <div className="door-scroll-prompt" data-door-prompt aria-hidden="true">
            <i />
          </div>
        </div>
      </section>

      <ScrollScrubVideo scene={storyVideos[1]} priority />

      <HorizontalStoryGallery
        ariaLabel={galleryCopy.ariaLabel}
        heading={galleryCopy.heading}
        hint={galleryCopy.hint}
        openPhotoLabel={galleryCopy.openPhotoLabel}
        closePhotoLabel={galleryCopy.closePhotoLabel}
        lightboxLabel={galleryCopy.lightboxLabel}
        items={galleryMemories}
        invitation={transitionCopy}
      />

      <section className="ceremony">
        <p className="ceremony__label">{ceremonyCopy.label}</p>
        <p className="ceremony__month">{ceremonyCopy.month}</p>
        <div className="ceremony__date">
          <span>{ceremonyCopy.weekday}</span>
          <strong>{ceremonyCopy.day}</strong>
          <span>{ceremonyCopy.year}</span>
        </div>
        <div className="ceremony__rule" />
        <h2>{ceremonyCopy.venue}</h2>
        <p>{ceremonyCopy.dateTime}</p>
        <p className="ceremony__address">{ceremonyCopy.address}</p>
        <div className="ceremony__actions">
          <button type="button">{ceremonyCopy.calendarAction}</button>
          <button type="button">{ceremonyCopy.mapAction}</button>
        </div>
      </section>

      <section className="details">
        <article>
          <span>{detailsCopy.locationLabel}</span>
          <h3>{detailsCopy.locationTitle}</h3>
          <p>
            {detailsCopy.locationBody[0]}
            <br />
            {detailsCopy.locationBody[1]}
          </p>
          <button type="button">{detailsCopy.transportAction}</button>
        </article>
        <article>
          <span>{detailsCopy.rsvpLabel}</span>
          <h3>{detailsCopy.rsvpTitle}</h3>
          <p>
            {detailsCopy.rsvpBody[0]}
            <br />
            {detailsCopy.rsvpBody[1]}
          </p>
          <button type="button">{detailsCopy.rsvpAction}</button>
        </article>
      </section>

      <footer className="ending">
        <div className="ending-shade" />
        <div className="ending-copy">
          <p>{endingCopy.label}</p>
          <h2>
            {endingCopy.title[0]}
            <br />
            {endingCopy.title[1]}
          </h2>
          <span>{endingCopy.familyNames}</span>
        </div>
      </footer>
    </main>
  );
}
