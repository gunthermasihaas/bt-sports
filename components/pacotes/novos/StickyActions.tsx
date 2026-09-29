type StickyActionsProps = {
  loading: boolean;
  loadingMessage: string;
  onCancel: () => void;
  onDelete?: () => void;
};

export default function StickyActions({
  loading,
  loadingMessage,
  onCancel,
  onDelete,
}: StickyActionsProps) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 border-t border-default bg-surface/95 px-4 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] backdrop-blur sm:-mx-6 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={loading}
            className="min-h-10 rounded-md border border-danger/40 px-4 py-2 text-sm font-semibold text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Excluir pacote
          </button>
        ) : (
          <div />
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="min-h-10 rounded-md border border-default bg-surface px-5 py-2 text-sm font-semibold text-admin transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="min-h-10 rounded-md bg-brand px-6 py-2 text-sm font-semibold text-on-brand shadow-sm transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? loadingMessage : "Salvar pacote"}
          </button>
        </div>
      </div>
    </div>
  );
}
