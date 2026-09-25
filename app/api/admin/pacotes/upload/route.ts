import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

import { TipoFoto } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "avif"]);

function getSafeFileName(fileName: string): string {
  const fileNameWithoutPath = fileName.split(/[\\/]/).pop() ?? "";

  const safeFileName = fileNameWithoutPath
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return safeFileName || "imagem";
}

function getFileExtension(fileName: string): string {
  const normalizedFileName = fileName.toLowerCase();
  const lastDotIndex = normalizedFileName.lastIndexOf(".");

  if (lastDotIndex <= 0) {
    return "";
  }

  return normalizedFileName.slice(lastDotIndex + 1);
}

function getTipoFoto(value: string): TipoFoto | null {
  const normalizedValue = value.trim().toUpperCase();

  const tipo = Object.values(TipoFoto).find(
    (enumValue) => enumValue === normalizedValue
  );

  return tipo ?? null;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Erro desconhecido";
}

export async function POST(req: Request) {
  const authorization = await requireAdmin();

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
    const formData = await req.formData();

    const fileEntry = formData.get("file");
    const tipoRaw = formData.get("tipo");
    const pacoteIdRaw = formData.get("pacoteId");

    if (!(fileEntry instanceof File)) {
      return NextResponse.json({ error: "Arquivo inválido" }, { status: 400 });
    }

    if (typeof tipoRaw !== "string" || !tipoRaw.trim()) {
      return NextResponse.json(
        { error: "Tipo de foto é obrigatório" },
        { status: 400 }
      );
    }

    if (typeof pacoteIdRaw !== "string" || !/^\d+$/.test(pacoteIdRaw)) {
      return NextResponse.json(
        { error: "ID do pacote inválido" },
        { status: 400 }
      );
    }

    const pacoteId = Number(pacoteIdRaw);

    if (!Number.isSafeInteger(pacoteId) || pacoteId <= 0) {
      return NextResponse.json(
        { error: "ID do pacote inválido" },
        { status: 400 }
      );
    }

    const tipo = getTipoFoto(tipoRaw);

    if (!tipo) {
      return NextResponse.json(
        { error: "Tipo de foto inválido" },
        { status: 400 }
      );
    }

    if (fileEntry.size <= 0) {
      return NextResponse.json(
        { error: "O arquivo está vazio" },
        { status: 400 }
      );
    }

    if (fileEntry.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "O arquivo excede o limite de 10 MB" },
        { status: 413 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(fileEntry.type.toLowerCase())) {
      return NextResponse.json(
        { error: "Formato de imagem não permitido" },
        { status: 400 }
      );
    }

    const extension = getFileExtension(fileEntry.name);

    if (!ALLOWED_EXTENSIONS.has(extension)) {
      return NextResponse.json(
        { error: "Extensão de arquivo não permitida" },
        { status: 400 }
      );
    }

    const pacote = await prisma.pacote.findUnique({
      where: {
        id: pacoteId,
      },
      select: {
        id: true,
        deleted_at: true,
      },
    });

    if (!pacote || pacote.deleted_at !== null) {
      return NextResponse.json(
        { error: "Pacote não encontrado" },
        { status: 404 }
      );
    }

    const safeFileName = getSafeFileName(fileEntry.name);
    const timestamp = Date.now();

    const blobPath = [
      "pacotes",
      String(pacoteId),
      `${tipo.toLowerCase()}-${timestamp}-${safeFileName}`,
    ].join("/");

    const blob = await put(blobPath, fileEntry, {
      access: "public",
      addRandomSuffix: true,
    });

    try {
      const foto = await prisma.foto.create({
        data: {
          pacote_id: pacoteId,
          url: blob.url,
          tipo,
        },
      });

      return NextResponse.json(
        {
          success: true,
          foto,
          url: blob.url,
        },
        { status: 201 }
      );
    } catch (databaseError) {
      console.error(
        "Erro ao salvar registro da foto:",
        getErrorMessage(databaseError)
      );

      return NextResponse.json(
        {
          error:
            "Imagem enviada, mas não foi possível salvar o registro no banco",
          url: blob.url,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("POST /api/admin/pacotes/upload", getErrorMessage(error));

    return NextResponse.json(
      { error: "Erro no upload da imagem" },
      { status: 500 }
    );
  }
}
