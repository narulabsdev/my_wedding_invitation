import { randomBytes } from "node:crypto";

const INVITATION_ID_BYTES = 9;
const INVITATION_ID_PATTERN = /^[A-Za-z0-9_-]{8,24}$/;

export const createInvitationId = () =>
  randomBytes(INVITATION_ID_BYTES).toString("base64url");

export const isInvitationId = (value: unknown): value is string =>
  typeof value === "string" && INVITATION_ID_PATTERN.test(value);
