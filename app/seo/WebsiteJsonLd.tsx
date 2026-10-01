export default function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.biarritz.com.br/#website",
        url: "https://www.biarritz.com.br",
        name: "Biarritz Turismo Sports",
        publisher: {
          "@id": "https://www.biarritz.com.br/#organization",
        },
        inLanguage: "pt-BR",
      },
      {
        "@type": "WebPage",
        "@id": "https://www.biarritz.com.br/#webpage",
        url: "https://www.biarritz.com.br",
        name: "Biarritz Turismo Sports",
        isPartOf: {
          "@id": "https://www.biarritz.com.br/#website",
        },
        about: {
          "@id": "https://www.biarritz.com.br/#organization",
        },
        inLanguage: "pt-BR",
      },
    ],
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
