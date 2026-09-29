"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
};

type UserForm = {
  name: string;
  email: string;
  password: string;
};

const EMPTY_FORM: UserForm = {
  name: "",
  email: "",
  password: "",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<UserForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function carregarUsuarios() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/users", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar usuários");
      }

      setUsers(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao carregar usuários";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  function updateField(key: keyof UserForm, value: string) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function startEditing(user: User) {
    setEditingId(user.id);

    setForm({
      name: user.name ?? "",
      email: user.email,
      password: "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);

      const editing = Boolean(editingId);

      const payload = editing
        ? {
            id: editingId,
            name: form.name,
            email: form.email,
            password: form.password,
          }
        : form;

      const response = await fetch("/api/admin/users", {
        method: editing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar usuário");
      }

      toast.success(
        editing
          ? "Usuário atualizado com sucesso"
          : "Usuário criado com sucesso"
      );

      resetForm();
      await carregarUsuarios();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao salvar usuário";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(user: User) {
    const confirmed = window.confirm(
      `Excluir o usuário ${user.email}? Esta ação não pode ser desfeita.`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao excluir usuário");
      }

      toast.success("Usuário excluído com sucesso");

      if (editingId === user.id) {
        resetForm();
      }

      await carregarUsuarios();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao excluir usuário";

      toast.error(message);
    }
  }

  return (
    <div className="min-h-screen bg-admin">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6 sm:py-10">
        <div>
          <h1 className="text-xl font-semibold text-admin sm:text-2xl">
            Usuários
          </h1>

          <p className="mt-2 text-sm text-admin-muted">
            Gerencie os usuários que possuem acesso à administração.
          </p>
        </div>

        <section className="rounded-xl border border-default bg-surface p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-admin">
              {editingId ? "Editar usuário" : "Novo usuário"}
            </h2>

            <p className="mt-1 text-sm text-admin-muted">
              Todos os usuários possuem acesso administrativo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-3">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-admin"
              >
                Nome
              </label>

              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
                maxLength={255}
                className="mt-2 w-full rounded-md border border-default bg-surface px-3 py-2 text-admin focus-ring-brand"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-admin"
              >
                E-mail
              </label>

              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                required
                maxLength={255}
                className="mt-2 w-full rounded-md border border-default bg-surface px-3 py-2 text-admin focus-ring-brand"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-admin"
              >
                {editingId ? "Nova senha" : "Senha"}
              </label>

              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
                required={!editingId}
                minLength={12}
                maxLength={128}
                autoComplete="new-password"
                placeholder={editingId ? "Deixe vazio para manter" : undefined}
                className="mt-2 w-full rounded-md border border-default bg-surface px-3 py-2 text-admin focus-ring-brand"
              />

              <p className="mt-1 text-xs text-admin-muted">
                Mínimo de 12 caracteres.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 md:col-span-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Salvando..."
                  : editingId
                    ? "Salvar alterações"
                    : "Criar usuário"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-md border border-default px-4 py-2 text-sm font-semibold text-admin transition hover:bg-surface-muted disabled:opacity-60"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-default bg-surface">
          <div className="border-b border-default px-5 py-4 sm:px-6">
            <h2 className="font-semibold text-admin">Usuários cadastrados</h2>
          </div>

          {loading ? (
            <div className="px-5 py-8 text-sm text-admin-muted sm:px-6">
              Carregando usuários...
            </div>
          ) : users.length === 0 ? (
            <div className="px-5 py-8 text-sm text-admin-muted sm:px-6">
              Nenhum usuário encontrado.
            </div>
          ) : (
            <div className="divide-y divide-default">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div>
                    <p className="font-semibold text-admin">
                      {user.name || "Sem nome"}
                    </p>

                    <p className="mt-1 text-sm text-admin-muted">
                      {user.email}
                    </p>

                    <p className="mt-1 text-xs uppercase tracking-wide text-admin-muted">
                      {user.role}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(user)}
                      className="rounded-md border border-default px-3 py-2 text-sm font-semibold text-admin transition hover:bg-surface-muted"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(user)}
                      className="rounded-md border border-danger px-3 py-2 text-sm font-semibold text-danger transition hover:bg-danger/10"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
