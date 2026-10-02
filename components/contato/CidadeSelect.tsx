import { useRef } from "react";

import { useClickOutside } from "./hooks/useClickOutside";

type Cidade = {
  id: number;
  nome: string;
};

type Props = {
  estado: string;
  cidade: string;
  setCidade: (v: string) => void;
  cidades: Cidade[];
  busca: string;
  setBusca: (v: string) => void;
};

export function CidadeSelect({
  estado,
  cidade,
  setCidade,
  cidades,
  busca,
  setBusca,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [aberta, setAberta] = useClickOutside(ref);

  const desativado = !estado || estado === "FORA";

  return (
    <div ref={ref} className="relative">
      <label
        htmlFor="cidade-trigger"
        className="block text-sm font-bold text-default"
      >
        Cidade
      </label>

      <button
        id="cidade-trigger"
        type="button"
        disabled={desativado}
        onClick={() => setAberta((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={aberta}
        className={`mt-2 flex min-h-12 w-full items-center justify-between rounded-xl border bg-surface px-4 text-left text-sm shadow-sm outline-none transition ${
          desativado
            ? "cursor-not-allowed border-default text-muted opacity-50"
            : "border-default text-default hover:border-border-muted focus:border-brand focus-ring-brand"
        }`}
      >
        <span className={cidade ? "text-default" : "text-muted"}>
          {cidade || "Selecione a cidade"}
        </span>

        <span
          aria-hidden="true"
          className={`text-xs text-muted transition-transform ${
            aberta ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {aberta && !desativado && (
        <div
          role="dialog"
          aria-label="Selecionar cidade"
          className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-xl border border-default bg-surface shadow-[var(--shadow-elevated)]"
        >
          <div className="border-b border-default p-2">
            <input
              type="search"
              placeholder="Buscar cidade..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              autoFocus
              className="min-h-11 w-full rounded-lg border border-default bg-surface-muted px-3 text-sm text-default outline-none placeholder:text-muted focus:border-brand focus-ring-brand"
            />
          </div>

          <ul
            role="listbox"
            aria-label="Cidades"
            className="max-h-60 overflow-y-auto p-1"
          >
            {cidades.length > 0 ? (
              cidades.map((cidadeItem) => (
                <li
                  key={cidadeItem.id}
                  role="option"
                  aria-selected={cidade === cidadeItem.nome}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setCidade(cidadeItem.nome);
                      setAberta(false);
                      setBusca("");
                    }}
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${
                      cidade === cidadeItem.nome
                        ? "bg-brand-soft font-semibold text-brand-dark"
                        : "text-default hover:bg-surface-muted"
                    }`}
                  >
                    {cidadeItem.nome}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-3 py-6 text-center text-sm text-muted">
                Nenhuma cidade encontrada.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
