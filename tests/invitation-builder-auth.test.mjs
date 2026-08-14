import assert from "node:assert/strict";
import test from "node:test";

import { isInvitationBuilderAuthorized } from "../app/lib/invitation-builder-auth.ts";

test("accepts only the configured invitation-builder access code", () => {
  const secret = "a-private-builder-access-code";

  assert.equal(isInvitationBuilderAuthorized(secret, secret), true);
  assert.equal(isInvitationBuilderAuthorized("wrong-code", secret), false);
  assert.equal(isInvitationBuilderAuthorized(null, secret), false);
});
