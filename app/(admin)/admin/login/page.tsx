"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      status === "authenticated" &&
      (session.user.role === "ADMIN" || session.user.role === "EDITOR")
    ) {
      router.replace("/admin");
    }
  }, [status, session, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.get("email"),
      password: formData.get("password"),
      callbackUrl: "/admin",
    });

    setLoading(false);

    if (!res?.ok) {
      setError(
        res?.error === "CredentialsSignin"
          ? "Email ou senha inválidos"
          : "Erro ao tentar fazer login"
      );

      return;
    }

    router.push(res.url ?? "/admin");
  }

  if (status === "loading") {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-surface px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold tracking-tight text-color-text">
          Login Administração
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="
            space-y-6
            rounded-lg
            border border-muted
            bg-surface
            p-6
            shadow-sm
          "
        >
          {error && (
            <div className="rounded-md bg-error/10 px-4 py-3 text-sm text-error">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-color-text">
              Email
            </label>

            <input
              name="email"
              type="email"
              required
              className="
                mt-2 block w-full rounded-md
                bg-surface-muted
                px-3 py-2
                text-color-text
                border border-muted
                focus:border-brand
                focus-ring-brand
                transition
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-color-text">
              Senha
            </label>

            <input
              name="password"
              type="password"
              required
              className="
                mt-2 block w-full rounded-md
                bg-surface-muted
                px-3 py-2
                text-color-text
                border border-muted
                focus:border-brand
                focus-ring-brand
                transition
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              flex w-full justify-center rounded-md
              bg-brand
              px-3 py-2
              text-sm font-semibold
              text-on-brand
              transition-colors
              hover:bg-brand-dark
              disabled:opacity-50
              focus-ring-brand
            "
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
