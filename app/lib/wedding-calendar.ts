const WEDDING_START_UTC = "20261101T060000Z";
const WEDDING_END_UTC = "20261101T080000Z";
const WEDDING_UID =
  "20261101T150000-sangho-steph@our-wedding.narulabs.ca";
const WEDDING_URL = "https://our-wedding.narulabs.ca";
const MAX_ICS_LINE_BYTES = 75;

type WeddingCalendarInput = {
  title: string;
  description: string;
  venue: string;
  address: string;
  phone: string;
  createdAt?: Date;
};

const escapeIcsText = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n?|\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");

const formatUtcTimestamp = (date: Date) =>
  date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

const foldIcsLine = (line: string) => {
  const chunks: string[] = [];
  let chunk = "";
  let chunkBytes = 0;
  let byteLimit = MAX_ICS_LINE_BYTES;

  for (const character of line) {
    const characterBytes = new TextEncoder().encode(character).length;
    if (chunk && chunkBytes + characterBytes > byteLimit) {
      chunks.push(chunk);
      chunk = "";
      chunkBytes = 0;
      byteLimit = MAX_ICS_LINE_BYTES - 1;
    }
    chunk += character;
    chunkBytes += characterBytes;
  }

  if (chunk || chunks.length === 0) chunks.push(chunk);
  return chunks.join("\r\n ");
};

export const createWeddingCalendar = ({
  title,
  description,
  venue,
  address,
  phone,
  createdAt = new Date(),
}: WeddingCalendarInput) => {
  const location = `${venue}, ${address}`;
  const details = `${description}\n${venue}\n${address}\nTEL ${phone}`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NARU LABS//Sang Ho and Steph Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-TIMEZONE:Asia/Seoul",
    `X-WR-CALNAME:${escapeIcsText(title)}`,
    "BEGIN:VEVENT",
    `UID:${WEDDING_UID}`,
    `DTSTAMP:${formatUtcTimestamp(createdAt)}`,
    `DTSTART:${WEDDING_START_UTC}`,
    `DTEND:${WEDDING_END_UTC}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(details)}`,
    `LOCATION:${escapeIcsText(location)}`,
    `CONTACT:TEL ${escapeIcsText(phone)}`,
    `URL:${WEDDING_URL}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
};
