"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import InformacoesBasicas from "@/components/pacotes/novos/InformacoesBasicas";
import ImagensPacote from "@/components/pacotes/novos/ImagensPacote";
import ConteudoPacote from "@/components/pacotes/novos/ConteudoPacote";
import StickyActions from "@/components/pacotes/novos/StickyActions";
import ConfirmModal from "@/components/ui/ConfirmModal";
import PacotePreview from "@/components/pacotes/novos/PacotePreview";

import { PacoteFormState } from "@/types/pacoteForm";

type Categoria = {
  id: number;
  nome: string;
};

type PacoteEditavel = {
  id: number;
  nome: string;
  categoria_id: number;
  data_inicio: string;
  preco: number;
  moeda?: PacoteFormState["moeda"];
  texto_destaque: string;
  resumo: string;
  descricao: string;
  destaque: boolean;
  capaUrl?: string;
  cardUrl?: string;
  bannerUrl?: string;
};

type Props = {
  pacote: PacoteEditavel;
  categorias: Categoria[];
};

type TipoImagem = "CAPA" | "CARD" | "BANNER";

type ApiResponse = {
  error?: string;
};

export default function EditarPacoteClient({ pacote, categorias }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [formData, setFormData] = useState<PacoteFormState>({
    nome: pacote.nome,
    categoria_id: pacote.categoria_id,
    data_inicio: pacote.data_inicio,
    preco: pacote.preco,
    moeda: pacote.moeda ?? "EUR",
    texto_destaque: pacote.texto_destaque,
    resumo: pacote.resumo,
    descricao: pacote.descricao,
    destaque: pacote.destaque,
  });

  const [listaCategorias, setListaCategorias] =
    useState<Categoria[]>(categorias);

  const [fotoCapa, setFotoCapa] = useState<File | null>(null);
  const [fotoCard, setFotoCard] = useState<File | null>(null);
  const [fotoBanner, setFotoBanner] = useState<File | null>(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function updateField<K extends keyof PacoteFormState>(
    key: K,
    value: PacoteFormState[K]
  ) {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function uploadImagem(file: File, tipo: TipoImagem, pacoteId: number) {
    const formDataUpload = new FormData();

    formDataUpload.append("file", file);
    formDataUpload.append("tipo", tipo);
    formDataUpload.append("pacoteId", String(pacoteId));

    const response = await fetch("/api/admin/pacotes/upload", {
      method: "POST",
      body: formDataUpload,
    });

    const responseData = (await response.json()) as ApiResponse;

    if (!response.ok) {
      throw new Error(responseData.error || `Erro ao enviar a imagem ${tipo}`);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    const nome = formData.nome.trim();

    if (nome.length < 3) {
      toast.error("Informe um nome com pelo menos 3 caracteres");
      return;
    }

    if (formData.categoria_id === "") {
      toast.error("Selecione uma categoria");
      return;
    }

    if (!Number.isFinite(formData.preco) || formData.preco < 0) {
      toast.error("Informe um preço válido");
      return;
    }

    try {
      setLoading(true);
      setLoadingMessage("Salvando alterações...");

      const response = await fetch(`/api/admin/pacotes/${pacote.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          nome,
        }),
      });

      const responseData = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(responseData.error || "Erro ao atualizar pacote");
      }

      const imagens = [
        fotoCapa
          ? {
              file: fotoCapa,
              tipo: "CAPA" as const,
            }
          : null,
        fotoCard
          ? {
              file: fotoCard,
              tipo: "CARD" as const,
            }
          : null,
        fotoBanner
          ? {
              file: fotoBanner,
              tipo: "BANNER" as const,
            }
          : null,
      ].filter(
        (
          item
        ): item is {
          file: File;
          tipo: TipoImagem;
        } => item !== null
      );

      for (let index = 0; index < imagens.length; index += 1) {
        const imagem = imagens[index];

        setLoadingMessage(
          `Atualizando imagens... ${index + 1}/${imagens.length}`
        );

        await uploadImagem(imagem.file, imagem.tipo, pacote.id);
      }

      toast.success("Pacote atualizado com sucesso");

      router.refresh();
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);

      const message =
        error instanceof Error ? error.message : "Erro ao salvar alterações";

      toast.error(message);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  }

  async function handleDelete() {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      setLoadingMessage("Arquivando pacote...");

      const response = await fetch(`/api/admin/pacotes/${pacote.id}`, {
        method: "DELETE",
      });

      const responseData = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(responseData.error || "Erro ao arquivar pacote");
      }

      toast.success("Pacote arquivado com sucesso");

      router.push("/admin/pacotes");
      router.refresh();
    } catch (error) {
      console.error("Erro ao arquivar pacote:", error);

      const message =
        error instanceof Error ? error.message : "Erro ao arquivar pacote";

      toast.error(message);
    } finally {
      setLoading(false);
      setLoadingMessage("");
      setShowDeleteModal(false);
    }
  }

  const categoriaAtual = listaCategorias.find(
    (categoria) => categoria.id === formData.categoria_id
  );

  return (
    <div className="min-h-screen bg-admin">
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6 sm:py-10">
        <h1 className="text-xl font-semibold text-admin sm:text-2xl">
          Editar pacote
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <InformacoesBasicas
            categorias={listaCategorias}
            setCategorias={setListaCategorias}
            categoriaSelecionada={formData.categoria_id}
            onCategoriaChange={(value) => updateField("categoria_id", value)}
            valores={{
              nome: formData.nome,
              data_inicio: formData.data_inicio,
              preco: formData.preco,
              moeda: formData.moeda,
              destaque: formData.destaque,
            }}
            onChange={updateField}
          />

          <ImagensPacote
            fotoCapa={fotoCapa}
            setFotoCapa={setFotoCapa}
            fotoCard={fotoCard}
            setFotoCard={setFotoCard}
            fotoBanner={fotoBanner}
            setFotoBanner={setFotoBanner}
            capaAtualUrl={pacote.capaUrl}
            cardAtualUrl={pacote.cardUrl}
            bannerAtualUrl={pacote.bannerUrl}
          />

          <ConteudoPacote
            valores={{
              texto_destaque: formData.texto_destaque,
              resumo: formData.resumo,
              descricao: formData.descricao,
            }}
            onChange={updateField}
          />

          <StickyActions
            loading={loading}
            loadingMessage={loadingMessage}
            onCancel={() => setShowCancelModal(true)}
            onDelete={() => setShowDeleteModal(true)}
          />
        </form>
      </div>

      <div className="mx-auto mt-10 max-w-7xl overflow-hidden rounded-xl border border-default">
        <PacotePreview
          nome={formData.nome}
          categoria={
            categoriaAtual
              ? {
                  nome: categoriaAtual.nome,
                }
              : undefined
          }
          dataInicio={
            formData.data_inicio
              ? new Date(`${formData.data_inicio}T00:00:00`)
              : undefined
          }
          textoDestaque={formData.texto_destaque}
          resumo={formData.resumo}
          descricao={formData.descricao}
          preco={formData.preco}
          moeda={formData.moeda}
          capaUrl={pacote.capaUrl}
        />
      </div>

      <ConfirmModal
        open={showCancelModal}
        title="Cancelar edição?"
        description="As alterações não salvas serão perdidas."
        confirmLabel="Sim, cancelar"
        onCancel={() => setShowCancelModal(false)}
        onConfirm={() => {
          setShowCancelModal(false);
          router.back();
        }}
      />

      <ConfirmModal
        open={showDeleteModal}
        title="Arquivar pacote?"
        description="O pacote será removido das áreas públicas. Os dados serão mantidos no banco."
        confirmLabel="Sim, arquivar"
        danger
        loading={loading}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
