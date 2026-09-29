"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InformacoesBasicas from "@/components/pacotes/novos/InformacoesBasicas";
import ImagensPacote from "@/components/pacotes/novos/ImagensPacote";
import ConteudoPacote from "@/components/pacotes/novos/ConteudoPacote";
import StickyActions from "@/components/pacotes/novos/StickyActions";
import PacoteView from "@/components/pacotes/PacoteView";
import { PacoteFormState } from "@/types/pacoteForm";
import { toast } from "sonner";

type Categoria = {
  id: number;
  nome: string;
};

type UploadResponse = {
  error?: string;
};

type CreatePacoteResponse = {
  pacote?: {
    id: number;
  };
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
        const response = await fetch("/api/admin/categorias-viagem");

        if (!response.ok) {
          throw new Error("Erro ao carregar categorias");
        }

        const data = (await response.json()) as Categoria[];

        if (active) {
          setCategorias(data);
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);

        if (active) {
          toast.error("Erro ao carregar categorias");
        }
      }
    }

    carregarCategorias();

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
    const formDataUpload = new FormData();

    formDataUpload.append("file", file);
    formDataUpload.append("tipo", tipo);
    formDataUpload.append("pacoteId", String(pacoteId));

    const response = await fetch("/api/admin/pacotes/upload", {
      method: "POST",
      body: formDataUpload,
    });

    let responseData: UploadResponse = {};

    try {
      responseData = (await response.json()) as UploadResponse;
    } catch {
      responseData = {};
    }

    if (!response.ok) {
      throw new Error(responseData.error || `Erro ao enviar a imagem ${tipo}`);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) {
      return;
    }

    if (!formData.nome.trim()) {
      toast.error("Informe o nome do pacote");
      return;
    }

    if (formData.categoria_id === "") {
      toast.error("Selecione uma categoria");
      return;
    }

    if (formData.preco < 0) {
      toast.error("O preço não pode ser negativo");
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
        body: JSON.stringify(formData),
      });

      let responseData: CreatePacoteResponse = {};

      try {
        responseData = (await response.json()) as CreatePacoteResponse;
      } catch {
        responseData = {};
      }

      if (!response.ok || !responseData.pacote) {
        throw new Error(responseData.error || "Erro ao criar pacote");
      }

      const pacoteId = responseData.pacote.id;

      setLoadingMessage("Enviando imagens...");

      if (fotoCapa) {
        await uploadImagem(fotoCapa, "CAPA", pacoteId);
      }

      if (fotoCard) {
        await uploadImagem(fotoCard, "CARD", pacoteId);
      }

      if (fotoBanner) {
        await uploadImagem(fotoBanner, "BANNER", pacoteId);
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
            <PacoteView
              slug="preview"
              nome={formData.nome || "Nome do pacote"}
              categoria={
                categoriaAtual
                  ? {
                      nome: categoriaAtual.nome,
                    }
                  : undefined
              }
              data_inicio={
                formData.data_inicio
                  ? new Date(formData.data_inicio)
                  : undefined
              }
              texto_destaque={formData.texto_destaque}
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
