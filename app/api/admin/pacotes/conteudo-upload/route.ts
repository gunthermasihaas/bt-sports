import { del, put } from "@vercel/blob";
import { NextResponse } from "next/server";

import { requireRole } from "@/lib/require-role";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const EXTENSIONS_BY_MIME: Record<string, Set<string>> = {
  "image/jpeg": new Set(["jpg", "jpeg"]),
  "image/png": new Set(["png"]),
  "image/webp": new Set(["webp"]),
  "image/avif": new Set(["avif"]),
};

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

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Erro desconhecido";
}

export async function POST(req: Request) {
  const authorization = await requireRole(["ADMIN", "EDITOR"]);

  if (!authorization.authorized) {
    return authorization.response;
  }

  let uploadedBlobUrl: string | null = null;

  try {
    let formData: FormData;

    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json(
        {
          error: "FormData inválido",
        },
        {
          status: 400,
        }
      );
    }

    const fileEntry = formData.get("file");

    if (!(fileEntry instanceof File)) {
      return NextResponse.json(
        {
          error: "Arquivo inválido",
        },
        {
          status: 400,
        }
      );
    }

    if (fileEntry.size <= 0) {
      return NextResponse.json(
        {
          error: "O arquivo está vazio",
        },
        {
          status: 400,
        }
      );
    }

    if (fileEntry.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "O arquivo excede o limite de 10 MB",
        },
        {
          status: 413,
        }
      );
    }

    const mimeType = fileEntry.type.toLowerCase();

    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        {
          error: "Formato de imagem não permitido",
        },
        {
          status: 400,
        }
      );
    }

    const extension = getFileExtension(fileEntry.name);
    const allowedExtensions = EXTENSIONS_BY_MIME[mimeType];

    if (!allowedExtensions?.has(extension)) {
      return NextResponse.json(
        {
          error:
            "A extensão do arquivo não corresponde ao tipo de imagem informado",
        },
        {
          status: 400,
        }
      );
    }

    const buffer = await fileEntry.arrayBuffer();

    if (!isValidImageSignature(buffer, mimeType)) {
      return NextResponse.json(
        {
          error: "O conteúdo do arquivo não corresponde ao formato informado",
        },
        {
          status: 400,
        }
      );
    }

    const safeFileName = getSafeFileName(fileEntry.name);

    const blobPath = [
      "pacotes",
      "conteudo",
      `${Date.now()}-${safeFileName}`,
    ].join("/");

    const blob = await put(blobPath, fileEntry, {
      access: "public",
      addRandomSuffix: true,
    });

    uploadedBlobUrl = blob.url;

    uploadedBlobUrl = null;

    return NextResponse.json(
      {
        success: true,
        url: blob.url,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    if (uploadedBlobUrl) {
      try {
        await del(uploadedBlobUrl);
      } catch (cleanupError) {
        console.error(
          "Erro ao remover Blob após falha no upload:",
          getErrorMessage(cleanupError)
        );
      }
    }

    console.error(
      "POST /api/admin/pacotes/conteudo-upload",
      getErrorMessage(error)
    );

    return NextResponse.json(
      {
        error: "Erro no upload da imagem do conteúdo",
      },
      {
        status: 500,
      }
    );
  }
}
