import { prisma } from "@/lib/prisma";
import EditarPacoteClient from "./EditarPacoteClient";
import { notFound } from "next/navigation";

export default async function EditarPacotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pacoteId = Number(id);

  if (!Number.isInteger(pacoteId) || pacoteId <= 0) {
    notFound();
  }

  const pacote = await prisma.pacote.findUnique({
    where: {
      id: pacoteId,
    },
    include: {
      fotos: true,
    },
  });

  if (!pacote || pacote.deleted_at !== null) {
    notFound();
  }

  const categorias = await prisma.categoriaViagem.findMany({
    orderBy: {
      nome: "asc",
    },
  });

  const foto = (tipo: string) => pacote.fotos.find((f) => f.tipo === tipo)?.url;

  return (
    <EditarPacoteClient
      pacote={{
        id: pacote.id,
        nome: pacote.nome,
        categoria_id: pacote.categoria_id,
        data_inicio: pacote.data_inicio
          ? pacote.data_inicio.toISOString().slice(0, 10)
          : "",
        preco: pacote.preco ? Number(pacote.preco) : 0,
        moeda: pacote.moeda,
        texto_destaque: pacote.texto_destaque ?? "",
        resumo: pacote.resumo ?? "",
        descricao: pacote.descricao ?? "",
        capaUrl: foto("CAPA"),
        cardUrl: foto("CARD"),
        bannerUrl: foto("BANNER"),
        destaque: pacote.destaque,
      }}
      categorias={categorias}
    />
  );
}
