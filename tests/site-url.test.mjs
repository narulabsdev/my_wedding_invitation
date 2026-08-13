import assert from "node:assert/strict";
import test from "node:test";

import {
  PUBLIC_SITE_URL,
  buildPersonalizedInvitationUrl,
} from "../app/lib/site-url.ts";

test("always creates invitation links on the custom wedding domain", () => {
  assert.equal(PUBLIC_SITE_URL, "https://our-wedding.narulabs.ca");
  assert.equal(
    buildPersonalizedInvitationUrl("opaque-token"),
    "https://our-wedding.narulabs.ca/#i=opaque-token",
  );
  assert.equal(
    buildPersonalizedInvitationUrl("opaque-token", { autoMode: true }),
    "https://our-wedding.narulabs.ca/auto#i=opaque-token",
  );
});
