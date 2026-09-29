import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { loginRateLimit } from "@/lib/rate-limit";
import bcrypt from "bcrypt";

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
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
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas");
        }

        const email = normalizeEmail(credentials.email);

        try {
          const rateLimit = await loginRateLimit.limit(email);

          if (!rateLimit.success) {
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
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error("Credenciais inválidas");
        }

        const senhaValida = await bcrypt.compare(
          credentials.password,
          user.password
        );

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

        if ("role" in user && typeof user.role === "string") {
          token.role = user.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
};
