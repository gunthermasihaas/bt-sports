import { User } from "./user-types";

type Props = {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

function getRoleLabel(role: User["role"]): string {
  switch (role) {
    case "ADMIN":
      return "Administrador";

    case "EDITOR":
      return "Editor";

    default:
      return role;
  }
}

export default function UserCard({ user, onEdit, onDelete }: Props) {
  const initials =
    user.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || user.email.slice(0, 2).toUpperCase();

  return (
    <article className="group px-4 py-4 transition-colors duration-150 hover:bg-surface-muted/50 sm:px-5 md:grid md:grid-cols-[1.4fr_1.8fr_0.7fr_180px] md:items-center md:gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand">
          {initials}
        </div>

        <div className="min-w-0">
          <p className="truncate font-semibold text-admin">
            {user.name || "Sem nome"}
          </p>

          <p className="truncate text-sm text-admin-muted md:hidden">
            {user.email}
          </p>
        </div>
      </div>

      <p className="mt-3 hidden truncate text-sm text-admin-muted md:mt-0 md:block">
        {user.email}
      </p>

      <div className="mt-3 md:mt-0">
        <span className="inline-flex rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold tracking-wide text-brand">
          {getRoleLabel(user.role)}
        </span>
      </div>

      <div className="mt-4 flex gap-2 md:mt-0 md:justify-end">
        <button
          type="button"
          onClick={() => onEdit(user)}
          className="min-h-9 rounded-lg border border-default px-3 py-2 text-sm font-semibold text-admin transition-all duration-150 hover:-translate-y-0.5 hover:bg-surface-muted hover:shadow-sm active:translate-y-0"
        >
          Editar
        </button>

        <button
          type="button"
          onClick={() => onDelete(user)}
          disabled={user.email.toLowerCase() === "gunther@biarritz.com.br"}
          className="min-h-9 rounded-lg border border-danger/40 px-3 py-2 text-sm font-semibold text-danger transition-all duration-150 hover:-translate-y-0.5 hover:bg-danger/10 hover:shadow-sm active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Excluir
        </button>
      </div>
    </article>
  );
}
