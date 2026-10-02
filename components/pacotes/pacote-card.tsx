import Image from "next/image";
import Link from "next/link";

import { formatarPreco, type Moeda } from "@/types/moedas";

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

  const content = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={nome}
            fill
            sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) calc(50vw - 1.5rem), (max-width: 1279px) calc(33.333vw - 1.5rem), 25vw"
            className="object-cover transition-transform duration-700 ease-[var(--ease-emphasized)] group-hover:scale-[1.045]"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center bg-brand-deep px-4 text-center text-sm font-medium text-white/65"
            aria-label="Este pacote não possui imagem"
          >
            Sem imagem
          </div>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[rgb(4_15_10_/_0.78)] via-[rgb(4_15_10_/_0.08)] to-transparent opacity-95"
        />

        {dataEvento && (
          <span className="absolute left-4 top-4 z-10 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-deep shadow-sm backdrop-blur-md">
            {dataEvento}
          </span>
        )}

        {badge && (
          <span className="absolute right-4 top-4 z-10 rounded-full bg-brand px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-on-brand shadow-sm">
            {badge}
          </span>
        )}

        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-3">
          <span className="line-clamp-3 max-w-[calc(100%-3.25rem)] text-xl font-extrabold leading-[1.05] tracking-[-0.02em] text-white">
            {nome}
          </span>

          {href && (
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg font-bold text-brand-deep shadow-sm transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          )}
        </div>
      </div>

      <div
        className={`flex min-h-[148px] flex-col justify-between p-5 ${
          isAdmin ? "bg-surface-muted" : "bg-surface"
        }`}
      >
        {resumo ? (
          <p className="line-clamp-2 text-sm leading-6 text-muted">{resumo}</p>
        ) : (
          <div aria-hidden="true" className="h-6" />
        )}

        <div className="mt-5 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
              A partir de
            </span>

            <span className="mt-1 block truncate text-lg font-extrabold tracking-[-0.015em] text-default">
              {preco !== undefined
                ? formatarPreco(preco, moeda)
                : "Sob consulta"}
            </span>
          </div>

          {href && (
            <span className="shrink-0 text-xs font-bold text-brand-dark transition-colors group-hover:text-brand-deep">
              Ver pacote
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (!href) {
    return (
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-default bg-surface shadow-[var(--shadow-card)]">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-default bg-surface shadow-[var(--shadow-card)] outline-none transition-all duration-500 ease-[var(--ease-standard)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      {content}
    </Link>
  );
}
