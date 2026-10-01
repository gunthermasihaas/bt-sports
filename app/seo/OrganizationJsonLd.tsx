const baseUrl = "https://www.biarritz.com.br";

export default function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,

    name: "Biarritz Turismo Sports",
    legalName: "Buisson & Cia Ltda",
    url: baseUrl,

    description:
      "Empresa brasileira especializada em turismo esportivo, pacotes de viagem e experiências para grandes eventos esportivos.",

    foundingDate: "1993",

    address: {
      "@type": "PostalAddress",
      addressLocality: "Porto Alegre",
      addressRegion: "RS",
      addressCountry: "BR",
    },

    telephone: "+55 51 3026-2233",
    email: "flavio@biarritz.com.br",

    sameAs: [
      "https://www.instagram.com/biarritzsports/",
      "https://www.facebook.com/biarritzsports/",
      "https://www.biarritz.net.br/",
    ],

    identifier: [
      {
        "@type": "PropertyValue",
        propertyID: "CNPJ",
        value: "94.996.931/0001-35",
      },
      {
        "@type": "PropertyValue",
        propertyID: "CADASTUR",
        value: "94996931000135",
      },
      {
        "@type": "PropertyValue",
        propertyID: "IATA TIDS",
        value: "96180512",
      },
      {
        "@type": "PropertyValue",
        propertyID: "Inscrição Municipal",
        value: "4451171",
      },
    ],

    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },

    knowsAbout: [
      "Turismo esportivo",
      "Viagens esportivas",
      "Eventos esportivos",
      "Maratonas",
      "Corridas de rua",
      "Tênis",
      "Futebol",
      "Automobilismo",
      "Ciclismo",
      "Esqui",
    ],

    employee: [
      {
        "@type": "Person",
        name: "Véronique Buisson Masi",
      },
      {
        "@type": "Person",
        name: "Flávio Galant Masi",
      },
    ],

    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55 51 3026-2233",
      email: "flavio@biarritz.com.br",
      contactType: "customer service",
      areaServed: "BR",
      availableLanguage: ["Portuguese", "French"],
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
