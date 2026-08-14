import assert from "node:assert/strict";
import test from "node:test";

import {
  createInvitationId,
  isInvitationId,
} from "../app/lib/invitation-id.ts";

test("creates a compact opaque invitation identifier", () => {
  const first = createInvitationId();
  const second = createInvitationId();

  assert.equal(first.length, 12);
  assert.match(first, /^[A-Za-z0-9_-]+$/);
  assert.notEqual(first, second);
  assert.equal(isInvitationId(first), true);
});

test("rejects malformed invitation identifiers", () => {
  assert.equal(isInvitationId("short"), false);
  assert.equal(isInvitationId("contains spaces"), false);
  assert.equal(isInvitationId("a".repeat(25)), false);
});
