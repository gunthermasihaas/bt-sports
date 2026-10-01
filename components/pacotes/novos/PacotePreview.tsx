"use client";

import Image from "next/image";

import { formatarDataLonga } from "@/lib/formatarData";
import { formatarPreco, type Moeda } from "@/types/moedas";

type Props = {
  nome: string;
  categoria?: {
    nome: string;
  };
  dataInicio?: Date;
  textoDestaque?: string;
  resumo?: string;
  descricao?: string;
  preco?: number;
  moeda?: Moeda;
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
  moeda = "EUR",
  capaUrl,
}: Props) {
  return (
    <section className="bg-surface">
      <div className="border-b border-default bg-surface-muted px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Pré-visualização
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
        <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-surface-muted">
          {capaUrl ? (
            <Image
              src={capaUrl}
              alt={nome || "Imagem do pacote"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">
              Sem imagem de capa
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          {categoria && (
            <span className="inline-block max-w-full truncate self-start rounded-md bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
              {categoria.nome}
            </span>
          )}

          <div className="space-y-3">
            <h2 className="wrap-break-word text-2xl font-bold leading-tight text-on-surface sm:text-3xl">
              {nome || "Nome do pacote"}
            </h2>

            {dataInicio && (
              <p className="text-sm font-medium text-on-surface-muted">
                {formatarDataLonga(dataInicio)}
              </p>
            )}
          </div>

          {textoDestaque && (
            <p className="wrap-break-word text-lg font-medium text-brand">
              {textoDestaque}
            </p>
          )}

          {resumo && (
            <p className="wrap-break-word text-sm leading-relaxed text-on-surface-muted">
              {resumo}
            </p>
          )}

          <div className="rounded-xl border border-border-muted bg-surface-muted p-5">
            <p className="text-xs uppercase tracking-wide text-on-surface-muted">
              A partir de
            </p>

            <p className="mt-1 wrap-break-word text-2xl font-bold text-on-surface">
              {preco !== undefined
                ? formatarPreco(preco, moeda)
                : "Sob consulta"}
            </p>
          </div>

          {descricao && (
            <div className="border-t border-default pt-5">
              <h3 className="text-base font-semibold text-on-surface">
                Sobre o pacote
              </h3>

              <div className="mt-3 wrap-break-word whitespace-pre-wrap text-sm leading-relaxed text-on-surface-muted">
                {descricao}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
