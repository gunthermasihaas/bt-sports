import { getCategoriasHome } from "@/lib/getCategoriasHome";
import { getPacotesRecentes } from "@/lib/getPacotesRecentes";
import { getPacoteDestaque } from "@/lib/getPacoteDestaque";
import { formatarDataLonga } from "@/lib/formatarData";

import CategoriasCarousel from "@/components/home/categorias/CategoriasCarousel";
import PacotesRecentes from "@/components/home/pacotes-recentes/PacotesRecentes";
import PacoteDestaque from "@/components/home/pacote-destaque/PacoteDestaque";

export default async function Home() {
  const categorias = await getCategoriasHome();
  const pacotes = await getPacotesRecentes(6);
  const destaque = await getPacoteDestaque();

  return (
    <>
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
    </>
  );
}
