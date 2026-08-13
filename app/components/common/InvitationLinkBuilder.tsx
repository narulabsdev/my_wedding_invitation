"use client";

import { type FormEvent, useState } from "react";
import type { InvitationLinkBuilderCopy } from "../../content/invitation";
import { buildPersonalizedInvitationUrl } from "../../lib/site-url";

type InvitationLinkBuilderProps = {
  copy: InvitationLinkBuilderCopy;
};

type BuilderStatus = "idle" | "submitting" | "ready" | "copied" | "error";

export function InvitationLinkBuilder({ copy }: InvitationLinkBuilderProps) {
  const [accessCode, setAccessCode] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [status, setStatus] = useState<BuilderStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!recipientName.trim() || !message.trim()) {
      setStatus("error");
      setErrorMessage(copy.validationError);
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode, recipientName, message }),
      });
      if (response.status === 401) {
        setStatus("error");
        setErrorMessage(copy.accessError);
        return;
      }
      if (!response.ok) throw new Error("Invitation link creation failed.");

      const result = await response.json() as { invitationId?: string };
      if (!result.invitationId) throw new Error("Invitation identifier is missing.");

      setGeneratedUrl(buildPersonalizedInvitationUrl(result.invitationId));
      setStatus("ready");
    } catch {
      setGeneratedUrl("");
      setStatus("error");
      setErrorMessage(copy.requestError);
    }
  };

  const handleCopy = async () => {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    setStatus("copied");
  };

  return (
    <main className="invite-builder">
      <section className="invite-builder__card">
        <p className="invite-builder__eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p className="invite-builder__description">{copy.description}</p>

        <form className="invite-builder__form" onSubmit={handleSubmit}>
          <label>
            <span>{copy.accessCodeLabel}</span>
            <input
              name="accessCode"
              type="password"
              value={accessCode}
              maxLength={128}
              placeholder={copy.accessCodePlaceholder}
              autoComplete="current-password"
              onChange={(event) => {
                setAccessCode(event.target.value);
                setStatus("idle");
              }}
            />
          </label>

          <label>
            <span>{copy.nameLabel}</span>
            <input
              name="recipientName"
              value={recipientName}
              maxLength={40}
              placeholder={copy.namePlaceholder}
              autoComplete="off"
              onChange={(event) => {
                setRecipientName(event.target.value);
                setStatus("idle");
              }}
            />
          </label>

          <label>
            <span>{copy.messageLabel}</span>
            <textarea
              name="message"
              value={message}
              maxLength={300}
              rows={6}
              placeholder={copy.messagePlaceholder}
              onChange={(event) => {
                setMessage(event.target.value);
                setStatus("idle");
              }}
            />
            <small>{message.length} / 300</small>
          </label>

          <p className="invite-builder__privacy">{copy.privacyNote}</p>
          <button type="submit" disabled={status === "submitting"}>
            {status === "submitting"
              ? copy.generatingAction
              : copy.generateAction}
          </button>
        </form>

        {errorMessage ? (
          <p className="invite-builder__error" role="alert">{errorMessage}</p>
        ) : null}

        {generatedUrl ? (
          <div className="invite-builder__result">
            <label htmlFor="generated-invitation-url">{copy.resultLabel}</label>
            <input
              id="generated-invitation-url"
              value={generatedUrl}
              readOnly
              onFocus={(event) => event.currentTarget.select()}
            />
            <button type="button" onClick={handleCopy}>
              {status === "copied" ? copy.copiedAction : copy.copyAction}
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
