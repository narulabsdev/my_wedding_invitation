import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../app/api/calendar/route.ts";
import { createWeddingCalendar } from "../app/lib/wedding-calendar.ts";

test("creates a valid Seoul wedding calendar event with localized copy", () => {
  const calendar = createWeddingCalendar({
    title: "상호 · 스테프 결혼식",
    description: "저희 두 사람의 혼례에\n귀한 걸음 해주세요.",
    venue: "롯데월드 민속박물관 전통혼례장",
    address: "서울 송파구 올림픽로 240 (잠실동 40-1)",
    phone: "02-411-3703",
    createdAt: new Date("2026-08-13T12:34:56Z"),
  });

  assert.match(calendar, /^BEGIN:VCALENDAR\r\n/);
  assert.match(calendar, /DTSTART:20261101T060000Z\r\n/);
  assert.match(calendar, /DTEND:20261101T080000Z\r\n/);
  assert.match(calendar, /DTSTAMP:20260813T123456Z\r\n/);
  assert.match(calendar, /SUMMARY:상호 · 스테프 결혼식\r\n/);
  assert.match(calendar, /DESCRIPTION:저희 두 사람의 혼례에\\n귀한 걸음 해주세요\./);
  assert.match(calendar, /CONTACT:TEL 02-411-3703/);
  assert.match(calendar, /UID:20261101T150000-sangho-steph@our-wedding\.narulabs\.ca/);
  assert.match(calendar, /END:VCALENDAR\r\n$/);
  calendar.split("\r\n").forEach((line) => {
    assert.ok(Buffer.byteLength(line, "utf8") <= 75);
  });
});

test("serves a downloadable localized calendar file", async () => {
  const response = await GET(
    new Request("https://our-wedding.narulabs.ca/api/calendar?locale=ko"),
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/calendar; charset=utf-8");
  assert.match(response.headers.get("content-disposition") ?? "", /sangho-steph-wedding\.ics/);
  assert.match(await response.text(), /SUMMARY:상호 · 스테프 결혼식/);
});
