type PackageJsonLdProps = {
  name: string;
  description?: string;
  url: string;
  image?: string;
  category?: string;
  price?: number;
  currency?: string;
};

export default function PackageJsonLd({
  name,
  description,
  url,
  image,
  category,
  price,
  currency,
}: PackageJsonLdProps) {
  const product: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    url,
    ...(description ? { description } : {}),
    ...(image ? { image: [image] } : {}),
    ...(category ? { category } : {}),
  };

  if (price !== undefined && currency) {
    product.offers = {
      "@type": "Offer",
      url,
      price: price.toFixed(2),
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Biarritz Turismo Sports",
        url: "https://www.biarritz.com.br",
      },
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(product),
      }}
    />
  );
}
