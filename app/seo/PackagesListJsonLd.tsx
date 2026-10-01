const baseUrl = "https://www.biarritz.com.br";

type PackagesListJsonLdItem = {
  name: string;
  url: string;
  imageUrl?: string;
  position: number;
};

type PackagesListJsonLdProps = {
  items: PackagesListJsonLdItem[];
};

export default function PackagesListJsonLd({ items }: PackagesListJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}/pacotes#webpage`,
    name: "Pacotes de Turismo Esportivo",
    url: `${baseUrl}/pacotes`,
    description:
      "Confira os pacotes de turismo esportivo da Biarritz Turismo Sports e viva grandes eventos esportivos de perto.",
    isPartOf: {
      "@id": `${baseUrl}/#website`,
    },
    mainEntity: {
      "@type": "ItemList",
      "@id": `${baseUrl}/pacotes#itemlist`,
      numberOfItems: items.length,
      itemListElement: items.map((item) => ({
        "@type": "ListItem",
        position: item.position,
        name: item.name,
        url: item.url,
        ...(item.imageUrl ? { image: item.imageUrl } : {}),
      })),
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
