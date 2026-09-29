import { NextResponse } from "next/server";
import { Moeda } from "@/generated/prisma";
import { ZodError } from "zod";
import slugify from "slugify";

import { prisma } from "@/lib/prisma";
import { pacoteSchema } from "@/app/(admin)/admin/(protected)/pacotes/novo/schema";
import { requireRole } from "@/lib/require-role";

const MAX_CREATE_ATTEMPTS = 3;

function isPrismaErrorCode(error: unknown, code: string): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  return "code" in error && error.code === code;
}

function isUniqueConstraintError(error: unknown): boolean {
  return isPrismaErrorCode(error, "P2002");
}

function isForeignKeyConstraintError(error: unknown): boolean {
  return isPrismaErrorCode(error, "P2003");
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Erro desconhecido";
}

function createSlugCandidate(slugBase: string, attempt: number): string {
  if (attempt === 0) {
    return slugBase;
  }

  const suffix = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

  return `${slugBase}-${suffix}`;
}

export async function POST(req: Request) {
  const authorization = await requireRole(["ADMIN", "EDITOR"]);

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
    const body: unknown = await req.json();
    const data = pacoteSchema.parse(body);

    const dataInicio = data.data_inicio ? new Date(data.data_inicio) : null;

    if (dataInicio && Number.isNaN(dataInicio.getTime())) {
      return NextResponse.json(
        {
          error: "Data de início inválida",
        },
        {
          status: 400,
        }
      );
    }

    const slugBase = slugify(data.nome, {
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

    for (let attempt = 0; attempt < MAX_CREATE_ATTEMPTS; attempt++) {
      const slug = createSlugCandidate(slugBase, attempt);

      try {
        const pacote = await prisma.$transaction(async (tx) => {
          if (data.destaque === true) {
            await tx.pacote.updateMany({
              where: {
                destaque: true,
                deleted_at: null,
              },
              data: {
                destaque: false,
              },
            });
          }

          return tx.pacote.create({
            data: {
              nome: data.nome.trim(),
              slug,
              categoria_id: data.categoria_id,
              data_inicio: dataInicio,
              preco: data.preco,
              moeda: data.moeda as Moeda,
              texto_destaque: data.texto_destaque ?? null,
              resumo: data.resumo ?? null,
              descricao: data.descricao ?? null,
              destaque: data.destaque === true,
            },
          });
        });

        return NextResponse.json(
          {
            pacote,
          },
          {
            status: 201,
          }
        );
      } catch (error) {
        if (isUniqueConstraintError(error)) {
          if (attempt < MAX_CREATE_ATTEMPTS - 1) {
            continue;
          }

          return NextResponse.json(
            {
              error:
                "Não foi possível criar o pacote porque o nome gerou um identificador já utilizado. Tente novamente.",
            },
            {
              status: 409,
            }
          );
        }

        if (isForeignKeyConstraintError(error)) {
          return NextResponse.json(
            {
              error: "A categoria selecionada não existe",
            },
            {
              status: 400,
            }
          );
        }

        throw error;
      }
    }

    return NextResponse.json(
      {
        error: "Não foi possível criar o pacote",
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

    console.error("POST /api/admin/pacotes", getErrorMessage(error));

    return NextResponse.json(
      {
        error: "Erro ao criar pacote",
      },
      {
        status: 500,
      }
    );
  }
}
