import { NextResponse } from "next/server";
import { del, put } from "@vercel/blob";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "avif"]);

const updateSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .max(255, "Nome muito longo"),

  href: z.string().trim().url("Link inválido").max(2048, "Link muito longo"),

  ordem: z.coerce.number().int().min(0),
});

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getSafeFileName(fileName: string): string {
  const baseName = fileName.split(/[\\/]/).pop() ?? "";

  const safeName = baseName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return safeName || "logo";
}

function getExtension(fileName: string): string {
  const normalized = fileName.toLowerCase();
  const dot = normalized.lastIndexOf(".");

  if (dot <= 0) {
    return "";
  }

  return normalized.slice(dot + 1);
}

function isValidImageSignature(buffer: ArrayBuffer, mimeType: string): boolean {
  const bytes = new Uint8Array(buffer);

  switch (mimeType) {
    case "image/jpeg":
      return (
        bytes.length >= 3 &&
        bytes[0] === 0xff &&
        bytes[1] === 0xd8 &&
        bytes[2] === 0xff
      );

    case "image/png":
      return (
        bytes.length >= 8 &&
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47 &&
        bytes[4] === 0x0d &&
        bytes[5] === 0x0a &&
        bytes[6] === 0x1a &&
        bytes[7] === 0x0a
      );

    case "image/webp":
      return (
        bytes.length >= 12 &&
        bytes[0] === 0x52 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x46 &&
        bytes[3] === 0x46 &&
        bytes[8] === 0x57 &&
        bytes[9] === 0x45 &&
        bytes[10] === 0x42 &&
        bytes[11] === 0x50
      );

    case "image/avif":
      return (
        bytes.length >= 12 &&
        bytes[4] === 0x66 &&
        bytes[5] === 0x74 &&
        bytes[6] === 0x79 &&
        bytes[7] === 0x70 &&
        bytes[8] === 0x61 &&
        bytes[9] === 0x76 &&
        bytes[10] === 0x69 &&
        bytes[11] === 0x66
      );

    default:
      return false;
  }
}

async function uploadLogo(
  file: File,
  partnerId: number,
  variant: "desktop" | "mobile"
): Promise<string> {
  if (file.size <= 0) {
    throw new Error("O arquivo está vazio");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("O arquivo excede o limite de 10 MB");
  }

  const mimeType = file.type.toLowerCase();

  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new Error("Formato de imagem não permitido");
  }

  const extension = getExtension(file.name);

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    throw new Error("Extensão de arquivo não permitida");
  }

  const buffer = await file.arrayBuffer();

  if (!isValidImageSignature(buffer, mimeType)) {
    throw new Error(
      "O conteúdo do arquivo não corresponde ao formato informado"
    );
  }

  const safeName = getSafeFileName(file.name);

  const path = [
    "parceiros",
    String(partnerId),
    `${variant}-${Date.now()}-${safeName}`,
  ].join("/");

  const blob = await put(path, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return blob.url;
}

function getId(params: { id: string }): number | null {
  if (!/^\d+$/.test(params.id)) {
    return null;
  }

  const id = Number(params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export async function PATCH(req: Request, context: RouteContext) {
  const authorization = await requireRole(["ADMIN", "EDITOR"]);

  if (!authorization.authorized) {
    return authorization.response;
  }

  const params = await context.params;
  const id = getId(params);

  if (!id) {
    return NextResponse.json(
      {
        error: "ID do parceiro inválido",
      },
      {
        status: 400,
      }
    );
  }

  let newDesktopUrl: string | null = null;
  let newMobileUrl: string | null = null;

  try {
    const existing = await prisma.parceiro.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          error: "Parceiro não encontrado",
        },
        {
          status: 404,
        }
      );
    }

    const formData = await req.formData();

    const nomeRaw = formData.get("nome");
    const hrefRaw = formData.get("href");
    const ordemRaw = formData.get("ordem");
    const desktopFile = formData.get("logoDesktop");
    const mobileFile = formData.get("logoMobile");
    const removeMobileRaw = formData.get("removeMobile");

    if (typeof nomeRaw !== "string" || typeof hrefRaw !== "string") {
      return NextResponse.json(
        {
          error: "Nome e link são obrigatórios",
        },
        {
          status: 400,
        }
      );
    }

    const parsed = updateSchema.safeParse({
      nome: nomeRaw,
      href: hrefRaw,
      ordem: ordemRaw,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: parsed.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    if (!isHttpUrl(parsed.data.href)) {
      return NextResponse.json(
        {
          error: "O link deve começar com http:// ou https://",
        },
        {
          status: 400,
        }
      );
    }

    if (desktopFile instanceof File && desktopFile.size > 0) {
      newDesktopUrl = await uploadLogo(desktopFile, id, "desktop");
    }

    if (mobileFile instanceof File && mobileFile.size > 0) {
      newMobileUrl = await uploadLogo(mobileFile, id, "mobile");
    }

    const removeMobile = removeMobileRaw === "true" && !newMobileUrl;

    const parceiro = await prisma.parceiro.update({
      where: {
        id,
      },
      data: {
        nome: parsed.data.nome,
        href: parsed.data.href,
        ordem: parsed.data.ordem,
        ...(newDesktopUrl
          ? {
              logo_desktop_url: newDesktopUrl,
            }
          : {}),
        ...(newMobileUrl
          ? {
              logo_mobile_url: newMobileUrl,
            }
          : removeMobile
            ? {
                logo_mobile_url: null,
              }
            : {}),
      },
    });

    if (
      newDesktopUrl &&
      existing.logo_desktop_url &&
      existing.logo_desktop_url.startsWith("http")
    ) {
      try {
        await del(existing.logo_desktop_url);
      } catch (error) {
        console.error("Erro ao remover logo desktop anterior:", error);
      }
    }

    if (
      (newMobileUrl || removeMobile) &&
      existing.logo_mobile_url &&
      existing.logo_mobile_url.startsWith("http")
    ) {
      try {
        await del(existing.logo_mobile_url);
      } catch (error) {
        console.error("Erro ao remover logo mobile anterior:", error);
      }
    }

    return NextResponse.json({
      parceiro,
    });
  } catch (error) {
    if (newDesktopUrl) {
      try {
        await del(newDesktopUrl);
      } catch {}
    }

    if (newMobileUrl) {
      try {
        await del(newMobileUrl);
      } catch {}
    }

    console.error(`PATCH /api/admin/parceiros/${id}`, error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erro ao atualizar parceiro",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  const authorization = await requireRole(["ADMIN", "EDITOR"]);

  if (!authorization.authorized) {
    return authorization.response;
  }

  const params = await context.params;
  const id = getId(params);

  if (!id) {
    return NextResponse.json(
      {
        error: "ID do parceiro inválido",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const parceiro = await prisma.parceiro.findUnique({
      where: {
        id,
      },
    });

    if (!parceiro) {
      return NextResponse.json(
        {
          error: "Parceiro não encontrado",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.parceiro.delete({
      where: {
        id,
      },
    });

    const urls = [parceiro.logo_desktop_url, parceiro.logo_mobile_url].filter(
      (url): url is string => Boolean(url && url.startsWith("http"))
    );

    for (const url of urls) {
      try {
        await del(url);
      } catch (error) {
        console.error("Erro ao remover logo do Blob:", error);
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(`DELETE /api/admin/parceiros/${id}`, error);

    return NextResponse.json(
      {
        error: "Erro ao remover parceiro",
      },
      {
        status: 500,
      }
    );
  }
}
