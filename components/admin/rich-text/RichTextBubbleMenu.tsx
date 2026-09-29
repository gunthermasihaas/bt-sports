"use client";

import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "@heroicons/react/24/outline";

import RichTextToolbarButton from "./RichTextToolbarButton";

type Props = {
  editor: Editor;
  onLink: () => void;
};

export default function RichTextBubbleMenu({ editor, onLink }: Props) {
  return (
    <BubbleMenu
      editor={editor}
      options={{
        placement: "top",
      }}
    >
      <div className="flex items-center gap-0.5 rounded-lg border border-default bg-surface p-1 shadow-xl">
        <RichTextToolbarButton
          label="Negrito"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon className="h-4 w-4" strokeWidth={2.5} />
        </RichTextToolbarButton>

        <RichTextToolbarButton
          label="Itálico"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon className="h-4 w-4" strokeWidth={2.2} />
        </RichTextToolbarButton>

        <RichTextToolbarButton
          label="Sublinhado"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" strokeWidth={2.2} />
        </RichTextToolbarButton>

        <RichTextToolbarButton
          label="Tachado"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <StrikethroughIcon className="h-4 w-4" strokeWidth={2.2} />
        </RichTextToolbarButton>

        <RichTextToolbarButton
          label="Link"
          active={editor.isActive("link")}
          onClick={onLink}
        >
          <LinkIcon className="h-4 w-4" strokeWidth={2} />
        </RichTextToolbarButton>
      </div>
    </BubbleMenu>
  );
}
