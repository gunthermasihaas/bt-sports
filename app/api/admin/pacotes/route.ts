import { NextResponse } from "next/server";
import { ZodError } from "zod";
import slugify from "slugify";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { pacoteSchema } from "@/app/(admin)/admin/(protected)/pacotes/novo/schema";

export async function POST(req: Request) {
  const authorization = await requireAdmin();

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
    const body = await req.json();
    const data = pacoteSchema.parse(body);

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
    let count = 1;

    while (await prisma.pacote.findUnique({ where: { slug } })) {
      slug = `${slugBase}-${count++}`;
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
          data_inicio: data.data_inicio ? new Date(data.data_inicio) : null,
          preco: data.preco,
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
