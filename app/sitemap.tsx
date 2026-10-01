import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

const baseUrl = "https://www.biarritz.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pacotes, categorias] = await Promise.all([
    prisma.pacote.findMany({
      where: {
        deleted_at: null,
      },
      select: {
        slug: true,
        updated_at: true,
      },
    }),
    prisma.categoriaViagem.findMany({
      where: {
        pacotes: {
          some: {
            deleted_at: null,
          },
        },
      },
      select: {
        slug: true,
        updated_at: true,
      },
    }),
  ]);

  const paginasPrincipais: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/pacotes`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categorias`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const urlsCategorias: MetadataRoute.Sitemap = categorias.map((categoria) => ({
    url: `${baseUrl}/categorias/${categoria.slug}`,
    lastModified: categoria.updated_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const urlsPacotes: MetadataRoute.Sitemap = pacotes.map((pacote) => ({
    url: `${baseUrl}/pacotes/${pacote.slug}`,
    lastModified: pacote.updated_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...paginasPrincipais, ...urlsCategorias, ...urlsPacotes];
}
