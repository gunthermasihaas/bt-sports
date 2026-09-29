import { prisma } from "@/lib/prisma";

export async function getCategoriasHome() {
  return prisma.categoriaViagem.findMany({
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
}
