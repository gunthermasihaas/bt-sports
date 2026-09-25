import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const categoriaSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Nome da categoria é obrigatório")
    .max(100, "O nome da categoria deve ter no máximo 100 caracteres"),
});

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

export async function GET() {
  const authorization = await requireAdmin();

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
      },
    });

    return NextResponse.json(categorias);
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
  const authorization = await requireAdmin();

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
          error: "Não foi possível gerar um slug válido",
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

    return NextResponse.json(categoria, {
      status: 201,
    });
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
