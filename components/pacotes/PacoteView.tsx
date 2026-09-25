"use client";

import { useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import Link from "next/link";

import { formatarDataLonga } from "@/lib/formatarData";

type Categoria = {
  nome: string;
};

type Props = {
  slug: string;
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
  slug,
  nome,
  categoria,
  data_inicio,
  texto_destaque,
  resumo,
  descricao,
  preco,
  capaUrl,
}: Props) {
  const descricaoSanitizada = useMemo(() => {
    if (!descricao) {
      return "";
    }

    return DOMPurify.sanitize(descricao, {
      USE_PROFILES: {
        html: true,
      },
      FORBID_TAGS: [
        "iframe",
        "object",
        "embed",
        "form",
        "input",
        "button",
        "textarea",
        "select",
        "style",
        "script",
      ],
      FORBID_ATTR: ["style", "onerror", "onload", "onclick", "onmouseover"],
    });
  }, [descricao]);

  const contatoUrl = `/contato?pacote=${encodeURIComponent(
    nome
  )}&slug=${encodeURIComponent(slug)}`;

  return (
    <div className="bg-surface px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl space-y-10">
        <section className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-muted">
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

          <div className="flex min-w-0 flex-col gap-6">
            {categoria && (
              <span className="inline-block max-w-full truncate rounded-md bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
                {categoria.nome}
              </span>
            )}

            <h1 className="wrap-break-word text-3xl font-bold leading-tight tracking-tight text-on-surface">
              {nome}
            </h1>

            {data_inicio && (
              <p className="text-sm font-medium text-on-surface-muted">
                {formatarDataLonga(data_inicio)}
              </p>
            )}

            {texto_destaque && (
              <p className="wrap-break-word text-lg font-medium text-brand">
                {texto_destaque}
              </p>
            )}

            {resumo && (
              <p className="wrap-break-word text-sm leading-relaxed text-on-surface-muted">
                {resumo}
              </p>
            )}

            <div className="rounded-xl border border-border-muted bg-surface-muted p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wide text-on-surface-muted">
                    A partir de
                  </p>

                  <p className="wrap-break-word text-2xl font-bold leading-tight text-on-surface sm:text-3xl">
                    {preco !== undefined
                      ? `€ ${preco.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : "Sob consulta"}
                  </p>
                </div>

                <div className="shrink-0">
                  <Link
                    href={contatoUrl}
                    className="
                      inline-flex
                      w-full
                      min-w-45
                      items-center
                      justify-center
                      rounded-lg
                      bg-brand
                      px-6
                      py-3
                      text-sm
                      font-semibold
                      text-on-brand
                      transition
                      hover:bg-brand-hover
                      focus:outline-none
                      focus:ring-2
                      focus:ring-brand/40
                      sm:w-auto
                      whitespace-nowrap
                    "
                  >
                    Solicitar informações
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {descricaoSanitizada && (
          <section
            className="
              prose prose-neutral
              max-w-none
              wrap-break-word

              [&_a]:font-medium
              [&_a]:text-brand
              [&_a]:underline
              [&_a]:underline-offset-2
              [&_a]:decoration-2
              [&_a]:decoration-brand/70
              [&_a]:transition

              [&_a:hover]:text-brand-dark
              [&_a:hover]:decoration-brand-dark

              [&_img]:h-auto
              [&_img]:max-w-full

              [&_table]:block
              [&_table]:w-full
              [&_table]:overflow-x-auto
            "
          >
            <h2>Sobre o pacote</h2>

            <div
              dangerouslySetInnerHTML={{
                __html: descricaoSanitizada,
              }}
            />
          </section>
        )}
      </div>
    </div>
  );
}
