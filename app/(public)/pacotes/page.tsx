import type { Metadata } from "next";

import { getPacotesUi, type Order } from "@/lib/getPacotesUi";
import PacotesGrid from "@/components/pacotes/pacotesGrid";
import PacotesHeader from "@/components/pacotes/pacotesHeader";

export const metadata: Metadata = {
  title: "Pacotes de Turismo Esportivo",
  description:
    "Confira os pacotes de turismo esportivo da Biarritz Turismo Sports e viva grandes eventos esportivos de perto.",
  alternates: {
    canonical: "/pacotes",
  },
  openGraph: {
    title: "Pacotes de Turismo Esportivo",
    description:
      "Confira os pacotes de turismo esportivo da Biarritz Turismo Sports e viva grandes eventos esportivos de perto.",
    url: "/pacotes",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    order?: string;
  }>;
};

function getValidOrder(value: string | undefined): Order {
  if (value === "data" || value === "preco-asc" || value === "preco-desc") {
    return value;
  }

  return "nome";
}

export default async function PacotesPublicos({ searchParams }: Props) {
  const params = await searchParams;
  const order = getValidOrder(params.order);

  const pacotes = await getPacotesUi(order);

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 sm:py-12">
      <PacotesHeader order={order} />
      <PacotesGrid pacotes={pacotes} />
    </div>
  );
}
