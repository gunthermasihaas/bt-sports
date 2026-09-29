import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { Prisma } from "@/generated/prisma";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nome muito curto")
    .max(255, "Nome muito longo"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("E-mail inválido")
    .max(255, "E-mail muito longo"),

  password: z
    .string()
    .min(12, "A senha deve ter pelo menos 12 caracteres")
    .max(128, "A senha deve ter no máximo 128 caracteres"),
});

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
    const users = await prisma.user.findMany({
      orderBy: {
        email: "asc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/admin/users", error);

    return NextResponse.json(
      {
        error: "Erro ao buscar usuários",
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

    const result = createUserSchema.safeParse(body);

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

    const { name, email, password } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Já existe um usuário com esse e-mail",
        },
        {
          status: 409,
        }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role: "ADMIN",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json(user, {
      status: 201,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        {
          error: "Já existe um usuário com esse e-mail",
        },
        {
          status: 409,
        }
      );
    }

    console.error("POST /api/admin/users", error);

    return NextResponse.json(
      {
        error: "Erro ao criar usuário",
      },
      {
        status: 500,
      }
    );
  }
}
