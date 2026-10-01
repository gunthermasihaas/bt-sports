type CategoryJsonLdItem = {
  name: string;
  url: string;
  position: number;
};

type CategoryJsonLdProps = {
  name: string;
  url: string;
  items: CategoryJsonLdItem[];
};

export default function CategoryJsonLd({
  name,
  url,
  items,
}: CategoryJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    name,
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item) => ({
        "@type": "ListItem",
        position: item.position,
        name: item.name,
        url: item.url,
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
