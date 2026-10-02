import Image from "next/image";
import Link from "next/link";

import { formatarPreco, type Moeda } from "@/types/moedas";

type Props = {
  slug: string;
  nome: string;
  preco?: number;
  moeda?: Moeda;
  dataEvento?: string;
  bannerUrl?: string;
};

export default function PacoteDestaque({
  slug,
  nome,
  preco,
  moeda = "EUR",
  dataEvento,
  bannerUrl,
}: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-deep">
      <Link
        href={`/pacotes/${slug}`}
        aria-label={`Conhecer o pacote ${nome}`}
        className="group relative block min-h-[620px] overflow-hidden sm:min-h-[680px] lg:min-h-[760px]"
      >
        <div className="absolute inset-0">
          {bannerUrl ? (
            <Image
              src={bannerUrl}
              alt={nome}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.035]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-brand-deep text-sm text-white/70">
              Sem imagem de destaque
            </div>
          )}
        </div>

        <div className="hero-overlay absolute inset-0" />

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[rgb(4_15_10_/_0.45)] to-transparent" />

        <div className="relative z-10 flex min-h-[620px] items-end sm:min-h-[680px] lg:min-h-[760px]">
          <div className="site-container w-full pb-12 sm:pb-16 lg:pb-20">
            <div className="max-w-3xl">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                  Experiência em destaque
                </span>

                {dataEvento && (
                  <span className="text-sm font-semibold text-white/75">
                    {dataEvento}
                  </span>
                )}
              </div>

              <h1 className="display-title max-w-4xl text-white">{nome}</h1>

              <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                    A partir de
                  </span>

                  <span className="mt-1 block text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    {preco !== undefined
                      ? formatarPreco(preco, moeda)
                      : "Sob consulta"}
                  </span>
                </div>

                <span className="button-primary min-h-12 px-6">
                  Conhecer experiência
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
