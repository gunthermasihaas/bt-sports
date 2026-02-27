"use client";

import { useState } from "react";
import InformacoesBasicas from "@/components/pacotes/novos/InformacoesBasicas";
import ConteudoPacote from "@/components/pacotes/novos/ConteudoPacote";
import StickyActions from "@/components/pacotes/novos/StickyActions";
import ConfirmModal from "@/components/ui/ConfirmModal";
import PacoteView from "@/components/pacotes/PacoteView";
import { toast } from "sonner";
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
  moeda?: string;
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

export default function EditarPacoteClient({ pacote, categorias }: Props) {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setLoadingMessage("Salvando alterações...");

      const res = await fetch(`/api/admin/pacotes/${pacote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erro ao atualizar pacote");

      toast.success("Pacote atualizado");
    } catch (err) {
      toast.error("Erro ao salvar alterações");
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  }

  async function handleDelete() {
    try {
      setLoading(true);
      setLoadingMessage("Excluindo pacote...");

      const res = await fetch(`/api/admin/pacotes/${pacote.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao excluir pacote");

      window.location.href = "/admin/pacotes";
    } catch (err) {
      toast.error("Erro ao excluir pacote");
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  }

  const categoriaAtual = listaCategorias.find(
    (c) => c.id === formData.categoria_id
  );

  return (
    <div className="bg-admin min-h-screen">
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

      <div className="rounded-xl border border-default overflow-hidden">
        <PacoteView
          nome={formData.nome}
          categoria={categoriaAtual ? { nome: categoriaAtual.nome } : undefined}
          data_inicio={
            formData.data_inicio ? new Date(formData.data_inicio) : undefined
          }
          texto_destaque={formData.texto_destaque}
          resumo={formData.resumo}
          descricao={formData.descricao}
          preco={formData.preco}
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
          history.back();
        }}
      />

      <ConfirmModal
        open={showDeleteModal}
        title="Excluir pacote?"
        description="Essa ação é permanente."
        confirmLabel="Sim, excluir"
        danger
        loading={loading}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
