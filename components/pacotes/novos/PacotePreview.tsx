"use client";

import PacoteView from "@/components/pacotes/PacoteView";

type Props = {
  nome: string;
  categoria?: {
    nome: string;
  };
  dataInicio?: Date;
  textoDestaque: string;
  resumo: string;
  descricao: string;
  preco: number;
  moeda: "EUR" | "USD" | "BRL" | "GBP";
  capaUrl?: string;
};

export default function PacotePreview({
  nome,
  categoria,
  dataInicio,
  textoDestaque,
  resumo,
  descricao,
  preco,
  moeda,
  capaUrl,
}: Props) {
  return (
    <section className="overflow-hidden rounded-xl border border-default bg-surface shadow-sm">
      <div className="border-b border-default bg-surface-muted px-5 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          Pré-visualização
        </p>

        <h2 className="mt-1 text-base font-semibold text-admin">
          Assim o pacote será apresentado ao visitante
        </h2>
      </div>

      <PacoteView
        slug="preview"
        nome={nome || "Nome do pacote"}
        categoria={categoria}
        data_inicio={dataInicio}
        texto_destaque={textoDestaque}
        resumo={resumo}
        descricao={descricao}
        preco={preco}
        moeda={moeda}
        capaUrl={capaUrl}
      />
    </section>
  );
}
