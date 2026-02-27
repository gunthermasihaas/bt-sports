"use client";

import Image from "next/image";
import { formatarDataLonga } from "@/lib/formatarData";

type Categoria = {
  nome: string;
};

type Props = {
  nome: string;
  categoria?: Categoria;
  data_inicio?: Date;
  texto_destaque?: string;
  resumo?: string;
  descricao?: string;
  preco?: number;
  capaUrl?: string;
};

export default function PacoteView({
  nome,
  categoria,
  data_inicio,
  texto_destaque,
  resumo,
  descricao,
  preco,
  capaUrl,
}: Props) {
  return (
    <div className="bg-surface px-4 py-8 sm:px-6 sm:py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-surface-muted">
            {capaUrl && (
              <Image
                src={capaUrl}
                alt={nome}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>

          <div className="flex flex-col gap-6 min-w-0">
            {categoria && (
              <span className="inline-block max-w-full truncate rounded-md bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
                {categoria.nome}
              </span>
            )}

            <h1 className="text-3xl font-bold tracking-tight text-on-surface wrap-break-word leading-tight">
              {nome}
            </h1>

            {data_inicio && (
              <p className="text-sm font-medium text-on-surface-muted">
                {formatarDataLonga(data_inicio)}
              </p>
            )}

            {texto_destaque && (
              <p className="text-lg font-medium text-brand wrap-break-word">
                {texto_destaque}
              </p>
            )}

            {resumo && (
              <p className="text-sm leading-relaxed text-on-surface-muted wrap-break-word">
                {resumo}
              </p>
            )}

            <div className="rounded-xl border border-border-muted bg-surface-muted p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-wide text-on-surface-muted">
                    A partir de
                  </p>

                  <p className="text-2xl sm:text-3xl font-bold text-on-surface wrap-break-word leading-tight">
                    {preco
                      ? `€ ${preco.toLocaleString("pt-BR")}`
                      : "Sob consulta"}
                  </p>
                </div>

                <div className="shrink-0">
                  <button
                    className="
                      w-full sm:w-auto
                      min-w-45
                      rounded-lg
                      bg-brand
                      px-6 py-3
                      text-sm font-semibold
                      text-on-brand
                      transition
                      hover:bg-brand-hover
                      focus:outline-none
                      focus:ring-2
                      focus:ring-brand/40
                      whitespace-nowrap
                    "
                  >
                    Solicitar informações
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {descricao && (
          <section
            className="
      prose prose-neutral max-w-none wrap-break-word

      [&_a]:text-brand
      [&_a]:underline
      [&_a]:underline-offset-2
      [&_a]:decoration-2
      [&_a]:decoration-brand/70
      [&_a]:font-medium
      [&_a]:transition

      [&_a:hover]:text-brand-dark
      [&_a:hover]:decoration-brand-dark
    "
          >
            <h2>Sobre o pacote</h2>

            <div
              dangerouslySetInnerHTML={{ __html: descricao }}
              className="
        [&_img]:max-w-full
        [&_img]:h-auto
        [&_table]:w-full
        [&_table]:block
        [&_table]:overflow-x-auto
      "
            />
          </section>
        )}
      </div>
    </div>
  );
}
