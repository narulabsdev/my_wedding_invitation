# 06. 개발 인수인계

## 1. 기준 구현

- 프레임워크: Next.js 16.2.6
- UI: React 19.2.6 + TypeScript
- 스타일: 단일 전역 CSS + Tailwind CSS 4 import
- 빌드 환경: Vinext/Vite 기반 Cloudflare 호환 출력
- 기준 Node.js: 24.x
- 기준 사이트 버전: v18
- 콘텐츠 폭: 최대 480px의 모바일 청첩장 프레임

현재 데모는 동영상 라이브러리나 스크롤 애니메이션 패키지 없이 브라우저 기본 API와 SVG 애니메이션으로 구현되어 있습니다. 창호문 다음 오프닝은 이미지 3개로 뼈대를 표시하며, 향후 각 장면을 별도 영상 클립으로 교체합니다.

## 2. 주요 파일

```text
app/
  layout.tsx            문서 언어, 메타데이터, 기본 서체 설정
  page.tsx              데이터, 완자살 계산, 로딩, 스크롤 인터랙션, 전체 화면 구조
  globals.css           컬러, 레이아웃, 모든 시각 스타일과 키프레임
public/
  images/
    vancouver-story.webp
    canada-wedding.webp
    family-three.webp
    tree-shadow.png
  wedding/seals/
    sangho-steph-square-tassel.png
```

## 3. 현재 컴포넌트 구조

현재 샘플은 한 페이지 안에서 전체 경험을 빠르게 검증하기 위해 `page.tsx` 하나에 주요 로직을 모았습니다. 실제 프로젝트로 확장할 때는 아래처럼 분리하는 것이 좋습니다.

```text
app/page.tsx
components/
  DoorLoadingScene.tsx
  WanjassalPanel.tsx
  PhotoHero.tsx
  HorizontalTimeline.tsx
  InvitationCopy.tsx
  CeremonyDetails.tsx
  AccessAndRsvp.tsx
  EndingScene.tsx
data/
  invitation.ts
  memories.ts
lib/
  scroll-progress.ts
  wanjassal-geometry.ts
```

분리 시 시각 결과나 진행률 계산을 바꾸지 말고, 데이터와 표현의 경계만 정리합니다.

## 4. 데이터 모델 권장안

```ts
type InvitationData = {
  couple: {
    partner1: { ko: string; en: string };
    partner2: { ko: string; en: string };
    child?: { ko: string; en?: string; isPublic: boolean };
  };
  ceremony: {
    startsAt: string;
    venue: string;
    address: string;
    mapUrl: string;
    calendarUrl?: string;
  };
  memories: Array<{
    chapter: string;
    dateOrPlace: string;
    title: string;
    body: string;
    image: string;
    alt: string;
  }>;
  openingScenes: Array<{
    id: string;
    imageSrc: string;
    alt: string;
    videoSrc?: string;
  }>;
};
```

날짜 문자열을 여러 위치에 직접 쓰지 말고 단일 ISO 날짜에서 화면용 한글·영문 표기를 생성하면 불일치 가능성을 줄일 수 있습니다.

## 5. 섹션과 스크롤 높이

| 섹션 | 현재 높이 | 내부 고정 | 동작 |
|---|---:|---:|---|
| 창호문 | `220svh` | `100svh` | 스크롤 연동 양문 열림 |
| 복수 미디어 오프닝 | `260svh` | `100svh` | 현재 이미지 3장 크로스페이드, 향후 장면별 영상 교체 |
| 이야기 브리지 | `100svh` 이상 | 없음 | 일반 세로 흐름 |
| 수평 타임라인 | `560svh` | `100svh` | 세로 진행률을 가로 트랙 X로 변환 |
| 초대 문구 | `115vh` | 없음 | 일반 세로 흐름 |
| 행사 정보 | `115vh` | 없음 | 일반 세로 흐름 |
| 세부 정보 | 콘텐츠 기반 | 없음 | 모바일 1열 |
| 엔딩 | `100svh` | 없음 | 전체 화면 가족 사진 |

`svh`를 우선 사용해 모바일 브라우저 주소창 변화에 대응합니다. 필요하면 구형 브라우저용 `vh` 값을 앞에 함께 선언합니다.

오프닝의 각 이미지 장면은 향후 별도 영상 클립 하나에 대응합니다. 현재 이미지 경로는 영상 poster 및 재생 실패 시 대체 화면으로 유지합니다.

## 6. 스크롤 렌더링 구조

현재 로직은 한 개의 `scroll` 리스너에서 문, 오프닝, 타임라인의 진행률을 계산하고 `requestAnimationFrame`에서 실제 스타일을 반영합니다.

권장 유지 사항:

- `scroll` 리스너는 `passive: true`
- 프레임 대기 중이면 추가 `requestAnimationFrame`을 요청하지 않음
- `transform`과 `opacity`를 우선 변경
- 카드 폭은 `ResizeObserver`로 갱신
- `getBoundingClientRect()` 호출과 DOM 쓰기를 가능하면 같은 단계끼리 묶음
- SSR 시 `window`에 접근하지 않고 클라이언트 효과 안에서만 사용

카드 수가 크게 늘어날 경우에는 타임라인 전체 높이를 상수로 두지 않고 다음처럼 계산합니다.

```text
requiredVerticalTravel ≈ horizontalTrackTravel × scrollRatio
sectionHeight = viewportHeight + requiredVerticalTravel
```

모바일에서는 `scrollRatio` 1.0–1.3 범위에서 실제 손가락 이동 감각을 테스트합니다.

## 7. 완자살 구현 경계

### 변경해도 되는 것

- 셀 배열 데이터
- 단위당 재생 시간
- 선 색, 두께, 미세한 그림자
- 좌우 패널의 거울 대칭 여부

### 유지해야 하는 것

- 외곽 연결 노드에서 시작하는 그래프 기반 순서
- 시작 전 내부 선의 완전한 비표시
- 실제 끝점 이동으로 선을 그리는 방식
- 평평한 선 끝 모양
- 창살 본체와 그림자의 별도 위계

### 회귀 가능성이 높은 변경

- 모든 선에 동일한 지연 배열 적용: 중앙에서 선 조각이 먼저 생길 수 있음
- 패턴 전체에 단일 마스크 적용: 완성된 선을 가렸다가 보여주는 느낌
- 둥근 선 끝 사용: 시작 전 점이 보이거나 교차부가 뭉개질 수 있음
- 큰 드롭 섀도: 그림자가 두 번째 창살처럼 보임

## 8. 접근성

현재 샘플에 반영된 항목:

- 문 구간에 한국어 `aria-label`
- 로딩 상태를 `role=status`, `aria-live=polite`로 전달
- 장식용 SVG와 나무 그림자는 보조기술에서 숨김
- 사진마다 이야기 맥락을 설명하는 대체 텍스트
- `prefers-reduced-motion` 정적 대안

실제 프로젝트에서 추가할 항목:

- 모든 버튼에 실제 링크 또는 명확한 동작 연결
- 실제 링크·폼 연결 후의 키보드 동작 검증
- RSVP 폼 라벨, 오류 문구, 제출 완료 알림
- 지도와 외부 링크에 새 창 안내
- 글자 확대 200%에서 콘텐츠 손실 확인
- 명조체의 실제 렌더링 대비 점검

## 9. 버튼 및 외부 기능 상태

현재 아래 버튼은 시각 샘플이며 실제 기능이 연결되지 않았습니다.

- 달력에 저장
- 지도 보기
- 교통 안내 확인
- 참석 여부 전달

### 권장 구현

#### 달력

- 표준 `.ics` 파일 제공
- Google Calendar 링크 보조 제공
- 행사 시간대는 `Asia/Seoul`로 고정

#### 지도

- 모바일에서는 카카오맵 또는 네이버지도 링크 우선
- 해외 하객을 위해 Google Maps 링크도 제공 가능

#### RSVP

- 이름, 참석 여부, 인원 정도만 필수
- 연락처는 실제 필요성이 있을 때만 수집
- 제출 후 수정 링크 또는 연락 방법 제공
- 개인정보 보관 기간과 접근 주체 결정

## 10. 이미지 성능

- 현재 샘플 사진은 1536×1024 WebP이며 각각 약 32–68KB
- 나무 그림자 PNG는 약 404KB로 가장 큼
- 실제 배포에서는 나무 그림자를 알파 WebP로 변환해 용량 비교 권장
- 첫 문 뒤 사진은 우선 로드
- 나머지는 첫 화면 로딩을 해치지 않는 범위에서 프리로드 또는 지연 로드
- 복수 영상 연결 시 첫 클립만 우선 준비하고 후속 클립은 순차 지연 로드
- 모바일 표시 크기에 맞춰 480px, 960px 정도의 파생 이미지를 제공
- 저속 네트워크에서 이미지 오류가 나도 로딩 화면에 영구 정지하지 않도록 실패를 완료 상태로 처리

## 11. 브라우저·기기 테스트 범위

최소 권장 범위:

- iPhone Safari: 360–430px 폭
- Android Chrome: 360–412px 폭
- 데스크톱 Chrome/Safari: 모바일 프레임이 중앙 정렬되는지 확인
- 저전력 모드 또는 성능이 낮은 모바일
- 세로 화면 회전 후 다시 세로로 돌아오는 경우
- `prefers-reduced-motion: reduce`
- 느린 4G 및 캐시 없는 첫 접속

### 핵심 시나리오

1. 새로 접속 → 로딩 완료 → 첫 스크롤
2. 로딩 중 빠르게 스크롤 시도
3. 문 구간을 빠르게 왕복
4. 타임라인을 천천히/빠르게 완주
5. 중간에서 화면 회전 또는 브라우저 높이 변화
6. 하단 버튼 탭 후 원래 페이지로 복귀
7. 새로고침과 뒤로 가기

## 12. 현재 샘플에서 실제 프로젝트로 옮길 순서

1. 행사 정보와 공개 범위를 확정
2. 실제 사진을 수집하고 장면별로 매핑
3. 콘텐츠 데이터를 코드 밖의 한 파일로 분리
4. 현재 완자살·문 열림·타임라인 동작을 그대로 이식
5. 사진 색보정과 모바일 크롭 조정
6. 지도·달력·RSVP 기능 연결
7. 공유 이미지와 메타데이터 제작
8. 접근성·성능·실기기 테스트
9. 실제 하객에게 보내기 전 비공개 링크로 최종 검수

## 13. 최종 배포 전 체크리스트

- [ ] 행사 날짜·시간·요일·장소·주소를 두 사람이 확인했다.
- [ ] 모바일 첫 화면에서 완자살 애니메이션이 부드럽다.
- [ ] 나무 그림자 위치와 흔들림이 의도대로다.
- [ ] 모든 사진에 올바른 인물과 대체 텍스트가 연결됐다.
- [ ] 수평 타임라인은 가로 스와이프 없이 세로 스크롤로 동작한다.
- [ ] 네 개의 정보 버튼이 실제 기능과 연결됐다.
- [ ] RSVP 데이터 저장·열람 권한을 확인했다.
- [ ] 공유용 이미지와 링크 미리보기를 확인했다.
- [ ] 움직임 줄이기와 키보드 탐색을 확인했다.
- [ ] iPhone Safari와 Android Chrome 실기기 테스트를 완료했다.
- [ ] 잘못된 샘플 문구나 임시 이미지가 남아 있지 않다.

## 14. 실행 참고

전체 소스 패키지에서 다음 명령으로 개발 환경을 실행할 수 있습니다.

```bash
npm ci
npm run dev
```

현재 구성은 `.nvmrc`와 `package.json` 기준 Node.js 24.x를 사용합니다.
