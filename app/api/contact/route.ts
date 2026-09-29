import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

import { contactRateLimit } from "@/lib/rate-limit";

const contactSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(120, "O nome é muito longo"),

  email: z
    .string()
    .trim()
    .email("E-mail inválido")
    .max(254, "O e-mail é muito longo"),

  telefone: z
    .string()
    .trim()
    .max(30, "O telefone é muito longo")
    .optional()
    .default(""),

  estado: z
    .string()
    .trim()
    .max(100, "O estado é muito longo")
    .optional()
    .default(""),

  cidade: z
    .string()
    .trim()
    .max(100, "A cidade é muito longa")
    .optional()
    .default(""),

  mensagem: z
    .string()
    .trim()
    .min(10, "A mensagem deve ter pelo menos 10 caracteres")
    .max(5000, "A mensagem é muito longa"),
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${name}`);
  }

  return value;
}

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();

    if (firstIp) {
      return firstIp;
    }
  }

  const realIp = req.headers.get("x-real-ip")?.trim();

  if (realIp) {
    return realIp;
  }

  return "unknown";
}

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);

    try {
      const rateLimit = await contactRateLimit.limit(clientIp);

      if (!rateLimit.success) {
        const retryAfter = Math.max(
          1,
          Math.ceil((rateLimit.reset - Date.now()) / 1000)
        );

        return NextResponse.json(
          {
            success: false,
            error: "Muitas tentativas. Tente novamente mais tarde.",
          },
          {
            status: 429,
            headers: {
              "Retry-After": String(retryAfter),
              "X-RateLimit-Limit": String(rateLimit.limit),
              "X-RateLimit-Remaining": String(rateLimit.remaining),
            },
          }
        );
      }
    } catch (error) {
      console.error("POST /api/contact rate limit", error);
    }

    const body: unknown = await req.json();

    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { nome, email, telefone, estado, cidade, mensagem } = result.data;

    const smtpHost = getRequiredEnv("SMTP_HOST");
    const smtpPortRaw = getRequiredEnv("SMTP_PORT");
    const smtpUser = getRequiredEnv("SMTP_USER");
    const smtpPass = getRequiredEnv("SMTP_PASS");
    const adminEmail = getRequiredEnv("ADMIN_EMAIL");

    const smtpPort = Number(smtpPortRaw);

    if (!Number.isInteger(smtpPort) || smtpPort <= 0 || smtpPort > 65535) {
      throw new Error("SMTP_PORT inválida");
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const safeNome = escapeHtml(nome);
    const safeEmail = escapeHtml(email);
    const safeTelefone = escapeHtml(telefone || "-");
    const safeEstado = escapeHtml(estado || "-");
    const safeCidade = escapeHtml(cidade || "-");
    const safeMensagem = escapeHtml(mensagem).replace(/\r?\n/g, "<br />");

    await transporter.sendMail({
      from: `"Contato Site" <${smtpUser}>`,
      to: adminEmail,
      replyTo: email,
      subject: "Novo contato pelo site",

      text: [
        "Novo contato",
        "",
        `Nome: ${nome}`,
        `E-mail: ${email}`,
        `Telefone: ${telefone || "-"}`,
        `Estado: ${estado || "-"}`,
        `Cidade: ${cidade || "-"}`,
        "",
        "Mensagem:",
        mensagem,
      ].join("\n"),

      html: `
        <!doctype html>
        <html lang="pt-BR">
          <body>
            <h2>Novo contato</h2>

            <p>
              <strong>Nome:</strong>
              ${safeNome}
            </p>

            <p>
              <strong>E-mail:</strong>
              ${safeEmail}
            </p>

            <p>
              <strong>Telefone:</strong>
              ${safeTelefone}
            </p>

            <p>
              <strong>Estado:</strong>
              ${safeEstado}
            </p>

            <p>
              <strong>Cidade:</strong>
              ${safeCidade}
            </p>

            <p>
              <strong>Mensagem:</strong>
            </p>

            <p>${safeMensagem}</p>
          </body>
        </html>
      `,
    });

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("POST /api/contact", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao enviar mensagem",
      },
      {
        status: 500,
      }
    );
  }
}
