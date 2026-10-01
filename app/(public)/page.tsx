import type { Metadata } from "next";

import { getCategoriasHome } from "@/lib/getCategoriasHome";
import { getPacotesRecentes } from "@/lib/getPacotesRecentes";
import { getPacoteDestaque } from "@/lib/getPacoteDestaque";
import { formatarDataLonga } from "@/lib/formatarData";

import CategoriasCarousel from "@/components/home/categorias/CategoriasCarousel";
import PacotesRecentes from "@/components/home/pacotes-recentes/PacotesRecentes";
import PacoteDestaque from "@/components/home/pacote-destaque/PacoteDestaque";
import WebsiteJsonLd from "@/app/seo/WebsiteJsonLd";

export const metadata: Metadata = {
  title: "Turismo Esportivo e Pacotes para Grandes Eventos",
  description:
    "Encontre pacotes de turismo esportivo da Biarritz Turismo Sports para viver grandes eventos esportivos com experiências completas.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://www.biarritz.com.br",
    siteName: "Biarritz Turismo Sports",
    title: "Turismo Esportivo e Pacotes para Grandes Eventos",
    description:
      "Encontre pacotes de turismo esportivo da Biarritz Turismo Sports para viver grandes eventos esportivos com experiências completas.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Turismo Esportivo e Pacotes para Grandes Eventos",
    description:
      "Encontre pacotes de turismo esportivo da Biarritz Turismo Sports para viver grandes eventos esportivos com experiências completas.",
  },
};

export default async function Home() {
  const categorias = await getCategoriasHome();
  const pacotes = await getPacotesRecentes(6);
  const destaque = await getPacoteDestaque();

  return (
    <>
      <WebsiteJsonLd />

      <main>
        <h1 className="sr-only">
          Biarritz Turismo Sports — Turismo Esportivo e Pacotes para Grandes
          Eventos
        </h1>

        {destaque && (
          <PacoteDestaque
            slug={destaque.slug}
            nome={destaque.nome}
            preco={destaque.preco}
            moeda={destaque.moeda}
            dataEvento={formatarDataLonga(destaque.dataInicio)}
            bannerUrl={destaque.imageUrl}
          />
        )}

        <section className="bg-surface-muted px-6 py-12 text-color-text">
          <h2 className="mb-6 text-center text-xl font-semibold">
            <span className="text-brand">Escolha</span> sua próxima experiência
          </h2>

          <CategoriasCarousel categorias={categorias} />

          <PacotesRecentes pacotes={pacotes} />
        </section>
      </main>
    </>
  );
}
