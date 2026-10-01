"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import type { Categoria } from "@/types/categoria";

type ApiErrorResponse = {
  error?: string;
};

async function buscarCategorias(): Promise<Categoria[]> {
  const response = await fetch("/api/admin/categorias-viagem", {
    method: "GET",
    cache: "no-store",
  });

  const data = (await response.json()) as Categoria[] | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      "error" in data && data.error
        ? data.error
        : "Não foi possível carregar as categorias."
    );
  }

  if (!Array.isArray(data)) {
    throw new Error("Resposta inválida ao carregar as categorias.");
  }

  return data;
}

export default function CategoriasAdminPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nome, setNome] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  async function carregarCategorias() {
    setCarregando(true);
    setErro(null);

    try {
      const data = await buscarCategorias();

      setCategorias(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as categorias."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    let ativo = true;

    buscarCategorias()
      .then((data) => {
        if (!ativo) {
          return;
        }

        setCategorias(data);
      })
      .catch((error: unknown) => {
        if (!ativo) {
          return;
        }

        console.error("Erro ao carregar categorias:", error);

        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as categorias."
        );
      })
      .finally(() => {
        if (!ativo) {
          return;
        }

        setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro(null);
    setSucesso(null);

    const nomeNormalizado = nome.trim();

    if (!nomeNormalizado) {
      setErro("Informe o nome da categoria.");
      return;
    }

    setSalvando(true);

    try {
      const response = await fetch("/api/admin/categorias-viagem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nomeNormalizado,
        }),
      });

      const data = (await response.json()) as Categoria | ApiErrorResponse;

      if (!response.ok) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "Não foi possível criar a categoria."
        );
      }

      if (
        !("id" in data) ||
        !("nome" in data) ||
        !("slug" in data) ||
        typeof data.id !== "number" ||
        typeof data.nome !== "string" ||
        typeof data.slug !== "string"
      ) {
        throw new Error("Resposta inválida ao criar a categoria.");
      }

      setCategorias((categoriasAtuais) =>
        [...categoriasAtuais, data].sort((a, b) =>
          a.nome.localeCompare(b.nome, "pt-BR")
        )
      );

      setNome("");
      setSucesso("Categoria criada com sucesso.");
      toast.success("Categoria criada com sucesso.");
    } catch (error) {
      console.error("Erro ao criar categoria:", error);

      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível criar a categoria.";

      setErro(mensagem);
      toast.error(mensagem);
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluirCategoria(categoria: Categoria) {
    const pacotesCount = categoria.pacotes_count ?? 0;

    if (pacotesCount > 0) {
      setErro(
        `Não é possível excluir a categoria "${categoria.nome}" porque existem ${pacotesCount} pacote${
          pacotesCount === 1 ? "" : "s"
        } relacionado${pacotesCount === 1 ? "" : "s"} a ela.`
      );

      return;
    }

    const confirmado = window.confirm(
      `Excluir a categoria "${categoria.nome}"?\n\nEssa ação não pode ser desfeita.`
    );

    if (!confirmado) {
      return;
    }

    setErro(null);
    setSucesso(null);
    setExcluindoId(categoria.id);

    try {
      const response = await fetch(
        `/api/admin/categorias-viagem?id=${categoria.id}`,
        {
          method: "DELETE",
        }
      );

      const data = (await response.json()) as ApiErrorResponse;

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível excluir a categoria.");
      }

      setCategorias((categoriasAtuais) =>
        categoriasAtuais.filter(
          (categoriaAtual) => categoriaAtual.id !== categoria.id
        )
      );

      setSucesso("Categoria excluída com sucesso.");
      toast.success("Categoria excluída com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);

      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a categoria.";

      setErro(mensagem);
      toast.error(mensagem);
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <main className="p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold">Categorias de viagem</h1>

        <p className="mt-2 text-muted-foreground">
          Gerencie as categorias de viagem cadastradas.
        </p>

        <section className="mt-8 rounded-lg border border-default bg-surface p-6">
          <h2 className="text-lg font-semibold">Nova categoria</h2>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="nome-categoria"
                className="mb-2 block text-sm font-medium"
              >
                Nome da categoria
              </label>

              <input
                id="nome-categoria"
                name="nome"
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                maxLength={100}
                placeholder="Ex.: Viagens internacionais"
                disabled={salvando}
                className="w-full rounded-md border border-default bg-background px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </div>

            <button
              type="submit"
              disabled={salvando || !nome.trim()}
              className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-on-brand transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              {salvando ? "Salvando..." : "Cadastrar categoria"}
            </button>
          </form>
        </section>

        {erro && (
          <div
            role="alert"
            className="mt-6 rounded-md border border-danger bg-surface p-4 text-sm text-danger"
          >
            {erro}
          </div>
        )}

        {sucesso && (
          <div
            role="status"
            className="mt-6 rounded-md border border-default bg-surface p-4 text-sm text-muted"
          >
            {sucesso}
          </div>
        )}

        <section className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Categorias cadastradas</h2>

            <button
              type="button"
              onClick={() => void carregarCategorias()}
              disabled={carregando}
              className="rounded-md border border-default px-3 py-2 text-sm font-medium transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              {carregando ? "Atualizando..." : "Atualizar"}
            </button>
          </div>

          {carregando ? (
            <div className="mt-4 rounded-lg border border-default bg-surface p-6 text-sm text-muted">
              Carregando categorias...
            </div>
          ) : categorias.length === 0 ? (
            <div className="mt-4 rounded-lg border border-default bg-surface p-6 text-sm text-muted">
              Nenhuma categoria cadastrada.
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-lg border border-default">
              <table className="w-full min-w-175 text-left text-sm">
                <thead className="bg-surface-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Nome</th>
                    <th className="px-4 py-3 font-semibold">Slug</th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Pacotes
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {categorias.map((categoria) => {
                    const pacotesCount = categoria.pacotes_count ?? 0;
                    const podeExcluir = pacotesCount === 0;
                    const excluindo = excluindoId === categoria.id;

                    return (
                      <tr
                        key={categoria.id}
                        className="border-t border-default"
                      >
                        <td className="px-4 py-3 font-medium">
                          {categoria.nome}
                        </td>

                        <td className="px-4 py-3 text-muted">
                          {categoria.slug}
                        </td>

                        <td className="px-4 py-3 text-center">
                          <span
                            className={
                              pacotesCount > 0
                                ? "font-medium text-admin"
                                : "text-muted"
                            }
                          >
                            {pacotesCount}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              void handleExcluirCategoria(categoria)
                            }
                            disabled={
                              !podeExcluir || excluindo || excluindoId !== null
                            }
                            title={
                              podeExcluir
                                ? "Excluir categoria"
                                : `Não é possível excluir: ${pacotesCount} pacote${
                                    pacotesCount === 1 ? "" : "s"
                                  } relacionado${
                                    pacotesCount === 1 ? "" : "s"
                                  }.`
                            }
                            className="rounded-md border border-danger px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {excluindo ? "Excluindo..." : "Excluir"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
