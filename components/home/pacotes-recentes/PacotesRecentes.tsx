import Link from "next/link";

import PacoteCard from "@/components/pacotes/pacote-card";

type Moeda = "EUR" | "USD" | "BRL" | "GBP";

type Pacote = {
  id: number;
  nome: string;
  resumo?: string | null;
  preco?: number;
  moeda?: Moeda;
  dataEvento?: string;
  imageUrl?: string;
  href: string;
};

type Props = {
  pacotes: Pacote[];
};

export default function PacotesRecentes({ pacotes }: Props) {
  if (!pacotes.length) return null;

  return (
    <section className="bg-surface px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 text-center text-lg font-semibold text-color-text sm:text-xl">
          <span className="text-brand">Pacotes</span> recentes
        </h2>

        <div
          className="
            grid grid-cols-1 gap-4
            sm:grid-cols-2 sm:gap-5
            lg:grid-cols-3 lg:gap-6
          "
        >
          {pacotes.map((pacote) => (
            <PacoteCard
              key={pacote.id}
              nome={pacote.nome}
              resumo={pacote.resumo ?? undefined}
              preco={pacote.preco}
              moeda={pacote.moeda}
              dataEvento={pacote.dataEvento}
              imageUrl={pacote.imageUrl}
              href={pacote.href}
            />
          ))}
        </div>

        {pacotes.length >= 6 && (
          <div className="mt-8 text-center">
            <Link
              href="/pacotes"
              className="
                inline-flex items-center rounded-full
                border border-brand px-5 py-2
                text-sm font-medium text-brand
                transition hover:bg-brand hover:text-on-brand
              "
            >
              Ver todos os pacotes
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
