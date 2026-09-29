type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  total: number;
  filteredTotal: number;
};

export default function UsersToolbar({
  search,
  onSearchChange,
  total,
  filteredTotal,
}: Props) {
  return (
    <section className="rounded-xl border border-default bg-surface p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted">
            ⌕
          </span>

          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por nome, e-mail ou função..."
            className="h-11 w-full rounded-lg border border-default bg-surface pl-10 pr-4 text-sm text-admin outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <div className="text-sm text-admin-muted">
          {search.trim() ? (
            <>
              Mostrando <strong className="text-admin">{filteredTotal}</strong>{" "}
              de <strong className="text-admin">{total}</strong> usuários
            </>
          ) : (
            <>
              <strong className="text-admin">{total}</strong>{" "}
              {total === 1 ? "usuário cadastrado" : "usuários cadastrados"}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
