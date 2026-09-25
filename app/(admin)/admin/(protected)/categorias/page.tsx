"use client";

import { FormEvent, useEffect, useState } from "react";

type Categoria = {
  id: number;
  nome: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export default function CategoriasAdminPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nome, setNome] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  async function carregarCategorias() {
    setCarregando(true);
    setErro(null);

    try {
      const response = await fetch("/api/admin/categorias-viagem", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Não foi possível carregar as categorias."
        );
      }

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
    void carregarCategorias();
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível criar a categoria.");
      }

      setCategorias((categoriasAtuais) =>
        [...categoriasAtuais, data].sort((a, b) =>
          a.nome.localeCompare(b.nome, "pt-BR")
        )
      );

      setNome("");
      setSucesso("Categoria criada com sucesso.");
    } catch (error) {
      console.error("Erro ao criar categoria:", error);

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível criar a categoria."
      );
    } finally {
      setSalvando(false);
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
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead className="bg-surface-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Nome</th>
                    <th className="px-4 py-3 font-semibold">Slug</th>
                  </tr>
                </thead>

                <tbody>
                  {categorias.map((categoria) => (
                    <tr key={categoria.id} className="border-t border-default">
                      <td className="px-4 py-3">{categoria.nome}</td>
                      <td className="px-4 py-3 text-muted">{categoria.slug}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
