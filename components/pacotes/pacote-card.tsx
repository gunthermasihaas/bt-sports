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
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[var(--ease-emphasized)] group-hover:scale-[1.045]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-brand-deep text-sm text-white/70">
            Sem imagem
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(4_15_10_/_0.72)] via-transparent to-transparent opacity-90" />

        {dataEvento && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-deep backdrop-blur-md">
            {dataEvento}
          </span>
        )}

        {badge && (
          <span className="absolute right-4 top-4 z-10 rounded-full bg-brand px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-on-brand shadow-sm">
            {badge}
          </span>
        )}

        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-3">
          <span className="max-w-[80%] text-xl font-extrabold leading-tight tracking-tight text-white">
            {nome}
          </span>

          {href && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-deep transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          )}
        </div>
      </div>

      <div className={`p-5 ${isAdmin ? "bg-surface-muted" : "bg-surface"}`}>
        {resumo && (
          <p className="line-clamp-2 text-sm leading-6 text-muted">{resumo}</p>
        )}

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
              A partir de
            </span>

            <span className="mt-1 block text-lg font-extrabold tracking-tight text-default">
              {preco !== undefined
                ? formatarPreco(preco, moeda)
                : "Sob consulta"}
            </span>
          </div>

          {href && (
            <span className="text-xs font-bold text-brand-dark transition-colors group-hover:text-brand-deep">
              Ver pacote
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (!href) {
    return (
      <div className="group relative overflow-hidden rounded-2xl border border-default bg-surface shadow-[var(--shadow-card)]">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-2xl border border-default bg-surface shadow-[var(--shadow-card)] transition-all duration-500 ease-[var(--ease-standard)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
    >
      {content}
    </Link>
  );
}
