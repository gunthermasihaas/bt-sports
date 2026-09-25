import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function CategoriasPage() {
  const categorias = await prisma.categoriaViagem.findMany({
    orderBy: {
      nome: "asc",
    },
    select: {
      id: true,
      nome: true,
      slug: true,
    },
  });

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold">Categorias de viagem</h1>

        <p className="mt-2 text-muted-foreground">
          Explore nossas categorias de viagem.
        </p>

        {categorias.length === 0 ? (
          <div className="mt-8 rounded-lg border border-default bg-surface p-6 text-muted">
            Nenhuma categoria disponível no momento.
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/categorias/${categoria.slug}`}
                className="rounded-lg border border-default bg-surface p-6 transition-colors hover:border-brand hover:bg-surface-muted"
              >
                <h2 className="text-lg font-semibold">{categoria.nome}</h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Explorar pacotes
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
