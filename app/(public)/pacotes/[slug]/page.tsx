import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BreadcrumbJsonLd from "@/app/seo/BreadcrumbJsonLd";
import PackageJsonLd from "@/app/seo/PackageJsonLd";
import PacoteView from "@/components/pacotes/PacoteView";
import { prisma } from "@/lib/prisma";
import { TipoFoto } from "@/generated/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function getPacote(slug: string) {
  return prisma.pacote.findFirst({
    where: {
      slug,
      deleted_at: null,
    },
    include: {
      categoria: true,
      fotos: {
        orderBy: {
          ordem: "asc",
        },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const pacote = await getPacote(slug);

  if (!pacote) {
    return {
      title: "Pacote não encontrado",
      description:
        "O pacote de turismo esportivo solicitado não foi encontrado.",
    };
  }

  const description =
    pacote.resumo ||
    "Confira este pacote de turismo esportivo da Biarritz Turismo Sports.";

  const fotoPrincipal =
    pacote.fotos.find((foto) => foto.tipo === TipoFoto.CAPA) ?? pacote.fotos[0];

  const canonical = `/pacotes/${pacote.slug}`;

  return {
    title: pacote.nome,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: pacote.nome,
      description,
      siteName: "Biarritz Turismo Sports",
      ...(fotoPrincipal?.url
        ? {
            images: [
              {
                url: fotoPrincipal.url,
                alt: fotoPrincipal.descricao || pacote.nome,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: fotoPrincipal?.url ? "summary_large_image" : "summary",
      title: pacote.nome,
      description,
      ...(fotoPrincipal?.url
        ? {
            images: [fotoPrincipal.url],
          }
        : {}),
    },
  };
}

export default async function PacotePage({ params }: Props) {
  const { slug } = await params;

  const pacote = await getPacote(slug);

  if (!pacote) {
    notFound();
  }

  const capa =
    pacote.fotos.find((foto) => foto.tipo === TipoFoto.CAPA) ?? pacote.fotos[0];

  const pacoteUrl = `https://www.biarritz.com.br/pacotes/${pacote.slug}`;

  const descricao =
    pacote.resumo ||
    "Confira este pacote de turismo esportivo da Biarritz Turismo Sports.";

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          {
            name: "Início",
            url: "https://www.biarritz.com.br",
          },
          {
            name: "Pacotes",
            url: "https://www.biarritz.com.br/pacotes",
          },
          ...(pacote.categoria
            ? [
                {
                  name: pacote.categoria.nome,
                  url: `https://www.biarritz.com.br/categorias/${pacote.categoria.slug}`,
                },
              ]
            : []),
          {
            name: pacote.nome,
            url: pacoteUrl,
          },
        ]}
      />

      <PackageJsonLd
        name={pacote.nome}
        description={descricao}
        url={pacoteUrl}
        image={capa?.url}
        category={pacote.categoria?.nome}
        price={pacote.preco !== null ? Number(pacote.preco) : undefined}
        currency={pacote.moeda}
      />

      <PacoteView
        slug={pacote.slug}
        nome={pacote.nome}
        categoria={pacote.categoria}
        data_inicio={pacote.data_inicio ?? undefined}
        texto_destaque={pacote.texto_destaque ?? undefined}
        resumo={pacote.resumo ?? undefined}
        descricao={pacote.descricao ?? undefined}
        preco={pacote.preco !== null ? Number(pacote.preco) : undefined}
        moeda={pacote.moeda}
        capaUrl={capa?.url}
      />
    </>
  );
}
