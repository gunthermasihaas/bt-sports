import { NextResponse } from "next/server";
import { ZodError } from "zod";
import slugify from "slugify";

import { Moeda } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { pacotePatchSchema } from "@/app/(admin)/admin/(protected)/pacotes/novo/schema";
import { requireRole } from "@/lib/require-role";

const MAX_UPDATE_ATTEMPTS = 3;

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

function createSlugCandidate(slugBase: string, attempt: number): string {
  if (attempt === 0) {
    return slugBase;
  }

  const suffix = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

  return `${slugBase}-${suffix}`;
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

    const body: unknown = await req.json();
    const data = pacotePatchSchema.parse(body);

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        {
          error: "Nenhuma alteração foi enviada",
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
        nome: true,
        slug: true,
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

    if (data.categoria_id !== undefined) {
      const categoria = await prisma.categoriaViagem.findUnique({
        where: {
          id: data.categoria_id,
        },
        select: {
          id: true,
        },
      });

      if (!categoria) {
        return NextResponse.json(
          {
            error: "Categoria não encontrada",
          },
          {
            status: 400,
          }
        );
      }
    }

    let slugBase: string | undefined;

    if (data.nome !== undefined && data.nome.trim() !== pacoteExistente.nome) {
      slugBase = slugify(data.nome.trim(), {
        lower: true,
        strict: true,
        trim: true,
      });

      if (!slugBase) {
        return NextResponse.json(
          {
            error: "Não foi possível gerar um slug válido para o pacote",
          },
          {
            status: 400,
          }
        );
      }
    }

    for (let attempt = 0; attempt < MAX_UPDATE_ATTEMPTS; attempt += 1) {
      const novoSlug =
        slugBase !== undefined
          ? createSlugCandidate(slugBase, attempt)
          : undefined;

      try {
        await prisma.$transaction(async (tx) => {
          if (data.destaque === true) {
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
              ...(data.nome !== undefined && {
                nome: data.nome.trim(),
              }),

              ...(novoSlug !== undefined && {
                slug: novoSlug,
              }),

              ...(data.categoria_id !== undefined && {
                categoria_id: data.categoria_id,
              }),

              ...(data.data_inicio !== undefined && {
                data_inicio:
                  data.data_inicio === ""
                    ? null
                    : new Date(`${data.data_inicio}T00:00:00`),
              }),

              ...(data.preco !== undefined && {
                preco: data.preco,
              }),

              ...(data.moeda !== undefined && {
                moeda: data.moeda as Moeda,
              }),

              ...(data.texto_destaque !== undefined && {
                texto_destaque: data.texto_destaque?.trim() || null,
              }),

              ...(data.resumo !== undefined && {
                resumo: data.resumo?.trim() || null,
              }),

              ...(data.descricao !== undefined && {
                descricao: data.descricao?.trim() || null,
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
        if (isPrismaErrorCode(error, "P2002")) {
          if (slugBase !== undefined && attempt < MAX_UPDATE_ATTEMPTS - 1) {
            continue;
          }

          return NextResponse.json(
            {
              error:
                "Não foi possível atualizar o pacote porque o identificador gerado já está em uso. Tente novamente.",
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

        throw error;
      }
    }

    return NextResponse.json(
      {
        error: "Não foi possível atualizar o pacote",
      },
      {
        status: 500,
      }
    );
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
      await tx.pacote.delete({
        where: {
          id: pacoteId,
        },
      });

      if (pacote.destaque) {
        const novoDestaque = await tx.pacote.findFirst({
          where: {
            deleted_at: null,
            destaque: false,
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
      id: pacoteId,
    });
  } catch (error) {
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

    if (isPrismaErrorCode(error, "P2003")) {
      return NextResponse.json(
        {
          error:
            "Não foi possível excluir o pacote porque existem registros relacionados.",
        },
        {
          status: 409,
        }
      );
    }

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
