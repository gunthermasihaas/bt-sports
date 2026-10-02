import type { Metadata } from "next";
import Link from "next/link";

import CategoriesJsonLd from "@/app/seo/CategoriesJsonLd";
import { prisma } from "@/lib/prisma";

const baseUrl = "https://www.biarritz.com.br";

const title = "Categorias de Viagem";

const description =
  "Explore os pacotes de turismo esportivo da Biarritz Turismo Sports organizados por categoria.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/categorias",
  },
  openGraph: {
    title,
    description,
    url: "/categorias",
    type: "website",
    siteName: "Biarritz Turismo Sports",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

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
    <>
      <CategoriesJsonLd
        items={categorias.map((categoria, index) => ({
          name: categoria.nome,
          url: `${baseUrl}/categorias/${categoria.slug}`,
          position: index + 1,
        }))}
      />

      <main className="min-h-screen bg-background py-14 sm:py-18 lg:py-24">
        <div className="site-container">
          <header className="max-w-3xl">
            <span className="section-kicker">Explore</span>

            <h1 className="section-title mt-5">Categorias de viagem</h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Escolha o tipo de experiência que combina com o seu próximo
              destino esportivo.
            </p>
          </header>

          {categorias.length === 0 ? (
            <div className="surface-card mt-12 flex min-h-64 items-center justify-center p-8 text-center">
              <div>
                <span className="section-kicker">Em breve</span>

                <p className="mt-4 text-lg font-bold text-default">
                  Nenhuma categoria disponível no momento.
                </p>

                <p className="mt-2 text-sm text-muted">
                  Novas experiências serão adicionadas em breve.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categorias.map((categoria, index) => {
                const numero = String(index + 1).padStart(2, "0");

                return (
                  <Link
                    key={categoria.id}
                    href={`/categorias/${categoria.slug}`}
                    className="group relative min-h-64 overflow-hidden rounded-2xl bg-brand-deep p-6 shadow-[var(--shadow-card)] transition-all duration-500 ease-[var(--ease-standard)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] sm:min-h-72 sm:p-8"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgb(97_198_129_/_0.24),transparent_32%)]" />

                    <div className="absolute -bottom-20 -right-16 h-48 w-48 rounded-full border border-white/5 transition-transform duration-700 group-hover:scale-125" />

                    <div className="relative z-10 flex h-full flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-bold tracking-[0.16em] text-white/45">
                          {numero}
                        </span>

                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-brand">
                          →
                        </span>
                      </div>

                      <div>
                        <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">
                          {categoria._count.pacotes}{" "}
                          {categoria._count.pacotes === 1
                            ? "experiência"
                            : "experiências"}
                        </span>

                        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                          {categoria.nome}
                        </h2>

                        <span className="mt-4 inline-flex items-center text-sm font-bold text-brand">
                          Explorar categoria
                          <span className="ml-2 transition-transform group-hover:translate-x-1">
                            →
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
