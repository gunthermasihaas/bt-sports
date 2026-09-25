"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type UploadImagemProps = {
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  imagemAtualUrl?: string;
  aspect?: "16:9" | "4:3" | "21:9";
  description?: string;
  location?: string;
  recommendedSize?: string;
  helperText?: string;
};

export default function UploadImagem({
  label,
  value,
  onChange,
  imagemAtualUrl,
  aspect = "16:9",
  description,
  location,
  recommendedSize,
  helperText,
}: UploadImagemProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      // Necessário para limpar a pré-visualização anterior.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(value);

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

  const aspectLabel =
    aspect === "16:9" ? "16:9" : aspect === "4:3" ? "4:3" : "21:9";

  function handleFileChange(file: File | null) {
    if (!file) {
      onChange(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    onChange(file);
  }

  return (
    <div className="space-y-4 rounded-xl border border-default bg-surface p-4">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="block text-sm font-semibold text-admin">
            {label}
          </label>

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

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-admin-muted">
              Visualização no site
            </span>

            <span className="text-xs text-admin-muted">Ilustração</span>
          </div>

          <div className="rounded-lg border border-default bg-surface-muted p-3">
            <div className="overflow-hidden rounded-md border border-default bg-surface">
              <div className="flex h-6 items-center gap-1 border-b border-default px-2">
                <span className="h-2 w-2 rounded-full bg-border-muted" />
                <span className="h-2 w-2 rounded-full bg-border-muted" />
                <span className="h-2 w-2 rounded-full bg-border-muted" />
              </div>

              <div className="space-y-2 p-2">
                <div className="h-2 w-1/3 rounded bg-surface-muted" />

                <div
                  className={`relative flex items-center justify-center overflow-hidden rounded border-2 border-dashed border-brand bg-brand/5 ${aspectClass}`}
                >
                  <div className="px-3 text-center">
                    <p className="text-xs font-semibold text-admin">
                      Área da imagem
                    </p>

                    <p className="mt-1 text-[10px] text-admin-muted">
                      {aspectLabel}
                    </p>
                  </div>
                </div>

                <div className="h-2 w-4/5 rounded bg-surface-muted" />
                <div className="h-2 w-full rounded bg-surface-muted" />
                <div className="h-2 w-3/5 rounded bg-surface-muted" />
              </div>
            </div>
          </div>
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
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(event) =>
                    handleFileChange(event.target.files?.[0] ?? null)
                  }
                />
              </label>
            </div>
          ) : !value ? (
            <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-muted bg-surface-muted p-6 text-center transition-colors hover:border-brand">
              <span className="text-sm text-admin-muted">
                Selecione uma imagem para visualizar
              </span>

              <span className="mt-3 rounded-md bg-brand px-4 py-2 text-sm font-medium text-on-brand">
                Escolher imagem
              </span>

              <input
                type="file"
                accept="image/*"
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
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) =>
                      handleFileChange(event.target.files?.[0] ?? null)
                    }
                  />
                </label>

                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="text-sm font-medium text-danger hover:underline"
                >
                  Remover imagem
                </button>
              </div>
            </div>
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
