"use client";

import Image from "next/image";
import Link from "next/link";

type Moeda = "EUR" | "USD" | "BRL" | "GBP";

type Props = {
  slug: string;
  nome: string;
  preco?: number;
  moeda?: Moeda;
  dataEvento?: string;
  bannerUrl?: string;
};

function formatarPreco(preco: number, moeda: Moeda) {
  const locales: Record<Moeda, string> = {
    EUR: "pt-PT",
    USD: "en-US",
    BRL: "pt-BR",
    GBP: "en-GB",
  };

  return new Intl.NumberFormat(locales[moeda], {
    style: "currency",
    currency: moeda,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(preco);
}

export default function PacoteDestaque({
  slug,
  nome,
  preco,
  moeda = "EUR",
  dataEvento,
  bannerUrl,
}: Props) {
  return (
    <section className="relative w-full bg-surface">
      <Link
        href={`/pacotes/${slug}`}
        className="
          group relative block w-full overflow-hidden
          focus:outline-none focus:ring-2 focus:ring-brand/40
        "
      >
        <div
          className="
            relative h-[45vh] min-h-65 max-h-130
            w-full bg-surface-muted
          "
        >
          {bannerUrl && (
            <Image
              src={bannerUrl}
              alt={nome}
              fill
              priority
              sizes="100vw"
              className="
                object-cover object-center
                transition-transform duration-700 ease-out
                group-hover:scale-[1.04]
              "
            />
          )}

          <div className="absolute inset-0 bg-black/40" />

          <div
            className="
              absolute inset-0 bg-brand/20
              opacity-0 transition-opacity duration-300
              group-hover:opacity-100
            "
          />
        </div>

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-6 sm:px-10 sm:pb-10">
            {dataEvento && (
              <span className="text-sm font-medium text-on-brand/80">
                {dataEvento}
              </span>
            )}

            <div className="max-w-3xl space-y-3">
              <h2
                className="
                  text-2xl font-bold leading-tight text-on-brand
                  sm:text-3xl lg:text-4xl
                "
              >
                {nome}
              </h2>

              <div className="flex flex-wrap items-center gap-4">
                <span
                  className="
                    rounded-md bg-brand px-4 py-2
                    text-sm font-semibold text-on-brand
                  "
                >
                  {preco !== undefined && preco !== null
                    ? `A partir de ${formatarPreco(preco, moeda)}`
                    : "Sob consulta"}
                </span>

                <span
                  className="
                    text-sm font-medium text-on-brand/80
                    underline-offset-4 group-hover:underline
                  "
                >
                  Ver detalhes →
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
