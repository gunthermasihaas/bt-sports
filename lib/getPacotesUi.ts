import { TipoFoto } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { formatarDataCurta } from "@/lib/formatarData";
import type { Moeda } from "@/types/moedas";

export type Order = "nome" | "data" | "preco-asc" | "preco-desc";

export type PacoteUi = {
  id: number;
  nome: string;
  slug: string;
  resumo: string;
  preco: number;
  moeda: Moeda;
  dataEvento: string;
  imageUrl?: string;
  href: string;
};

type PacoteOrderBy =
  | {
      nome: "asc" | "desc";
    }
  | {
      data_inicio: {
        sort: "asc" | "desc";
        nulls: "first" | "last";
      };
    }
  | {
      preco: "asc" | "desc";
    };

const ORDER_BY_MAP = {
  nome: { nome: "asc" },
  data: {
    data_inicio: {
      sort: "asc",
      nulls: "last",
    },
  },
  "preco-asc": { preco: "asc" },
  "preco-desc": { preco: "desc" },
} satisfies Record<Order, PacoteOrderBy>;

export async function getPacotesUi(order: Order): Promise<PacoteUi[]> {
  const orderBy = ORDER_BY_MAP[order];

  const pacotesDb = await prisma.pacote.findMany({
    where: {
      deleted_at: null,
    },
    orderBy,
    include: {
      fotos: {
        where: {
          tipo: TipoFoto.CARD,
        },
        take: 1,
      },
    },
  });

  return pacotesDb.map((pacote) => ({
    id: pacote.id,
    nome: pacote.nome,
    slug: pacote.slug,
    resumo: pacote.resumo ?? "",
    preco: Number(pacote.preco ?? 0),
    moeda: pacote.moeda,
    dataEvento: formatarDataCurta(pacote.data_inicio) ?? "",
    imageUrl: pacote.fotos[0]?.url,
    href: `/pacotes/${pacote.slug}`,
  }));
}
