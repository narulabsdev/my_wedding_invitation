import type { PersonalizedInvitation } from "../content/invitation";
import { createInvitationId, isInvitationId } from "./invitation-id.ts";
import { normalizeInvitationDraft } from "./invitation-token.ts";

const NOTION_API_BASE_URL = "https://api.notion.com/v1";
const NOTION_API_VERSION = "2026-03-11";
const INVITATION_EXPIRES_AT = "2026-12-02T00:00:00+09:00";
const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_RETRIES = 2;

export type NotionInvitationStoreConfig = {
  accessToken: string;
  dataSourceId: string;
};

type Fetcher = typeof fetch;

type NotionTextItem = {
  plain_text?: unknown;
};

type NotionProperty = {
  title?: NotionTextItem[];
  rich_text?: NotionTextItem[];
  checkbox?: unknown;
  date?: { start?: unknown } | null;
};

type NotionPage = {
  archived?: unknown;
  in_trash?: unknown;
  properties?: Record<string, NotionProperty>;
};

const cache = new Map<string, {
  invitation: PersonalizedInvitation;
  cachedUntil: number;
}>();

const wait = (durationMs: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, durationMs));

const readRetryDelay = (response: Response, attempt: number) => {
  const retryAfterSeconds = Number(response.headers.get("retry-after"));
  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds >= 0) {
    return Math.min(retryAfterSeconds * 1000, 2_000);
  }
  return 250 * (attempt + 1);
};

const requestNotion = async (
  path: string,
  init: RequestInit,
  config: NotionInvitationStoreConfig,
  fetcher: Fetcher,
) => {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const response = await fetcher(`${NOTION_API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
        "Notion-Version": NOTION_API_VERSION,
        ...init.headers,
      },
      cache: "no-store",
    });

    if (response.ok) return response;

    const canRetry = response.status === 429 || response.status >= 500;
    if (!canRetry || attempt === MAX_RETRIES) {
      throw new Error(`Notion request failed with status ${response.status}.`);
    }
    await wait(readRetryDelay(response, attempt));
  }

  throw new Error("Notion request failed.");
};

const richText = (value: string) => [{
  type: "text",
  text: { content: value },
}];

const readPlainText = (items: NotionTextItem[] | undefined) =>
  items?.map((item) =>
    typeof item.plain_text === "string" ? item.plain_text : ""
  ).join("") ?? "";

export const readNotionInvitationStoreConfig = (): NotionInvitationStoreConfig => {
  const accessToken = process.env.NOTION_ACCESS_TOKEN?.trim();
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID?.trim();

  if (!accessToken || !dataSourceId) {
    throw new Error("Notion invitation store is not configured.");
  }

  return { accessToken, dataSourceId };
};

export const createNotionInvitation = async (
  invitation: PersonalizedInvitation,
  config = readNotionInvitationStoreConfig(),
  fetcher: Fetcher = fetch,
  createId = createInvitationId,
) => {
  const normalized = normalizeInvitationDraft(invitation);
  if (!normalized) throw new Error("Invalid invitation content.");

  const invitationId = createId();
  if (!isInvitationId(invitationId)) {
    throw new Error("Invalid invitation identifier.");
  }

  await requestNotion(
    "/pages",
    {
      method: "POST",
      body: JSON.stringify({
        parent: {
          type: "data_source_id",
          data_source_id: config.dataSourceId,
        },
        properties: {
          "초대 ID": { title: richText(invitationId) },
          "이름": { rich_text: richText(normalized.recipientName) },
          "초대 문구": { rich_text: richText(normalized.message) },
          "활성": { checkbox: true },
          "만료일": { date: { start: INVITATION_EXPIRES_AT } },
        },
      }),
    },
    config,
    fetcher,
  );

  cache.set(invitationId, {
    invitation: normalized,
    cachedUntil: Date.now() + CACHE_TTL_MS,
  });

  return invitationId;
};

export const readNotionInvitation = async (
  invitationId: string,
  config = readNotionInvitationStoreConfig(),
  fetcher: Fetcher = fetch,
  now = Date.now(),
): Promise<PersonalizedInvitation | null> => {
  if (!isInvitationId(invitationId)) return null;

  const cached = cache.get(invitationId);
  if (cached && cached.cachedUntil > now) return cached.invitation;
  cache.delete(invitationId);

  const response = await requestNotion(
    `/data_sources/${encodeURIComponent(config.dataSourceId)}/query`,
    {
      method: "POST",
      body: JSON.stringify({
        filter: {
          property: "초대 ID",
          title: { equals: invitationId },
        },
        page_size: 1,
      }),
    },
    config,
    fetcher,
  );
  const payload = await response.json() as { results?: NotionPage[] };
  const page = payload.results?.[0];
  const properties = page?.properties;

  if (
    !page ||
    page.archived === true ||
    page.in_trash === true ||
    properties?.["활성"]?.checkbox !== true
  ) {
    return null;
  }

  const expiresAt = properties["만료일"]?.date?.start;
  if (
    typeof expiresAt !== "string" ||
    !Number.isFinite(Date.parse(expiresAt)) ||
    Date.parse(expiresAt) <= now
  ) {
    return null;
  }

  const invitation = normalizeInvitationDraft({
    recipientName: readPlainText(properties["이름"]?.rich_text),
    message: readPlainText(properties["초대 문구"]?.rich_text),
  });
  if (!invitation) return null;

  cache.set(invitationId, {
    invitation,
    cachedUntil: now + CACHE_TTL_MS,
  });
  return invitation;
};
