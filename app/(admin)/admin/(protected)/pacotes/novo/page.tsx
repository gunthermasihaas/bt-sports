"use client";

import { useEffect, useState } from "react";
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

export default function NovoPacotePage() {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [fotoCapa, setFotoCapa] = useState<File | null>(null);
  const [fotoBanner, setFotoBanner] = useState<File | null>(null);
  const [fotoCard, setFotoCard] = useState<File | null>(null);

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
    fetch("/api/admin/categorias-viagem")
      .then((r) => r.json())
      .then(setCategorias)
      .catch(() => toast.error("Erro ao carregar categorias"));
  }, []);

  function updateField<K extends keyof PacoteFormState>(
    key: K,
    value: PacoteFormState[K]
  ) {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setLoadingMessage("Criando pacote...");

      const res = await fetch("/api/admin/pacotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erro ao criar pacote");

      const { pacote } = await res.json();

      async function uploadImagem(file: File, tipo: string) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("tipo", tipo);
        fd.append("pacoteId", pacote.id.toString());

        await fetch("/api/admin/pacotes/upload", {
          method: "POST",
          body: fd,
        });
      }

      setLoadingMessage("Enviando imagens...");

      if (fotoCapa) await uploadImagem(fotoCapa, "CAPA");
      if (fotoCard) await uploadImagem(fotoCard, "CARD");
      if (fotoBanner) await uploadImagem(fotoBanner, "BANNER");

      window.location.href = `/admin/pacotes/${pacote.id}`;
    } catch (err) {
      toast.error("Erro ao salvar pacote");
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  }

  const categoriaAtual = categorias.find((c) => c.id === formData.categoria_id);

  return (
    <div className="bg-admin min-h-screen">
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6 sm:py-10">
        <h1 className="text-xl sm:text-2xl font-semibold text-admin">
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

          <div className="rounded-xl border border-default overflow-hidden">
            <PacoteView
              nome={formData.nome || "Nome do pacote"}
              categoria={
                categoriaAtual ? { nome: categoriaAtual.nome } : undefined
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
              capaUrl={fotoCapa ? URL.createObjectURL(fotoCapa) : undefined}
            />
          </div>

          <StickyActions
            loading={loading}
            loadingMessage={loadingMessage}
            onCancel={() => {
              if (confirm("Deseja cancelar?")) {
                window.location.href = "/admin/pacotes";
              }
            }}
          />
        </form>
      </div>
    </div>
  );
}
