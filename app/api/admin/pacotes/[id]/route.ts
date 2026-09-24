import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { pacotePatchSchema } from "@/app/(admin)/admin/(protected)/pacotes/novo/schema";

type RouteContext = {
  params: Promise<{
    id?: string;
  }>;
};

function parsePacoteId(id?: string) {
  if (!id || !/^\d+$/.test(id)) {
    return null;
  }

  const pacoteId = Number(id);

  if (!Number.isSafeInteger(pacoteId) || pacoteId <= 0) {
    return null;
  }

  return pacoteId;
}

export async function PATCH(req: Request, context: RouteContext) {
  const authorization = await requireAdmin();

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
    const { id } = await context.params;
    const pacoteId = parsePacoteId(id);

    if (!pacoteId) {
      return NextResponse.json(
        {
          error: "ID inválido",
        },
        {
          status: 400,
        }
      );
    }

    const pacoteExistente = await prisma.pacote.findUnique({
      where: {
        id: pacoteId,
      },
      select: {
        id: true,
        deleted_at: true,
      },
    });

    if (!pacoteExistente || pacoteExistente.deleted_at !== null) {
      return NextResponse.json(
        {
          error: "Pacote não encontrado",
        },
        {
          status: 404,
        }
      );
    }

    const body = await req.json();
    const data = pacotePatchSchema.parse(body);

    if (
      data.data_inicio &&
      Number.isNaN(new Date(data.data_inicio).getTime())
    ) {
      return NextResponse.json(
        {
          error: "Data de início inválida",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.$transaction(async (tx) => {
      if (data.destaque === true) {
        await tx.pacote.updateMany({
          where: {
            destaque: true,
            id: {
              not: pacoteId,
            },
            deleted_at: null,
          },
          data: {
            destaque: false,
          },
        });
      }

      await tx.pacote.update({
        where: {
          id: pacoteId,
        },
        data: {
          ...(data.nome !== undefined && {
            nome: data.nome.trim(),
          }),

          ...(data.categoria_id !== undefined && {
            categoria: {
              connect: {
                id: data.categoria_id,
              },
            },
          }),

          ...(data.data_inicio !== undefined && {
            data_inicio: data.data_inicio ? new Date(data.data_inicio) : null,
          }),

          ...(data.preco !== undefined && {
            preco: data.preco,
          }),

          ...(data.texto_destaque !== undefined && {
            texto_destaque: data.texto_destaque,
          }),

          ...(data.resumo !== undefined && {
            resumo: data.resumo,
          }),

          ...(data.descricao !== undefined && {
            descricao: data.descricao,
          }),

          ...(data.destaque !== undefined && {
            destaque: data.destaque,
          }),
        },
      });
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    console.error("PATCH /api/admin/pacotes/[id]", error);

    return NextResponse.json(
      {
        error: "Erro ao atualizar pacote",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  const authorization = await requireAdmin();

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
    const { id } = await context.params;
    const pacoteId = parsePacoteId(id);

    if (!pacoteId) {
      return NextResponse.json(
        {
          error: "ID inválido",
        },
        {
          status: 400,
        }
      );
    }

    const pacote = await prisma.pacote.findUnique({
      where: {
        id: pacoteId,
      },
      select: {
        id: true,
        destaque: true,
        deleted_at: true,
      },
    });

    if (!pacote || pacote.deleted_at !== null) {
      return NextResponse.json(
        {
          error: "Pacote não encontrado",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.pacote.update({
        where: {
          id: pacoteId,
        },
        data: {
          deleted_at: new Date(),
          destaque: false,
        },
      });

      if (pacote.destaque) {
        const novoDestaque = await tx.pacote.findFirst({
          where: {
            id: {
              not: pacoteId,
            },
            deleted_at: null,
          },
          orderBy: {
            created_at: "desc",
          },
          select: {
            id: true,
          },
        });

        if (novoDestaque) {
          await tx.pacote.update({
            where: {
              id: novoDestaque.id,
            },
            data: {
              destaque: true,
            },
          });
        }
      }
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("DELETE /api/admin/pacotes/[id]", error);

    return NextResponse.json(
      {
        error: "Erro ao excluir pacote",
      },
      {
        status: 500,
      }
    );
  }
}
