import { prisma } from "@/lib/prisma";
import { categoriasHomeMock } from "@/mocks/categoriasHome";

export async function getCategoriasHome() {
  const categoriasDb = await prisma.categoriaViagem.findMany({
    where: {
      pacotes: {
        some: {
          deleted_at: null,
        },
      },
    },
    include: {
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
    orderBy: {
      nome: "asc",
    },
  });

  const categoriasComPacotes = categoriasDb.filter(
    (categoria) => categoria._count.pacotes > 0
  );

  if (categoriasComPacotes.length > 0) {
    return categoriasComPacotes;
  }

  return categoriasHomeMock;
}
