import { createHash, timingSafeEqual } from "node:crypto";

const developmentAccessCode = "local-wedding-builder-access";

const digest = (value: string) => createHash("sha256").update(value).digest();

export const readInvitationBuilderSecret = () => {
  const secret = process.env.INVITATION_BUILDER_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return developmentAccessCode;

  throw new Error("INVITATION_BUILDER_SECRET is not configured.");
};

export const isInvitationBuilderAuthorized = (
  accessCode: unknown,
  secret = readInvitationBuilderSecret(),
) => {
  if (typeof accessCode !== "string" || accessCode.length > 128) return false;
  return timingSafeEqual(digest(accessCode), digest(secret));
};
