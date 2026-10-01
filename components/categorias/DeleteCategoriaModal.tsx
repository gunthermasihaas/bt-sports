"use client";

import type { Categoria } from "@/types/categoria";

type DeleteCategoriaModalProps = {
  categoria: Categoria | null;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteCategoriaModal({
  categoria,
  loading,
  onCancel,
  onConfirm,
}: DeleteCategoriaModalProps) {
  if (!categoria) {
    return null;
  }

  const pacotesCount = Number(categoria.pacotes_count ?? 0);
  const podeExcluir = pacotesCount === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-categoria-title"
    >
      <div className="w-full max-w-md rounded-lg border border-default bg-surface p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="delete-categoria-title" className="text-lg font-semibold">
              Excluir categoria
            </h2>

            <p className="mt-2 text-sm text-muted">
              {podeExcluir
                ? "Esta ação não pode ser desfeita."
                : "Esta categoria não pode ser excluída enquanto houver pacotes relacionados."}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            aria-label="Fechar"
            className="rounded-md px-2 py-1 text-lg text-muted transition-colors hover:bg-surface-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <div className="mt-5 rounded-md border border-default bg-surface-muted p-4">
          <p className="text-sm text-muted">Categoria</p>

          <p className="mt-1 font-semibold">{categoria.nome}</p>

          <p className="mt-3 text-sm text-muted">
            Pacotes relacionados:{" "}
            <span className="font-semibold text-foreground">
              {pacotesCount}
            </span>
          </p>
        </div>

        {!podeExcluir && (
          <div
            role="alert"
            className="mt-4 rounded-md border border-danger bg-surface p-4 text-sm text-danger"
          >
            Não é possível excluir esta categoria porque ela possui{" "}
            <strong>
              {pacotesCount} pacote{pacotesCount === 1 ? "" : "s"}
            </strong>{" "}
            relacionado{pacotesCount === 1 ? "" : "s"}.
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border border-default px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={!podeExcluir || loading}
            className="rounded-md border border-(--color-error) bg-(--color-error) px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Excluindo..." : "Excluir categoria"}
          </button>
        </div>
      </div>
    </div>
  );
}
