import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import type { PersonalizedInvitation } from "../content/invitation";

const TOKEN_VERSION = "v1";
const TOKEN_CONTEXT = "our-story-wedding:personal-invitation:v1";
const INVITATION_EXPIRES_AT = Date.parse("2026-12-02T00:00:00+09:00");
const IV_BYTES = 12;

export const INVITATION_NAME_MAX_LENGTH = 40;
export const INVITATION_MESSAGE_MAX_LENGTH = 300;

type InvitationTokenPayload = PersonalizedInvitation & {
  issuedAt: number;
  expiresAt: number;
};

const normalizeText = (value: unknown) =>
  typeof value === "string"
    ? value.replace(/\r\n?/g, "\n").trim().normalize("NFC")
    : "";

export const normalizeInvitationDraft = (
  value: unknown,
): PersonalizedInvitation | null => {
  if (!value || typeof value !== "object") return null;

  const input = value as Record<string, unknown>;
  const recipientName = normalizeText(input.recipientName);
  const message = normalizeText(input.message);

  if (
    recipientName.length === 0 ||
    recipientName.length > INVITATION_NAME_MAX_LENGTH ||
    message.length === 0 ||
    message.length > INVITATION_MESSAGE_MAX_LENGTH
  ) {
    return null;
  }

  return { recipientName, message };
};

const deriveKey = (secret: string) =>
  createHash("sha256").update(`${TOKEN_CONTEXT}:${secret}`).digest();

const assertSecret = (secret: string) => {
  if (secret.length < 32) {
    throw new Error("INVITATION_TOKEN_SECRET must contain at least 32 characters.");
  }
};

const decodeBase64Url = (value: string) => {
  const decoded = Buffer.from(value, "base64url");
  if (decoded.toString("base64url") !== value) {
    throw new Error("Invalid invitation token encoding.");
  }
  return decoded;
};

export const createInvitationToken = (
  invitation: PersonalizedInvitation,
  secret: string,
  now = Date.now(),
) => {
  assertSecret(secret);
  const normalized = normalizeInvitationDraft(invitation);
  if (!normalized) throw new Error("Invalid invitation content.");

  const payload: InvitationTokenPayload = {
    ...normalized,
    issuedAt: now,
    expiresAt: INVITATION_EXPIRES_AT,
  };
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", deriveKey(secret), iv);
  cipher.setAAD(Buffer.from(TOKEN_CONTEXT));
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);
  const authenticationTag = cipher.getAuthTag();

  return [
    TOKEN_VERSION,
    iv.toString("base64url"),
    encrypted.toString("base64url"),
    authenticationTag.toString("base64url"),
  ].join(".");
};

export const readInvitationToken = (
  token: string,
  secret: string,
  now = Date.now(),
): PersonalizedInvitation => {
  assertSecret(secret);
  const [version, encodedIv, encodedPayload, encodedTag, extra] = token.split(".");
  if (
    version !== TOKEN_VERSION ||
    !encodedIv ||
    !encodedPayload ||
    !encodedTag ||
    extra
  ) {
    throw new Error("Invalid invitation token.");
  }

  const iv = decodeBase64Url(encodedIv);
  const authenticationTag = decodeBase64Url(encodedTag);
  if (iv.length !== IV_BYTES || authenticationTag.length !== 16) {
    throw new Error("Invalid invitation token.");
  }

  const decipher = createDecipheriv("aes-256-gcm", deriveKey(secret), iv);
  decipher.setAAD(Buffer.from(TOKEN_CONTEXT));
  decipher.setAuthTag(authenticationTag);
  const decrypted = Buffer.concat([
    decipher.update(decodeBase64Url(encodedPayload)),
    decipher.final(),
  ]).toString("utf8");
  const payload = JSON.parse(decrypted) as Partial<InvitationTokenPayload>;
  const invitation = normalizeInvitationDraft(payload);

  if (
    !invitation ||
    typeof payload.issuedAt !== "number" ||
    typeof payload.expiresAt !== "number" ||
    payload.issuedAt > now + 60_000 ||
    payload.expiresAt <= now
  ) {
    throw new Error("Expired or invalid invitation token.");
  }

  return invitation;
};

const developmentSecret =
  "local-development-only-invitation-token-secret-v1";

export const readInvitationTokenSecret = () => {
  const secret = process.env.INVITATION_TOKEN_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return developmentSecret;

  throw new Error("INVITATION_TOKEN_SECRET is not configured.");
};
