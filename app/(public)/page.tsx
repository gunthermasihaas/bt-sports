import type { Metadata } from "next";

import { getCategoriasHome } from "@/lib/getCategoriasHome";
import { getPacotesRecentes } from "@/lib/getPacotesRecentes";
import { getPacoteDestaque } from "@/lib/getPacoteDestaque";
import { formatarDataLonga } from "@/lib/formatarData";

import CategoriasCarousel from "@/components/home/categorias/CategoriasCarousel";
import PacotesRecentes from "@/components/home/pacotes-recentes/PacotesRecentes";
import PacoteDestaque from "@/components/home/pacote-destaque/PacoteDestaque";
import PorqueBiarritz from "@/components/home/PorqueBiarritz";
import HomeCta from "@/components/home/HomeCta";

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

      <main className="bg-background">
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

        <section
          className="bg-background py-16 sm:py-20 lg:py-24"
          aria-labelledby="experiencias-heading"
        >
          <div className="site-container">
            <div className="mb-10 max-w-2xl">
              <span className="section-kicker">Experiências esportivas</span>

              <h2
                id="experiencias-heading"
                className="section-title mt-4 text-default"
              >
                Escolha como você quer viver o esporte.
              </h2>

              <p className="mt-4 max-w-xl text-base leading-7 text-muted sm:text-lg">
                Grandes eventos, destinos especiais e experiências pensadas para
                quem quer estar dentro da atmosfera do esporte.
              </p>
            </div>

            <CategoriasCarousel categorias={categorias} />
          </div>
        </section>

        <section
          className="bg-surface py-16 sm:py-20 lg:py-24"
          aria-labelledby="pacotes-heading"
        >
          <div className="site-container">
            <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <span className="section-kicker">Seleção Biarritz</span>

                <h2
                  id="pacotes-heading"
                  className="section-title mt-4 text-default"
                >
                  Experiências em destaque
                </h2>

                <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
                  Pacotes selecionados para você chegar ao evento, aproveitar a
                  viagem e viver cada momento.
                </p>
              </div>
            </div>

            <PacotesRecentes pacotes={pacotes} />
          </div>
        </section>

        <PorqueBiarritz />

        <HomeCta />
      </main>
    </>
  );
}
