"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type UploadImagemProps = {
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  imagemAtualUrl?: string;
  aspect?: "16:9" | "4:3" | "21:9";
};

export default function UploadImagem({
  label,
  value,
  onChange,
  imagemAtualUrl,
  aspect = "16:9",
}: UploadImagemProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      // A atualização é necessária para limpar a pré-visualização anterior.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(value);

    // A pré-visualização depende do Object URL criado para o arquivo.
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [value]);

  const aspectClass =
    aspect === "16:9"
      ? "aspect-video"
      : aspect === "4:3"
        ? "aspect-[4/3]"
        : "aspect-[21/9]";

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-admin">
        {label}
      </label>

      {!value && imagemAtualUrl ? (
        <div className="space-y-3">
          <div
            className={`relative w-full overflow-hidden rounded-md border border-default ${aspectClass}`}
          >
            <Image
              src={imagemAtualUrl}
              alt={label}
              fill
              className="object-cover"
            />
          </div>

          <label className="cursor-pointer text-sm font-medium text-brand hover:underline">
            Substituir imagem
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => onChange(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
      ) : !value ? (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-border-muted bg-surface-muted p-6 text-center hover:border-brand">
          <span className="text-sm text-admin-muted">
            Arraste uma imagem aqui ou
          </span>

          <span className="mt-3 rounded-md bg-brand px-4 py-2 text-sm font-medium text-on-brand">
            Escolher imagem
          </span>

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          />
        </label>
      ) : (
        <div className="space-y-3">
          {previewUrl && (
            <div
              className={`relative w-full overflow-hidden rounded-md border border-default ${aspectClass}`}
            >
              <Image
                src={previewUrl}
                alt={label}
                fill
                className="object-cover"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-sm font-medium text-danger hover:underline"
          >
            Remover imagem
          </button>
        </div>
      )}
    </div>
  );
}
