import { NextResponse } from "next/server";
import { del, put } from "@vercel/blob";

import { TipoFoto } from "@/generated/prisma";

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

const REPLACEABLE_TYPES = new Set<TipoFoto>([
  TipoFoto.CAPA,
  TipoFoto.CARD,
  TipoFoto.BANNER,
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

function getTipoFoto(value: string): TipoFoto | null {
  const normalizedValue = value.trim().toUpperCase();

  const tipo = Object.values(TipoFoto).find(
    (enumValue) => enumValue === normalizedValue
  );

  return tipo ?? null;
}

function isPrismaErrorCode(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
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
    const tipoRaw = formData.get("tipo");
    const pacoteIdRaw = formData.get("pacoteId");

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

    if (typeof tipoRaw !== "string" || !tipoRaw.trim()) {
      return NextResponse.json(
        {
          error: "Tipo de foto é obrigatório",
        },
        {
          status: 400,
        }
      );
    }

    if (typeof pacoteIdRaw !== "string" || !/^\d+$/.test(pacoteIdRaw)) {
      return NextResponse.json(
        {
          error: "ID do pacote inválido",
        },
        {
          status: 400,
        }
      );
    }

    const pacoteId = Number(pacoteIdRaw);

    if (!Number.isSafeInteger(pacoteId) || pacoteId <= 0) {
      return NextResponse.json(
        {
          error: "ID do pacote inválido",
        },
        {
          status: 400,
        }
      );
    }

    const tipo = getTipoFoto(tipoRaw);

    if (!tipo) {
      return NextResponse.json(
        {
          error: "Tipo de foto inválido",
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

    if (!ALLOWED_EXTENSIONS.has(extension)) {
      return NextResponse.json(
        {
          error: "Extensão de arquivo não permitida",
        },
        {
          status: 400,
        }
      );
    }

    const allowedExtensionsForMime = EXTENSIONS_BY_MIME[mimeType];

    if (!allowedExtensionsForMime || !allowedExtensionsForMime.has(extension)) {
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

    const fileBuffer = await fileEntry.arrayBuffer();

    if (!isValidImageSignature(fileBuffer, mimeType)) {
      return NextResponse.json(
        {
          error: "O conteúdo do arquivo não corresponde ao formato informado",
        },
        {
          status: 400,
        }
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
        {
          error: "Pacote não encontrado",
        },
        {
          status: 404,
        }
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

    uploadedBlobUrl = blob.url;

    try {
      const resultado = await prisma.$transaction(
        async (tx) => {
          let fotoAnterior: {
            id: number;
            url: string;
          } | null = null;

          if (REPLACEABLE_TYPES.has(tipo)) {
            fotoAnterior = await tx.foto.findFirst({
              where: {
                pacote_id: pacoteId,
                tipo,
              },
              orderBy: {
                created_at: "desc",
              },
              select: {
                id: true,
                url: true,
              },
            });

            if (fotoAnterior) {
              await tx.foto.delete({
                where: {
                  id: fotoAnterior.id,
                },
              });
            }
          }

          const novaFoto = await tx.foto.create({
            data: {
              pacote_id: pacoteId,
              url: blob.url,
              tipo,
            },
          });

          return {
            novaFoto,
            fotoAnterior,
          };
        },
        {
          isolationLevel: "Serializable",
        }
      );

      if (resultado.fotoAnterior?.url) {
        try {
          await del(resultado.fotoAnterior.url);
        } catch (cleanupError) {
          console.error(
            "Erro ao remover Blob anterior:",
            getErrorMessage(cleanupError)
          );
        }
      }

      uploadedBlobUrl = null;

      return NextResponse.json(
        {
          success: true,
          foto: resultado.novaFoto,
          url: blob.url,
        },
        {
          status: 201,
        }
      );
    } catch (databaseError) {
      try {
        await del(blob.url);
        uploadedBlobUrl = null;
      } catch (cleanupError) {
        console.error(
          "Erro ao remover Blob após falha no banco:",
          getErrorMessage(cleanupError)
        );
      }

      if (isPrismaErrorCode(databaseError, "P2002")) {
        return NextResponse.json(
          {
            error:
              "Outra imagem deste tipo foi enviada simultaneamente. Tente novamente.",
          },
          {
            status: 409,
          }
        );
      }

      if (isPrismaErrorCode(databaseError, "P2034")) {
        return NextResponse.json(
          {
            error:
              "O upload entrou em conflito com outra alteração simultânea. Tente novamente.",
          },
          {
            status: 409,
          }
        );
      }

      if (isPrismaErrorCode(databaseError, "P2025")) {
        return NextResponse.json(
          {
            error:
              "A imagem anterior não pôde ser substituída porque o registro não foi encontrado.",
          },
          {
            status: 409,
          }
        );
      }

      console.error(
        "Erro ao salvar registro da foto:",
        getErrorMessage(databaseError)
      );

      return NextResponse.json(
        {
          error:
            "Imagem enviada, mas não foi possível salvar o registro no banco",
        },
        {
          status: 500,
        }
      );
    }
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

    console.error("POST /api/admin/pacotes/upload", getErrorMessage(error));

    return NextResponse.json(
      {
        error: "Erro no upload da imagem",
      },
      {
        status: 500,
      }
    );
  }
}
