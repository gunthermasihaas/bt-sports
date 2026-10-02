import PacoteCard from "@/components/pacotes/pacote-card";
import { formatarDataCurta } from "@/lib/formatarData";
import type { Moeda } from "@/types/moedas";

type Pacote = {
  id: number;
  nome: string;
  resumo: string | null;
  preco: unknown;
  moeda: Moeda;
  data_inicio: Date | null;
  slug: string;
  fotos: {
    url: string;
  }[];
};

type Props = {
  nome: string;
  pacotes: Pacote[];
};

export default function PacotesPorCategoria({ nome, pacotes }: Props) {
  return (
    <section className="bg-background py-14 sm:py-18 lg:py-24">
      <div className="site-container">
        <header className="mb-10 max-w-3xl sm:mb-12">
          <span className="section-kicker">Categoria</span>

          <h1 className="section-title mt-5">{nome}</h1>

          <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
            {pacotes.length === 0
              ? "Novas experiências serão adicionadas em breve."
              : pacotes.length === 1
                ? "Uma experiência disponível nesta categoria."
                : `${pacotes.length} experiências disponíveis nesta categoria.`}
          </p>
        </header>

        {pacotes.length === 0 ? (
          <div className="surface-card flex min-h-64 items-center justify-center p-8 text-center">
            <div className="max-w-md">
              <span className="section-kicker">Em breve</span>

              <h2 className="mt-4 text-xl font-bold text-default">
                Nenhum pacote disponível nesta categoria.
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted">
                Estamos preparando novas experiências esportivas para você.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pacotes.map((pacote) => (
              <PacoteCard
                key={pacote.id}
                nome={pacote.nome}
                resumo={pacote.resumo ?? undefined}
                preco={pacote.preco !== null ? Number(pacote.preco) : undefined}
                moeda={pacote.moeda}
                imageUrl={pacote.fotos[0]?.url}
                dataEvento={
                  pacote.data_inicio
                    ? formatarDataCurta(pacote.data_inicio)
                    : undefined
                }
                href={`/pacotes/${pacote.slug}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
