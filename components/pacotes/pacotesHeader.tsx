import PacotesOrderMenu from "@/components/pacotes/PacotesOrderMenu";
import { Order } from "@/lib/getPacotesUi";

type Props = {
  order: Order;
};

export default function PacotesHeader({ order }: Props) {
  return (
    <header className="mb-10 border-b border-default pb-8 sm:mb-12 sm:pb-10">
      <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="max-w-2xl">
          <span className="section-kicker">Catálogo</span>

          <h1 className="section-title mt-4 text-default">Pacotes de viagem</h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-muted sm:text-base sm:leading-7">
            Encontre a experiência esportiva que combina com o seu próximo
            destino.
          </p>
        </div>

        <div className="flex w-full shrink-0 items-center justify-between gap-4 sm:justify-end lg:w-auto">
          <span className="text-xs font-semibold text-muted">
            Organizar resultados
          </span>

          <PacotesOrderMenu
            order={order}
            basePath="/pacotes"
            variant="public"
          />
        </div>
      </div>
    </header>
  );
}
