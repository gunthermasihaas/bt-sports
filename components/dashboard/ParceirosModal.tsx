"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { ParceiroForm, type ParceiroFormData } from "./ParceiroForm";

type Props = {
  initialParceiros: ParceiroFormData[];
};

export function ParceirosModal({ initialParceiros }: Props) {
  const [open, setOpen] = useState(false);
  const [parceiros, setParceiros] =
    useState<ParceiroFormData[]>(initialParceiros);

  const [editing, setEditing] = useState<ParceiroFormData | null>(null);

  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function closeModal() {
    if (editing || creating) {
      setEditing(null);
      setCreating(false);
      setError(null);
      return;
    }

    setOpen(false);
    setError(null);
  }

  function startCreate() {
    setEditing(null);
    setCreating(true);
    setError(null);
  }

  function startEdit(parceiro: ParceiroFormData) {
    setCreating(false);
    setEditing(parceiro);
    setError(null);
  }

  function handleSaved(parceiro: ParceiroFormData) {
    setParceiros((current) => {
      const exists = current.some((item) => item.id === parceiro.id);

      const next = exists
        ? current.map((item) => (item.id === parceiro.id ? parceiro : item))
        : [...current, parceiro];

      return [...next].sort((a, b) => a.ordem - b.ordem || a.id! - b.id!);
    });

    setEditing(null);
    setCreating(false);
    setError(null);
  }

  async function handleDelete(parceiro: ParceiroFormData) {
    const confirmed = window.confirm(
      `Remover "${parceiro.nome}" dos parceiros oficiais?`
    );

    if (!confirmed) {
      return;
    }

    if (!parceiro.id) {
      return;
    }

    setDeletingId(parceiro.id);
    setError(null);

    try {
      const response = await fetch(`/api/admin/parceiros/${parceiro.id}`, {
        method: "DELETE",
      });

      const payload: {
        error?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ?? "Não foi possível remover o parceiro."
        );
      }

      setParceiros((current) =>
        current.filter((item) => item.id !== parceiro.id)
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível remover o parceiro."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setError(null);
        }}
        className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-on-brand transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        Editar parceiros
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="parceiros-modal-title"
            className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-default bg-surface shadow-2xl"
          >
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-default px-5 py-4 sm:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-dark">
                  Conteúdo do site
                </p>

                <h2
                  id="parceiros-modal-title"
                  className="mt-1 text-xl font-extrabold tracking-tight text-admin"
                >
                  Agências parceiras oficiais
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Gerencie os logos exibidos no rodapé.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Fechar"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl text-muted transition-colors hover:bg-surface-soft hover:text-admin"
              >
                ×
              </button>
            </header>

            {editing || creating ? (
              <ParceiroForm
                parceiro={editing}
                onSaved={handleSaved}
                onCancel={() => {
                  setEditing(null);
                  setCreating(false);
                  setError(null);
                }}
              />
            ) : (
              <>
                <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
                  {error && (
                    <div
                      role="alert"
                      className="mb-5 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm font-medium text-danger"
                    >
                      {error}
                    </div>
                  )}

                  {parceiros.length === 0 ? (
                    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-default bg-surface-soft px-6 text-center">
                      <p className="text-lg font-bold text-admin">
                        Nenhum parceiro cadastrado
                      </p>

                      <p className="mt-2 max-w-md text-sm leading-6 text-muted">
                        Adicione a primeira agência parceira para começar a
                        preencher a seção do rodapé.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {parceiros.map((parceiro) => (
                        <article
                          key={parceiro.id}
                          className="overflow-hidden rounded-2xl border border-default bg-surface-soft"
                        >
                          <div className="relative flex h-32 items-center justify-center bg-surface">
                            <Image
                              src={parceiro.logo_desktop_url}
                              alt=""
                              fill
                              unoptimized
                              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                              className="object-contain p-6"
                            />
                          </div>

                          <div className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="truncate text-sm font-bold text-admin">
                                  {parceiro.nome}
                                </h3>

                                <p className="mt-1 text-xs text-muted">
                                  Ordem {parceiro.ordem}
                                </p>
                              </div>

                              <span className="shrink-0 rounded-full bg-brand-soft px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-dark">
                                Ativo
                              </span>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => startEdit(parceiro)}
                                disabled={deletingId === parceiro.id}
                                className="flex-1 rounded-full border border-default bg-surface px-3 py-2 text-xs font-bold text-admin transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand-dark disabled:opacity-50"
                              >
                                Editar
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(parceiro)}
                                disabled={deletingId === parceiro.id}
                                className="rounded-full border border-danger/20 bg-surface px-3 py-2 text-xs font-bold text-danger transition-colors hover:border-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white disabled:opacity-50"
                              >
                                {deletingId === parceiro.id ? "..." : "Remover"}
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>

                <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-default bg-surface px-5 py-4 sm:px-6">
                  <p className="hidden text-xs text-muted sm:block">
                    {parceiros.length}{" "}
                    {parceiros.length === 1 ? "parceiro" : "parceiros"}{" "}
                    cadastrado
                    {parceiros.length === 1 ? "" : "s"}
                  </p>

                  <div className="ml-auto flex items-center gap-3">
                    <button
                      type="button"
                      onClick={startCreate}
                      className="rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-on-brand transition-colors hover:bg-brand-dark"
                    >
                      + Adicionar parceiro
                    </button>

                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-full border border-default px-4 py-2.5 text-sm font-semibold text-admin transition-colors hover:bg-surface-soft"
                    >
                      Fechar
                    </button>
                  </div>
                </footer>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
