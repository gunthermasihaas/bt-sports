import { TipoFoto } from "@/generated/prisma";

import PacoteCard from "@/components/pacotes/pacote-card";
import { formatarDataCurta } from "@/lib/formatarData";
import { prisma } from "@/lib/prisma";

type Props = {
  slug: string;
};

export default async function PacotesPorCategoria({ slug }: Props) {
  const categoria = await prisma.categoriaViagem.findUnique({
    where: {
      slug,
    },
    include: {
      pacotes: {
        where: {
          deleted_at: null,
        },
        orderBy: {
          data_inicio: "asc",
        },
        include: {
          fotos: {
            where: {
              tipo: TipoFoto.CARD,
            },
            take: 1,
          },
        },
      },
    },
  });

  if (!categoria) {
    return (
      <div className="site-container py-20 sm:py-24">
        <div className="surface-card mx-auto max-w-2xl p-8 text-center sm:p-12">
          <span className="section-kicker">404</span>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-default">
            Categoria não encontrada
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            A categoria que você procura não está disponível.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-background py-14 sm:py-18 lg:py-24">
      <div className="site-container">
        <header className="mb-10 max-w-3xl sm:mb-12">
          <span className="section-kicker">Categoria</span>

          <h1 className="section-title mt-5">{categoria.nome}</h1>

          <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
            {categoria.pacotes.length === 1
              ? "Uma experiência disponível nesta categoria."
              : `${categoria.pacotes.length} experiências disponíveis nesta categoria.`}
          </p>
        </header>

        {!categoria.pacotes.length ? (
          <div className="surface-card flex min-h-64 items-center justify-center p-8 text-center">
            <div>
              <span className="section-kicker">Em breve</span>

              <h2 className="mt-4 text-xl font-bold text-default">
                Nenhum pacote disponível nesta categoria.
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted">
                Estamos preparando novas experiências.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoria.pacotes.map((pacote) => (
              <PacoteCard
                key={pacote.id}
                nome={pacote.nome}
                resumo={pacote.resumo ?? undefined}
                preco={pacote.preco !== null ? Number(pacote.preco) : undefined}
                moeda={pacote.moeda}
                imageUrl={pacote.fotos[0]?.url}
                dataEvento={formatarDataCurta(pacote.data_inicio)}
                href={`/pacotes/${pacote.slug}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
