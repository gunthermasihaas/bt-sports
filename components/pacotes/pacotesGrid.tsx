import PacoteCard from "@/components/pacotes/pacote-card";

type Moeda = "EUR" | "USD" | "BRL" | "GBP";

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
  return (
    <div
      className="
        grid gap-6
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        2xl:grid-cols-4
      "
    >
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
