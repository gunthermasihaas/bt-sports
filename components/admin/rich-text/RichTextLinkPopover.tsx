"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";

import { normalizeUrl } from "./richTextUtils";

type Props = {
  editor: Editor;
  open: boolean;
  onClose: () => void;
};

export default function RichTextLinkPopover({ editor, open, onClose }: Props) {
  const [url, setUrl] = useState(() => editor.getAttributes("link").href ?? "");

  if (!open) {
    return null;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = normalizeUrl(url);

    if (!normalized) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      onClose();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: normalized,
        target: "_blank",
        rel: "noopener noreferrer nofollow",
      })
      .run();

    onClose();
  }

  function handleRemove() {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    onClose();
  }

  return (
    <div className="absolute left-2 top-full z-30 mt-2 w-[min(360px,calc(100vw-2rem))] rounded-lg border border-default bg-surface p-3 shadow-xl">
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="rich-text-link"
          className="block text-xs font-semibold uppercase tracking-wide text-admin-muted"
        >
          URL do link
        </label>

        <input
          id="rich-text-link"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://exemplo.com"
          autoFocus
          className="mt-2 h-10 w-full rounded-md border border-default bg-surface px-3 text-sm text-admin outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        />

        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleRemove}
            disabled={!editor.isActive("link")}
            className="rounded-md px-3 py-2 text-xs font-semibold text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Remover link
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-default px-3 py-2 text-xs font-semibold text-admin transition hover:bg-surface-muted"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-md bg-brand px-3 py-2 text-xs font-semibold text-on-brand transition hover:bg-brand-hover"
            >
              Aplicar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
