import { del, list } from "@vercel/blob";
import { NextResponse } from "next/server";

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

function extractUrlsFromHtml(html: string | null): string[] {
  if (!html) {
    return [];
  }

  const urls = new Set<string>();

  const srcRegex = /\bsrc\s*=\s*["']([^"']+)["']/gi;

  for (const match of html.matchAll(srcRegex)) {
    const url = match[1]?.trim();

    if (url) {
      urls.add(url);
    }
  }

  return [...urls];
}

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
    const [blobs, fotos, pacotes] = await Promise.all([
      listAllPackageBlobs(),

      prisma.foto.findMany({
        select: {
          url: true,
        },
      }),

      prisma.pacote.findMany({
        select: {
          descricao: true,
        },
      }),
    ]);

    const urlsEmUso = new Set<string>();

    for (const foto of fotos) {
      urlsEmUso.add(foto.url);
    }

    for (const pacote of pacotes) {
      for (const url of extractUrlsFromHtml(pacote.descricao)) {
        urlsEmUso.add(url);
      }
    }

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
      totalPacotesComDescricao: pacotes.length,
      totalUrlsEmUso: urlsEmUso.size,
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

export async function POST() {
  const authorization = await requireRole(["ADMIN", "EDITOR"]);

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
    const [blobs, fotos, pacotes] = await Promise.all([
      listAllPackageBlobs(),

      prisma.foto.findMany({
        select: {
          url: true,
        },
      }),

      prisma.pacote.findMany({
        select: {
          descricao: true,
        },
      }),
    ]);

    const urlsEmUso = new Set<string>();

    for (const foto of fotos) {
      urlsEmUso.add(foto.url);
    }

    for (const pacote of pacotes) {
      for (const url of extractUrlsFromHtml(pacote.descricao)) {
        urlsEmUso.add(url);
      }
    }

    const limiteData = Date.now() - MIN_AGE_MS;

    const orfaos = blobs.filter((blob) => {
      const idadeSegura = blob.uploadedAt.getTime() < limiteData;
      const naoEstaNoBanco = !urlsEmUso.has(blob.url);

      return idadeSegura && naoEstaNoBanco;
    });

    if (orfaos.length === 0) {
      return NextResponse.json({
        success: true,
        deleted: 0,
        message: "Nenhum Blob órfão encontrado.",
      });
    }

    await del(orfaos.map((blob) => blob.url));

    return NextResponse.json({
      success: true,
      deleted: orfaos.length,
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
