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

  return (
    <main className="flex min-h-screen items-center justify-center bg-admin px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-base font-black text-on-brand shadow-sm">
            BT
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-admin">
            Administração
          </h1>

          <p className="mt-2 text-sm text-admin-muted">
            Entre para acessar o painel administrativo.
          </p>
        </div>

        <div className="rounded-2xl border border-admin bg-admin p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-admin"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={loading}
                className="
                  mt-2 block w-full rounded-xl
                  border border-admin
                  bg-admin-muted
                  px-3.5 py-3
                  text-sm text-admin
                  outline-none
                  transition-[border-color,box-shadow,background-color]
                  duration-200
                  placeholder:text-admin-muted
                  hover:border-brand/40
                  focus:border-brand
                  focus:bg-admin
                  focus:ring-2
                  focus:ring-brand/20
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-admin"
              >
                Senha
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={loading}
                className="
                  mt-2 block w-full rounded-xl
                  border border-admin
                  bg-admin-muted
                  px-3.5 py-3
                  text-sm text-admin
                  outline-none
                  transition-[border-color,box-shadow,background-color]
                  duration-200
                  placeholder:text-admin-muted
                  hover:border-brand/40
                  focus:border-brand
                  focus:bg-admin
                  focus:ring-2
                  focus:ring-brand/20
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                flex w-full items-center justify-center
                rounded-xl
                bg-brand
                px-4 py-3
                text-sm font-bold
                text-on-brand
                shadow-sm
                transition-[background-color,box-shadow,transform]
                duration-200
                hover:bg-brand-dark
                hover:shadow-md
                active:translate-y-px
                active:shadow-sm
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-brand
                focus-visible:ring-offset-2
                disabled:cursor-not-allowed
                disabled:opacity-60
                disabled:hover:bg-brand
                disabled:hover:shadow-sm
              "
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-admin-muted">
          Biarritz Turismo Sports
        </p>
      </div>
    </main>
  );
}
