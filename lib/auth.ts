import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { loginIpRateLimit, loginRateLimit } from "@/lib/rate-limit";
import bcrypt from "bcrypt";
import { createHash } from "node:crypto";

type UserRole = "ADMIN" | "EDITOR";

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

type HeaderValue = string | string[] | undefined;

type HeadersLike = Record<string, HeaderValue>;

function getHeaderValue(
  headers: HeadersLike | undefined,
  name: string
): string | undefined {
  if (!headers) {
    return undefined;
  }

  const value = headers[name];

  if (Array.isArray(value)) {
    return value[0]?.trim() || undefined;
  }

  return value?.trim() || undefined;
}

function getClientIp(headers: HeadersLike | undefined): string {
  const realIp = getHeaderValue(headers, "x-real-ip");

  if (realIp) {
    return realIp;
  }

  const forwardedFor = getHeaderValue(headers, "x-forwarded-for");

  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();

    if (firstIp) {
      return firstIp;
    }
  }

  return "unknown";
}

function hashEmail(email: string): string {
  return createHash("sha256").update(email).digest("hex");
}

function isUserRole(value: unknown): value is UserRole {
  return value === "ADMIN" || value === "EDITOR";
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Senha",
          type: "password",
        },
      },

      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas");
        }

        const email = normalizeEmail(String(credentials.email));
        const password = String(credentials.password);

        const clientIp = getClientIp(req?.headers);
        const emailHash = hashEmail(email);

        try {
          const [emailLimit, ipLimit] = await Promise.all([
            loginRateLimit.limit(`${clientIp}:${emailHash}`),
            loginIpRateLimit.limit(clientIp),
          ]);

          if (!emailLimit.success || !ipLimit.success) {
            throw new Error("Muitas tentativas. Tente novamente mais tarde.");
          }
        } catch (error) {
          if (
            error instanceof Error &&
            error.message === "Muitas tentativas. Tente novamente mais tarde."
          ) {
            throw error;
          }

          console.error("NextAuth login rate limit", error);

          throw new Error(
            "Serviço de autenticação temporariamente indisponível"
          );
        }

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          throw new Error("Credenciais inválidas");
        }

        const senhaValida = await bcrypt.compare(password, user.password);

        if (!senhaValida) {
          throw new Error("Credenciais inválidas");
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  pages: {
    signIn: "/admin/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        if (!isUserRole(user.role)) {
          throw new Error("Perfil de usuário inválido");
        }

        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (!session.user) {
        return session;
      }

      if (!token.id || !isUserRole(token.role)) {
        throw new Error("Sessão inválida");
      }

      session.user.id = token.id;
      session.user.role = token.role;

      return session;
    },
  },
};
