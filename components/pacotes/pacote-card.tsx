import Image from "next/image";
import Link from "next/link";

import { formatarPreco } from "@/types/moedas";
import type { Moeda } from "@/types/moedas";

type PacoteCardProps = {
  nome: string;
  resumo?: string;
  preco?: number;
  moeda?: Moeda;
  dataEvento?: string;
  imageUrl?: string;
  href?: string;
  badge?: string;
  variant?: "public" | "admin";
};

export default function PacoteCard({
  nome,
  resumo,
  preco,
  moeda = "EUR",
  dataEvento,
  imageUrl,
  href,
  badge,
  variant = "public",
}: PacoteCardProps) {
  const isAdmin = variant === "admin";

  const Content = (
    <>
      <div className="relative aspect-4/3 w-full bg-surface-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={nome}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            Sem imagem
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-brand-soft/60 opacity-0 transition-opacity sm:group-hover:opacity-100" />

        {dataEvento && (
          <span
            className="
              absolute left-3 top-3 z-10
              rounded-full
              bg-brand
              px-3 py-1
              text-[11px]
              font-semibold
              uppercase
              tracking-wide
              text-on-brand
              shadow-sm
            "
          >
            {dataEvento}
          </span>
        )}

        {badge && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-on-brand">
            {badge}
          </span>
        )}
      </div>

      <div
        className={`relative z-10 px-4 py-4 sm:px-5 ${
          isAdmin ? "bg-surface-muted" : "bg-surface"
        }`}
      >
        <h3 className="text-base font-semibold leading-snug sm:text-lg">
          {nome}
        </h3>

        {resumo && (
          <p className="mt-1 line-clamp-2 text-sm text-muted">{resumo}</p>
        )}

        {preco !== undefined && preco !== null && (
          <div className="mt-3 text-base font-bold text-brand sm:text-lg">
            {formatarPreco(preco, moeda)}
          </div>
        )}
      </div>
    </>
  );

  if (!href) {
    return (
      <div
        className="
          group relative block overflow-hidden rounded-xl
          border border-default bg-surface
        "
      >
        {Content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="
        group relative block overflow-hidden rounded-xl
        border border-default bg-surface transition
        sm:hover:-translate-y-0.5 sm:hover:shadow-lg
      "
    >
      {Content}
    </Link>
  );
}
