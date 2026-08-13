import assert from "node:assert/strict";
import test from "node:test";

import { getInvitationContent } from "../app/content/invitation.ts";

test("records each source video duration for automatic playback", () => {
  assert.deepEqual(
    getInvitationContent("ko").storyVideos.map((video) => video.durationSeconds),
    [6.583333, 6.583333, 8, 10.125, 8.875, 9.416667],
  );
});

test("uses the final family thank-you video as the ending", () => {
  const ending = getInvitationContent("ko").ending;

  assert.equal(ending.src, "/videos/007-scroll.mp4?v=20260813-hq");
  assert.equal(ending.poster, "/images/video-posters/007.webp?v=20260813");
  assert.equal(ending.durationSeconds, 8);
  assert.deepEqual(ending.title, [
    "우리의 이야기를",
    "함께해 주셔서 감사합니다.",
  ]);
});

test("places the Canada wedding label in the lower-right corner", () => {
  const content = getInvitationContent("ko");
  const scene = content.storyVideos.find((video) => video.id === "canada-wedding");

  assert.equal(scene?.labels?.[0]?.placement, "bottom-right");
});

test("places Youngjoon's birth video after the Canadian wedding", () => {
  const videos = getInvitationContent("ko").storyVideos;
  const weddingIndex = videos.findIndex((video) => video.id === "canada-wedding");
  const birthIndex = videos.findIndex((video) => video.id === "youngjoon-birth");
  const birth = videos[birthIndex];

  assert.equal(birthIndex, weddingIndex + 1);
  assert.equal(birth.src, "/videos/006.mp4?v=20260812-hq");
  assert.equal(
    birth.poster,
    "/images/video-posters/006.webp?v=20260813-first-frame",
  );
  assert.equal(birth.labels?.[0]?.text, "영준이 출산");
  assert.equal(birth.labels?.[0]?.date, "2026.07.10 4:58");
  assert.equal(birth.labels?.[0]?.placement, "top-left");
});

test("keeps the moving-in label visible longer", () => {
  const movingIn = getInvitationContent("ko").storyVideos
    .find((video) => video.id === "home-and-cookie")?.labels?.[0];

  assert.ok(movingIn?.end >= 0.38);
});

test("introduces the gallery with a localized family-story message", () => {
  const content = getInvitationContent("ko");

  assert.deepEqual(content.galleryPrelude.title, [
    "서로 다른 두 사람이",
    "한 가족이 되기까지",
  ]);
  assert.equal(content.gallery.autoScrollHint, "상하로 스크롤해 주세요");
  assert.equal(
    content.galleryPrelude.body,
    "함께 쌓아온 소중한 순간들을 사진에 담았습니다.",
  );
});

test("formats a localized recipient greeting", () => {
  assert.equal(
    getInvitationContent("ko").transition.personalizedGreeting("김하객"),
    "김하객님께",
  );
  assert.equal(
    getInvitationContent("en").transition.personalizedGreeting("Alex"),
    "For Alex",
  );
});

test("uses the requested traditional-door invitation copy", () => {
  const door = getInvitationContent("ko").door;

  assert.deepEqual(door.invitationLines, [
    "저희 두 사람의 혼례에",
    "귀한 걸음 해주세요",
  ]);
  assert.deepEqual(door.personalizedInvitationLines("김하객"), [
    "김하객님을",
    "저희 두 사람의 혼례에",
    "정중히 초대합니다",
  ]);
  assert.equal(door.coupleNames, "상호 · 스테프");
  assert.equal(door.invitationDate, "2026년 11월 1일");
});

test("uses the corrected Korean ceremony time and readable date labels", () => {
  const ceremony = getInvitationContent("ko").ceremony;

  assert.equal(ceremony.month, "11월");
  assert.equal(ceremony.weekday, "일요일");
  assert.equal(ceremony.day, "1");
  assert.equal(ceremony.year, "2026년");
  assert.match(ceremony.dateTime, /오후 3시/);
  assert.equal(ceremony.venue, "롯데월드 민속박물관 전통혼례장");
  assert.equal(ceremony.address, "서울 송파구 올림픽로 240 (잠실동 40-1)");
});

test("offers Korean map choices and the requested parking information", () => {
  const content = getInvitationContent("ko");

  assert.deepEqual(
    content.ceremony.mapDialog.options.map(({ label, url }) => ({ label, url })),
    [
      { label: "네이버지도", url: "https://naver.me/Gxkehh7q" },
      { label: "카카오맵", url: "https://place.map.kakao.com/1687324400" },
      { label: "구글 지도", url: "https://maps.app.goo.gl/KLohU1Q2w2ok1Lp8A" },
    ],
  );
  assert.equal(content.details.phone, "02-411-3703");
  assert.match(content.details.parkingBody, /2시간 무료주차/);
  assert.match(content.details.parkingNotice, /서울스카이.*이용 불가/);
});

test("provides localized automatic-play copy without scroll instructions", () => {
  assert.equal(
    getInvitationContent("ko").door.autoReadyPrompt,
    "잠시 후 이야기가 자동으로 시작됩니다",
  );
  assert.equal(
    getInvitationContent("ja").door.autoReadyPrompt,
    "まもなく物語が自動で始まります",
  );
  assert.equal(
    getInvitationContent("en").door.autoReadyPrompt,
    "The story will begin automatically",
  );
});

test("describes short private invitation links in every locale", () => {
  assert.match(getInvitationContent("ko").linkBuilder.description, /짧은/);
  assert.match(getInvitationContent("ko").linkBuilder.privacyNote, /초대 ID/);
  assert.match(getInvitationContent("ja").linkBuilder.description, /短い/);
  assert.match(getInvitationContent("en").linkBuilder.description, /short/);
  assert.equal(
    getInvitationContent("ko").linkBuilder.defaultMessage,
    "함께 자리해 주시면 더없이 기쁘겠습니다.",
  );
  assert.match(
    getInvitationContent("ko").linkBuilder.autoModeLabel,
    /자동 재생/,
  );
  assert.match(
    getInvitationContent("ja").linkBuilder.autoModeLabel,
    /自動再生/,
  );
  assert.match(
    getInvitationContent("en").linkBuilder.autoModeLabel,
    /auto-play/,
  );
});
