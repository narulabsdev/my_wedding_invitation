"use client";

import { useEffect, useState } from "react";
import type { PersonalizedInvitation } from "../content/invitation";

const readInvitationReferenceFromHash = () => {
  const parameters = new URLSearchParams(window.location.hash.slice(1));
  return {
    invitationId: parameters.get("i")?.trim() ?? "",
    legacyToken: parameters.get("invite")?.trim() ?? "",
  };
};

export function usePersonalizedInvitation() {
  const [invitation, setInvitation] = useState<PersonalizedInvitation | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const resolveInvitation = async () => {
      const { invitationId, legacyToken } = readInvitationReferenceFromHash();
      if (!invitationId && !legacyToken) {
        setInvitation(null);
        return;
      }

      try {
        const response = await fetch("/api/invitations/resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            invitationId ? { invitationId } : { token: legacyToken },
          ),
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Invitation token could not be resolved.");

        const result = await response.json() as {
          invitation?: PersonalizedInvitation;
        };
        setInvitation(result.invitation ?? null);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setInvitation(null);
      }
    };

    void resolveInvitation();
    window.addEventListener("hashchange", resolveInvitation);

    return () => {
      controller.abort();
      window.removeEventListener("hashchange", resolveInvitation);
    };
  }, []);

  return invitation;
}
