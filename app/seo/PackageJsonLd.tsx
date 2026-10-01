const baseUrl = "https://www.biarritz.com.br";

type PackageAvailability = "InStock" | "OutOfStock" | "PreOrder" | "SoldOut";

type PackageJsonLdProps = {
  nome: string;
  slug: string;
  resumo?: string | null;
  descricao?: string | null;
  preco?: number | null;
  moeda?: string | null;
  dataInicio?: Date | null;
  categoriaNome?: string | null;
  categoriaSlug?: string | null;
  imageUrl?: string | null;
  disponibilidade?: PackageAvailability | null;
};

function toAbsoluteUrl(value: string) {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `${baseUrl}${value.startsWith("/") ? value : `/${value}`}`;
}

function formatDate(value: Date) {
  return value.toISOString();
}

function getAvailabilityUrl(disponibilidade: PackageAvailability): string {
  return `https://schema.org/${disponibilidade}`;
}

export default function PackageJsonLd({
  nome,
  slug,
  resumo,
  descricao,
  preco,
  moeda,
  dataInicio,
  categoriaNome,
  categoriaSlug,
  imageUrl,
  disponibilidade,
}: PackageJsonLdProps) {
  const packageUrl = `${baseUrl}/pacotes/${slug}`;

  const description =
    resumo?.trim() ||
    descricao?.trim() ||
    `Pacote de turismo esportivo ${nome} da Biarritz Turismo Sports.`;

  const graph: Record<string, unknown>[] = [];

  const hasOffer =
    preco !== null &&
    preco !== undefined &&
    moeda !== null &&
    moeda !== undefined &&
    moeda.trim() !== "";

  const offer = hasOffer
    ? {
        "@type": "Offer",
        "@id": `${packageUrl}#offer`,
        url: packageUrl,
        price: preco!.toFixed(2),
        priceCurrency: moeda,
        ...(disponibilidade
          ? {
              availability: getAvailabilityUrl(disponibilidade),
            }
          : {}),
        seller: {
          "@id": `${baseUrl}/#organization`,
        },
      }
    : null;

  const product: Record<string, unknown> = {
    "@type": "Product",
    "@id": `${packageUrl}#product`,
    name: nome,
    url: packageUrl,
    description,
    brand: {
      "@type": "Brand",
      name: "Biarritz Turismo Sports",
    },
    manufacturer: {
      "@id": `${baseUrl}/#organization`,
    },
    ...(imageUrl ? { image: [toAbsoluteUrl(imageUrl)] } : {}),
    ...(categoriaNome ? { category: categoriaNome } : {}),
    ...(offer ? { offers: offer } : {}),
  };

  if (categoriaNome && categoriaSlug) {
    product.isRelatedTo = {
      "@type": "CollectionPage",
      "@id": `${baseUrl}/categorias/${categoriaSlug}#webpage`,
      name: categoriaNome,
      url: `${baseUrl}/categorias/${categoriaSlug}`,
    };
  }

  graph.push(product);

  if (dataInicio) {
    graph.push({
      "@type": "Event",
      "@id": `${packageUrl}#event`,
      name: nome,
      url: packageUrl,
      description,
      startDate: formatDate(dataInicio),
      eventStatus: "https://schema.org/EventScheduled",
      organizer: {
        "@id": `${baseUrl}/#organization`,
      },
      ...(imageUrl ? { image: [toAbsoluteUrl(imageUrl)] } : {}),
      location: {
        "@type": "Place",
        name: "Evento esportivo",
      },
      ...(offer
        ? {
            offers: {
              ...offer,
              "@id": `${packageUrl}#event-offer`,
            },
          }
        : {}),
    });
  }

  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Início",
      item: baseUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Pacotes",
      item: `${baseUrl}/pacotes`,
    },
  ];

  if (categoriaNome && categoriaSlug) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: categoriaNome,
      item: `${baseUrl}/categorias/${categoriaSlug}`,
    });

    breadcrumbItems.push({
      "@type": "ListItem",
      position: 4,
      name: nome,
      item: packageUrl,
    });
  } else {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: nome,
      item: packageUrl,
    });
  }

  graph.push({
    "@type": "WebPage",
    "@id": `${packageUrl}#webpage`,
    url: packageUrl,
    name: nome,
    description,
    isPartOf: {
      "@id": `${baseUrl}/#website`,
    },
    about: {
      "@id": `${packageUrl}#product`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      "@id": `${packageUrl}#breadcrumb`,
      itemListElement: breadcrumbItems,
    },
  });

  const data = {
    "@context": "https://schema.org",
    "@graph": graph,
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
