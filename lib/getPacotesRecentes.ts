import { TipoFoto } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { pacotesMock } from "@/mocks/pacotes";
import { formatarDataCurta } from "@/lib/formatarData";

export async function getPacotesRecentes(limit = 6) {
  try {
    const pacotes = await prisma.pacote.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: "desc",
      },
      take: limit,
      include: {
        fotos: {
          where: { tipo: TipoFoto.CARD },
          take: 1,
        },
      },
    });

    if (!pacotes.length) {
      return pacotesMock.slice(0, limit);
    }

    return pacotes.map((pacote) => ({
      id: pacote.id,
      nome: pacote.nome,
      resumo: pacote.resumo,
      preco: pacote.preco ? Number(pacote.preco) : undefined,
      moeda: pacote.moeda,
      dataEvento: formatarDataCurta(pacote.data_inicio),
      imageUrl: pacote.fotos[0]?.url,
      href: `/pacotes/${pacote.slug}`,
    }));
  } catch (error) {
    console.error("[getPacotesRecentes]", error);
    return pacotesMock.slice(0, limit);
  }
}
