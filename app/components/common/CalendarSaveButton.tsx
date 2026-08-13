import type { InvitationLocale } from "../../lib/locale";

type CalendarSaveButtonProps = {
  label: string;
  locale: InvitationLocale;
};

export function CalendarSaveButton({
  label,
  locale,
}: CalendarSaveButtonProps) {
  return (
    <a
      className="calendar-save-button"
      href={`/api/calendar?locale=${locale}`}
      download="sangho-steph-wedding.ics"
    >
      {label}
    </a>
  );
}
