import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";

const categoriaSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Nome da categoria é obrigatório")
    .max(100, "O nome da categoria deve ter no máximo 100 caracteres"),
});

const categoriaIdSchema = z.coerce
  .number()
  .int()
  .positive("ID da categoria inválido");

function gerarSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function isForeignKeyConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2003"
  );
}

export async function GET() {
  const authorization = await requireRole(["ADMIN", "EDITOR"]);

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
    const categorias = await prisma.categoriaViagem.findMany({
      orderBy: {
        nome: "asc",
      },
      select: {
        id: true,
        nome: true,
        slug: true,
        created_at: true,
        updated_at: true,
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
    });

    const resposta = categorias.map((categoria) => ({
      id: categoria.id,
      nome: categoria.nome,
      slug: categoria.slug,
      created_at: categoria.created_at,
      updated_at: categoria.updated_at,
      pacotes_count: categoria._count.pacotes,
    }));

    return NextResponse.json(resposta);
  } catch (error) {
    console.error("GET /api/admin/categorias-viagem", error);

    return NextResponse.json(
      {
        error: "Erro ao buscar categorias",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  const authorization = await requireRole(["ADMIN", "EDITOR"]);

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
    const body: unknown = await req.json();

    const result = categoriaSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: result.error.flatten().fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    const nome = result.data.nome;
    const slug = gerarSlug(nome);

    if (!slug) {
      return NextResponse.json(
        {
          error: "Não foi possível gerar um slug válido para a categoria",
        },
        {
          status: 400,
        }
      );
    }

    const categoriaExistente = await prisma.categoriaViagem.findFirst({
      where: {
        OR: [
          {
            nome: {
              equals: nome,
              mode: "insensitive",
            },
          },
          {
            slug,
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (categoriaExistente) {
      return NextResponse.json(
        {
          error: "Já existe uma categoria com esse nome ou slug",
        },
        {
          status: 409,
        }
      );
    }

    const categoria = await prisma.categoriaViagem.create({
      data: {
        nome,
        slug,
      },
      select: {
        id: true,
        nome: true,
        slug: true,
        created_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json(
      {
        ...categoria,
        pacotes_count: 0,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        {
          error: "Já existe uma categoria com esse nome ou slug",
        },
        {
          status: 409,
        }
      );
    }

    console.error("POST /api/admin/categorias-viagem", error);

    return NextResponse.json(
      {
        error: "Erro ao criar categoria",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req: Request) {
  const authorization = await requireRole(["ADMIN", "EDITOR"]);

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
    const url = new URL(req.url);
    const rawId = url.searchParams.get("id");

    const result = categoriaIdSchema.safeParse(rawId);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "ID da categoria inválido",
        },
        {
          status: 400,
        }
      );
    }

    const categoriaId = result.data;

    const categoria = await prisma.categoriaViagem.findUnique({
      where: {
        id: categoriaId,
      },
      select: {
        id: true,
        nome: true,
      },
    });

    if (!categoria) {
      return NextResponse.json(
        {
          error: "Categoria não encontrada",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * A exclusão da categoria só é permitida quando NÃO EXISTE
     * nenhum pacote relacionado a ela.
     *
     * Importante:
     * Não usamos deleted_at: null aqui.
     *
     * Pacotes excluídos logicamente continuam existindo no banco
     * e continuam referenciando a categoria. Portanto, também
     * impedem a exclusão física da categoria.
     */
    const pacotesCount = await prisma.pacote.count({
      where: {
        categoria_id: categoriaId,
      },
    });

    if (pacotesCount > 0) {
      return NextResponse.json(
        {
          error: `Não é possível excluir a categoria "${categoria.nome}" porque ela possui ${pacotesCount} pacote${
            pacotesCount === 1 ? "" : "s"
          } relacionado${pacotesCount === 1 ? "" : "s"}.`,
          pacotes_count: pacotesCount,
        },
        {
          status: 409,
        }
      );
    }

    await prisma.categoriaViagem.delete({
      where: {
        id: categoriaId,
      },
    });

    return NextResponse.json({
      success: true,
      id: categoriaId,
    });
  } catch (error) {
    if (isForeignKeyConstraintError(error)) {
      return NextResponse.json(
        {
          error:
            "Não é possível excluir esta categoria porque existem pacotes relacionados.",
        },
        {
          status: 409,
        }
      );
    }

    console.error("DELETE /api/admin/categorias-viagem", error);

    return NextResponse.json(
      {
        error: "Erro ao excluir categoria",
      },
      {
        status: 500,
      }
    );
  }
}
