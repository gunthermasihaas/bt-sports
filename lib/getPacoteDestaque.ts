import { TipoFoto } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export async function getPacoteDestaque() {
  const pacote = await prisma.pacote.findFirst({
    where: {
      destaque: true,
      deleted_at: null,
    },
    include: {
      fotos: {
        where: {
          tipo: TipoFoto.BANNER,
        },
        take: 1,
      },
    },
  });

  if (!pacote) {
    return null;
  }

  return {
    id: pacote.id,
    nome: pacote.nome,
    resumo: pacote.resumo ?? undefined,
    preco: pacote.preco !== null ? Number(pacote.preco) : undefined,
    moeda: pacote.moeda,
    imageUrl: pacote.fotos[0]?.url,
    dataInicio: pacote.data_inicio,
    href: `/pacotes/${pacote.slug}`,
    slug: pacote.slug,
  };
}
