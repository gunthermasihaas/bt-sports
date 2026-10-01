import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function CategoriasPage() {
  const categorias = await prisma.categoriaViagem.findMany({
    where: {
      pacotes: {
        some: {
          deleted_at: null,
        },
      },
    },
    orderBy: {
      nome: "asc",
    },
    select: {
      id: true,
      nome: true,
      slug: true,
      _count: {
        select: {
          pacotes: {
            where: {
              deleted_at: null,
            },
          },
        },
      },
    },
  });

  return (
    <main className="bg-surface px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header>
          <h1 className="text-3xl font-bold text-on-surface">
            Categorias de viagem
          </h1>

          <p className="mt-2 text-on-surface-muted">
            Explore nossos pacotes por categoria.
          </p>
        </header>

        {categorias.length === 0 ? (
          <div className="mt-8 rounded-xl border border-default bg-surface-muted p-8 text-center">
            <p className="text-sm text-on-surface-muted">
              Nenhuma categoria disponível no momento.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/categorias/${categoria.slug}`}
                className="group rounded-xl border border-default bg-surface p-6 transition-colors hover:bg-surface-muted"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-semibold text-on-surface group-hover:text-brand">
                    {categoria.nome}
                  </h2>

                  <span className="shrink-0 text-xs font-medium text-on-surface-muted">
                    {categoria._count.pacotes}{" "}
                    {categoria._count.pacotes === 1 ? "pacote" : "pacotes"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
