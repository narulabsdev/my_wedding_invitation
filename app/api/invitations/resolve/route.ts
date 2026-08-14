import {
  readInvitationToken,
  readInvitationTokenSecret,
} from "../../../lib/invitation-token";
import { isInvitationId } from "../../../lib/invitation-id";
import { readNotionInvitation } from "../../../lib/notion-invitation-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      invitationId?: unknown;
      token?: unknown;
    };
    let invitation;

    if (isInvitationId(body.invitationId)) {
      invitation = await readNotionInvitation(body.invitationId);
      if (!invitation) throw new Error("Invitation was not found.");
    } else if (typeof body.token === "string" && body.token.length <= 2_000) {
      invitation = readInvitationToken(
        body.token,
        readInvitationTokenSecret(),
      );
    } else {
      return Response.json({ error: "INVALID_INVITATION" }, { status: 422 });
    }

    return Response.json(
      { invitation },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "INVALID_INVITATION" },
      { status: 422, headers: { "Cache-Control": "no-store" } },
    );
  }
}
