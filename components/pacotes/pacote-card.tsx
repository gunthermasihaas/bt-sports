import Image from "next/image";
import Link from "next/link";

type Moeda = "EUR" | "USD" | "BRL" | "GBP";

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

export default function PacoteCard({
  nome,
  resumo,
  preco,
  moeda = "EUR",
  dataEvento,
  imageUrl,
  href,
  badge,
}: PacoteCardProps) {
  const Content = (
    <>
      <div className="relative aspect-4/3 w-full bg-surface-muted">
        {imageUrl ? (
          <Image src={imageUrl} alt={nome} fill className="object-cover" />
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

      <div className="relative z-10 bg-surface px-4 py-4 sm:px-5">
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

  return href ? (
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
  ) : (
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
