import type { Metadata } from "next";

import ContactForm from "@/components/contato/ContactForm";

const baseUrl = "https://www.biarritz.com.br";

const title = "Contato | Biarritz Turismo Sports";

const description =
  "Entre em contato com a Biarritz Turismo Sports para obter informações sobre pacotes de turismo esportivo, eventos e experiências.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/contato",
  },
  openGraph: {
    title,
    description,
    url: `${baseUrl}/contato`,
    type: "website",
    siteName: "Biarritz Turismo Sports",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

type Props = {
  searchParams: Promise<{
    pacote?: string;
    slug?: string;
  }>;
};

export default async function ContatoPage({ searchParams }: Props) {
  const params = await searchParams;

  const pacoteNome =
    typeof params.pacote === "string" ? params.pacote.trim() : "";

  const pacoteSlug = typeof params.slug === "string" ? params.slug.trim() : "";

  const mensagemInicial =
    pacoteNome && pacoteSlug
      ? `Olá, gostaria de receber mais informações sobre o pacote "${pacoteNome}".`
      : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${baseUrl}/contato#webpage`,
    url: `${baseUrl}/contato`,
    name: title,
    description,
    isPartOf: {
      "@id": `${baseUrl}/#website`,
    },
    about: {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: "Biarritz Turismo Sports",
      url: baseUrl,
    },
    mainEntity: {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: "Biarritz Turismo Sports",
      url: baseUrl,
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

      <main className="min-h-screen bg-background">
        <ContactForm mensagemInicial={mensagemInicial} />
      </main>
    </>
  );
}
