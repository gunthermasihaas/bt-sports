import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TipoFoto } from "@/generated/prisma";
import PacoteView from "@/components/pacotes/PacoteView";

type Props = {
  params: { slug?: string };
};

export default async function PacotePage({ params }: Props) {
  const { slug } = await params;

  const pacote = await prisma.pacote.findUnique({
    where: { slug },
    include: {
      fotos: { orderBy: { ordem: "asc" } },
      categoria: true,
    },
  });

  if (!pacote) {
    notFound();
  }

  const capa = pacote.fotos.find((f) => f.tipo === TipoFoto.CAPA);
  // const galeria = pacote.fotos.filter((f) => f.tipo !== TipoFoto.GALERIA);

  return (
    <PacoteView
      nome={pacote.nome}
      categoria={pacote.categoria}
      data_inicio={pacote.data_inicio ?? undefined}
      texto_destaque={pacote.texto_destaque ?? undefined}
      resumo={pacote.resumo ?? undefined}
      descricao={pacote.descricao ?? undefined}
      preco={pacote.preco?.toNumber() ?? undefined}
      capaUrl={capa?.url}
    />
  );
}
