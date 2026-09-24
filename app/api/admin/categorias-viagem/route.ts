import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

function gerarSlug(nome: string) {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
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
    const body = await req.json();

    if (typeof body.nome !== "string" || !body.nome.trim()) {
      return NextResponse.json(
        {
          error: "Nome da categoria é obrigatório",
        },
        {
          status: 400,
        }
      );
    }

    const nome = body.nome.trim();

    if (nome.length > 100) {
      return NextResponse.json(
        {
          error: "O nome da categoria deve ter no máximo 100 caracteres",
        },
        {
          status: 400,
        }
      );
    }

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
    });

    return NextResponse.json(categoria, {
      status: 201,
    });
  } catch (error) {
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
