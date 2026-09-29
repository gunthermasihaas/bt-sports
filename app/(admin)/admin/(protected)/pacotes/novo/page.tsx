"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import InformacoesBasicas from "@/components/pacotes/novos/InformacoesBasicas";
import ImagensPacote from "@/components/pacotes/novos/ImagensPacote";
import ConteudoPacote from "@/components/pacotes/novos/ConteudoPacote";
import StickyActions from "@/components/pacotes/novos/StickyActions";
import PacotePreview from "@/components/pacotes/novos/PacotePreview";
import { PacoteFormState } from "@/types/pacoteForm";

type Categoria = {
  id: number;
  nome: string;
};

type ApiErrorResponse = {
  error?: string;
  details?: unknown;
};

type CreatePacoteResponse = {
  pacote?: {
    id: number;
  };
  error?: string;
};

type UploadResponse = {
  error?: string;
};

type TipoImagem = "CAPA" | "CARD" | "BANNER";

export default function NovoPacotePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [fotoCapa, setFotoCapa] = useState<File | null>(null);
  const [fotoBanner, setFotoBanner] = useState<File | null>(null);
  const [fotoCard, setFotoCard] = useState<File | null>(null);

  const [capaPreviewUrl, setCapaPreviewUrl] = useState<string | undefined>(
    undefined
  );

  const [formData, setFormData] = useState<PacoteFormState>({
    nome: "",
    categoria_id: "",
    data_inicio: "",
    preco: 0,
    moeda: "EUR",
    texto_destaque: "",
    resumo: "",
    descricao: "",
    destaque: false,
  });

  useEffect(() => {
    let active = true;

    async function carregarCategorias() {
      try {
        const response = await fetch("/api/admin/categorias-viagem", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await response.json()) as Categoria[] | ApiErrorResponse;

        if (!response.ok) {
          throw new Error(
            "error" in data && data.error
              ? data.error
              : "Erro ao carregar categorias"
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("Resposta inválida ao carregar categorias");
        }

        if (active) {
          setCategorias(data);
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);

        if (active) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Erro ao carregar categorias"
          );
        }
      }
    }

    void carregarCategorias();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!fotoCapa) {
      setCapaPreviewUrl(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(fotoCapa);

    setCapaPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [fotoCapa]);

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
    const uploadData = new FormData();

    uploadData.append("file", file);
    uploadData.append("tipo", tipo);
    uploadData.append("pacoteId", String(pacoteId));

    const response = await fetch("/api/admin/pacotes/upload", {
      method: "POST",
      body: uploadData,
    });

    const data = (await response.json()) as UploadResponse;

    if (!response.ok) {
      throw new Error(data.error || `Erro ao enviar a imagem ${tipo}`);
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
      setLoadingMessage("Criando pacote...");

      const response = await fetch("/api/admin/pacotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          nome,
        }),
      });

      const responseData = (await response.json()) as CreatePacoteResponse;

      if (!response.ok || !responseData.pacote) {
        throw new Error(responseData.error || "Erro ao criar pacote");
      }

      const pacoteId = responseData.pacote.id;

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

        setLoadingMessage(`Enviando imagens... ${index + 1}/${imagens.length}`);

        await uploadImagem(imagem.file, imagem.tipo, pacoteId);
      }

      toast.success("Pacote criado com sucesso");

      router.push(`/admin/pacotes/${pacoteId}`);
      router.refresh();
    } catch (error) {
      console.error("Erro ao salvar pacote:", error);

      const message =
        error instanceof Error ? error.message : "Erro ao salvar pacote";

      toast.error(message);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  }

  const categoriaAtual = categorias.find(
    (categoria) => categoria.id === formData.categoria_id
  );

  return (
    <div className="min-h-screen bg-admin">
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6 sm:py-10">
        <h1 className="text-xl font-semibold text-admin sm:text-2xl">
          Criar novo pacote
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <InformacoesBasicas
            categorias={categorias}
            setCategorias={setCategorias}
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
          />

          <ConteudoPacote
            valores={{
              texto_destaque: formData.texto_destaque,
              resumo: formData.resumo,
              descricao: formData.descricao,
            }}
            onChange={updateField}
          />

          <div className="overflow-hidden rounded-xl border border-default">
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
              capaUrl={capaPreviewUrl}
            />
          </div>

          <StickyActions
            loading={loading}
            loadingMessage={loadingMessage}
            onCancel={() => {
              if (loading) {
                return;
              }

              router.push("/admin/pacotes");
            }}
          />
        </form>
      </div>
    </div>
  );
}
