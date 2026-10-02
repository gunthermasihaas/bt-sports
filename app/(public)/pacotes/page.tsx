import type { Metadata } from "next";

import { getPacotesUi, type Order } from "@/lib/getPacotesUi";
import PacotesGrid from "@/components/pacotes/pacotesGrid";
import PacotesHeader from "@/components/pacotes/pacotesHeader";
import PackagesListJsonLd from "@/app/seo/PackagesListJsonLd";

const title = "Pacotes de Turismo Esportivo";

const description =
  "Confira os pacotes de turismo esportivo da Biarritz Turismo Sports e viva grandes eventos esportivos de perto.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/pacotes",
  },
  openGraph: {
    title,
    description,
    url: "/pacotes",
    type: "website",
    siteName: "Biarritz Turismo Sports",
  },
  twitter: {
    card: "summary",
    title,
    description,
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
    <>
      <PackagesListJsonLd
        items={pacotes.map((pacote, index) => ({
          name: pacote.nome,
          url: `https://www.biarritz.com.br/pacotes/${pacote.slug}`,
          imageUrl: pacote.imageUrl,
          position: index + 1,
        }))}
      />

      <main className="min-h-screen bg-background py-12 sm:py-16 lg:py-20">
        <div className="site-container">
          <PacotesHeader order={order} />
          <PacotesGrid pacotes={pacotes} />
        </div>
      </main>
    </>
  );
}
