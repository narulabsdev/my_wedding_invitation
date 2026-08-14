import type { Metadata } from "next";
import { WeddingInvitation } from "../WeddingInvitation";

export const metadata: Metadata = {
  alternates: {
    canonical: "/auto",
  },
};

export default function AutoInvitationPage() {
  return <WeddingInvitation autoMode />;
}
