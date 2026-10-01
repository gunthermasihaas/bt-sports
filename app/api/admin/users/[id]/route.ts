import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { Prisma } from "@/generated/prisma";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";

const PROTECTED_ADMIN_EMAIL = "gunther@biarritz.com.br";

const updateUserSchema = z.object({
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
    .max(128, "A senha deve ter no máximo 128 caracteres")
    .optional()
    .or(z.literal("")),

  role: z.enum(["ADMIN", "EDITOR"]),
});

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(req: Request, context: RouteContext) {
  const authorization = await requireRole(["ADMIN"]);

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
    const { id } = await context.params;

    if (!id.trim()) {
      return NextResponse.json(
        {
          error: "ID do usuário é obrigatório",
        },
        {
          status: 400,
        }
      );
    }

    const body: unknown = await req.json();

    const result = updateUserSchema.safeParse(body);

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

    const { name, email, password, role } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          error: "Usuário não encontrado",
        },
        {
          status: 404,
        }
      );
    }

    const isProtectedUser =
      existingUser.email.toLowerCase() === PROTECTED_ADMIN_EMAIL;

    if (isProtectedUser) {
      if (email !== PROTECTED_ADMIN_EMAIL) {
        return NextResponse.json(
          {
            error: "O e-mail da conta principal não pode ser alterado",
          },
          {
            status: 403,
          }
        );
      }

      if (role !== "ADMIN") {
        return NextResponse.json(
          {
            error:
              "A conta principal não pode perder o perfil de administrador",
          },
          {
            status: 403,
          }
        );
      }
    }

    if (existingUser.role === "ADMIN" && role !== "ADMIN") {
      const totalAdmins = await prisma.user.count({
        where: {
          role: "ADMIN",
        },
      });

      if (totalAdmins <= 1) {
        return NextResponse.json(
          {
            error: "Não é possível remover o último administrador",
          },
          {
            status: 400,
          }
        );
      }
    }

    const data: {
      name: string;
      email: string;
      role: "ADMIN" | "EDITOR";
      password?: string;
    } = {
      name,
      email: isProtectedUser ? PROTECTED_ADMIN_EMAIL : email,
      role: isProtectedUser ? "ADMIN" : role,
    };

    if (password && password.trim().length > 0) {
      data.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json(updatedUser);
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

    console.error("PATCH /api/admin/users/[id]", error);

    return NextResponse.json(
      {
        error: "Erro ao atualizar usuário",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  const authorization = await requireRole(["ADMIN"]);

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
    const { id } = await context.params;

    if (!id.trim()) {
      return NextResponse.json(
        {
          error: "ID do usuário é obrigatório",
        },
        {
          status: 400,
        }
      );
    }

    const currentUserId = authorization.session.user?.id;

    if (currentUserId === id) {
      return NextResponse.json(
        {
          error: "Você não pode excluir o próprio usuário",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Usuário não encontrado",
        },
        {
          status: 404,
        }
      );
    }

    const isProtectedUser = user.email.toLowerCase() === PROTECTED_ADMIN_EMAIL;

    if (isProtectedUser) {
      return NextResponse.json(
        {
          error: "A conta principal não pode ser excluída",
        },
        {
          status: 403,
        }
      );
    }

    if (user.role === "ADMIN") {
      const totalAdmins = await prisma.user.count({
        where: {
          role: "ADMIN",
        },
      });

      if (totalAdmins <= 1) {
        return NextResponse.json(
          {
            error: "Não é possível excluir o último administrador",
          },
          {
            status: 400,
          }
        );
      }
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE /api/admin/users/[id]", error);

    return NextResponse.json(
      {
        error: "Erro ao excluir usuário",
      },
      {
        status: 500,
      }
    );
  }
}
