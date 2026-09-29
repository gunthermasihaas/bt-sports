import { NextResponse } from "next/server";
import { del, list } from "@vercel/blob";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";

const BATCH_SIZE = 1000;
const MIN_AGE_MS = 24 * 60 * 60 * 1000;

type BlobItem = {
  url: string;
  pathname: string;
  uploadedAt: Date;
  size: number;
};

async function listAllPackageBlobs(): Promise<BlobItem[]> {
  const blobs: BlobItem[] = [];

  let cursor: string | undefined;

  do {
    const result = await list({
      prefix: "pacotes/",
      limit: BATCH_SIZE,
      cursor,
    });

    blobs.push(...result.blobs);

    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  return blobs;
}

export async function GET() {
  const authorization = await requireRole(["ADMIN", "EDITOR"]);

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
    const [blobs, fotos] = await Promise.all([
      listAllPackageBlobs(),

      prisma.foto.findMany({
        select: {
          url: true,
        },
      }),
    ]);

    const urlsEmUso = new Set(fotos.map((foto) => foto.url));

    const limiteData = Date.now() - MIN_AGE_MS;

    const orfaos = blobs.filter((blob) => {
      const idadeSegura = blob.uploadedAt.getTime() < limiteData;
      const naoEstaNoBanco = !urlsEmUso.has(blob.url);

      return idadeSegura && naoEstaNoBanco;
    });

    const tamanhoTotal = orfaos.reduce((total, blob) => total + blob.size, 0);

    return NextResponse.json({
      success: true,
      totalBlobs: blobs.length,
      totalFotosNoBanco: fotos.length,
      totalOrfaos: orfaos.length,
      tamanhoTotalBytes: tamanhoTotal,
      orfaos,
    });
  } catch (error) {
    console.error("GET /api/admin/blob-cleanup", error);

    return NextResponse.json(
      {
        error: "Erro ao auditar Blobs",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  const authorization = await requireRole(["ADMIN", "EDITOR"]);

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
    const auditResponse = await GET();

    if (!auditResponse.ok) {
      return auditResponse;
    }

    const audit = (await auditResponse.json()) as {
      orfaos: BlobItem[];
    };

    const urls = audit.orfaos.map((blob) => blob.url);

    if (urls.length === 0) {
      return NextResponse.json({
        success: true,
        deleted: 0,
        message: "Nenhum Blob órfão encontrado.",
      });
    }

    await del(urls);

    return NextResponse.json({
      success: true,
      deleted: urls.length,
    });
  } catch (error) {
    console.error("POST /api/admin/blob-cleanup", error);

    return NextResponse.json(
      {
        error: "Erro ao remover Blobs órfãos",
      },
      {
        status: 500,
      }
    );
  }
}
