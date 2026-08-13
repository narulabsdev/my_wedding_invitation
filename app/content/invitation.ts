import type { InvitationLocale } from "../lib/locale";

export type StoryVideo = {
  id: string;
  src: string;
  durationSeconds: number;
  poster?: string;
  ariaLabel: string;
  eyebrow: string;
  title: string[];
  detail?: string;
  labels?: StoryVideoLabel[];
};

export type StoryVideoLabel = {
  id: string;
  text: string;
  date: string;
  start: number;
  end: number;
  placement: "top-left" | "bottom-left" | "bottom-right";
};

export type GalleryMemory = {
  year: string;
  kicker: string;
  title: string[];
  body?: string;
  image?: string;
  alt: string;
  className: string;
};

export type PersonalizedInvitation = {
  recipientName: string;
  message: string;
};

export type EndingVideo = {
  src: string;
  poster: string;
  durationSeconds: number;
  ariaLabel: string;
  label: string;
  title: readonly [string, string];
  familyNames: string;
};

export type InvitationLinkBuilderCopy = {
  eyebrow: string;
  title: string;
  description: string;
  accessCodeLabel: string;
  accessCodePlaceholder: string;
  nameLabel: string;
  namePlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  defaultMessage: string;
  autoModeLabel: string;
  autoModeDescription: string;
  privacyNote: string;
  generateAction: string;
  generatingAction: string;
  resultLabel: string;
  copyAction: string;
  copiedAction: string;
  validationError: string;
  accessError: string;
  requestError: string;
};

export type CeremonyMapDialogCopy = {
  ariaLabel: string;
  title: string;
  description: string;
  closeLabel: string;
  venue: string;
  address: string;
  options: readonly { label: string; url: string; iconSrc: string }[];
};

type StoryVideoText = Pick<StoryVideo, "ariaLabel" | "eyebrow" | "title"> & {
  labels?: readonly string[];
};
type GalleryMemoryText = Pick<GalleryMemory, "title" | "body" | "alt">;
type Six<T> = readonly [T, T, T, T, T, T];

type InvitationCopy = {
  storyVideos: Six<StoryVideoText>;
  gallery: {
    ariaLabel: string;
    heading: string;
    hint: string;
    autoScrollHint: string;
    openPhotoLabel: string;
    closePhotoLabel: string;
    lightboxLabel: string;
  };
  galleryPrelude: {
    ariaLabel: string;
    eyebrow: string;
    title: readonly [string, string];
    body: string;
  };
  openingVideo: {
    eyebrow: string;
    title: string;
    scrollGuide: string;
  };
  galleryMemories: readonly GalleryMemoryText[];
  door: {
    ariaLabel: string;
    coupleNames: string;
    invitationLines: readonly [string, string];
    personalizedInvitationLines: (
      recipientName: string,
    ) => readonly [string, string, string];
    invitationDate: string;
    readyAriaLabel: string;
    loadingAriaLabel: (progress: number) => string;
    readyPrompt: string;
    readyPromptEyebrow: string;
    autoReadyAriaLabel: string;
    autoReadyPrompt: string;
    autoReadyPromptEyebrow: string;
    loadingPrompt: string;
  };
  transition: {
    sectionLabel: string;
    title: readonly [string, string];
    body: readonly [string, string];
    personalizedGreeting: (name: string) => string;
  };
  linkBuilder: InvitationLinkBuilderCopy;
  ceremony: {
    label: string;
    month: string;
    weekday: string;
    day: string;
    year: string;
    venue: string;
    dateTime: string;
    address: string;
    calendarAction: string;
    calendarEvent: {
      title: string;
      description: string;
    };
    mapAction: string;
    mapDialog: CeremonyMapDialogCopy;
  };
  details: {
    locationLabel: string;
    locationTitle: string;
    venue: string;
    phoneLabel: string;
    phone: string;
    addressLabel: string;
    address: string;
    subwayLabel: string;
    subwayBody: string;
    busLabel: string;
    busBody: string;
    parkingLabel: string;
    parkingBody: string;
    parkingNotice: string;
  };
  ending: {
    ariaLabel: string;
    label: string;
    title: readonly [string, string];
    familyNames: string;
  };
};

export type InvitationContent = Omit<
  InvitationCopy,
  "storyVideos" | "galleryMemories" | "ending"
> & {
  storyVideos: StoryVideo[];
  galleryMemories: GalleryMemory[];
  ending: EndingVideo;
};

type StoryVideoAsset = Pick<
  StoryVideo,
  "id" | "src" | "durationSeconds" | "poster" | "detail"
> & {
  labelWindows?: readonly Omit<StoryVideoLabel, "text">[];
};

const storyVideoAssets: Six<StoryVideoAsset> = [
  {
    id: "vancouver",
    src: "/videos/001-scroll.mp4?v=20260812-hq",
    durationSeconds: 6.583333,
    poster: "/images/video-posters/001.webp",
    detail: "2026 · 11 · 01",
  },
  {
    id: "first-date",
    src: "/videos/002-scroll.mp4?v=20260812-hq",
    durationSeconds: 6.583333,
    poster: "/images/video-posters/002.webp",
    detail: "2022 · 10 · 08",
  },
  {
    id: "home-and-cookie",
    src: "/videos/003-scroll.mp4?v=20260812-hq",
    durationSeconds: 8,
    poster: "/images/video-posters/003.webp",
    labelWindows: [
      {
        id: "moving-in",
        date: "2023.03.04",
        start: 0.04,
        end: 0.38,
        placement: "top-left",
      },
      {
        id: "cookie-adoption",
        date: "2023.04.06",
        start: 0.28,
        end: 0.72,
        placement: "bottom-left",
      },
    ],
  },
  {
    id: "ring-exchange",
    src: "/videos/004-scroll.mp4?v=20260812-hq",
    durationSeconds: 10.125,
    poster: "/images/video-posters/004.webp",
    labelWindows: [
      {
        id: "proposal",
        date: "2024.10.08",
        start: 0.32,
        end: 0.76,
        placement: "top-left",
      },
    ],
  },
  {
    id: "canada-wedding",
    src: "/videos/005-scroll.mp4?v=20260812-hq",
    durationSeconds: 8.875,
    poster: "/images/video-posters/005.webp",
    labelWindows: [
      {
        id: "canada-wedding",
        date: "2025.05.05",
        start: 0.2,
        end: 0.78,
        placement: "bottom-right",
      },
    ],
  },
  {
    id: "youngjoon-birth",
    src: "/videos/006.mp4?v=20260812-hq",
    durationSeconds: 9.416667,
    poster: "/images/video-posters/006.webp?v=20260813-first-frame",
    labelWindows: [
      {
        id: "youngjoon-birth",
        date: "2026.07.10 4:58",
        start: 0.18,
        end: 0.82,
        placement: "top-left",
      },
    ],
  },
];

const endingVideoAsset = {
  src: "/videos/007-scroll.mp4?v=20260813-hq",
  poster: "/images/video-posters/007.webp?v=20260813",
  durationSeconds: 8,
} as const;

const galleryAssets: readonly Pick<
  GalleryMemory,
  "year" | "kicker" | "image" | "className"
>[] = [
  {
    year: "NANAIMO",
    kicker: "Chapter 01",
    image: "/images/gallery/gallery-01.jpg",
    className: "memory--wide",
  },
  {
    year: "CHERRY BLOSSOMS",
    kicker: "Chapter 02",
    image: "/images/gallery/gallery-02.jpg",
    className: "memory--portrait",
  },
  {
    year: "SQUAMISH",
    kicker: "Chapter 03",
    image: "/images/gallery/gallery-03.jpg",
    className: "memory--wide",
  },
  {
    year: "COOKIE",
    kicker: "Chapter 04",
    image: "/images/gallery/gallery-04.jpg",
    className: "memory--wide",
  },
  {
    year: "JAPAN",
    kicker: "Chapter 05",
    image: "/images/gallery/gallery-05.jpg",
    className: "memory--wide",
  },
  {
    year: "JAPAN",
    kicker: "Chapter 06",
    image: "/images/gallery/gallery-06.jpg",
    className: "memory--portrait",
  },
  {
    year: "JAPAN",
    kicker: "Chapter 07",
    image: "/images/gallery/gallery-07.jpg",
    className: "memory--wide",
  },
  {
    year: "JEJU",
    kicker: "Chapter 08",
    image: "/images/gallery/gallery-08.jpg",
    className: "memory--wide",
  },
  {
    year: "BUSAN",
    kicker: "Chapter 09",
    image: "/images/gallery/gallery-09.jpg",
    className: "memory--wide",
  },
  {
    year: "JEONJU",
    kicker: "Chapter 10",
    image: "/images/gallery/gallery-10.jpg",
    className: "memory--portrait",
  },
  {
    year: "BANFF",
    kicker: "Chapter 11",
    image: "/images/gallery/gallery-11.jpg",
    className: "memory--wide",
  },
  {
    year: "THE PROPOSAL",
    kicker: "Chapter 12",
    image: "/images/gallery/gallery-12.jpg",
    className: "memory--wide",
  },
  {
    year: "CANADA WEDDING",
    kicker: "Chapter 13",
    image: "/images/gallery/gallery-13.jpg",
    className: "memory--wide",
  },
  {
    year: "CANADA WEDDING",
    kicker: "Chapter 14",
    image: "/images/gallery/gallery-14.jpg",
    className: "memory--wide",
  },
  {
    year: "JEJU",
    kicker: "Chapter 15",
    image: "/images/gallery/gallery-15.jpg",
    className: "memory--portrait",
  },
  {
    year: "JAPAN",
    kicker: "Chapter 16",
    image: "/images/gallery/gallery-16.jpg",
    className: "memory--portrait",
  },
  {
    year: "HELLO, BABY",
    kicker: "Chapter 17",
    image: "/images/gallery/gallery-17.jpg",
    className: "memory--wide",
  },
  {
    year: "WAITING FOR YOU",
    kicker: "Chapter 18",
    image: "/images/gallery/gallery-18.jpg",
    className: "memory--portrait",
  },
  {
    year: "WELCOME, YOUNGJOON",
    kicker: "Chapter 19",
    image: "/images/gallery/gallery-19.jpg",
    className: "memory--portrait",
  },
  {
    year: "ONE MONTH",
    kicker: "Chapter 20",
    image: "/images/gallery/gallery-20.jpg?v=20260813",
    className: "memory--portrait memory--final",
  },
];

const NAVER_MAP_ICON_SRC =
  "https://play-lh.googleusercontent.com/FZCOcEqapjBkvBmv2RkIMlJ1mteGJh8eq4239jAm-4QgpzvCa9sBj4msNlUBsWvf3hX69-fJoTnFZR2pFdZdwxY=w160-h160";
const KAKAO_MAP_ICON_SRC =
  "https://play-lh.googleusercontent.com/X_lsQWulxVVAZlmOHW3NiffVwXh7yNVUQrAMv_mk1k6IBN5lYynxKGH4urz-DeOHQQnOlEID9NJg0fBCP7uqww=w160-h160";
const GOOGLE_MAPS_ICON_SRC =
  "https://play-lh.googleusercontent.com/B8pdO_2K5nBsF0g1h6dKwV_jQFLP-XombGDEQGtJT-mw1EUKCKJpa9lBGCF4rP_MwCsozSXyvI3z19g9R3J4=w160-h160";

const localizedCopy = {
  ko: {
    storyVideos: [
      {
        ariaLabel: "밴쿠버에서 시작된 두 사람의 이야기 영상",
        eyebrow: "Our story · Vancouver to Seoul",
        title: ["Sang Ho", "&", "Steph"],
      },
      {
        ariaLabel: "두 사람의 첫 데이트 이야기 영상",
        eyebrow: "",
        title: ["첫 데이트"],
      },
      {
        ariaLabel: "두 사람이 함께 살기 시작하고 쿠키를 가족으로 맞이하는 이야기 영상",
        eyebrow: "",
        title: [],
        labels: ["함께 하기 시작한 날", "쿠키가 가족이 된 날"],
      },
      {
        ariaLabel: "두 사람이 서로에게 반지를 건네는 이야기 영상",
        eyebrow: "",
        title: [],
        labels: ["프러포즈"],
      },
      {
        ariaLabel: "두 사람의 캐나다 결혼식 이야기 영상",
        eyebrow: "",
        title: [],
        labels: ["캐나다 결혼"],
      },
      {
        ariaLabel: "영준이가 태어난 날의 가족 이야기 영상",
        eyebrow: "",
        title: [],
        labels: ["영준이 출산"],
      },
    ],
    gallery: {
      ariaLabel: "두 사람과 가족의 사진 갤러리",
      heading: "OUR GALLERY",
      hint: "스크롤로 사진을 넘겨보세요",
      autoScrollHint: "상하로 스크롤해 주세요",
      openPhotoLabel: "사진 크게 보기",
      closePhotoLabel: "확대 사진 닫기",
      lightboxLabel: "확대 사진",
    },
    galleryPrelude: {
      ariaLabel: "사진으로 이어지는 두 사람과 가족의 이야기",
      eyebrow: "OUR MOMENTS",
      title: ["서로 다른 두 사람이", "한 가족이 되기까지"],
      body: "함께 쌓아온 소중한 순간들을 사진에 담았습니다.",
    },
    openingVideo: {
      eyebrow: "VANCOUVER",
      title: "우리의 이야기가 시작되는 곳",
      scrollGuide: "아래로 천천히 스크롤하면 영상이 재생됩니다.",
    },
    galleryMemories: [
      {
        title: ["나나이모 여행"],
        alt: "나나이모 여행에서 함께 찍은 두 사람",
      },
      {
        title: ["첫 벚꽃 나들이"],
        alt: "벚꽃 아래에서 함께 찍은 두 사람",
      },
      {
        title: ["스쿼미시 여행"],
        alt: "스쿼미시 여행에서 호수를 배경으로 찍은 두 사람",
      },
      {
        title: ["쿠키와 함께"],
        alt: "반려묘 쿠키와 함께 누워 있는 두 사람",
      },
      {
        title: ["우리의 첫 일본 여행"],
        alt: "첫 일본 여행에서 함께 찍은 두 사람",
      },
      {
        title: ["우리의 첫 일본 여행"],
        alt: "첫 일본 여행 중 전시 공간에서 포즈를 취한 두 사람",
      },
      {
        title: ["우리의 첫 일본 여행"],
        alt: "첫 일본 여행에서 가족과 함께한 두 사람",
      },
      {
        title: ["제주 여행"],
        alt: "제주 바다의 노을 앞에서 손으로 하트를 만든 두 사람",
      },
      {
        title: ["부산 여행"],
        alt: "부산 바닷가에서 함께 찍은 두 사람",
      },
      {
        title: ["전주 여행"],
        alt: "전주 여행에서 한복을 입고 찍은 두 사람",
      },
      {
        title: ["밴프 여행"],
        alt: "밴프의 호수와 산을 배경으로 찍은 두 사람",
      },
      {
        title: ["프러포즈"],
        alt: "프러포즈 날 식탁에 마주 앉은 두 사람",
      },
      {
        title: ["캐나다 결혼식"],
        alt: "캐나다 결혼식에서 가족과 친구들과 함께 찍은 단체 사진",
      },
      {
        title: ["서로의 가족이 된 날"],
        alt: "캐나다 결혼식에서 서로를 안고 있는 두 사람",
      },
      {
        title: ["다시 찾은 제주"],
        alt: "제주의 숲에서 함께 찍은 두 사람",
      },
      {
        title: ["함께한 일본 여행"],
        alt: "일본 여행 중 꽃이 핀 정원에서 함께 찍은 두 사람",
      },
      {
        title: ["우리 아이의 첫 소식"],
        alt: "처음 만난 아기의 초음파 사진",
      },
      {
        title: ["영준이를 기다리며"],
        alt: "출산을 앞두고 촬영한 두 사람의 실루엣",
      },
      {
        title: ["영준이가 태어난 날"],
        alt: "병원에서 갓 태어난 영준이를 안고 있는 아빠",
      },
      {
        title: ["영준이의 첫 달"],
        alt: "영준이의 첫 달을 함께 기념하는 세 사람과 쿠키",
      },
    ],
    door: {
      ariaLabel: "전통 창호문을 열고 이야기 안으로 들어가기",
      coupleNames: "상호 · 스테프",
      invitationLines: [
        "저희 두 사람의 혼례에",
        "귀한 걸음 해주세요",
      ],
      personalizedInvitationLines: (recipientName) => [
        `${recipientName}님을`,
        "저희 두 사람의 혼례에",
        "정중히 초대합니다",
      ],
      invitationDate: "2026년 11월 1일",
      readyAriaLabel: "준비가 완료되었습니다. 아래로 스크롤하여 문을 열어주세요.",
      loadingAriaLabel: (progress) =>
        `청첩장을 준비하고 있습니다. ${progress}퍼센트`,
      readyPrompt: "아래로 내려 문을 열어주세요",
      readyPromptEyebrow: "SCROLL TO OPEN",
      autoReadyAriaLabel: "준비가 완료되어 이야기가 자동으로 시작됩니다.",
      autoReadyPrompt: "잠시 후 이야기가 자동으로 시작됩니다",
      autoReadyPromptEyebrow: "AUTO PLAY",
      loadingPrompt: "이야기를 준비하고 있습니다",
    },
    transition: {
      sectionLabel: "02 · INVITATION",
      title: [
        "이제 한국의 소중한 분들 앞에서",
        "우리의 다음 장면을 이어가려 합니다.",
      ],
      body: [
        "함께 자리하시어 새로운 시작을",
        "따뜻한 마음으로 축복해 주세요.",
      ],
      personalizedGreeting: (name) => `${name}님께`,
    },
    linkBuilder: {
      eyebrow: "PRIVATE INVITATION LINK",
      title: "맞춤 초대 링크 만들기",
      description: "초대받는 분의 이름을 입력하면 짧은 맞춤 초대 링크를 만듭니다. 문구를 비워 두면 기본 문구가 사용됩니다.",
      accessCodeLabel: "관리자 접근 코드",
      accessCodePlaceholder: "초대 생성용 접근 코드를 입력해 주세요",
      nameLabel: "초대받는 분",
      namePlaceholder: "예: 김하객",
      messageLabel: "초대 문구 (선택)",
      messagePlaceholder: "함께 자리해 주시면 더없이 기쁘겠습니다.",
      defaultMessage: "함께 자리해 주시면 더없이 기쁘겠습니다.",
      autoModeLabel: "자동 재생 링크로 만들기",
      autoModeDescription: "전통문부터 갤러리 첫 사진까지 자동으로 진행됩니다.",
      privacyNote: "이름과 문구는 비공개 초대 목록에 저장되며 URL에는 짧은 초대 ID만 표시됩니다. 링크는 초대할 분에게만 전달해 주세요.",
      generateAction: "초대 링크 생성",
      generatingAction: "링크를 만들고 있습니다",
      resultLabel: "생성된 초대 링크",
      copyAction: "링크 복사",
      copiedAction: "복사 완료",
      validationError: "초대받는 분의 이름을 입력해 주세요.",
      accessError: "관리자 접근 코드가 올바르지 않습니다.",
      requestError: "링크를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.",
    },
    ceremony: {
      label: "예식 안내",
      month: "11월",
      weekday: "일요일",
      day: "1",
      year: "2026년",
      venue: "롯데월드 민속박물관 전통혼례장",
      dateTime: "2026년 11월 1일 일요일 · 오후 3시",
      address: "서울 송파구 올림픽로 240 (잠실동 40-1)",
      calendarAction: "달력에 저장",
      calendarEvent: {
        title: "상호 · 스테프 결혼식",
        description: "저희 두 사람의 혼례에 귀한 걸음 해주세요.",
      },
      mapAction: "지도 보기",
      mapDialog: {
        ariaLabel: "지도 앱 선택",
        title: "어떤 지도로 열까요?",
        description: "편한 지도 앱을 선택해 주세요.",
        closeLabel: "지도 선택 닫기",
        venue: "롯데월드 민속박물관 전통혼례장",
        address: "서울 송파구 올림픽로 240 (잠실동 40-1)",
        options: [
          {
            label: "네이버지도",
            url: "https://naver.me/Gxkehh7q",
            iconSrc: NAVER_MAP_ICON_SRC,
          },
          {
            label: "카카오맵",
            url: "https://place.map.kakao.com/1687324400",
            iconSrc: KAKAO_MAP_ICON_SRC,
          },
          {
            label: "구글 지도",
            url: "https://maps.app.goo.gl/KLohU1Q2w2ok1Lp8A",
            iconSrc: GOOGLE_MAPS_ICON_SRC,
          },
        ],
      },
    },
    details: {
      locationLabel: "LOCATION",
      locationTitle: "오시는 길",
      venue: "롯데월드 민속박물관 전통혼례장",
      phoneLabel: "전화",
      phone: "02-411-3703",
      addressLabel: "주소",
      address: "서울 송파구 올림픽로 240 (잠실동 40-1)",
      subwayLabel: "지하철",
      subwayBody: "2호선·8호선 잠실역 4번 출구 → 롯데월드 정문 → 전용 엘리베이터 3층",
      busLabel: "버스",
      busBody: "잠실역 롯데월드 정류장 하차 → 롯데월드 정문 → 전용 엘리베이터 3층",
      parkingLabel: "무료 주차",
      parkingBody: "하객은 2시간 무료주차 · 롯데월드 단지 전체 주차장 이용 가능",
      parkingNotice: "롯데월드타워 전망대(서울스카이) 주차장은 이용 불가",
    },
    ending: {
      ariaLabel: "한복을 입은 가족과 쿠키가 전하는 마지막 감사 인사 영상",
      label: "THANK YOU",
      title: ["우리의 이야기를", "함께해 주셔서 감사합니다."],
      familyNames: "Sang Ho · Steph · Youngjoon",
    },
  },
  ja: {
    storyVideos: [
      {
        ariaLabel: "バンクーバーから始まった二人の物語の映像",
        eyebrow: "Our story · Vancouver to Seoul",
        title: ["Sang Ho", "&", "Steph"],
      },
      {
        ariaLabel: "二人の初めてのデートの物語の映像",
        eyebrow: "",
        title: ["初めてのデート"],
      },
      {
        ariaLabel: "二人が一緒に暮らし始め、クッキーを家族に迎える物語の映像",
        eyebrow: "",
        title: [],
        labels: ["二人で歩み始めた日", "クッキーを家族に迎えた日"],
      },
      {
        ariaLabel: "二人がお互いに指輪を贈る物語の映像",
        eyebrow: "",
        title: [],
        labels: ["プロポーズ"],
      },
      {
        ariaLabel: "二人のカナダでの結婚式の映像",
        eyebrow: "",
        title: [],
        labels: ["カナダでの結婚式"],
      },
      {
        ariaLabel: "ヨンジュンが生まれた日の家族の映像",
        eyebrow: "",
        title: [],
        labels: ["ヨンジュンの誕生"],
      },
    ],
    gallery: {
      ariaLabel: "二人と家族のフォトギャラリー",
      heading: "OUR GALLERY",
      hint: "スクロールして写真をご覧ください",
      autoScrollHint: "上下にスクロールしてください",
      openPhotoLabel: "写真を拡大表示",
      closePhotoLabel: "拡大写真を閉じる",
      lightboxLabel: "拡大写真",
    },
    galleryPrelude: {
      ariaLabel: "写真で続く二人と家族の物語",
      eyebrow: "OUR MOMENTS",
      title: ["別々だった二人が", "ひとつの家族になるまで"],
      body: "共に重ねてきた大切な瞬間を写真に残しました。",
    },
    openingVideo: {
      eyebrow: "VANCOUVER",
      title: "私たちの物語が始まる場所",
      scrollGuide: "下へゆっくりスクロールすると映像が再生されます。",
    },
    galleryMemories: [
      {
        title: ["ナナイモへの旅"],
        alt: "ナナイモへの旅で撮った二人の写真",
      },
      {
        title: ["初めてのお花見"],
        alt: "桜の下で撮った二人の写真",
      },
      {
        title: ["スコーミッシュへの旅"],
        alt: "スコーミッシュの湖を背景に撮った二人の写真",
      },
      {
        title: ["クッキーと一緒に"],
        alt: "愛猫クッキーと一緒に横になる二人",
      },
      {
        title: ["初めての日本旅行"],
        alt: "初めての日本旅行で撮った二人の写真",
      },
      {
        title: ["初めての日本旅行"],
        alt: "日本旅行中の展示スペースでポーズを取る二人",
      },
      {
        title: ["初めての日本旅行"],
        alt: "初めての日本旅行で家族と一緒に過ごす二人",
      },
      {
        title: ["済州島への旅"],
        alt: "済州島の夕日を前に手でハートを作る二人",
      },
      {
        title: ["釜山への旅"],
        alt: "釜山の海辺で撮った二人の写真",
      },
      {
        title: ["全州への旅"],
        alt: "全州で韓服を着て撮った二人の写真",
      },
      {
        title: ["バンフへの旅"],
        alt: "バンフの湖と山を背景に撮った二人の写真",
      },
      {
        title: ["プロポーズ"],
        alt: "プロポーズの日にテーブルを挟んで座る二人",
      },
      {
        title: ["カナダでの結婚式"],
        alt: "カナダでの結婚式で家族や友人と撮った集合写真",
      },
      {
        title: ["家族になった日"],
        alt: "カナダでの結婚式で抱き合う二人",
      },
      {
        title: ["再び訪れた済州島"],
        alt: "済州島の森で撮った二人の写真",
      },
      {
        title: ["二人で訪れた日本"],
        alt: "日本の花咲く庭園で撮った二人の写真",
      },
      {
        title: ["赤ちゃんからの最初の知らせ"],
        alt: "初めて見た赤ちゃんのエコー写真",
      },
      {
        title: ["ヨンジュンを待ちながら"],
        alt: "出産を前に撮影した二人のシルエット",
      },
      {
        title: ["ヨンジュンが生まれた日"],
        alt: "病院で生まれたばかりのヨンジュンを抱く父親",
      },
      {
        title: ["ヨンジュンの最初の一か月"],
        alt: "ヨンジュンの生後一か月を祝う三人とクッキー",
      },
    ],
    door: {
      ariaLabel: "韓国の伝統的な扉を開き、物語の中へ進む",
      coupleNames: "Sang Ho · Steph",
      invitationLines: [
        "私たち二人の結婚式へ",
        "ぜひお越しください",
      ],
      personalizedInvitationLines: (recipientName) => [
        `${recipientName}様を`,
        "私たち二人の結婚式へ",
        "心よりご招待いたします",
      ],
      invitationDate: "2026年11月1日",
      readyAriaLabel: "準備ができました。下にスクロールして扉を開いてください。",
      loadingAriaLabel: (progress) =>
        `招待状を準備しています。${progress}パーセント`,
      readyPrompt: "下にスクロールして扉を開いてください",
      readyPromptEyebrow: "SCROLL TO OPEN",
      autoReadyAriaLabel: "準備ができました。物語は自動で始まります。",
      autoReadyPrompt: "まもなく物語が自動で始まります",
      autoReadyPromptEyebrow: "AUTO PLAY",
      loadingPrompt: "物語を準備しています",
    },
    transition: {
      sectionLabel: "02 · INVITATION",
      title: [
        "韓国の大切な皆さまの前で",
        "私たちの次の物語を始めます。",
      ],
      body: [
        "新しい門出を共に見守り",
        "温かい祝福をいただければ幸いです。",
      ],
      personalizedGreeting: (name) => `${name} 様へ`,
    },
    linkBuilder: {
      eyebrow: "PRIVATE INVITATION LINK",
      title: "個別招待リンクを作成",
      description: "お名前を入力すると、短い個別招待リンクを作成します。メッセージを空欄にすると既定の文面を使用します。",
      accessCodeLabel: "管理者アクセスコード",
      accessCodePlaceholder: "招待作成用のアクセスコードを入力してください",
      nameLabel: "ご招待する方",
      namePlaceholder: "例：山田 花子",
      messageLabel: "招待メッセージ（任意）",
      messagePlaceholder: "ご一緒いただけましたら幸いです。",
      defaultMessage: "ご一緒いただけましたら幸いです。",
      autoModeLabel: "自動再生リンクにする",
      autoModeDescription: "伝統門からギャラリーの最初の写真まで自動で進みます。",
      privacyNote: "お名前とメッセージは非公開の招待リストに保存され、URLには短い招待IDのみが表示されます。リンクはご本人だけにお送りください。",
      generateAction: "招待リンクを作成",
      generatingAction: "リンクを作成しています",
      resultLabel: "作成された招待リンク",
      copyAction: "リンクをコピー",
      copiedAction: "コピーしました",
      validationError: "ご招待する方のお名前を入力してください。",
      accessError: "管理者アクセスコードが正しくありません。",
      requestError: "リンクを作成できませんでした。しばらくしてからお試しください。",
    },
    ceremony: {
      label: "THE CEREMONY",
      month: "NOVEMBER",
      weekday: "SUN",
      day: "01",
      year: "2026",
      venue: "ロッテワールド民俗博物館 伝統婚礼場",
      dateTime: "2026年11月1日（日）· 午後3時",
      address: "韓国 ソウル市 松坡区 オリンピック路240（蚕室洞40-1）",
      calendarAction: "カレンダーに保存",
      calendarEvent: {
        title: "サンホ · ステフ 結婚式",
        description: "私たち二人の結婚式へ、ぜひお越しください。",
      },
      mapAction: "地図を見る",
      mapDialog: {
        ariaLabel: "地図アプリを選択",
        title: "地図アプリを選択してください",
        description: "使いやすい地図アプリで会場をご確認ください。",
        closeLabel: "地図選択を閉じる",
        venue: "ロッテワールド民俗博物館 伝統婚礼場",
        address: "韓国 ソウル市 松坡区 オリンピック路240（蚕室洞40-1）",
        options: [
          {
            label: "NAVERマップ",
            url: "https://naver.me/Gxkehh7q",
            iconSrc: NAVER_MAP_ICON_SRC,
          },
          {
            label: "カカオマップ",
            url: "https://place.map.kakao.com/1687324400",
            iconSrc: KAKAO_MAP_ICON_SRC,
          },
          {
            label: "Google マップ",
            url: "https://maps.app.goo.gl/KLohU1Q2w2ok1Lp8A",
            iconSrc: GOOGLE_MAPS_ICON_SRC,
          },
        ],
      },
    },
    details: {
      locationLabel: "LOCATION",
      locationTitle: "アクセス",
      venue: "ロッテワールド民俗博物館 伝統婚礼場",
      phoneLabel: "電話",
      phone: "02-411-3703",
      addressLabel: "住所",
      address: "韓国 ソウル市 松坡区 オリンピック路240（蚕室洞40-1）",
      subwayLabel: "地下鉄",
      subwayBody: "2号線・8号線 蚕室駅4番出口 → ロッテワールド正門 → 専用エレベーター3階",
      busLabel: "バス",
      busBody: "蚕室駅ロッテワールド停留所 → ロッテワールド正門 → 専用エレベーター3階",
      parkingLabel: "無料駐車",
      parkingBody: "ご参列者は2時間無料 · ロッテワールド敷地内の駐車場を利用可能",
      parkingNotice: "ロッテワールドタワー展望台（ソウルスカイ）駐車場は利用不可",
    },
    ending: {
      ariaLabel: "韓服姿の家族とクッキーが感謝を伝える最後の映像",
      label: "THANK YOU",
      title: ["私たちの物語を", "見守ってくださりありがとうございます。"],
      familyNames: "Sang Ho · Steph · Youngjoon",
    },
  },
  en: {
    storyVideos: [
      {
        ariaLabel: "The story of two people whose journey began in Vancouver",
        eyebrow: "Our story · Vancouver to Seoul",
        title: ["Sang Ho", "&", "Steph"],
      },
      {
        ariaLabel: "The story of our first date",
        eyebrow: "",
        title: ["Our first date"],
      },
      {
        ariaLabel: "The story of moving in together and welcoming Cookie into our family",
        eyebrow: "",
        title: [],
        labels: ["The day we began our life together", "The day Cookie joined our family"],
      },
      {
        ariaLabel: "The story of exchanging rings with each other",
        eyebrow: "",
        title: [],
        labels: ["The proposal"],
      },
      {
        ariaLabel: "The story of our wedding in Canada",
        eyebrow: "",
        title: [],
        labels: ["Our Canadian wedding"],
      },
      {
        ariaLabel: "Our family story from the day Youngjoon was born",
        eyebrow: "",
        title: [],
        labels: ["Youngjoon's birth"],
      },
    ],
    gallery: {
      ariaLabel: "A photo gallery of the couple and their family",
      heading: "OUR GALLERY",
      hint: "Scroll to explore our photos",
      autoScrollHint: "Scroll up or down",
      openPhotoLabel: "Open photo",
      closePhotoLabel: "Close enlarged photo",
      lightboxLabel: "Enlarged photo",
    },
    galleryPrelude: {
      ariaLabel: "The family story continues through photographs",
      eyebrow: "OUR MOMENTS",
      title: ["From separate lives", "to one family"],
      body: "A few treasured moments from the life we have built together.",
    },
    openingVideo: {
      eyebrow: "VANCOUVER",
      title: "Where our story begins",
      scrollGuide: "Scroll down slowly to play the video.",
    },
    galleryMemories: [
      {
        title: ["A trip to Nanaimo"],
        alt: "The couple taking a photo together on their Nanaimo trip",
      },
      {
        title: ["Our first cherry blossoms"],
        alt: "The couple taking a photo beneath cherry blossoms",
      },
      {
        title: ["A trip to Squamish"],
        alt: "The couple posing beside a lake in Squamish",
      },
      {
        title: ["Together with Cookie"],
        alt: "The couple lying down with their cat Cookie",
      },
      {
        title: ["Our first trip to Japan"],
        alt: "The couple taking a photo on their first trip to Japan",
      },
      {
        title: ["Our first trip to Japan"],
        alt: "The couple posing in an exhibition space during their first trip to Japan",
      },
      {
        title: ["Our first trip to Japan"],
        alt: "The couple spending time with family on their first trip to Japan",
      },
      {
        title: ["A trip to Jeju"],
        alt: "The couple making a heart with their hands at sunset in Jeju",
      },
      {
        title: ["A trip to Busan"],
        alt: "The couple taking a photo by the sea in Busan",
      },
      {
        title: ["A trip to Jeonju"],
        alt: "The couple wearing hanbok in Jeonju",
      },
      {
        title: ["A trip to Banff"],
        alt: "The couple posing beside a mountain lake in Banff",
      },
      {
        title: ["The proposal"],
        alt: "The couple sitting across from each other on the day of the proposal",
      },
      {
        title: ["Our Canadian wedding"],
        alt: "A group photo with family and friends at the Canadian wedding",
      },
      {
        title: ["The day we became family"],
        alt: "The couple embracing at their Canadian wedding",
      },
      {
        title: ["Back to Jeju"],
        alt: "The couple taking a photo together in a forest in Jeju",
      },
      {
        title: ["Japan, together again"],
        alt: "The couple posing in a flower garden during a trip to Japan",
      },
      {
        title: ["Our first hello"],
        alt: "The baby's first ultrasound image",
      },
      {
        title: ["Waiting for Youngjoon"],
        alt: "The couple's silhouette shortly before the birth",
      },
      {
        title: ["The day Youngjoon arrived"],
        alt: "A father holding newborn Youngjoon at the hospital",
      },
      {
        title: ["Youngjoon's first month"],
        alt: "The family of three and Cookie celebrating Youngjoon's first month",
      },
    ],
    door: {
      ariaLabel: "Open the traditional Korean doors and enter our story",
      coupleNames: "Sang Ho · Steph",
      invitationLines: ["Please join us", "for our wedding"],
      personalizedInvitationLines: (recipientName) => [
        `${recipientName},`,
        "we warmly invite you",
        "to our wedding",
      ],
      invitationDate: "November 1, 2026",
      readyAriaLabel: "The invitation is ready. Scroll down to open the doors.",
      loadingAriaLabel: (progress) =>
        `Preparing the invitation. ${progress} percent`,
      readyPrompt: "Scroll down to open the doors",
      readyPromptEyebrow: "SCROLL TO OPEN",
      autoReadyAriaLabel: "The invitation is ready and the story will begin automatically.",
      autoReadyPrompt: "The story will begin automatically",
      autoReadyPromptEyebrow: "AUTO PLAY",
      loadingPrompt: "Preparing our story",
    },
    transition: {
      sectionLabel: "02 · INVITATION",
      title: [
        "Before our loved ones in Korea,",
        "we begin the next chapter of our story.",
      ],
      body: [
        "Please join us as we begin this new chapter",
        "and celebrate with your warmest wishes.",
      ],
      personalizedGreeting: (name) => `For ${name}`,
    },
    linkBuilder: {
      eyebrow: "PRIVATE INVITATION LINK",
      title: "Create a personal invitation link",
      description: "Enter a guest name to create a short personal invitation link. Leave the message blank to use the default invitation text.",
      accessCodeLabel: "Administrator access code",
      accessCodePlaceholder: "Enter the invitation-builder access code",
      nameLabel: "Guest name",
      namePlaceholder: "Example: Alex Kim",
      messageLabel: "Invitation message (optional)",
      messagePlaceholder: "We would be delighted to celebrate together with you.",
      defaultMessage: "We would be delighted to celebrate together with you.",
      autoModeLabel: "Create an auto-play link",
      autoModeDescription: "The story advances automatically from the traditional doors to the first gallery photo.",
      privacyNote: "The name and message are stored in a private invitation list, while the URL shows only a short invitation ID. Share each link only with its intended guest.",
      generateAction: "Create invitation link",
      generatingAction: "Creating link",
      resultLabel: "Generated invitation link",
      copyAction: "Copy link",
      copiedAction: "Copied",
      validationError: "Enter the guest name.",
      accessError: "The administrator access code is incorrect.",
      requestError: "The link could not be created. Please try again shortly.",
    },
    ceremony: {
      label: "THE CEREMONY",
      month: "NOVEMBER",
      weekday: "SUN",
      day: "01",
      year: "2026",
      venue: "Lotte World Folk Museum Traditional Wedding Hall",
      dateTime: "Sunday, November 1, 2026 · 3:00 PM",
      address: "240 Olympic-ro, Songpa-gu, Seoul (Jamsil-dong 40-1)",
      calendarAction: "Save to calendar",
      calendarEvent: {
        title: "Sang Ho & Steph's Wedding",
        description: "Please join us for our wedding in Seoul.",
      },
      mapAction: "View map",
      mapDialog: {
        ariaLabel: "Choose a map service",
        title: "Choose a map service",
        description: "Open the venue in your preferred Korean map service.",
        closeLabel: "Close map choices",
        venue: "Lotte World Folk Museum Traditional Wedding Hall",
        address: "240 Olympic-ro, Songpa-gu, Seoul (Jamsil-dong 40-1)",
        options: [
          {
            label: "NAVER Map",
            url: "https://naver.me/Gxkehh7q",
            iconSrc: NAVER_MAP_ICON_SRC,
          },
          {
            label: "KakaoMap",
            url: "https://place.map.kakao.com/1687324400",
            iconSrc: KAKAO_MAP_ICON_SRC,
          },
          {
            label: "Google Maps",
            url: "https://maps.app.goo.gl/KLohU1Q2w2ok1Lp8A",
            iconSrc: GOOGLE_MAPS_ICON_SRC,
          },
        ],
      },
    },
    details: {
      locationLabel: "LOCATION",
      locationTitle: "Getting here",
      venue: "Lotte World Folk Museum Traditional Wedding Hall",
      phoneLabel: "Phone",
      phone: "02-411-3703",
      addressLabel: "Address",
      address: "240 Olympic-ro, Songpa-gu, Seoul (Jamsil-dong 40-1)",
      subwayLabel: "Subway",
      subwayBody: "Jamsil Station, Lines 2 and 8 · Exit 4 → Lotte World main gate → dedicated elevator to Level 3",
      busLabel: "Bus",
      busBody: "Get off at Jamsil Station Lotte World → main gate → dedicated elevator to Level 3",
      parkingLabel: "Complimentary parking",
      parkingBody: "Two hours free for wedding guests · all Lotte World complex parking lots are available",
      parkingNotice: "The Seoul Sky observatory parking lot in Lotte World Tower cannot be used",
    },
    ending: {
      ariaLabel: "A final thank-you video from the family in hanbok and Cookie",
      label: "THANK YOU",
      title: ["Thank you for being", "part of our story."],
      familyNames: "Sang Ho · Steph · Youngjoon",
    },
  },
} satisfies Record<InvitationLocale, InvitationCopy>;

const buildContent = (copy: InvitationCopy): InvitationContent => ({
  ...copy,
  ending: {
    ...copy.ending,
    ...endingVideoAsset,
  },
  storyVideos: storyVideoAssets.map((asset, index) => {
    const { labelWindows, ...videoAsset } = asset;
    const { labels: labelCopy, ...videoCopy } = copy.storyVideos[index];
    const labels = labelWindows
      ?.map((window, labelIndex) => ({
        ...window,
        text: labelCopy?.[labelIndex] ?? "",
      }))
      .filter((label) => label.text.length > 0);

    return {
      ...videoAsset,
      ...videoCopy,
      title: [...videoCopy.title],
      ...(labels?.length ? { labels } : {}),
    };
  }),
  galleryMemories: galleryAssets.map((asset, index) => ({
    ...asset,
    ...copy.galleryMemories[index],
    title: [...copy.galleryMemories[index].title],
  })),
});

export const invitationContent: Record<InvitationLocale, InvitationContent> = {
  ko: buildContent(localizedCopy.ko),
  ja: buildContent(localizedCopy.ja),
  en: buildContent(localizedCopy.en),
};

export const getInvitationContent = (locale: InvitationLocale) =>
  invitationContent[locale];
