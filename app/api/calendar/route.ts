import { getInvitationContent } from "../../content/invitation.ts";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type InvitationLocale,
} from "../../lib/locale.ts";
import { createWeddingCalendar } from "../../lib/wedding-calendar.ts";

export const runtime = "nodejs";

const readLocale = (request: Request): InvitationLocale => {
  const requestedLocale = new URL(request.url).searchParams.get("locale");
  return SUPPORTED_LOCALES.find((locale) => locale === requestedLocale) ??
    DEFAULT_LOCALE;
};

export async function GET(request: Request) {
  const locale = readLocale(request);
  const { ceremony, details } = getInvitationContent(locale);
  const calendar = createWeddingCalendar({
    title: ceremony.calendarEvent.title,
    description: ceremony.calendarEvent.description,
    venue: ceremony.venue,
    address: ceremony.address,
    phone: details.phone,
  });

  return new Response(calendar, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Disposition":
        'attachment; filename="sangho-steph-wedding.ics"',
      "Content-Type": "text/calendar; charset=utf-8",
    },
  });
}
