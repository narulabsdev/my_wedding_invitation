import assert from "node:assert/strict";
import test from "node:test";

import {
  createInvitationToken,
  normalizeInvitationDraft,
  readInvitationToken,
} from "../app/lib/invitation-token.ts";

const secret = "a-secure-test-secret-that-is-longer-than-thirty-two-characters";
const invitation = {
  recipientName: "김하객",
  message: "함께 자리해 주시면 더없이 기쁘겠습니다.",
};

test("creates an opaque token and restores the personal invitation", () => {
  const now = Date.parse("2026-08-12T12:00:00Z");
  const token = createInvitationToken(invitation, secret, now);

  assert.doesNotMatch(token, /김하객|함께 자리/);
  assert.deepEqual(readInvitationToken(token, secret, now), invitation);
});

test("rejects a modified invitation token", () => {
  const token = createInvitationToken(invitation, secret);
  const tampered = `${token.slice(0, -1)}${token.endsWith("A") ? "B" : "A"}`;

  assert.throws(() => readInvitationToken(tampered, secret));
});

test("normalizes valid text and rejects missing or oversized content", () => {
  assert.deepEqual(
    normalizeInvitationDraft({
      recipientName: "  김하객  ",
      message: "첫째 줄\r\n둘째 줄  ",
    }),
    { recipientName: "김하객", message: "첫째 줄\n둘째 줄" },
  );
  assert.equal(normalizeInvitationDraft({ recipientName: "", message: "초대" }), null);
  assert.equal(
    normalizeInvitationDraft({ recipientName: "김하객", message: "가".repeat(301) }),
    null,
  );
});

test("uses the localized default message when only a recipient name is entered", () => {
  assert.deepEqual(
    normalizeInvitationDraft({
      recipientName: "김하객",
      message: "",
      defaultMessage: "함께 자리해 주시면 더없이 기쁘겠습니다.",
    }),
    {
      recipientName: "김하객",
      message: "함께 자리해 주시면 더없이 기쁘겠습니다.",
    },
  );
});
