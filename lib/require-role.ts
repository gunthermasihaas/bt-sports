import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";

export type UserRole = "ADMIN" | "EDITOR";

type SessionUser = {
  id?: string;
  role?: string;
  email?: string | null;
};

type Session = {
  user?: SessionUser;
};

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
  allowedRoles: UserRole[]
): Promise<RequireRoleResult> {
  const session = (await getServerSession(authOptions)) as Session | null;

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
