import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TipoFoto } from "@/generated/prisma";

import PacoteView from "@/components/pacotes/PacoteView";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PacotePage({ params }: Props) {
  const { slug } = await params;

  const pacote = await prisma.pacote.findFirst({
    where: {
      slug,
      deleted_at: null,
    },
    include: {
      fotos: {
        orderBy: {
          ordem: "asc",
        },
      },
      categoria: true,
    },
  });

  if (!pacote) {
    notFound();
  }

  const capa = pacote.fotos.find((foto) => foto.tipo === TipoFoto.CAPA);

  return (
    <PacoteView
      slug={pacote.slug}
      nome={pacote.nome}
      categoria={pacote.categoria}
      data_inicio={pacote.data_inicio ?? undefined}
      texto_destaque={pacote.texto_destaque ?? undefined}
      resumo={pacote.resumo ?? undefined}
      descricao={pacote.descricao ?? undefined}
      preco={pacote.preco?.toNumber() ?? undefined}
      moeda={pacote.moeda}
      capaUrl={capa?.url}
    />
  );
}
