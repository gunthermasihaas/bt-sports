"use client";

import Link from "next/link";
import { useEffect } from "react";

type Props = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function PublicError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[70vh] bg-background">
      <div className="site-container flex min-h-[70vh] items-center py-16 sm:py-20 lg:py-24">
        <div className="max-w-2xl">
          <span className="section-kicker">Erro</span>

          <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.04em] text-default sm:text-5xl">
            Não foi possível carregar esta página.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
            Ocorreu um problema inesperado ao carregar o conteúdo. Tente
            novamente ou continue navegando pelo site.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={reset} className="button-primary">
              Tentar novamente
              <span aria-hidden="true">↻</span>
            </button>

            <Link href="/" className="button-secondary">
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
