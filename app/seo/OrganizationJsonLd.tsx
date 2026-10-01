type OrganizationJsonLdProps = {
  url?: string;
};

export default function OrganizationJsonLd({
  url = "https://www.biarritz.com.br",
}: OrganizationJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${url}/#organization`,
    name: "Biarritz Turismo Sports",
    url,
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
