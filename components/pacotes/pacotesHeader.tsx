import { Order } from "@/lib/getPacotesUi";
import PacotesOrderMenu from "@/components/pacotes/PacotesOrderMenu";

type Props = {
  order: Order;
};

export default function PacotesHeader({ order }: Props) {
  return (
    <div className="mb-10 flex flex-col gap-6 border-b border-default pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="section-kicker">Catálogo</span>

        <h1 className="section-title mt-4 text-default">Pacotes de viagem</h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">
          Encontre a experiência esportiva que combina com o seu próximo
          destino.
        </p>
      </div>

      <PacotesOrderMenu order={order} basePath="/pacotes" variant="public" />
    </div>
  );
}
