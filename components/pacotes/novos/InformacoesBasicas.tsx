"use client";

import React from "react";
import { toast } from "sonner";

import Section from "./Section";
import Field from "./Field";
import { PacoteFormState } from "@/types/pacoteForm";
import { MOEDAS, type Moeda } from "@/types/moedas";

const inputBase =
  "mt-2 w-full rounded-md bg-surface px-3.5 py-2 border border-default text-admin focus-ring-brand";

type Categoria = {
  id: number;
  nome: string;
};

type Props = {
  categorias: Categoria[];
  setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>;

  categoriaSelecionada: number | "";
  onCategoriaChange: (value: number | "") => void;

  valores: Pick<
    PacoteFormState,
    "nome" | "data_inicio" | "preco" | "moeda" | "destaque"
  >;

  onChange: <K extends keyof PacoteFormState>(
    key: K,
    value: PacoteFormState[K]
  ) => void;
};

const moedas = MOEDAS;

export default function InformacoesBasicas({
  categorias,
  setCategorias,
  categoriaSelecionada,
  onCategoriaChange,
  valores,
  onChange,
}: Props) {
  const [criandoCategoria, setCriandoCategoria] = React.useState(false);
  const [novaCategoria, setNovaCategoria] = React.useState("");

  function handleCategoriaChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;

    onCategoriaChange(value === "" ? "" : Number(value));
  }

  function handleMoedaChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;

    if (MOEDAS.includes(value as Moeda)) {
      onChange("moeda", value as PacoteFormState["moeda"]);
    }
  }

  async function handleCriarCategoria() {
    const nome = novaCategoria.trim();

    if (!nome) {
      toast.error("Informe o nome da categoria");
      return;
    }

    try {
      const response = await fetch("/api/admin/categorias-viagem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
        }),
      });

      let data: Categoria | { error?: string } | null = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        const errorMessage =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Erro ao criar categoria";

        throw new Error(errorMessage);
      }

      if (
        !data ||
        typeof data !== "object" ||
        !("id" in data) ||
        !("nome" in data) ||
        typeof data.id !== "number" ||
        typeof data.nome !== "string"
      ) {
        throw new Error("Resposta inválida ao criar categoria");
      }

      const categoriaCriada: Categoria = {
        id: data.id,
        nome: data.nome,
      };

      setCategorias((prev) => {
        const categoriasAtualizadas = [...prev, categoriaCriada];

        return categoriasAtualizadas.sort((a, b) =>
          a.nome.localeCompare(b.nome, "pt-BR")
        );
      });

      onCategoriaChange(categoriaCriada.id);

      setNovaCategoria("");
      setCriandoCategoria(false);

      toast.success("Categoria criada com sucesso");
    } catch (error) {
      console.error("Erro ao criar categoria:", error);

      toast.error(
        error instanceof Error ? error.message : "Erro ao criar categoria"
      );
    }
  }

  return (
    <Section
      title="Informações básicas"
      description="Dados principais do pacote"
    >
      <Field label="Nome do pacote" required>
        <input
          value={valores.nome}
          onChange={(event) => onChange("nome", event.target.value)}
          className={inputBase}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Categoria" required>
          {!criandoCategoria ? (
            <div className="space-y-2">
              <select
                value={categoriaSelecionada}
                onChange={handleCategoriaChange}
                className={inputBase}
              >
                <option value="">Selecione uma categoria</option>

                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setCriandoCategoria(true)}
                className="text-sm font-medium text-brand hover:underline"
              >
                + Criar nova categoria
              </button>
            </div>
          ) : (
            <div className="space-y-3 rounded-md border border-default bg-surface-muted p-4">
              <input
                value={novaCategoria}
                onChange={(event) => setNovaCategoria(event.target.value)}
                placeholder="Nome da nova categoria"
                className={inputBase}
                autoFocus
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCriarCategoria}
                  className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand"
                >
                  Salvar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCriandoCategoria(false);
                    setNovaCategoria("");
                  }}
                  className="text-sm font-medium text-admin-muted hover:underline"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </Field>

        <Field label="Data de início">
          <input
            type="date"
            value={valores.data_inicio}
            onChange={(event) => onChange("data_inicio", event.target.value)}
            className={inputBase}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Preço">
          <input
            type="number"
            min="0"
            step="0.01"
            value={valores.preco}
            onChange={(event) => onChange("preco", Number(event.target.value))}
            className={inputBase}
          />
        </Field>

        <Field label="Moeda">
          <select
            value={valores.moeda}
            onChange={handleMoedaChange}
            className={inputBase}
          >
            {moedas.map((moeda) => (
              <option key={moeda} value={moeda}>
                {moeda}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="pt-2">
        <label className="flex items-center gap-3 text-sm font-medium text-admin">
          <input
            type="checkbox"
            checked={valores.destaque}
            onChange={(event) => onChange("destaque", event.target.checked)}
          />
          Destacar este pacote na home
        </label>
      </div>
    </Section>
  );
}
