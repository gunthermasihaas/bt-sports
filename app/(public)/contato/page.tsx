import ContactForm from "@/components/contato/ContactForm";

export const metadata = {
  title: "Contato | Biarritz Turismo Sports",
  description:
    "Entre em contato com a Biarritz Turismo Sports e fale com nossa equipe.",
};

type Props = {
  searchParams: Promise<{
    pacote?: string;
    slug?: string;
  }>;
};

export default async function ContatoPage({ searchParams }: Props) {
  const params = await searchParams;

  const pacoteNome = typeof params.pacote === "string" ? params.pacote : "";

  const pacoteSlug = typeof params.slug === "string" ? params.slug : "";

  const mensagemInicial =
    pacoteNome && pacoteSlug
      ? `Olá, gostaria de receber mais informações sobre o pacote "${pacoteNome}".`
      : "";

  return (
    <main>
      <ContactForm mensagemInicial={mensagemInicial} />
    </main>
  );
}
