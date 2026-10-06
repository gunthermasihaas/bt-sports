"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type ParceiroFormData = {
  id: number | null;
  nome: string;
  href: string;
  logo_desktop_url: string;
  logo_mobile_url: string | null;
  ordem: number;
};

type Props = {
  parceiro: ParceiroFormData | null;
  onSaved: (parceiro: ParceiroFormData) => void;
  onCancel: () => void;
};

export function ParceiroForm({ parceiro, onSaved, onCancel }: Props) {
  const [nome, setNome] = useState(parceiro?.nome ?? "");
  const [href, setHref] = useState(parceiro?.href ?? "");
  const [ordem, setOrdem] = useState(String(parceiro?.ordem ?? 0));

  const [desktopFile, setDesktopFile] = useState<File | null>(null);

  const [mobileFile, setMobileFile] = useState<File | null>(null);

  const [removeMobile, setRemoveMobile] = useState(false);

  const [desktopPreview, setDesktopPreview] = useState<string | null>(
    parceiro?.logo_desktop_url ?? null
  );

  const [mobilePreview, setMobilePreview] = useState<string | null>(
    parceiro?.logo_mobile_url ?? null
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const desktopInputRef = useRef<HTMLInputElement | null>(null);

  const mobileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (desktopPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(desktopPreview);
      }

      if (mobilePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(mobilePreview);
      }
    };
  }, [desktopPreview, mobilePreview]);

  function handleDesktopFile(file: File | null) {
    if (!file) {
      return;
    }

    if (desktopPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(desktopPreview);
    }

    setDesktopFile(file);
    setDesktopPreview(URL.createObjectURL(file));
    setError(null);
  }

  function handleMobileFile(file: File | null) {
    if (!file) {
      return;
    }

    if (mobilePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(mobilePreview);
    }

    setMobileFile(file);
    setMobilePreview(URL.createObjectURL(file));
    setRemoveMobile(false);
    setError(null);
  }

  function handleRemoveMobile() {
    if (mobilePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(mobilePreview);
    }

    setMobileFile(null);
    setMobilePreview(null);
    setRemoveMobile(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    const normalizedName = nome.trim();
    const normalizedHref = href.trim();

    if (!normalizedName) {
      setError("Informe o nome do parceiro.");
      return;
    }

    if (!normalizedHref) {
      setError("Informe o link do parceiro.");
      return;
    }

    try {
      const parsedUrl = new URL(normalizedHref);

      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        setError("O link deve começar com http:// ou https://.");
        return;
      }
    } catch {
      setError("Informe um link válido.");
      return;
    }

    if (!parceiro && !desktopFile) {
      setError("Selecione a logo principal.");
      return;
    }

    const parsedOrder = Number(ordem);

    if (!Number.isInteger(parsedOrder) || parsedOrder < 0) {
      setError("A ordem deve ser um número inteiro válido.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      formData.set("nome", normalizedName);
      formData.set("href", normalizedHref);
      formData.set("ordem", String(parsedOrder));

      if (desktopFile) {
        formData.set("logoDesktop", desktopFile);
      }

      if (mobileFile) {
        formData.set("logoMobile", mobileFile);
      }

      if (removeMobile) {
        formData.set("removeMobile", "true");
      }

      const url = parceiro
        ? `/api/admin/parceiros/${parceiro.id}`
        : "/api/admin/parceiros";

      const response = await fetch(url, {
        method: parceiro ? "PATCH" : "POST",
        body: formData,
      });

      const payload: {
        parceiro?: ParceiroFormData;
        error?: string;
      } = await response.json();

      if (!response.ok || !payload.parceiro) {
        throw new Error(payload.error ?? "Não foi possível salvar o parceiro.");
      }

      onSaved(payload.parceiro);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível salvar o parceiro."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <label
              htmlFor="parceiro-nome"
              className="text-sm font-semibold text-admin"
            >
              Nome
            </label>

            <input
              id="parceiro-nome"
              type="text"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              maxLength={255}
              className="mt-2 w-full rounded-xl border border-admin bg-surface px-4 py-3 text-sm text-admin outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="Ex.: Maratona de Berlim"
              disabled={saving}
            />
          </div>

          <div>
            <label
              htmlFor="parceiro-href"
              className="text-sm font-semibold text-admin"
            >
              Link
            </label>

            <input
              id="parceiro-href"
              type="url"
              value={href}
              onChange={(event) => setHref(event.target.value)}
              maxLength={2048}
              className="mt-2 w-full rounded-xl border border-admin bg-surface px-4 py-3 text-sm text-admin outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="https://..."
              disabled={saving}
            />
          </div>
        </div>

        <div className="mt-6">
          <label
            htmlFor="parceiro-ordem"
            className="text-sm font-semibold text-admin"
          >
            Ordem
          </label>

          <input
            id="parceiro-ordem"
            type="number"
            min={0}
            step={1}
            value={ordem}
            onChange={(event) => setOrdem(event.target.value)}
            className="mt-2 w-32 rounded-xl border border-admin bg-surface px-4 py-3 text-sm text-admin outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            disabled={saving}
          />

          <p className="mt-2 text-xs text-muted">
            Menor número aparece primeiro.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-default bg-surface-soft p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-admin">
                  Logo principal
                </p>

                <p className="mt-1 text-xs text-muted">
                  Usada no desktop e como fallback.
                </p>
              </div>

              <button
                type="button"
                onClick={() => desktopInputRef.current?.click()}
                className="rounded-full bg-brand px-3 py-2 text-xs font-bold text-on-brand transition-colors hover:bg-brand-dark"
                disabled={saving}
              >
                {desktopFile ? "Trocar" : "Selecionar"}
              </button>
            </div>

            <input
              ref={desktopInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(event) =>
                handleDesktopFile(event.target.files?.[0] ?? null)
              }
              disabled={saving}
            />

            <div className="relative mt-4 flex h-36 items-center justify-center overflow-hidden rounded-xl border border-default bg-surface">
              {desktopPreview ? (
                <Image
                  src={desktopPreview}
                  alt=""
                  fill
                  unoptimized
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-contain p-6"
                />
              ) : (
                <span className="text-xs text-muted">
                  Nenhuma logo selecionada
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-default bg-surface-soft p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-admin">Logo mobile</p>

                <p className="mt-1 text-xs text-muted">
                  Opcional. Use apenas se precisar de uma versão específica.
                </p>
              </div>

              <button
                type="button"
                onClick={() => mobileInputRef.current?.click()}
                className="rounded-full border border-brand/20 bg-brand-soft px-3 py-2 text-xs font-bold text-brand-dark transition-colors hover:border-brand hover:bg-brand hover:text-on-brand"
                disabled={saving}
              >
                {mobileFile ? "Trocar" : "Selecionar"}
              </button>
            </div>

            <input
              ref={mobileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(event) =>
                handleMobileFile(event.target.files?.[0] ?? null)
              }
              disabled={saving}
            />

            <div className="relative mt-4 flex h-36 items-center justify-center overflow-hidden rounded-xl border border-default bg-surface">
              {mobilePreview ? (
                <Image
                  src={mobilePreview}
                  alt=""
                  fill
                  unoptimized
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-contain p-6"
                />
              ) : (
                <span className="text-xs text-muted">
                  Nenhuma versão mobile
                </span>
              )}
            </div>

            {mobilePreview && (
              <button
                type="button"
                onClick={handleRemoveMobile}
                className="mt-3 text-xs font-semibold text-danger transition-colors hover:text-red-700"
                disabled={saving}
              >
                Remover versão mobile
              </button>
            )}
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm font-medium text-danger"
          >
            {error}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-end gap-3 border-t border-default bg-surface px-5 py-4 sm:px-6">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-default px-4 py-2.5 text-sm font-semibold text-admin transition-colors hover:bg-surface-soft"
          disabled={saving}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-on-brand transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          disabled={saving}
        >
          {saving
            ? "Salvando..."
            : parceiro
              ? "Salvar alterações"
              : "Adicionar parceiro"}
        </button>
      </div>
    </form>
  );
}
