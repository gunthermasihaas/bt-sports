import { NextResponse } from "next/server";
import { Moeda } from "@/generated/prisma";
import { ZodError } from "zod";
import slugify from "slugify";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { pacoteSchema } from "@/app/(admin)/admin/(protected)/pacotes/novo/schema";

const MAX_CREATE_ATTEMPTS = 3;

function isUniqueConstraintError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  return "code" in error && error.code === "P2002";
}

export async function POST(req: Request) {
  const authorization = await requireAdmin();

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

    let slug = slugBase;

    for (let attempt = 0; attempt < MAX_CREATE_ATTEMPTS; attempt++) {
      if (attempt === 0) {
        slug = slugBase;
      } else {
        slug = `${slugBase}-${attempt}`;
      }

      try {
        while (await prisma.pacote.findUnique({ where: { slug } })) {
          const suffix = Math.floor(Math.random() * 1_000_000);

          slug = `${slugBase}-${suffix}`;
        }

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
        if (!isUniqueConstraintError(error)) {
          throw error;
        }

        if (attempt === MAX_CREATE_ATTEMPTS - 1) {
          throw error;
        }
      }
    }

    throw new Error("Não foi possível criar o pacote");
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

    console.error("POST /api/admin/pacotes", error);

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
