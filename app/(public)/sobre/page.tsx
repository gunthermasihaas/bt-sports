import type { Metadata } from "next";

import SobreNos from "@/components/about/sobre-nos";
import NossaHistoria from "@/components/about/história";
import Filosofia from "@/components/about/filosofia";

const baseUrl = "https://www.biarritz.com.br";

const title = "Sobre a Biarritz Turismo Sports";

const description =
  "Conheça a Biarritz Turismo Sports, empresa especializada em turismo esportivo, eventos esportivos e experiências para grandes competições.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/sobre",
  },
  openGraph: {
    title,
    description,
    url: `${baseUrl}/sobre`,
    type: "website",
    siteName: "Biarritz Turismo Sports",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${baseUrl}/sobre#webpage`,
    url: `${baseUrl}/sobre`,
    name: title,
    description,
    isPartOf: {
      "@id": `${baseUrl}/#website`,
    },
    about: {
      "@id": `${baseUrl}/#organization`,
    },
    mainEntity: {
      "@id": `${baseUrl}/#organization`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <main>
        <SobreNos />
        <NossaHistoria />
        <Filosofia />
      </main>
    </>
  );
}
