import { prisma } from "@/lib/prisma";
import { pacotesMock } from "@/mocks/pacotes";
import { formatarDataCurta } from "@/lib/formatarData";
import { TipoFoto } from "@/generated/prisma";

export type Order = "nome" | "data" | "preco-asc" | "preco-desc";

type PacoteOrderBy = {
  nome?: "asc" | "desc";
  data_inicio?: "asc" | "desc";
  preco?: "asc" | "desc";
};

const ORDER_BY_MAP = {
  nome: { nome: "asc" },
  data: { data_inicio: "asc" },
  "preco-asc": { preco: "asc" },
  "preco-desc": { preco: "desc" },
} satisfies Record<Order, PacoteOrderBy>;

export async function getPacotesUi(order: Order) {
  const orderBy = ORDER_BY_MAP[order];

  const pacotesDb = await prisma.pacote.findMany({
    where: {
      deleted_at: null,
    },
    orderBy,
    include: {
      fotos: {
        where: { tipo: TipoFoto.CARD },
        take: 1,
      },
    },
  });

  if (pacotesDb.length === 0) {
    const pacotes = [...pacotesMock];

    switch (order) {
      case "nome":
        return pacotes.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

      case "data":
        return pacotes.sort(
          (a, b) =>
            new Date(a.dataEvento).getTime() - new Date(b.dataEvento).getTime()
        );

      case "preco-asc":
        return pacotes.sort((a, b) => a.preco - b.preco);

      case "preco-desc":
        return pacotes.sort((a, b) => b.preco - a.preco);

      default:
        return pacotes;
    }
  }

  return pacotesDb.map((p) => ({
    id: p.id,
    nome: p.nome,
    resumo: p.resumo ?? "",
    preco: Number(p.preco ?? 0),
    moeda: p.moeda,
    dataEvento: formatarDataCurta(p.data_inicio),
    imageUrl: p.fotos[0]?.url,
    href: `/pacotes/${p.slug}`,
  }));
}
