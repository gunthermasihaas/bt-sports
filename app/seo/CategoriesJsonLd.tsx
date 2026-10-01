const baseUrl = "https://www.biarritz.com.br";

type CategoriesJsonLdItem = {
  name: string;
  url: string;
  position: number;
};

type CategoriesJsonLdProps = {
  items: CategoriesJsonLdItem[];
};

export default function CategoriesJsonLd({ items }: CategoriesJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}/categorias#webpage`,
    name: "Categorias de Viagem",
    description:
      "Explore os pacotes de turismo esportivo da Biarritz Turismo Sports organizados por categoria.",
    url: `${baseUrl}/categorias`,
    isPartOf: {
      "@id": `${baseUrl}/#website`,
    },
    about: {
      "@id": `${baseUrl}/#organization`,
    },
    mainEntity: {
      "@type": "ItemList",
      "@id": `${baseUrl}/categorias#itemlist`,
      numberOfItems: items.length,
      itemListElement: items,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
