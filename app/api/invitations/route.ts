import {
  normalizeInvitationDraft,
} from "../../lib/invitation-token";
import { createNotionInvitation } from "../../lib/notion-invitation-store";
import { isInvitationBuilderAuthorized } from "../../lib/invitation-builder-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    if (!isInvitationBuilderAuthorized(body.accessCode)) {
      return Response.json(
        { error: "UNAUTHORIZED" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }

    const invitation = normalizeInvitationDraft(body);
    if (!invitation) {
      return Response.json({ error: "INVALID_INPUT" }, { status: 422 });
    }

    const invitationId = await createNotionInvitation(invitation);

    return Response.json(
      { invitationId },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "INVITATION_CREATE_FAILED" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
