type Props = {
  onCreate: () => void;
};

export default function UsersHeader({ onCreate }: Props) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
          Administração
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-admin sm:text-3xl">
          Usuários
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-admin-muted">
          Gerencie os usuários com acesso ao painel administrativo.
        </p>
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="inline-flex min-h-10 items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand/30 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60"
      >
        <span className="mr-2 text-lg leading-none">+</span>
        Novo usuário
      </button>
    </header>
  );
}
