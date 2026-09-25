import Section from "./Section";
import UploadImagem from "@/components/admin/UploadImagem";

type ImagensPacoteProps = {
  fotoCapa: File | null;
  setFotoCapa: (file: File | null) => void;
  fotoCard: File | null;
  setFotoCard: (file: File | null) => void;
  fotoBanner: File | null;
  setFotoBanner: (file: File | null) => void;

  capaAtualUrl?: string;
  cardAtualUrl?: string;
  bannerAtualUrl?: string;
};

export default function ImagensPacote({
  fotoCapa,
  setFotoCapa,
  fotoCard,
  setFotoCard,
  fotoBanner,
  setFotoBanner,
  capaAtualUrl,
  cardAtualUrl,
  bannerAtualUrl,
}: ImagensPacoteProps) {
  return (
    <Section
      title="Imagens do pacote"
      description="Escolha cada imagem observando o local onde ela será exibida no site. O preview utiliza a proporção do componente."
    >
      <div className="space-y-6">
        <UploadImagem
          label="Imagem de capa"
          description="Imagem principal utilizada para apresentar o pacote."
          location="Aparece no topo da página de detalhes do pacote, como imagem principal da experiência."
          recommendedSize="1600 × 900 px"
          helperText="Prefira uma imagem horizontal, com o assunto principal bem enquadrado. Evite posicionar informações importantes nas extremidades."
          value={fotoCapa}
          onChange={setFotoCapa}
          imagemAtualUrl={capaAtualUrl}
          aspect="16:9"
        />

        <UploadImagem
          label="Imagem do card"
          description="Imagem utilizada na apresentação resumida do pacote."
          location="Aparece nos cards de pacotes, como na página inicial, listagens e áreas de destaque."
          recommendedSize="1200 × 900 px"
          helperText="Escolha uma imagem que continue identificável mesmo quando for exibida em um espaço menor."
          value={fotoCard}
          onChange={setFotoCard}
          imagemAtualUrl={cardAtualUrl}
          aspect="4:3"
        />

        <UploadImagem
          label="Imagem de banner"
          description="Imagem horizontal utilizada em áreas de destaque."
          location="Aparece na área de banner ou destaque da página configurada para o pacote."
          recommendedSize="2100 × 900 px"
          helperText="Prefira uma composição ampla. Evite colocar textos ou elementos importantes nas bordas, pois o corte pode variar conforme a tela."
          value={fotoBanner}
          onChange={setFotoBanner}
          imagemAtualUrl={bannerAtualUrl}
          aspect="21:9"
        />
      </div>
    </Section>
  );
}
