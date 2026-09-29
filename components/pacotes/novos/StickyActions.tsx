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
    <div className="sticky bottom-0 z-10 -mx-4 sm:-mx-6 border-t border-default bg-surface/90 px-4 sm:px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={loading}
            className="
              rounded-md border border-red-600
              px-4 py-2 text-sm font-semibold
              text-danger
              hover:bg-red-50
              disabled:opacity-50
            "
          >
            Arquivar pacote
          </button>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="
              rounded-md bg-brand
              bg-brand-dark-hover
              px-6 py-2 text-sm font-semibold
              text-on-brand
              disabled:opacity-60
            "
          >
            {loading ? loadingMessage : "Salvar pacote"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="
              rounded-md border border-default
              px-6 py-2 text-sm font-semibold
              text-admin
              bg-surface-muted-hover
              border-muted-hover
              disabled:opacity-50
            "
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
