import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BreadcrumbJsonLd from "@/app/seo/BreadcrumbJsonLd";
import CategoryJsonLd from "@/app/seo/CategoryJsonLd";
import PacotesPorCategoria from "@/components/home/categorias/PacotesPorCategoria";
import { TipoFoto } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function getCategoriaMetadata(slug: string) {
  return prisma.categoriaViagem.findUnique({
    where: {
      slug,
    },
    select: {
      nome: true,
      slug: true,
    },
  });
}

async function getCategoria(slug: string) {
  return prisma.categoriaViagem.findUnique({
    where: {
      slug,
    },
    select: {
      nome: true,
      slug: true,
      pacotes: {
        where: {
          deleted_at: null,
        },
        orderBy: {
          data_inicio: "asc",
        },
        select: {
          id: true,
          nome: true,
          slug: true,
          resumo: true,
          preco: true,
          moeda: true,
          data_inicio: true,
          fotos: {
            where: {
              tipo: TipoFoto.CARD,
            },
            take: 1,
            select: {
              url: true,
            },
          },
        },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const categoria = await getCategoriaMetadata(slug);

  if (!categoria) {
    return {
      title: "Categoria não encontrada",
      description:
        "A categoria de turismo esportivo solicitada não foi encontrada.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${categoria.nome} | Biarritz Turismo Sports`;

  const description = `Confira os pacotes de turismo esportivo da Biarritz Turismo Sports na categoria ${categoria.nome}.`;

  const canonical = `/categorias/${categoria.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "Biarritz Turismo Sports",
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;

  const categoria = await getCategoria(slug);

  if (!categoria) {
    notFound();
  }

  const categoriaUrl = `https://www.biarritz.com.br/categorias/${categoria.slug}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          {
            name: "Início",
            url: "https://www.biarritz.com.br",
          },
          {
            name: "Categorias",
            url: "https://www.biarritz.com.br/categorias",
          },
          {
            name: categoria.nome,
            url: categoriaUrl,
          },
        ]}
      />

      <CategoryJsonLd
        name={categoria.nome}
        url={categoriaUrl}
        items={categoria.pacotes.map((pacote, index) => ({
          name: pacote.nome,
          url: `https://www.biarritz.com.br/pacotes/${pacote.slug}`,
          position: index + 1,
        }))}
      />

      <main className="min-h-screen bg-background">
        <PacotesPorCategoria
          nome={categoria.nome}
          pacotes={categoria.pacotes}
        />
      </main>
    </>
  );
}
