import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

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

    const pacote = await prisma.pacote.findUnique({
      where: {
        id: pacoteId,
      },
      select: {
        id: true,
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

    const body = await req.json();

    if (typeof body.destaque !== "boolean") {
      return NextResponse.json(
        {
          error: "O campo destaque deve ser booleano",
        },
        {
          status: 400,
        }
      );
    }

    const destaque = body.destaque;

    await prisma.$transaction(async (tx) => {
      if (destaque) {
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
          destaque,
        },
      });
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("PATCH /api/admin/pacotes/[id]/destaques", error);

    return NextResponse.json(
      {
        error: "Erro ao atualizar destaque do pacote",
      },
      {
        status: 500,
      }
    );
  }
}
