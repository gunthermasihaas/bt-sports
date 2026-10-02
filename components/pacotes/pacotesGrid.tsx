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
      <div className="surface-card flex min-h-64 items-center justify-center p-8 text-center">
        <div>
          <p className="text-lg font-bold text-default">
            Nenhum pacote encontrado.
          </p>

          <p className="mt-2 text-sm text-muted">
            Novas experiências serão adicionadas em breve.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
