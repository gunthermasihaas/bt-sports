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
        <div className="relative min-h-[540px] sm:min-h-[620px] lg:min-h-[680px]">
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
            <div
              className="flex h-full min-h-[540px] items-center justify-center bg-brand-deep px-6 text-center text-sm font-medium text-white/60 sm:min-h-[620px] lg:min-h-[680px]"
              aria-label="Este pacote não possui imagem de capa"
            >
              Sem imagem de capa
            </div>
          )}

          <div className="hero-overlay absolute inset-0" />

          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-deep/70 to-transparent" />

          <div className="relative z-10 flex min-h-[540px] items-end sm:min-h-[620px] lg:min-h-[680px]">
            <div className="site-container w-full pb-10 sm:pb-14 lg:pb-18">
              <div className="max-w-5xl">
                {categoria && (
                  <Link
                    href={`/categorias/${categoria.slug}`}
                    className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-md transition hover:border-white/40 hover:bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  >
                    <span>{categoria.nome}</span>

                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                )}

                <h1 className="mt-5 max-w-5xl text-4xl font-extrabold leading-[0.94] tracking-[-0.045em] text-white sm:text-5xl lg:text-7xl">
                  {nome}
                </h1>

                {(data_inicio || texto_destaque) && (
                  <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-semibold">
                    {data_inicio && (
                      <span className="inline-flex items-center rounded-full border border-white/15 bg-black/20 px-3.5 py-2 text-white/85 backdrop-blur-md">
                        {formatarDataLonga(data_inicio)}
                      </span>
                    )}

                    {texto_destaque && (
                      <span className="inline-flex items-center rounded-full bg-brand px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-on-brand shadow-sm">
                        {texto_destaque}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 pb-10 sm:-mt-12 sm:pb-14">
        <div className="site-container">
          <div className="surface-card overflow-hidden p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                  A partir de
                </span>

                <div className="mt-2 text-3xl font-extrabold tracking-[-0.025em] text-default sm:text-4xl">
                  {preco !== undefined
                    ? formatarPreco(preco, moeda)
                    : "Sob consulta"}
                </div>

                {resumo && (
                  <p className="mt-4 max-w-3xl text-sm leading-6 text-muted sm:text-base sm:leading-7">
                    {resumo}
                  </p>
                )}
              </div>

              <div className="w-full lg:w-auto">
                <Link
                  href={contatoUrl}
                  className="button-primary min-h-13 w-full justify-center px-7 sm:w-auto"
                >
                  Solicitar informações
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {descricaoSanitizada && (
        <section className="pb-20 sm:pb-24 lg:pb-28">
          <div className="site-container">
            <div className="grid gap-10 lg:grid-cols-[minmax(220px,0.3fr)_minmax(0,0.7fr)] lg:gap-20">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <span className="section-kicker">A experiência</span>

                <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.02em] text-default sm:text-3xl">
                  Sobre o pacote
                </h2>

                <div className="mt-5 hidden h-px w-16 bg-brand lg:block" />
              </div>

              <div className="min-w-0">
                <div className="prose-biarritz max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: descricaoSanitizada,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
