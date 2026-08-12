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
  body?: string;
  image?: string;
  alt: string;
  className: string;
};

type StoryVideoText = Pick<StoryVideo, "ariaLabel" | "eyebrow" | "title">;
type GalleryMemoryText = Pick<GalleryMemory, "title" | "body" | "alt">;
type Two<T> = readonly [T, T];

type InvitationCopy = {
  storyVideos: Two<StoryVideoText>;
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
  galleryMemories: readonly GalleryMemoryText[];
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

const storyVideoAssets: Two<
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
];

const galleryAssets: readonly Pick<
  GalleryMemory,
  "year" | "kicker" | "image" | "className"
>[] = [
  {
    year: "NANAIMO",
    kicker: "Chapter 01",
    image: "/images/gallery/001_나나이모여행.jpg",
    className: "memory--wide",
  },
  {
    year: "CHERRY BLOSSOMS",
    kicker: "Chapter 02",
    image: "/images/gallery/002_첫벚꽃나드리.jpg",
    className: "memory--portrait",
  },
  {
    year: "SQUAMISH",
    kicker: "Chapter 03",
    image: "/images/gallery/003_스쿼미시여행.jpg",
    className: "memory--wide",
  },
  {
    year: "COOKIE",
    kicker: "Chapter 04",
    image: "/images/gallery/004_쿠키와같이.jpg",
    className: "memory--wide",
  },
  {
    year: "JAPAN",
    kicker: "Chapter 05",
    image: "/images/gallery/005_첫일본여행.jpg",
    className: "memory--wide",
  },
  {
    year: "JAPAN",
    kicker: "Chapter 06",
    image: "/images/gallery/005_첫일본여행_02.jpg",
    className: "memory--portrait",
  },
  {
    year: "JAPAN",
    kicker: "Chapter 07",
    image: "/images/gallery/006_첫일본여행_03.jpg",
    className: "memory--wide",
  },
  {
    year: "JEJU",
    kicker: "Chapter 08",
    image: "/images/gallery/007_제주여행.jpg",
    className: "memory--wide",
  },
  {
    year: "BUSAN",
    kicker: "Chapter 09",
    image: "/images/gallery/008_부산여행.jpg",
    className: "memory--wide",
  },
  {
    year: "JEONJU",
    kicker: "Chapter 10",
    image: "/images/gallery/009_전주여행.jpg",
    className: "memory--portrait",
  },
  {
    year: "BANFF",
    kicker: "Chapter 11",
    image: "/images/gallery/010_밴프여행.jpg",
    className: "memory--wide",
  },
  {
    year: "THE PROPOSAL",
    kicker: "Chapter 12",
    image: "/images/gallery/011_프러포즈.jpg",
    className: "memory--wide",
  },
  {
    year: "CANADA WEDDING",
    kicker: "Chapter 13",
    image: "/images/gallery/012_캐나다결혼.jpg",
    className: "memory--wide",
  },
  {
    year: "CANADA WEDDING",
    kicker: "Chapter 14",
    image: "/images/gallery/013_캐나다결혼_02.jpg",
    className: "memory--wide",
  },
  {
    year: "JEJU",
    kicker: "Chapter 15",
    image: "/images/gallery/014_제주여행.jpg",
    className: "memory--portrait",
  },
  {
    year: "JAPAN",
    kicker: "Chapter 16",
    image: "/images/gallery/015_일본여행.jpg",
    className: "memory--portrait",
  },
  {
    year: "HELLO, BABY",
    kicker: "Chapter 17",
    image: "/images/gallery/016_우리아이_첫소식.jpg",
    className: "memory--wide",
  },
  {
    year: "WAITING FOR YOU",
    kicker: "Chapter 18",
    image: "/images/gallery/016_출산직전.jpg",
    className: "memory--portrait",
  },
  {
    year: "WELCOME, YOUNGJOON",
    kicker: "Chapter 19",
    image: "/images/gallery/017_영준이출산.jpg",
    className: "memory--portrait",
  },
  {
    year: "ONE MONTH",
    kicker: "Chapter 20",
    image: "/images/gallery/018_영준이첫달.jpg",
    className: "memory--portrait memory--final",
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
