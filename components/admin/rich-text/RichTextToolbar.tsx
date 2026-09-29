"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  Bars3BottomLeftIcon,
  Bars3BottomRightIcon,
  Bars3Icon,
  BoldIcon,
  CodeBracketIcon,
  LinkIcon,
  ListBulletIcon,
  PhotoIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "@heroicons/react/24/outline";

import RichTextLinkPopover from "./RichTextLinkPopover";
import RichTextToolbarButton from "./RichTextToolbarButton";

type Props = {
  editor: Editor;
};

type HeadingValue = "paragraph" | "heading-1" | "heading-2" | "heading-3";

function getHeadingValue(editor: Editor): HeadingValue {
  if (editor.isActive("heading", { level: 1 })) {
    return "heading-1";
  }

  if (editor.isActive("heading", { level: 2 })) {
    return "heading-2";
  }

  if (editor.isActive("heading", { level: 3 })) {
    return "heading-3";
  }

  return "paragraph";
}

function ToolbarDivider() {
  return <div className="mx-1 h-6 w-px bg-default" aria-hidden="true" />;
}

export default function RichTextToolbar({ editor }: Props) {
  const [linkOpen, setLinkOpen] = useState(false);

  const headingValue = getHeadingValue(editor);

  function setHeading(value: HeadingValue) {
    const chain = editor.chain().focus();

    if (value === "paragraph") {
      chain.setParagraph().run();
      return;
    }

    const level = Number(value.split("-")[1]) as 1 | 2 | 3;

    chain.toggleHeading({ level }).run();
  }

  return (
    <div className="relative border-b border-default bg-surface-muted">
      <div className="flex flex-wrap items-center gap-1 p-2">
        <select
          value={headingValue}
          onChange={(event) => setHeading(event.target.value as HeadingValue)}
          aria-label="Estilo do texto"
          className="h-9 rounded-md border border-default bg-surface px-2.5 text-sm font-medium text-admin outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          <option value="paragraph">Parágrafo</option>
          <option value="heading-1">Título 1</option>
          <option value="heading-2">Título 2</option>
          <option value="heading-3">Título 3</option>
        </select>

        <ToolbarDivider />

        <RichTextToolbarButton
          label="Negrito"
          active={editor.isActive("bold")}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon className="h-5 w-5" strokeWidth={2.5} />
        </RichTextToolbarButton>

        <RichTextToolbarButton
          label="Sublinhado"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-5 w-5" strokeWidth={2.2} />
        </RichTextToolbarButton>

        <RichTextToolbarButton
          label="Tachado"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <StrikethroughIcon className="h-5 w-5" strokeWidth={2.2} />
        </RichTextToolbarButton>

        <RichTextToolbarButton
          label="Código"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <CodeBracketIcon className="h-5 w-5" strokeWidth={2} />
        </RichTextToolbarButton>

        <ToolbarDivider />

        <RichTextToolbarButton
          label="Alinhar à esquerda"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <Bars3BottomLeftIcon className="h-5 w-5" strokeWidth={2} />
        </RichTextToolbarButton>

        <RichTextToolbarButton
          label="Centralizar"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <Bars3Icon className="h-5 w-5" strokeWidth={2} />
        </RichTextToolbarButton>

        <RichTextToolbarButton
          label="Alinhar à direita"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <Bars3BottomRightIcon className="h-5 w-5" strokeWidth={2} />
        </RichTextToolbarButton>

        <ToolbarDivider />

        <RichTextToolbarButton
          label="Lista com marcadores"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListBulletIcon className="h-5 w-5" strokeWidth={2} />
        </RichTextToolbarButton>

        <RichTextToolbarButton
          label="Lista numerada"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <span className="text-sm font-bold leading-none">1.</span>
        </RichTextToolbarButton>

        <ToolbarDivider />

        <div className="flex items-center gap-1">
          <label
            title="Cor do texto"
            className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md transition hover:bg-surface"
          >
            <span className="absolute text-xs font-bold text-admin">A</span>

            <input
              type="color"
              aria-label="Cor do texto"
              value={editor.getAttributes("textStyle").color || "#111827"}
              onChange={(event) =>
                editor.chain().focus().setColor(event.target.value).run()
              }
              className="h-7 w-7 cursor-pointer opacity-0"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-1.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full"
              style={{
                backgroundColor:
                  editor.getAttributes("textStyle").color || "#111827",
              }}
            />
          </label>
        </div>

        <ToolbarDivider />

        <div className="relative">
          <RichTextToolbarButton
            label="Inserir ou editar link"
            active={editor.isActive("link")}
            onClick={() => setLinkOpen((current) => !current)}
          >
            <LinkIcon className="h-5 w-5" strokeWidth={2} />
          </RichTextToolbarButton>

          <RichTextLinkPopover
            editor={editor}
            open={linkOpen}
            onClose={() => setLinkOpen(false)}
          />
        </div>

        <RichTextToolbarButton
          label="Inserir imagem"
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("rich-text-open-image-picker")
            );
          }}
        >
          <PhotoIcon className="h-5 w-5" strokeWidth={2} />
        </RichTextToolbarButton>

        <ToolbarDivider />

        <RichTextToolbarButton
          label="Desfazer"
          disabled={!editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <ArrowUturnLeftIcon className="h-5 w-5" strokeWidth={2} />
        </RichTextToolbarButton>

        <RichTextToolbarButton
          label="Refazer"
          disabled={!editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <ArrowUturnRightIcon className="h-5 w-5" strokeWidth={2} />
        </RichTextToolbarButton>
      </div>
    </div>
  );
}
