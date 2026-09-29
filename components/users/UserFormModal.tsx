"use client";

import { useEffect } from "react";

import UserPasswordField from "./UserPasswordField";
import { User, UserFormData } from "./user-types";

type Props = {
  open: boolean;
  user: User | null;
  form: UserFormData;
  saving: boolean;
  onChange: (form: UserFormData) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function UserFormModal({
  open,
  user,
  form,
  saving,
  onChange,
  onClose,
  onSubmit,
}: Props) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, saving, onClose]);

  if (!open) {
    return null;
  }

  const editing = Boolean(user);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-modal-title"
        className="w-full max-w-xl rounded-t-2xl border border-default bg-surface shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between border-b border-default px-5 py-4 sm:px-6">
          <div>
            <h2
              id="user-modal-title"
              className="text-lg font-semibold text-admin"
            >
              {editing ? "Editar usuário" : "Novo usuário"}
            </h2>

            <p className="mt-1 text-sm text-admin-muted">
              {editing
                ? "Atualize os dados de acesso do usuário."
                : "Crie um novo acesso administrativo."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Fechar"
            className="rounded-lg p-2 text-admin-muted transition hover:bg-surface-muted hover:text-admin disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
          className="space-y-5 px-5 py-5 sm:px-6 sm:py-6"
        >
          <div>
            <label
              htmlFor="user-name"
              className="block text-sm font-semibold text-admin"
            >
              Nome
            </label>

            <input
              id="user-name"
              type="text"
              value={form.name}
              onChange={(event) =>
                onChange({
                  ...form,
                  name: event.target.value,
                })
              }
              required
              maxLength={255}
              autoFocus
              className="mt-2 h-11 w-full rounded-lg border border-default bg-surface px-3 text-sm text-admin outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div>
            <label
              htmlFor="user-email"
              className="block text-sm font-semibold text-admin"
            >
              E-mail
            </label>

            <input
              id="user-email"
              type="email"
              value={form.email}
              onChange={(event) =>
                onChange({
                  ...form,
                  email: event.target.value,
                })
              }
              required
              maxLength={255}
              autoComplete="email"
              className="mt-2 h-11 w-full rounded-lg border border-default bg-surface px-3 text-sm text-admin outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <UserPasswordField
            value={form.password}
            onChange={(password) =>
              onChange({
                ...form,
                password,
              })
            }
            editing={editing}
          />

          <div className="flex flex-col-reverse gap-2 border-t border-default pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="min-h-11 rounded-lg border border-default px-4 py-2 text-sm font-semibold text-admin transition-all hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="min-h-11 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Salvando..."
                : editing
                  ? "Salvar alterações"
                  : "Criar usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
