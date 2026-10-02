import CategoriaButton from "./CategoriaButton";

type Props = {
  slug: string;
  nome: string;
  index: number;
};

export default function CategoriaSlide({ slug, nome, index }: Props) {
  return (
    <div className="h-52 sm:h-60">
      <CategoriaButton
        href={`/categorias/${slug}`}
        label={nome}
        index={index}
      />
    </div>
  );
}
