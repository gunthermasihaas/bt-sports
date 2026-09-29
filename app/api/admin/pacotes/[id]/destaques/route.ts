import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";

type RouteContext = {
  params: Promise<{
    id?: string;
  }>;
};

function parsePacoteId(id?: string): number | null {
  if (!id || !/^\d+$/.test(id)) {
    return null;
  }

  const pacoteId = Number(id);

  if (!Number.isSafeInteger(pacoteId) || pacoteId <= 0) {
    return null;
  }

  return pacoteId;
}

function isPrismaErrorCode(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}

export async function PATCH(req: Request, context: RouteContext) {
  const authorization = await requireRole(["ADMIN", "EDITOR"]);

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

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: "JSON inválido",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("destaque" in body) ||
      typeof body.destaque !== "boolean"
    ) {
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
            id: {
              not: pacoteId,
            },
            destaque: true,
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
    if (isPrismaErrorCode(error, "P2002")) {
      return NextResponse.json(
        {
          error:
            "Não foi possível definir este pacote como destaque porque outro pacote foi definido como destaque simultaneamente.",
        },
        {
          status: 409,
        }
      );
    }

    if (isPrismaErrorCode(error, "P2025")) {
      return NextResponse.json(
        {
          error: "Pacote não encontrado",
        },
        {
          status: 404,
        }
      );
    }

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
