"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import { toast } from "sonner";

import RichTextToolbar from "./rich-text/RichTextToolbar";
import RichTextBubbleMenu from "./rich-text/RichTextBubbleMenu";
import RichTextLinkPopover from "./rich-text/RichTextLinkPopover";
import {
  uploadInlineImage,
  validateInlineImage,
} from "./rich-text/richTextUtils";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

type EditorState = {
  words: number;
  characters: number;
  isEmpty: boolean;
  canUndo: boolean;
  canRedo: boolean;
};

export default function RichTextEditor({ value, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),

      Underline,

      Image.configure({
        allowBase64: false,
      }),

      TextStyle,

      Color,

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Placeholder.configure({
        placeholder:
          "Descreva a experiência, o roteiro, o que está incluído e os principais detalhes do pacote...",
      }),
    ],

    content: value,
    immediatelyRender: false,

    onUpdate({ editor: currentEditor }) {
      onChange(currentEditor.getHTML());
    },
  });

  const editorState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }): EditorState | null => {
      if (!currentEditor) {
        return null;
      }

      const textContent = currentEditor.state.doc.textContent;

      return {
        words: textContent.trim().split(/\s+/).filter(Boolean).length,

        characters: textContent.length,

        isEmpty: currentEditor.isEmpty,

        canUndo: currentEditor.can().chain().focus().undo().run(),

        canRedo: currentEditor.can().chain().focus().redo().run(),
      };
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentHtml = editor.getHTML();

    if (value !== currentHtml) {
      editor.commands.setContent(value || "", {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  useEffect(() => {
    function handleOpenImagePicker() {
      fileInputRef.current?.click();
    }

    window.addEventListener(
      "rich-text-open-image-picker",
      handleOpenImagePicker
    );

    return () => {
      window.removeEventListener(
        "rich-text-open-image-picker",
        handleOpenImagePicker
      );
    };
  }, []);

  if (!editor) {
    return (
      <div className="mt-2 min-h-72 animate-pulse rounded-lg border border-default bg-surface-muted" />
    );
  }

  const activeEditor = editor;

  const stats: EditorState = editorState ?? {
    words: 0,
    characters: 0,
    isEmpty: true,
    canUndo: false,
    canRedo: false,
  };

  async function handleImageUpload(file: File) {
    const validationError = validateInlineImage(file);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setUploadingImage(true);

      const url = await uploadInlineImage(file);

      activeEditor
        .chain()
        .focus()
        .setImage({
          src: url,
          alt: file.name,
        })
        .run();

      toast.success("Imagem inserida");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a imagem.";

      toast.error(message);
    } finally {
      setUploadingImage(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function openLinkPopover() {
    setLinkPopoverOpen(true);
  }

  return (
    <div className="relative mt-2 overflow-visible rounded-lg border border-default bg-surface shadow-sm">
      <RichTextToolbar editor={activeEditor} />

      <RichTextBubbleMenu editor={activeEditor} onLink={openLinkPopover} />

      {linkPopoverOpen && (
        <div className="absolute left-2 top-14 z-40">
          <RichTextLinkPopover
            editor={activeEditor}
            open={linkPopoverOpen}
            onClose={() => setLinkPopoverOpen(false)}
          />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            void handleImageUpload(file);
          }
        }}
      />

      {uploadingImage && (
        <div className="flex items-center gap-2 border-b border-default bg-brand/5 px-4 py-2 text-xs font-medium text-brand">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
          Enviando imagem...
        </div>
      )}

      <EditorContent
        editor={activeEditor}
        className={[
          "min-h-72 p-5 outline-none",
          "[&_.ProseMirror]:min-h-60",
          "[&_.ProseMirror]:outline-none",
          "[&_.ProseMirror]:text-admin",
          "[&_.ProseMirror]:leading-7",

          "[&_.ProseMirror_p]:my-3",

          "[&_.ProseMirror_h1]:mb-4",
          "[&_.ProseMirror_h1]:mt-7",
          "[&_.ProseMirror_h1]:text-2xl",
          "[&_.ProseMirror_h1]:font-bold",
          "[&_.ProseMirror_h1]:text-admin",

          "[&_.ProseMirror_h2]:mb-3",
          "[&_.ProseMirror_h2]:mt-6",
          "[&_.ProseMirror_h2]:text-xl",
          "[&_.ProseMirror_h2]:font-bold",
          "[&_.ProseMirror_h2]:text-admin",

          "[&_.ProseMirror_h3]:mb-2",
          "[&_.ProseMirror_h3]:mt-5",
          "[&_.ProseMirror_h3]:text-lg",
          "[&_.ProseMirror_h3]:font-semibold",
          "[&_.ProseMirror_h3]:text-admin",

          "[&_.ProseMirror_ul]:my-4",
          "[&_.ProseMirror_ul]:list-disc",
          "[&_.ProseMirror_ul]:pl-6",

          "[&_.ProseMirror_ol]:my-4",
          "[&_.ProseMirror_ol]:list-decimal",
          "[&_.ProseMirror_ol]:pl-6",

          "[&_.ProseMirror_li]:my-1",

          "[&_.ProseMirror_blockquote]:my-4",
          "[&_.ProseMirror_blockquote]:border-l-4",
          "[&_.ProseMirror_blockquote]:border-brand",
          "[&_.ProseMirror_blockquote]:pl-4",
          "[&_.ProseMirror_blockquote]:italic",
          "[&_.ProseMirror_blockquote]:text-admin-muted",

          "[&_.ProseMirror_a]:font-medium",
          "[&_.ProseMirror_a]:text-brand",
          "[&_.ProseMirror_a]:underline",
          "[&_.ProseMirror_a]:underline-offset-2",

          "[&_.ProseMirror_img]:my-5",
          "[&_.ProseMirror_img]:h-auto",
          "[&_.ProseMirror_img]:max-w-full",
          "[&_.ProseMirror_img]:rounded-lg",
          "[&_.ProseMirror_img]:shadow-sm",

          "[&_.ProseMirror_.is-editor-empty:first-child::before]:pointer-events-none",
          "[&_.ProseMirror_.is-editor-empty:first-child::before]:float-left",
          "[&_.ProseMirror_.is-editor-empty:first-child::before]:h-0",
          "[&_.ProseMirror_.is-editor-empty:first-child::before]:text-admin-muted",
          "[&_.ProseMirror_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
        ].join(" ")}
      />

      <div className="flex flex-col gap-2 border-t border-default bg-surface-muted px-4 py-2.5 text-xs text-admin-muted sm:flex-row sm:items-center sm:justify-between">
        <span>
          {stats.words} {stats.words === 1 ? "palavra" : "palavras"} ·{" "}
          {stats.characters}{" "}
          {stats.characters === 1 ? "caractere" : "caracteres"}
        </span>

        <span className="hidden sm:inline">
          Use títulos, listas, links e imagens para estruturar o conteúdo.
        </span>
      </div>
    </div>
  );
}
