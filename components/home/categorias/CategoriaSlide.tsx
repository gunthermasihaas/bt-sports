"use client";
import CategoriaButton from "./CategoriaButton";

type Props = {
  slug: string;
  nome: string;
};

export default function CategoriaSlide({ slug, nome }: Props) {
  return (
    <div
      className="
        h-18
        sm:h-22
        flex
        items-center
      "
    >
      <CategoriaButton href={`/categorias/${slug}`} label={nome} />
    </div>
  );
}
