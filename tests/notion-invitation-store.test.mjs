import assert from "node:assert/strict";
import test from "node:test";

import {
  createNotionInvitation,
  readNotionInvitation,
} from "../app/lib/notion-invitation-store.ts";

const config = {
  accessToken: "notion-test-token",
  dataSourceId: "notion-test-data-source",
};

const invitation = {
  recipientName: "김하객",
  message: "저희 두 사람의 혼례에 정중히 초대합니다.",
};

test("stores an invitation in the private Notion data source", async () => {
  let request;
  const invitationId = await createNotionInvitation(
    invitation,
    config,
    async (input, init) => {
      request = { input: String(input), init };
      return Response.json({ id: "notion-page-id" }, { status: 200 });
    },
    () => "Ab3x9K2_cdE1",
  );

  assert.equal(invitationId, "Ab3x9K2_cdE1");
  assert.equal(request.input, "https://api.notion.com/v1/pages");
  const body = JSON.parse(request.init.body);
  assert.equal(body.parent.data_source_id, config.dataSourceId);
  assert.equal(body.properties["초대 ID"].title[0].text.content, invitationId);
  assert.equal(body.properties["이름"].rich_text[0].text.content, "김하객");
  assert.equal(body.properties["초대 문구"].rich_text[0].text.content, invitation.message);
  assert.equal(body.properties["활성"].checkbox, true);
});

test("resolves an active, unexpired Notion invitation", async () => {
  const result = await readNotionInvitation(
    "ReadTest1_AA",
    config,
    async () => Response.json({
      results: [{
        archived: false,
        in_trash: false,
        properties: {
          "초대 ID": { title: [{ plain_text: "ReadTest1_AA" }] },
          "이름": { rich_text: [{ plain_text: "김하객" }] },
          "초대 문구": { rich_text: [{ plain_text: invitation.message }] },
          "활성": { checkbox: true },
          "만료일": { date: { start: "2026-12-02T00:00:00+09:00" } },
        },
      }],
    }),
    Date.parse("2026-08-12T12:00:00Z"),
  );

  assert.deepEqual(result, invitation);
});

test("does not resolve inactive or expired invitations", async () => {
  const makeFetcher = (active, expiresAt) => async () => Response.json({
    results: [{
      archived: false,
      in_trash: false,
      properties: {
        "이름": { rich_text: [{ plain_text: "김하객" }] },
        "초대 문구": { rich_text: [{ plain_text: invitation.message }] },
        "활성": { checkbox: active },
        "만료일": { date: { start: expiresAt } },
      },
    }],
  });

  assert.equal(
    await readNotionInvitation(
      "Inactive01_A",
      config,
      makeFetcher(false, "2026-12-02T00:00:00+09:00"),
      Date.parse("2026-08-12T12:00:00Z"),
    ),
    null,
  );
  assert.equal(
    await readNotionInvitation(
      "Expired001_A",
      config,
      makeFetcher(true, "2026-01-01T00:00:00+09:00"),
      Date.parse("2026-08-12T12:00:00Z"),
    ),
    null,
  );
});
