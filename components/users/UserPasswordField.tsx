"use client";

import { useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  editing: boolean;
};

export default function UserPasswordField({ value, onChange, editing }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label
        htmlFor="user-password"
        className="block text-sm font-semibold text-admin"
      >
        {editing ? "Nova senha" : "Senha"}
      </label>

      <div className="relative mt-2">
        <input
          id="user-password"
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={!editing}
          minLength={12}
          maxLength={128}
          autoComplete={editing ? "new-password" : "new-password"}
          placeholder={editing ? "Deixe vazio para manter a atual" : undefined}
          className="h-11 w-full rounded-lg border border-default bg-surface px-3 pr-20 text-sm text-admin outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-admin-muted transition hover:bg-surface-muted hover:text-admin"
        >
          {visible ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      <p className="mt-1.5 text-xs leading-5 text-admin-muted">
        {editing
          ? "Deixe vazio para manter a senha atual."
          : "Use pelo menos 12 caracteres."}
      </p>
    </div>
  );
}
