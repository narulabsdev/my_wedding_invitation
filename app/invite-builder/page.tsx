"use client";

import { InvitationLinkBuilder } from "../components/common/InvitationLinkBuilder";
import { getInvitationContent } from "../content/invitation";
import { useDeviceLocale } from "../lib/use-device-locale";

export default function InviteBuilderPage() {
  const locale = useDeviceLocale();
  const copy = getInvitationContent(locale).linkBuilder;

  return <InvitationLinkBuilder copy={copy} />;
}
