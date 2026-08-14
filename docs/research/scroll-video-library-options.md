# 스크롤 연동 영상 라이브러리 조사

- 조사일: 2026-08-11
- 대상: React 19 + Vite/Vinext 기반 모바일 청첩장
- 원칙: 공식 문서, 공식 저장소, 웹 표준만 사용

## 결론

이 프로젝트에는 **GSAP ScrollTrigger 하나만 추가하고, `001.mp4`를 seek 친화적으로 다시 인코딩하는 조합**이 가장 작고 안정적이다.

라이브러리는 스크롤 진행률을 부드럽게 보간할 수 있지만, 압축 영상의 임의 위치를 디코딩하는 비용까지 없애지는 못한다. 따라서 다음 네 작업이 함께 필요하다.

1. 현재의 `휠 한 번 = 6프레임` 인터셉트를 제거하고 네이티브 스크롤 진행률을 연속값으로 사용한다.
2. GSAP ScrollTrigger의 숫자형 `scrub`으로 영상 playhead가 목표값을 약 0.25~0.45초에 걸쳐 따라오게 한다.
3. `001.mp4`의 키프레임 간격을 짧게 재인코딩한 뒤 실제 iPhone에서 파일 크기와 seek 성능을 비교한다.
4. 영상은 브라우저 전체 폭이 아니라 기존 **최대 480px 모바일 초대장 프레임 안에서만 full-bleed**로 표시한다.

Lenis를 함께 넣거나 전용 영상 컴포넌트로 전체 구조를 바꿀 필요는 없다. 이들은 이번 병목을 직접 해결하지 못하거나 iOS 제약이 더 크다.

## 현재 구현에서 확인한 원인

현재 저장소는 별도 애니메이션 라이브러리 없이 자체 `requestAnimationFrame` 구독기로 `video.currentTime`을 갱신한다. 전통문 뒤의 첫 영상에는 추가로 전역 `wheel` 이벤트를 가로채서 한 제스처마다 6프레임만큼 `window.scrollTo()`를 실행하는 코드가 있다. 이 방식은 부드러운 스크럽이 아니라 의도적으로 계단식 이동을 만든다.

`ffprobe`로 `public/videos/001.mp4`를 확인한 결과는 다음과 같다.

| 항목 | 현재 값 |
| --- | --- |
| 코덱 | H.264 High, `yuv420p` |
| 해상도 | 1024×1792 |
| 프레임레이트 | 24fps |
| 길이 | 6.583초 |
| 파일 크기 | 약 2.3MB |
| 키프레임 | **전체 영상에 1개, 0초에만 존재** |

즉 뒤쪽 프레임을 요청할 때 디코더가 직전 키프레임에서 시작할 수 없고 사실상 영상 처음부터 종속 프레임을 따라가야 한다. 연속 스크롤 중 `currentTime`을 반복 설정하면 이 비용이 눈에 띄는 버벅임으로 드러난다.

[WHATWG HTML seeking 알고리즘](https://html.spec.whatwg.org/multipage/media.html#seeking)은 새 seek가 진행 중인 seek를 중단할 수 있고, 사용자 에이전트가 목표 프레임 데이터를 준비할 때까지 기다려야 한다고 정의한다. 또한 정확한 위치 대신 가까운 키프레임을 선택하면 더 빨라질 수 있다고 설명한다. 라이브러리만 바꿔서는 이 디코딩 병목이 없어지지 않는 이유다.

## 후보 비교

| 후보 | 제공하는 것 | 이 프로젝트에서의 장점 | 핵심 한계 | 판단 |
| --- | --- | --- | --- | --- |
| GSAP ScrollTrigger | 연속 progress, 숫자형 `scrub`, pin, resize refresh, `matchMedia` | 스크롤 구간과 catch-up 시간을 직접 제어할 수 있고 기존 CSS sticky 구조를 유지 가능 | 영상 디코더/키프레임 문제는 해결하지 않음 | **채택 권장** |
| Motion `useScroll` + `useSpring` | React MotionValue 기반 progress와 spring 보간 | React 코드가 간결하고 React 렌더 없이 값을 구독 가능 | `currentTime` 연결 코드를 따로 작성해야 하며, 과한 spring은 손을 뗀 뒤 늦게 따라오는 느낌을 만듦 | 좋은 2순위 |
| Lenis | 페이지 전체의 wheel/touch 스크롤 보간 | 일반 페이지 스크롤, WebGL 동기화에는 유용 | 영상 seek를 해결하지 않으며 모바일 touch는 기본적으로 별도 smoothing 대상이 아님 | 이번에는 제외 |
| ScrollyVideo.js | WebCodecs+canvas, 순방향 `playbackRate`, 역방향/currentTime fallback | 영상 스크롤에 특화된 API와 React 컴포넌트 제공 | iOS 저전력 모드 미지원, 모바일 Safari에서 결국 keyframe=1 영상 권장 | 실험용, 핵심 경로에는 비추천 |
| react-kino `VideoScroll` | React용 sticky scene과 `currentTime` 기반 video scrub | 매우 작은 전용 API, mobile URL bar resize/reduced-motion 처리 | 2026년 시작된 0.x 신생 프로젝트이며 seek는 현재 구현과 동일한 직접 `currentTime` 방식 | 유지보수 관찰 후 재평가 |

### 1. GSAP ScrollTrigger

[공식 ScrollTrigger 문서](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)에서 `scrub: true`는 스크롤 위치와 애니메이션 playhead를 직접 연결하고, `scrub: 0.5` 같은 숫자는 playhead가 약 0.5초에 걸쳐 스크롤 위치를 따라오게 한다. 문서에는 pin, responsive `matchMedia`, resize 시 재계산, progress/velocity callback도 명시되어 있다.

이 프로젝트에서는 CSS `position: sticky`와 모바일 shell을 그대로 두고, duration이 로드된 뒤 `0..duration` 범위의 작은 proxy 객체를 tween하는 방식이 적합하다. 숫자형 scrub은 스크롤이 멈춘 뒤에도 보간이 계속되므로, 공식 문서 권장대로 `currentTime` 갱신은 ScrollTrigger 자체가 아니라 tween의 `onUpdate`에서 수행해야 한다.

React에서는 [`gsap.context()`](https://gsap.com/docs/v3/GSAP/gsap.context%28%29/) 또는 공식 React hook으로 effect cleanup 시 ScrollTrigger와 tween을 모두 되돌려야 한다. 현재 [GSAP 공식 가격 안내](https://gsap.com/pricing/)는 전체 라이브러리가 무료라고 설명하고, [표준 라이선스](https://gsap.com/community/standard-license/)는 일반 웹사이트와 상업 프로젝트 사용을 허용한다. 시각적 애니메이션 빌더처럼 Webflow와 경쟁하는 제품은 별도 제한이 있으나 이 청첩장은 해당하지 않는다.

권장 시작값은 `scrub: 0.35`, `ease: "none"`이다. 실기기에서 0.25~0.45초 사이를 비교하되, 0.6초 이상은 사용자의 손가락보다 영상이 뒤늦게 따라오는 느낌이 커질 수 있다.

### 2. Motion `useScroll` + `useSpring`

[Motion `useScroll` 공식 문서](https://motion.dev/docs/react-use-scroll)는 특정 element의 `scrollYProgress`를 0~1 값으로 제공하며, 이를 [`useSpring`](https://motion.dev/docs/react-use-spring)에 연결하는 패턴을 공식 예제로 제시한다. React 컴포넌트 안에서 progress를 다루기에는 가장 자연스럽다.

다만 Motion이 하드웨어 가속을 설명하는 범위는 `transform`, `opacity`, `filter` 같은 스타일 속성이다. `video.currentTime`은 여전히 JavaScript seek와 영상 디코딩 경로를 거친다. 이 프로젝트가 이미 Motion을 사용하지 않고 있고 ScrollTrigger의 구간 제어가 더 직접적이므로 2순위로 둔다.

### 3. Lenis

[Lenis 공식 저장소](https://github.com/darkroomengineering/lenis)는 Lenis를 smooth-scroll 도구로 정의하고 `lerp`, `duration`, RAF loop와 ScrollTrigger 연동 예제를 제공한다. 그러나 이는 실제/애니메이션 스크롤 위치를 보간하는 역할이지 MP4 프레임 seek를 최적화하는 역할이 아니다.

공식 옵션에서 `syncTouch` 기본값은 `false`이며 iOS 16 미만에서는 불안정할 수 있다고 명시되어 있다. 또한 [공식 limitations](https://github.com/darkroomengineering/lenis#limitations)는 Safari가 60fps로 제한되고 저전력 모드에서는 30fps라고 기록한다. 이 프로젝트에는 수평 갤러리와 네이티브 touch가 이미 있으므로 전역 스크롤 물리를 바꾸는 Lenis는 복잡성만 늘릴 가능성이 크다.

결론: GSAP과 같이 설치하지 않는다. 나중에 영상 외 페이지 전체의 스크롤 감촉을 바꾸기로 결정할 때만 별도 검토한다.

### 4. ScrollyVideo.js

[ScrollyVideo 공식 저장소와 기술 설명](https://github.com/dkaoster/scrolly-video)은 세 가지 렌더링 경로를 사용한다고 밝힌다.

1. 가능하면 WebCodecs로 전체 프레임을 디코딩해 canvas에 그림
2. 순방향에서는 `playbackRate`로 따라감
3. 역방향 또는 모바일 Safari에서는 `currentTime` seek로 fallback

공식 문서는 Safari/currentTime fallback의 최적 성능을 위해 **모든 프레임을 키프레임으로 인코딩(`keyframe = 1`)**하라고 권장한다. 동시에 iOS 저전력 모드에서는 동작하지 않는 known issue를 명시한다. WebCodecs의 `VideoDecoder` 역시 [MDN 공식 참조](https://developer.mozilla.org/en-US/docs/Web/API/VideoDecoder)에서 아직 Baseline이 아닌 제한 지원 기능이다.

저장소는 archive 상태가 아니고 2026-02까지 push가 있었지만, [공식 releases](https://github.com/dkaoster/scrolly-video/releases)는 npm 최신 `0.0.24`가 2025-03에 배포된 상태다. 저장소 `main`의 package version `0.0.25`와 npm 배포도 일치하지 않는다. iPhone이 핵심 플랫폼인 청첩장의 필수 경로를 맡기기에는 위험하다.

### 5. react-kino

[react-kino 공식 문서](https://github.com/btahir/react-kino#videoscroll)는 `VideoScroll`이 sticky 구간, `muted`, `playsInline`, metadata 재동기화, 모바일 URL bar resize, reduced-motion poster fallback을 처리한다고 설명한다. React 18+를 지원하므로 현재 React 19 조건에도 맞는다.

다만 공식 문서도 scroll progress에 따라 `currentTime`을 직접 설정한다고 밝힌다. 즉 현재 `001.mp4`처럼 키프레임이 한 개뿐인 영상에서는 버벅임의 근본 원인이 그대로 남는다. 2026-07의 `0.5.0` 신생 0.x 라이브러리이므로 현재는 안정성보다 간단한 prototype에 더 적합하다.

## 영상 인코딩과 모바일 Safari 주의사항

### 키프레임 간격

첫 실험은 현재 원본을 보존하고 다음 두 파생본을 만들어 실제 iPhone에서 비교하는 것이 안전하다.

- 품질 기준본: 24fps의 모든 프레임을 I-frame으로 만든 `GOP=1`
- 용량 절충본: 4프레임마다 키프레임을 둔 `GOP=4`(약 0.167초)

모바일 shell 최대 폭이 480px이므로, 원본 1024px 폭을 그대로 전달하기보다 폭 540px 정도로 낮춰 all-intra의 용량 증가를 상쇄할 수 있다. [`ffmpeg` 공식 문서](https://ffmpeg.org/ffmpeg.html#Advanced-Video-options)는 `-force_key_frames`와 keyframe 강제 동작을 설명한다. 예시 검증 명령은 다음과 같다.

```bash
ffmpeg -i public/videos/001.mp4 \
  -vf "scale=540:-2" -an \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
  -g 1 -keyint_min 1 -sc_threshold 0 \
  -movflags +faststart public/videos/001-scrub-gop1.mp4
```

이 결과가 셀룰러 전달에 너무 크면 `-g 4 -keyint_min 4` 버전과 비교한다. 최종 선택은 데스크톱 시뮬레이터가 아니라 iPhone Safari의 forward/reverse scrub, 첫 진입 대기시간, 파일 크기를 함께 측정해서 결정해야 한다.

### `currentTime`, `fastSeek`, 프레임 callback

- [`currentTime`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime)은 정확한 시간으로 seek하지만 압축 프레임 디코딩 비용이 발생한다.
- [`fastSeek()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/fastSeek)는 속도를 위해 정확도를 포기하고 일부 주요 브라우저에서 지원되지 않으므로 프레임 연동 영상에는 사용하지 않는다.
- [`requestVideoFrameCallback()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback)은 새 프레임이 compositor에 전달될 때 측정/동기화하는 데 유용하지만, target seek를 대신하거나 GOP 병목을 없애지는 않는다. 구형 기기를 위한 fallback도 필요하다.

### Safari 재생 정책과 preload

[WebKit의 iOS video 정책](https://webkit.org/blog/6784/new-video-policies-for-ios/)에 따라 iPhone에서 inline video는 `playsinline`을 유지해야 하고, 사용자 제스처 없는 `play()` 경로를 쓸 경우 muted 또는 audio track 없음 조건을 지켜야 한다. 현재처럼 무음 scroll-scrub video는 `muted`, `playsInline`, `preload="auto"`를 유지하되 재생 컨트롤을 노출하지 않는다.

다만 [`preload`는 HTML 표준상 힌트](https://html.spec.whatwg.org/multipage/media.html#attr-media-preload)에 불과하며 연결 상태나 사용자 설정에 따라 브라우저가 무시할 수 있다. poster와 로딩 상태를 유지하고, 저전력 모드나 데이터 절약 환경에서 첫 프레임 고정 fallback을 허용해야 한다. WebKit은 iOS 저전력 모드에서 silent autoplay를 비활성화한다고 [공식 버그 기록](https://bugs.webkit.org/show_bug.cgi?id=168985)에 남겼다.

## 권장 구현 경계

다음 구현에서 지켜야 할 범위는 명확하다.

- 삭제: 전역 non-passive `wheel` capture, 140ms gesture lock, 6프레임 단위 `scrollTo`
- 유지: 사용자의 네이티브 touch/wheel 스크롤, 기존 CSS sticky section, 기존 스토리 순서
- 추가: GSAP ScrollTrigger 한 개, 숫자형 scrub, effect cleanup, metadata/resize refresh
- 영상: 한 프레임 단위로 반올림하지 않고 연속 target time을 사용하되, 실제 seek write는 tween update당 최대 한 번
- 레이아웃: `.mobile-invitation`의 최대 480px 폭 유지, 첫 영상은 그 shell 내부에서 `width: 100%`, `height: 100svh`, `object-fit: cover`
- 접근성: `prefers-reduced-motion`에서는 poster 또는 일반 재생 대안을 사용하고 강제 스크럽을 피함
- 검증: iPhone Safari 일반/저전력 모드, Android Chrome, 트랙패드/마우스, 역방향 스크롤, 수평 갤러리 진입/이탈

## 최종 선택

**GSAP ScrollTrigger + seek 친화적 H.264 MP4**를 선택한다.

GSAP은 이번에 필요한 "스크롤 진행률을 자연스럽게 늦춰 따라가기"를 가장 직접적으로 제공한다. 영상 재인코딩은 현재 한 개뿐인 키프레임 때문에 발생하는 실제 디코딩 병목을 해결한다. 두 조치를 함께 해야 사용자가 요청한 "한 번 스크롤할 때 너무 많이 넘어가지 않으면서도 버벅이지 않는" 감각을 만들 수 있다.

Motion은 향후 프로젝트 전반에 Motion을 도입할 계획이 생기면 동일한 구조의 대안이 될 수 있다. Lenis, ScrollyVideo.js, react-kino는 현재 모바일 invitation의 핵심 경로에는 채택하지 않는다.
