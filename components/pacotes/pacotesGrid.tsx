import PacoteCard from "@/components/pacotes/pacote-card";
import type { Moeda } from "@/types/moedas";

type Props = {
  pacotes: {
    id: number;
    nome: string;
    resumo?: string;
    preco?: number;
    moeda?: Moeda;
    imageUrl?: string;
    dataEvento?: string;
    href: string;
  }[];
};

export default function PacotesGrid({ pacotes }: Props) {
  if (!pacotes.length) {
    return (
      <div className="surface-card overflow-hidden">
        <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center sm:px-10">
          <div
            aria-hidden="true"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-2xl text-brand-dark"
          >
            —
          </div>

          <span className="section-kicker mt-6">Catálogo</span>

          <h2 className="mt-3 text-xl font-extrabold tracking-tight text-default sm:text-2xl">
            Nenhum pacote encontrado.
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-muted sm:text-base">
            Não há experiências disponíveis para os critérios selecionados.
            Novos pacotes serão adicionados em breve.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {pacotes.map((pacote) => (
        <PacoteCard
          key={pacote.id}
          href={pacote.href}
          nome={pacote.nome}
          resumo={pacote.resumo}
          preco={pacote.preco}
          moeda={pacote.moeda}
          dataEvento={pacote.dataEvento}
          imageUrl={pacote.imageUrl}
        />
      ))}
    </div>
  );
}
