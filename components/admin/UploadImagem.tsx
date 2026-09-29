"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type UploadImagemProps = {
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  imagemAtualUrl?: string;
  referenciaImagem?: string;
  aspect?: "16:9" | "4:3" | "21:9";
  description?: string;
  location?: string;
  recommendedSize?: string;
  helperText?: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const ACCEPT_ATTRIBUTE = "image/jpeg,image/png,image/webp,image/avif";

export default function UploadImagem({
  label,
  value,
  onChange,
  imagemAtualUrl,
  referenciaImagem,
  aspect = "16:9",
  description,
  location,
  recommendedSize,
  helperText,
}: UploadImagemProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(file: File | null) {
    setError(null);

    if (!file) {
      onChange(null);
      setPreviewUrl(null);
      return;
    }

    if (!ALLOWED_TYPES.has(file.type.toLowerCase())) {
      setError("Formato não permitido. Use JPG, PNG, WebP ou AVIF.");
      return;
    }

    if (file.size <= 0) {
      setError("O arquivo está vazio.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("A imagem deve ter no máximo 10 MB.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setPreviewUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }

      return objectUrl;
    });

    onChange(file);
  }

  function clearSelectedFile() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setError(null);
    onChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const aspectClass =
    aspect === "16:9"
      ? "aspect-video"
      : aspect === "4:3"
        ? "aspect-[4/3]"
        : "aspect-[21/9]";

  const aspectLabel =
    aspect === "16:9" ? "16:9" : aspect === "4:3" ? "4:3" : "21:9";

  return (
    <div className="space-y-4 rounded-xl border border-default bg-surface p-4">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="block text-sm font-semibold text-admin">
            {label}
          </span>

          <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-admin-muted">
            Proporção {aspectLabel}
          </span>
        </div>

        {description && (
          <p className="text-sm leading-6 text-admin-muted">{description}</p>
        )}
      </div>

      {location && (
        <div className="rounded-lg border border-default bg-surface-muted p-3">
          <div className="mb-1 flex items-center gap-2">
            <span aria-hidden="true" className="text-sm">
              ⓘ
            </span>

            <span className="text-xs font-semibold uppercase tracking-wide text-admin">
              Onde será exibida
            </span>
          </div>

          <p className="text-sm text-admin-muted">{location}</p>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-admin-muted">
              Referência no site
            </span>

            <span className="text-xs text-admin-muted">Exemplo real</span>
          </div>

          {referenciaImagem ? (
            <div className="overflow-hidden rounded-lg border border-default bg-surface-muted">
              <Image
                src={referenciaImagem}
                alt={`Exemplo de utilização de ${label.toLowerCase()}`}
                width={1600}
                height={900}
                className="h-auto max-h-[420px] w-full object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-default bg-surface-muted p-6 text-center">
              <p className="text-sm text-admin-muted">
                Nenhuma imagem de referência configurada.
              </p>
            </div>
          )}

          <p className="text-xs leading-5 text-admin-muted">
            Esta imagem mostra a área do site em que o arquivo será utilizado.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-admin-muted">
              Sua imagem
            </span>

            {value && (
              <span className="text-xs text-admin-muted">Preview real</span>
            )}
          </div>

          {!value && imagemAtualUrl ? (
            <div className="space-y-3">
              <div
                className={`relative w-full overflow-hidden rounded-lg border border-default ${aspectClass}`}
              >
                <Image
                  src={imagemAtualUrl}
                  alt={label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              <label className="inline-flex cursor-pointer text-sm font-medium text-brand hover:underline">
                Substituir imagem
                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPT_ATTRIBUTE}
                  hidden
                  onChange={(event) =>
                    handleFileChange(event.target.files?.[0] ?? null)
                  }
                />
              </label>
            </div>
          ) : !value ? (
            <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-default bg-surface-muted p-6 text-center transition-colors hover:border-brand">
              <span className="text-sm text-admin-muted">
                Selecione uma imagem para visualizar
              </span>

              <span className="mt-3 rounded-md bg-brand px-4 py-2 text-sm font-medium text-on-brand">
                Escolher imagem
              </span>

              <input
                ref={inputRef}
                type="file"
                accept={ACCEPT_ATTRIBUTE}
                hidden
                onChange={(event) =>
                  handleFileChange(event.target.files?.[0] ?? null)
                }
              />
            </label>
          ) : (
            <div className="space-y-3">
              {previewUrl && (
                <div
                  className={`relative w-full overflow-hidden rounded-lg border border-default ${aspectClass}`}
                >
                  <Image
                    src={previewUrl}
                    alt={label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <label className="cursor-pointer text-sm font-medium text-brand hover:underline">
                  Trocar imagem
                  <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPT_ATTRIBUTE}
                    hidden
                    onChange={(event) =>
                      handleFileChange(event.target.files?.[0] ?? null)
                    }
                  />
                </label>

                <button
                  type="button"
                  onClick={clearSelectedFile}
                  className="text-sm font-medium text-danger hover:underline"
                >
                  Remover imagem
                </button>
              </div>
            </div>
          )}

          {error && (
            <p role="alert" className="text-xs font-medium text-danger">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-3 border-t border-default pt-4 sm:grid-cols-2">
        <div className="rounded-lg bg-surface-muted p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-admin-muted">
            Formato recomendado
          </p>

          <p className="mt-1 text-sm font-medium text-admin">{aspectLabel}</p>
        </div>

        {recommendedSize && (
          <div className="rounded-lg bg-surface-muted p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-admin-muted">
              Dimensão recomendada
            </p>

            <p className="mt-1 text-sm font-medium text-admin">
              {recommendedSize}
            </p>
          </div>
        )}
      </div>

      {helperText && (
        <p className="text-xs leading-5 text-admin-muted">{helperText}</p>
      )}
    </div>
  );
}
