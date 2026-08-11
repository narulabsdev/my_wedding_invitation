import type { InvitationLocale } from "../lib/locale";

export type StoryVideo = {
  id: string;
  src: string;
  poster?: string;
  ariaLabel: string;
  eyebrow: string;
  title: string[];
  detail?: string;
};

export type GalleryMemory = {
  year: string;
  kicker: string;
  title: string[];
  body: string;
  image?: string;
  alt: string;
  className: string;
};

type StoryVideoText = Pick<StoryVideo, "ariaLabel" | "eyebrow" | "title">;
type GalleryMemoryText = Pick<GalleryMemory, "title" | "body" | "alt">;
type Four<T> = readonly [T, T, T, T];
type Five<T> = readonly [T, T, T, T, T];

type InvitationCopy = {
  storyVideos: Four<StoryVideoText>;
  gallery: {
    ariaLabel: string;
    heading: string;
    hint: string;
    openPhotoLabel: string;
    closePhotoLabel: string;
    lightboxLabel: string;
  };
  openingVideo: {
    eyebrow: string;
    title: string;
  };
  videoSequenceLabel: string;
  galleryMemories: Five<GalleryMemoryText>;
  door: {
    ariaLabel: string;
    coupleNames: string;
    invitationTitle: string;
    invitationDate: string;
    readyAriaLabel: string;
    loadingAriaLabel: (progress: number) => string;
    readyPrompt: string;
    readyPromptEyebrow: string;
    loadingPrompt: string;
  };
  transition: {
    mark: readonly [string, string];
    sectionLabel: string;
    title: readonly [string, string];
    body: readonly [string, string];
  };
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
    mapAction: string;
  };
  details: {
    locationLabel: string;
    locationTitle: string;
    locationBody: readonly [string, string];
    transportAction: string;
    rsvpLabel: string;
    rsvpTitle: string;
    rsvpBody: readonly [string, string];
    rsvpAction: string;
  };
  ending: {
    label: string;
    title: readonly [string, string];
    familyNames: string;
  };
};

export type InvitationContent = Omit<
  InvitationCopy,
  "storyVideos" | "galleryMemories"
> & {
  storyVideos: StoryVideo[];
  galleryMemories: GalleryMemory[];
};

const storyVideoAssets: Four<
  Pick<StoryVideo, "id" | "src" | "poster" | "detail">
> = [
  {
    id: "vancouver",
    src: "/videos/001-scroll.mp4",
    detail: "2026 · 11 · 01",
  },
  {
    id: "first-date",
    src: "/videos/002-scroll.mp4",
    detail: "2022 · 09 · 10",
  },
  {
    id: "canada-wedding",
    src: "/videos/canada-wedding.mp4",
    detail: "05 · 05 · 2025",
  },
  {
    id: "family-home",
    src: "/videos/family-home.mp4",
  },
];

const galleryAssets: Five<
  Pick<GalleryMemory, "year" | "kicker" | "image" | "className">
> = [
  {
    year: "VANCOUVER",
    kicker: "Chapter 01",
    className: "memory--wide",
  },
  {
    year: "OUR DAYS",
    kicker: "Chapter 02",
    className: "memory--portrait memory--soft",
  },
  {
    year: "05 · 05 · 2025",
    kicker: "Chapter 03",
    className: "memory--wide",
  },
  {
    year: "07 · 10 · 2026",
    kicker: "Chapter 04",
    className: "memory--portrait",
  },
  {
    year: "WE BECAME THREE",
    kicker: "Chapter 05",
    className: "memory--final",
  },
];

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
        ariaLabel: "캐나다에서 부부가 된 두 사람의 이야기 영상",
        eyebrow: "We made a promise",
        title: ["서로의 가족이", "된 날"],
      },
      {
        ariaLabel: "세 사람이 가족이 된 이야기 영상",
        eyebrow: "We became a family",
        title: ["두 사람이 만나", "세 사람의 가족이 되었습니다"],
      },
    ],
    gallery: {
      ariaLabel: "두 사람과 가족의 사진 갤러리",
      heading: "OUR GALLERY",
      hint: "스크롤로 사진을 넘겨보세요",
      openPhotoLabel: "사진 크게 보기",
      closePhotoLabel: "확대 사진 닫기",
      lightboxLabel: "확대 사진",
    },
    openingVideo: {
      eyebrow: "VANCOUVER",
      title: "우리의 이야기가 시작되는 곳",
    },
    videoSequenceLabel: "부부에서 세 가족으로 이어지는 이야기 영상",
    galleryMemories: [
      {
        title: ["서로 다른 곳에서", "우리는 만났습니다"],
        body: "낯선 도시에서 시작된 두 사람의 이야기는 천천히 같은 방향을 바라보기 시작했습니다.",
        alt: "밴쿠버 바닷가를 걷는 두 사람",
      },
      {
        title: ["함께한 시간이", "우리의 일상이 되고"],
        body: "계절을 지나고, 여행을 하고, 평범한 하루를 나누며 둘만의 집을 만들어 갔습니다.",
        alt: "밴쿠버에서 함께한 시간",
      },
      {
        title: ["우리는 서로의", "가족이 되었습니다"],
        body: "캐나다에서 작은 약속을 나누고 부부가 되었습니다.",
        alt: "캐나다 결혼식에서 손을 맞잡은 두 사람",
      },
      {
        title: ["그리고 가장 소중한", "선물이 찾아왔습니다"],
        body: "영준이가 태어나고 두 사람의 이야기는 세 사람의 이야기가 되었습니다.",
        alt: "창가에서 아기를 안고 있는 가족",
      },
      {
        title: ["두 사람이 만나", "세 사람의 가족이 되었습니다"],
        body: "이제 한국의 가족과 친구들 앞에서 우리의 다음 장면을 이어가려 합니다.",
        alt: "아기와 함께한 세 사람의 가족",
      },
    ],
    door: {
      ariaLabel: "전통 창호문을 열고 이야기 안으로 들어가기",
      coupleNames: "상호 · 스테프",
      invitationTitle: "혼례에 초대합니다",
      invitationDate: "2026년 11월 1일",
      readyAriaLabel: "준비가 완료되었습니다. 아래로 스크롤하여 문을 열어주세요.",
      loadingAriaLabel: (progress) =>
        `청첩장을 준비하고 있습니다. ${progress}퍼센트`,
      readyPrompt: "아래로 내려 문을 열어주세요",
      readyPromptEyebrow: "SCROLL TO OPEN",
      loadingPrompt: "이야기를 준비하고 있습니다",
    },
    transition: {
      mark: ["상", "스"],
      sectionLabel: "02 · INVITATION",
      title: [
        "이제 한국의 소중한 분들 앞에서",
        "우리의 다음 장면을 이어가려 합니다.",
      ],
      body: [
        "함께 자리하시어 새로운 시작을",
        "따뜻한 마음으로 축복해 주세요.",
      ],
    },
    ceremony: {
      label: "THE CEREMONY",
      month: "NOVEMBER",
      weekday: "SUN",
      day: "01",
      year: "2026",
      venue: "롯데월드 전통혼례장",
      dateTime: "2026년 11월 1일 일요일 · 오후 12시",
      address: "서울특별시 송파구 올림픽로 240",
      calendarAction: "달력에 저장",
      mapAction: "지도 보기",
    },
    details: {
      locationLabel: "LOCATION",
      locationTitle: "오시는 길",
      locationBody: ["지하철 2호선·8호선 잠실역", "롯데월드 전통혼례장"],
      transportAction: "교통 안내 확인",
      rsvpLabel: "RSVP",
      rsvpTitle: "참석 여부",
      rsvpBody: [
        "귀한 걸음 준비에 참고할 수 있도록",
        "참석 여부를 알려주세요.",
      ],
      rsvpAction: "참석 여부 전달",
    },
    ending: {
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
        ariaLabel: "カナダで夫婦になった二人の物語の映像",
        eyebrow: "We made a promise",
        title: ["家族になった", "あの日"],
      },
      {
        ariaLabel: "三人家族になった物語の映像",
        eyebrow: "We became a family",
        title: ["二人が出会い", "三人家族になりました"],
      },
    ],
    gallery: {
      ariaLabel: "二人と家族のフォトギャラリー",
      heading: "OUR GALLERY",
      hint: "スクロールして写真をご覧ください",
      openPhotoLabel: "写真を拡大表示",
      closePhotoLabel: "拡大写真を閉じる",
      lightboxLabel: "拡大写真",
    },
    openingVideo: {
      eyebrow: "VANCOUVER",
      title: "私たちの物語が始まる場所",
    },
    videoSequenceLabel: "二人から三人家族へと続く物語の映像",
    galleryMemories: [
      {
        title: ["違う場所から来た", "私たちは出会いました"],
        body: "見知らぬ街で始まった二人の物語は、少しずつ同じ未来を見つめるようになりました。",
        alt: "バンクーバーの海辺を歩く二人",
      },
      {
        title: ["共に過ごした時間が", "私たちの日常になり"],
        body: "季節を重ね、旅をし、何気ない日々を分かち合いながら、二人の居場所を築いてきました。",
        alt: "バンクーバーで共に過ごした時間",
      },
      {
        title: ["私たちはお互いの", "家族になりました"],
        body: "カナダで小さな誓いを交わし、夫婦になりました。",
        alt: "カナダでの結婚式で手を取り合う二人",
      },
      {
        title: ["そして、かけがえのない", "贈り物が届きました"],
        body: "ヨンジュンが生まれ、二人の物語は三人の物語になりました。",
        alt: "窓辺で赤ちゃんを抱く家族",
      },
      {
        title: ["二人が出会い", "三人家族になりました"],
        body: "今、韓国の家族と友人の前で、私たちの次の物語を始めます。",
        alt: "赤ちゃんと一緒に写る三人家族",
      },
    ],
    door: {
      ariaLabel: "韓国の伝統的な扉を開き、物語の中へ進む",
      coupleNames: "Sang Ho · Steph",
      invitationTitle: "私たちの結婚式へご招待します",
      invitationDate: "2026年11月1日",
      readyAriaLabel: "準備ができました。下にスクロールして扉を開いてください。",
      loadingAriaLabel: (progress) =>
        `招待状を準備しています。${progress}パーセント`,
      readyPrompt: "下にスクロールして扉を開いてください",
      readyPromptEyebrow: "SCROLL TO OPEN",
      loadingPrompt: "物語を準備しています",
    },
    transition: {
      mark: ["サ", "ス"],
      sectionLabel: "02 · INVITATION",
      title: [
        "韓国の大切な皆さまの前で",
        "私たちの次の物語を始めます。",
      ],
      body: [
        "新しい門出を共に見守り",
        "温かい祝福をいただければ幸いです。",
      ],
    },
    ceremony: {
      label: "THE CEREMONY",
      month: "NOVEMBER",
      weekday: "SUN",
      day: "01",
      year: "2026",
      venue: "ロッテワールド伝統婚礼場",
      dateTime: "2026年11月1日（日）· 正午12時",
      address: "韓国 ソウル特別市 松坡区 オリンピック路240",
      calendarAction: "カレンダーに保存",
      mapAction: "地図を見る",
    },
    details: {
      locationLabel: "LOCATION",
      locationTitle: "アクセス",
      locationBody: [
        "地下鉄2号線・8号線 チャムシル駅",
        "ロッテワールド伝統婚礼場",
      ],
      transportAction: "交通案内を見る",
      rsvpLabel: "RSVP",
      rsvpTitle: "出欠のご連絡",
      rsvpBody: [
        "当日の準備の参考にさせていただくため",
        "ご出欠をお知らせください。",
      ],
      rsvpAction: "出欠を連絡する",
    },
    ending: {
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
        ariaLabel: "The story of the day we became a married couple in Canada",
        eyebrow: "We made a promise",
        title: ["The day we", "became family"],
      },
      {
        ariaLabel: "The story of how we became a family of three",
        eyebrow: "We became a family",
        title: ["Two became", "a family of three"],
      },
    ],
    gallery: {
      ariaLabel: "A photo gallery of the couple and their family",
      heading: "OUR GALLERY",
      hint: "Scroll to explore our photos",
      openPhotoLabel: "Open photo",
      closePhotoLabel: "Close enlarged photo",
      lightboxLabel: "Enlarged photo",
    },
    openingVideo: {
      eyebrow: "VANCOUVER",
      title: "Where our story begins",
    },
    videoSequenceLabel: "Our journey from a couple to a family of three",
    galleryMemories: [
      {
        title: ["From different places,", "we found each other"],
        body: "Our story began in an unfamiliar city, where we slowly started looking toward the same future.",
        alt: "The couple walking along the Vancouver waterfront",
      },
      {
        title: ["Time together became", "our everyday life"],
        body: "Through seasons, travels, and ordinary days, we built a home of our own.",
        alt: "Time spent together in Vancouver",
      },
      {
        title: ["We became", "each other's family"],
        body: "We exchanged a quiet promise in Canada and became a married couple.",
        alt: "The couple holding hands at their wedding in Canada",
      },
      {
        title: ["Then our most precious", "gift arrived"],
        body: "Youngjoon was born, and our story of two became a story of three.",
        alt: "The family holding their baby by a window",
      },
      {
        title: ["Two found each other", "and became a family of three"],
        body: "Now, before our family and friends in Korea, we begin our next chapter.",
        alt: "The family of three with their baby",
      },
    ],
    door: {
      ariaLabel: "Open the traditional Korean doors and enter our story",
      coupleNames: "Sang Ho · Steph",
      invitationTitle: "You're invited to our wedding",
      invitationDate: "November 1, 2026",
      readyAriaLabel: "The invitation is ready. Scroll down to open the doors.",
      loadingAriaLabel: (progress) =>
        `Preparing the invitation. ${progress} percent`,
      readyPrompt: "Scroll down to open the doors",
      readyPromptEyebrow: "SCROLL TO OPEN",
      loadingPrompt: "Preparing our story",
    },
    transition: {
      mark: ["S", "S"],
      sectionLabel: "02 · INVITATION",
      title: [
        "Before our loved ones in Korea,",
        "we begin the next chapter of our story.",
      ],
      body: [
        "Please join us as we begin this new chapter",
        "and celebrate with your warmest wishes.",
      ],
    },
    ceremony: {
      label: "THE CEREMONY",
      month: "NOVEMBER",
      weekday: "SUN",
      day: "01",
      year: "2026",
      venue: "Lotte World Traditional Wedding Hall",
      dateTime: "Sunday, November 1, 2026 · 12:00 PM",
      address: "240 Olympic-ro, Songpa-gu, Seoul, South Korea",
      calendarAction: "Save to calendar",
      mapAction: "View map",
    },
    details: {
      locationLabel: "LOCATION",
      locationTitle: "Getting here",
      locationBody: [
        "Jamsil Station · Subway Lines 2 and 8",
        "Lotte World Traditional Wedding Hall",
      ],
      transportAction: "View travel information",
      rsvpLabel: "RSVP",
      rsvpTitle: "Will you join us?",
      rsvpBody: [
        "To help us prepare for your visit,",
        "please let us know if you can attend.",
      ],
      rsvpAction: "Send RSVP",
    },
    ending: {
      label: "THANK YOU",
      title: ["Thank you for being", "part of our story."],
      familyNames: "Sang Ho · Steph · Youngjoon",
    },
  },
} satisfies Record<InvitationLocale, InvitationCopy>;

const buildContent = (copy: InvitationCopy): InvitationContent => ({
  ...copy,
  storyVideos: storyVideoAssets.map((asset, index) => ({
    ...asset,
    ...copy.storyVideos[index],
    title: [...copy.storyVideos[index].title],
  })),
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
