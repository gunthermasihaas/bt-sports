import UserCard from "./UserCard";
import { User } from "./user-types";

type Props = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export default function UsersTable({ users, onEdit, onDelete }: Props) {
  return (
    <section className="overflow-hidden rounded-xl border border-default bg-surface shadow-sm">
      <div className="hidden border-b border-default bg-surface-muted px-5 py-3 text-xs font-semibold uppercase tracking-wide text-admin-muted md:grid md:grid-cols-[1.4fr_1.8fr_0.7fr_180px] md:items-center md:gap-4">
        <span>Nome</span>
        <span>E-mail</span>
        <span>Perfil</span>
        <span className="text-right">Ações</span>
      </div>

      <div className="divide-y divide-default">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
