"use client";

import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { formatarDataLonga } from "@/lib/formatarData";
import { formatarPreco, type Moeda } from "@/types/moedas";
import type { Categoria } from "@/types/categoria";

type Props = {
  slug: string;
  nome: string;
  categoria?: Categoria;
  data_inicio?: Date;
  texto_destaque?: string;
  resumo?: string;
  descricao?: string;
  preco?: number;
  moeda?: Moeda;
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
  moeda = "EUR",
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

      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "b",
        "em",
        "i",
        "u",
        "s",
        "code",
        "h1",
        "h2",
        "h3",
        "ul",
        "ol",
        "li",
        "blockquote",
        "a",
        "img",
      ],

      ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "title"],

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
        "svg",
        "math",
      ],

      FORBID_ATTR: [
        "style",
        "onerror",
        "onload",
        "onclick",
        "onmouseover",
        "onfocus",
        "onblur",
      ],
    });
  }, [descricao]);

  const contatoUrl = `/contato?pacote=${encodeURIComponent(
    nome
  )}&slug=${encodeURIComponent(slug)}`;

  const altCapa = categoria?.nome ? `${nome} — ${categoria.nome}` : nome;

  return (
    <main className="bg-background">
      <section className="relative isolate overflow-hidden bg-brand-deep">
        <div className="relative min-h-[520px] sm:min-h-[620px]">
          {capaUrl ? (
            <Image
              src={capaUrl}
              alt={altCapa}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full min-h-[520px] items-center justify-center bg-brand-deep text-sm text-white/60">
              Sem imagem de capa
            </div>
          )}

          <div className="hero-overlay absolute inset-0" />

          <div className="relative z-10 flex min-h-[520px] items-end sm:min-h-[620px]">
            <div className="site-container w-full pb-10 sm:pb-14 lg:pb-16">
              <div className="max-w-4xl">
                {categoria && (
                  <Link
                    href={`/categorias/${categoria.slug}`}
                    className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-md transition hover:bg-white/15"
                  >
                    {categoria.nome}
                  </Link>
                )}

                <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.045em] leading-[0.95] text-white sm:text-5xl lg:text-7xl">
                  {nome}
                </h1>

                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-white/70">
                  {data_inicio && <span>{formatarDataLonga(data_inicio)}</span>}

                  {texto_destaque && (
                    <span className="text-brand">{texto_destaque}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 pb-8 sm:-mt-12 sm:pb-12">
        <div className="site-container">
          <div className="surface-card grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                A partir de
              </span>

              <div className="mt-2 text-3xl font-extrabold tracking-tight text-default sm:text-4xl">
                {preco !== undefined
                  ? formatarPreco(preco, moeda)
                  : "Sob consulta"}
              </div>

              {resumo && (
                <p className="mt-4 max-w-3xl text-sm leading-6 text-muted sm:text-base">
                  {resumo}
                </p>
              )}
            </div>

            <Link
              href={contatoUrl}
              className="button-primary min-h-13 w-full px-7 sm:w-auto"
            >
              Solicitar informações
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {descricaoSanitizada && (
        <section className="pb-20 sm:pb-24 lg:pb-28">
          <div className="site-container">
            <div className="grid gap-10 lg:grid-cols-[0.3fr_0.7fr] lg:gap-20">
              <div>
                <span className="section-kicker">A experiência</span>

                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-default sm:text-3xl">
                  Sobre o pacote
                </h2>
              </div>

              <div className="prose-biarritz max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: descricaoSanitizada,
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
