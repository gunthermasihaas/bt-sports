type Props = {
  hasSearch: boolean;
  onClearSearch: () => void;
  onCreate: () => void;
};

export default function UsersEmptyState({
  hasSearch,
  onClearSearch,
  onCreate,
}: Props) {
  return (
    <section className="rounded-xl border border-dashed border-default bg-surface px-5 py-12 text-center shadow-sm sm:px-6">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-xl text-brand">
        {hasSearch ? "⌕" : "+"}
      </div>

      <h2 className="mt-4 text-base font-semibold text-admin">
        {hasSearch ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-admin-muted">
        {hasSearch
          ? "Não encontramos usuários correspondentes à sua busca. Tente outro termo."
          : "Crie o primeiro usuário administrativo para começar a gerenciar os acessos."}
      </p>

      <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
        {hasSearch ? (
          <button
            type="button"
            onClick={onClearSearch}
            className="min-h-10 rounded-lg border border-default px-4 py-2 text-sm font-semibold text-admin transition hover:bg-surface-muted"
          >
            Limpar busca
          </button>
        ) : (
          <button
            type="button"
            onClick={onCreate}
            className="min-h-10 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Criar usuário
          </button>
        )}
      </div>
    </section>
  );
}
