"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useRef, useState } from "react";

type StoryMediaScene = {
  id: string;
  imageSrc: string;
  alt: string;
  futureVideoSrc?: string;
};

const storyMediaScenes: StoryMediaScene[] = [
  {
    id: "vancouver",
    imageSrc: "/images/vancouver-story.webp",
    alt: "밴쿠버 바닷가를 함께 걷는 두 사람",
  },
  {
    id: "canada-wedding",
    imageSrc: "/images/canada-wedding.webp",
    alt: "캐나다 결혼식에서 손을 맞잡은 두 사람",
  },
  {
    id: "family-three",
    imageSrc: "/images/family-three.webp",
    alt: "창가에서 아기를 안고 있는 세 가족",
  },
];

const doorSealSrc = "/wedding/seals/sangho-steph-square-tassel.png";
const criticalAssets = [
  ...storyMediaScenes.map((scene) => scene.imageSrc),
  doorSealSrc,
];

const memories = [
  {
    year: "VANCOUVER",
    kicker: "Chapter 01",
    title: "서로 다른 곳에서\n우리는 만났습니다",
    body: "낯선 도시에서 시작된 두 사람의 이야기는 천천히 같은 방향을 바라보기 시작했습니다.",
    image: "/images/vancouver-story.webp",
    alt: "밴쿠버 바닷가를 걷는 두 사람",
    className: "memory--wide",
  },
  {
    year: "OUR DAYS",
    kicker: "Chapter 02",
    title: "함께한 시간이\n우리의 일상이 되고",
    body: "계절을 지나고, 여행을 하고, 평범한 하루를 나누며 둘만의 집을 만들어 갔습니다.",
    image: "/images/vancouver-story.webp",
    alt: "밴쿠버에서 함께한 시간",
    className: "memory--portrait memory--soft",
  },
  {
    year: "05 · 05 · 2025",
    kicker: "Chapter 03",
    title: "우리는 서로의\n가족이 되었습니다",
    body: "캐나다에서 작은 약속을 나누고 부부가 되었습니다.",
    image: "/images/canada-wedding.webp",
    alt: "캐나다 결혼식에서 손을 맞잡은 두 사람",
    className: "memory--wide",
  },
  {
    year: "07 · 10 · 2026",
    kicker: "Chapter 04",
    title: "그리고 가장 소중한\n선물이 찾아왔습니다",
    body: "영준이가 태어나고 두 사람의 이야기는 세 사람의 이야기가 되었습니다.",
    image: "/images/family-three.webp",
    alt: "창가에서 아기를 안고 있는 가족",
    className: "memory--portrait",
  },
  {
    year: "WE BECAME THREE",
    kicker: "Chapter 05",
    title: "두 사람이 만나\n세 사람의 가족이 되었습니다",
    body: "이제 한국의 가족과 친구들 앞에서 우리의 다음 장면을 이어가려 합니다.",
    image: "/images/family-three.webp",
    alt: "아기와 함께한 세 사람의 가족",
    className: "memory--final",
  },
];

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
  const [loadProgress, setLoadProgress] = useState(2);
  const [isReady, setIsReady] = useState(false);
  const doorRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

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
    let frame = 0;

    const render = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const door = doorRef.current;

      if (door) {
        const rect = door.getBoundingClientRect();
        const range = Math.max(1, door.offsetHeight - viewportHeight);
        const progress = isReady ? clamp(-rect.top / range) : 0;
        const opening = clamp((progress - 0.035) / 0.78);
        const eased = 1 - Math.pow(1 - opening, 3);
        const leftDoor = door.querySelector<HTMLElement>("[data-door-left]");
        const rightDoor = door.querySelector<HTMLElement>("[data-door-right]");
        const knot = door.querySelector<HTMLElement>("[data-door-knot]");
        const invitation = door.querySelector<HTMLElement>("[data-door-invitation]");
        const prompt = door.querySelector<HTMLElement>("[data-door-prompt]");
        const reveal = door.querySelector<HTMLElement>("[data-door-reveal]");
        const behindCopy = door.querySelector<HTMLElement>("[data-door-behind-copy]");
        const treeShadow = door.querySelector<HTMLElement>("[data-tree-shadow]");

        if (leftDoor) {
          leftDoor.style.transform = `perspective(1100px) translate3d(${-eased * 38}%, 0, 0) rotateY(${eased * 68}deg)`;
          leftDoor.style.filter = `brightness(${1 - eased * 0.25})`;
        }
        if (rightDoor) {
          rightDoor.style.transform = `perspective(1100px) translate3d(${eased * 38}%, 0, 0) rotateY(${-eased * 68}deg)`;
          rightDoor.style.filter = `brightness(${1 - eased * 0.25})`;
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
        if (treeShadow) {
          treeShadow.style.opacity = String(clamp(1 - opening * 2.2));
        }
        if (reveal) {
          reveal.style.transform = `scale(${1.13 - eased * 0.1})`;
          reveal.style.filter = `saturate(${0.62 + eased * 0.26}) brightness(${0.72 + eased * 0.16})`;
        }
        if (behindCopy) {
          behindCopy.style.opacity = String(clamp((opening - 0.58) * 2.5));
          behindCopy.style.transform = `translate3d(0, ${(1 - opening) * 26}px, 0)`;
        }
      }

      const hero = heroRef.current;

      if (hero) {
        const rect = hero.getBoundingClientRect();
        const range = Math.max(1, hero.offsetHeight - viewportHeight);
        const progress = clamp(-rect.top / range);
        const layers = hero.querySelectorAll<HTMLElement>("[data-hero-layer]");
        const intro = hero.querySelector<HTMLElement>("[data-hero-intro]");
        const family = hero.querySelector<HTMLElement>("[data-hero-family]");
        const scrollMark = hero.querySelector<HTMLElement>("[data-scroll-mark]");

        if (layers[0]) {
          layers[0].style.opacity = String(clamp(1 - progress * 2.6));
          layers[0].style.transform = `scale(${1.03 + progress * 0.13}) translate3d(0, ${progress * -1.8}%, 0)`;
        }
        if (layers[1]) {
          const appear = clamp((progress - 0.2) * 3.8);
          const disappear = clamp((0.72 - progress) * 4.2);
          layers[1].style.opacity = String(Math.min(appear, disappear));
          layers[1].style.transform = `scale(${1.1 - progress * 0.06}) translate3d(${(0.45 - progress) * 2.5}%, 0, 0)`;
        }
        if (layers[2]) {
          layers[2].style.opacity = String(clamp((progress - 0.55) * 3.2));
          layers[2].style.transform = `scale(${1.12 - progress * 0.08}) translate3d(0, ${(0.75 - progress) * 2}%, 0)`;
        }
        if (intro) {
          intro.style.opacity = String(clamp(1 - progress * 2.4));
          intro.style.transform = `translate3d(0, ${progress * -42}px, 0)`;
        }
        if (family) {
          family.style.opacity = String(clamp((progress - 0.62) * 3.4));
          family.style.transform = `translate3d(0, ${(1 - progress) * 42}px, 0)`;
        }
        if (scrollMark) {
          scrollMark.style.opacity = String(clamp(1 - progress * 4));
        }
      }

      const timeline = timelineRef.current;
      const track = trackRef.current;

      if (timeline && track) {
        const rect = timeline.getBoundingClientRect();
        const range = Math.max(1, timeline.offsetHeight - viewportHeight);
        const progress = clamp(-rect.top / range);
        const viewportWidth = timeline.clientWidth;
        const maxX = Math.max(0, track.scrollWidth - viewportWidth);

        track.style.transform = `translate3d(${-progress * maxX}px, 0, 0)`;
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${progress})`;
        }

        track
          .querySelectorAll<HTMLElement>("[data-memory-card]")
          .forEach((card) => {
            const center =
              card.offsetLeft -
              progress * maxX +
              card.offsetWidth / 2;
            const distance = Math.abs(center - viewportWidth / 2);
            const focus = clamp(1 - distance / (viewportWidth * 0.82));
            const frameElement =
              card.querySelector<HTMLElement>("[data-memory-frame]");
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
      }
    };

    const requestRender = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(requestRender);
    if (heroRef.current) observer.observe(heroRef.current);
    if (trackRef.current) observer.observe(trackRef.current);

    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender);
    requestRender();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      if (frame) window.cancelAnimationFrame(frame);
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
    <main className="mobile-invitation">
      <section
        ref={doorRef}
        className="door-scroll"
        aria-label="전통 창호문 청첩장 열기"
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
            <Image
              src="/images/vancouver-story.webp"
              alt=""
              fill
              priority
              unoptimized
              sizes="(max-width: 480px) 100vw, 480px"
              className="door-reveal__image"
            />
            <div className="door-reveal__shade" />
            <div className="door-behind-copy" data-door-behind-copy>
              <span>VANCOUVER</span>
              <p>우리의 이야기가 시작된 곳</p>
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
            <p>상호 · 스테프</p>
            <h1>혼례에 초대합니다</h1>
            <small>2026년 11월 1일</small>
          </div>

          <div
            className="door-status"
            role="status"
            aria-live="polite"
            aria-label={
              isReady
                ? "준비가 완료되었습니다. 아래로 스크롤하여 문을 열어주세요."
                : `청첩장을 준비하고 있습니다. ${Math.round(loadProgress)}퍼센트`
            }
          >
            <p>
              {isReady ? (
                <>
                  아래로 내려 문을 열어주세요
                  <span>SCROLL TO OPEN</span>
                </>
              ) : (
                <>
                  이야기를 준비하고 있습니다
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

      <section ref={heroRef} className="hero-scroll" aria-label="가족 이야기 오프닝">
        <div className="hero-sticky">
          {storyMediaScenes.map((scene, index) => (
            <div
              className="hero-layer"
              data-hero-layer
              data-media-kind="image"
              data-story-scene={scene.id}
              key={scene.id}
            >
              <Image
                src={scene.imageSrc}
                alt=""
                fill
                priority={index === 0}
                unoptimized
                sizes="(max-width: 480px) 100vw, 480px"
                className="hero-image"
              />
            </div>
          ))}

          <div className="hero-shade" />
          <div className="grain" />

          <div className="hero-copy hero-copy--intro" data-hero-intro>
            <p className="eyebrow">Our story · Vancouver to Seoul</p>
            <h1>
              Sang Ho
              <span>&amp;</span>
              Steph
            </h1>
            <p className="hero-date">2026 · 11 · 01</p>
          </div>

          <div className="hero-copy hero-copy--family" data-hero-family>
            <p className="eyebrow">We became a family</p>
            <h2>
              두 사람이 만나
              <br />세 사람의 가족이 되었습니다
            </h2>
          </div>

          <div className="scroll-mark" data-scroll-mark aria-hidden="true">
            <span>SCROLL</span>
            <i />
          </div>
        </div>
      </section>

      <section className="story-bridge">
        <p className="section-number">01 · OUR STORY</p>
        <h2>
          캐나다에서 시작된 우리의 이야기가
          <br />
          한국에서 새로운 장면으로 이어집니다.
        </h2>
        <p className="story-bridge__hint">
          아래로 스크롤하면 이야기가 옆으로 펼쳐집니다
        </p>
      </section>

      <section
        ref={timelineRef}
        className="timeline-scroll"
        aria-label="우리 가족의 타임라인"
      >
        <div className="timeline-sticky">
          <header className="timeline-heading">
            <span>OUR TIMELINE</span>
            <span>Keep scrolling ↓</span>
          </header>

          <div ref={trackRef} className="timeline-track">
            <div className="timeline-spacer" aria-hidden="true" />
            {memories.map((memory, index) => (
              <article
                className={`memory-card ${memory.className}`}
                data-memory-card
                key={memory.kicker}
              >
                <div className="memory-visual" data-memory-frame>
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
                </div>
                <div className="memory-copy" data-memory-copy>
                  <p>{memory.kicker}</p>
                  <h3>
                    {memory.title.split("\n").map((line) => (
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
            <div className="timeline-end">
              <span>그리고</span>
              <strong>SEOUL</strong>
              <small>2026 · 11 · 01</small>
            </div>
          </div>

          <div className="timeline-rule" aria-hidden="true">
            <span ref={progressRef} />
          </div>
        </div>
      </section>

      <section className="invitation-transition">
        <div className="hanji-mark" aria-hidden="true">
          <span>상</span>
          <span>스</span>
        </div>
        <p className="section-number">02 · INVITATION</p>
        <h2>
          이제 한국의 소중한 분들 앞에서
          <br />
          우리의 다음 장면을 이어가려 합니다.
        </h2>
        <p>
          함께 자리하시어 새로운 시작을
          <br />
          따뜻한 마음으로 축복해 주세요.
        </p>
      </section>

      <section className="ceremony">
        <p className="ceremony__label">THE CEREMONY</p>
        <p className="ceremony__month">NOVEMBER</p>
        <div className="ceremony__date">
          <span>SUN</span>
          <strong>01</strong>
          <span>2026</span>
        </div>
        <div className="ceremony__rule" />
        <h2>롯데월드 전통혼례장</h2>
        <p>2026년 11월 1일 일요일 · 오후 12시</p>
        <p className="ceremony__address">
          서울특별시 송파구 올림픽로 240
        </p>
        <div className="ceremony__actions">
          <button type="button">달력에 저장</button>
          <button type="button">지도 보기</button>
        </div>
      </section>

      <section className="details">
        <article>
          <span>LOCATION</span>
          <h3>오시는 길</h3>
          <p>
            지하철 2호선·8호선 잠실역
            <br />
            롯데월드 전통혼례장
          </p>
          <button type="button">교통 안내 확인</button>
        </article>
        <article>
          <span>RSVP</span>
          <h3>참석 여부</h3>
          <p>
            귀한 걸음 준비에 참고할 수 있도록
            <br />
            참석 여부를 알려주세요.
          </p>
          <button type="button">참석 여부 전달</button>
        </article>
      </section>

      <footer className="ending">
        <div className="ending-photo">
          <Image
            src="/images/family-three.webp"
            alt="영준이와 함께한 상호와 스테프의 가족"
            fill
            unoptimized
            sizes="(max-width: 480px) 100vw, 480px"
            className="ending-image"
          />
        </div>
        <div className="ending-shade" />
        <div className="ending-copy">
          <p>THANK YOU</p>
          <h2>
            우리의 이야기를
            <br />
            함께해 주셔서 감사합니다.
          </h2>
          <span>Sang Ho · Steph · Youngjoon</span>
        </div>
      </footer>
    </main>
  );
}
