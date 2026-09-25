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
    return <div className="p-10">Categoria não encontrada</div>;
  }

  if (!categoria.pacotes.length) {
    return (
      <div className="rounded-lg border border-default bg-surface p-6 text-muted">
        Nenhum pacote disponível nesta categoria.
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">{categoria.nome}</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categoria.pacotes.map((pacote) => (
          <PacoteCard
            key={pacote.id}
            nome={pacote.nome}
            resumo={pacote.resumo ?? undefined}
            preco={pacote.preco ? Number(pacote.preco) : undefined}
            imageUrl={pacote.fotos[0]?.url ?? null}
            dataEvento={formatarDataCurta(pacote.data_inicio)}
            href={`/pacotes/${pacote.slug}`}
          />
        ))}
      </div>
    </>
  );
}
