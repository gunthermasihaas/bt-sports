import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";

type AdminSessionUser = {
  id?: string;
  role?: string;
  email?: string | null;
};

type AdminSession = {
  user?: AdminSessionUser;
};

type RequireAdminResult =
  | {
      authorized: true;
      session: AdminSession;
    }
  | {
      authorized: false;
      response: NextResponse;
    };

export async function requireAdmin(): Promise<RequireAdminResult> {
  const session = (await getServerSession(authOptions)) as AdminSession | null;

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

  if (session.user.role !== "admin") {
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
