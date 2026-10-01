import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";

import { authOptions } from "@/lib/auth";

export type UserRole = "ADMIN" | "EDITOR";

type RequireRoleResult =
  | {
      authorized: true;
      session: Session;
    }
  | {
      authorized: false;
      response: NextResponse;
    };

export async function requireRole(
  allowedRoles: readonly UserRole[]
): Promise<RequireRoleResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          error: "Não autenticado",
        },
        {
          status: 401,
        }
      ),
    };
  }

  const role = session.user.role;

  if (!role || !allowedRoles.includes(role as UserRole)) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          error: "Acesso negado",
        },
        {
          status: 403,
        }
      ),
    };
  }

  return {
    authorized: true,
    session,
  };
}
