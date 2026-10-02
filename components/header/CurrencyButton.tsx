"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";

import CurrencyChart from "./CurrencyChart";

type DailyItem = {
  bid: string;
  timestamp: string;
};

type CurrencyData = {
  current: {
    bid: string;
    pctChange: string;
  } | null;
  history: DailyItem[];
};

type CurrencyType = "eur" | "usd";

type Props = {
  open: boolean;
  onClose: () => void;
  usd: CurrencyData;
  eur: CurrencyData;
  loading: boolean;
  error: boolean;
};

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function formatPercent(value: string | number) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "—";
  }

  const sign = numericValue > 0 ? "+" : "";

  return `${sign}${numericValue.toFixed(2).replace(".", ",")}%`;
}

function isPositive(value: string | number) {
  return Number(value) >= 0;
}

function CurrencyCard({
  type,
  label,
  name,
  value,
  percentage,
  active,
  onClick,
}: {
  type: CurrencyType;
  label: string;
  name: string;
  value: string;
  percentage: string;
  active: boolean;
  onClick: () => void;
}) {
  const positive = isPositive(percentage);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={`Selecionar ${name}`}
      className={[
        "group relative w-full overflow-hidden rounded-2xl border p-5 text-left",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-brand focus-visible:ring-offset-2",
        active
          ? "border-brand bg-brand-soft shadow-sm"
          : "border-default bg-surface hover:border-brand/60 hover:bg-brand-soft/50 hover:shadow-sm",
      ].join(" ")}
    >
      {active && (
        <span
          aria-hidden="true"
          className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-on-brand"
        >
          <svg
            viewBox="0 0 20 20"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 10 3 3 7-7" />
          </svg>
        </span>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-extrabold tracking-[0.12em] text-muted">
            {label}
          </span>

          <p className="mt-3 text-sm font-semibold text-default">{name}</p>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <span className="text-2xl font-extrabold tracking-tight text-default sm:text-3xl">
          {formatCurrency(value)}
        </span>

        <span
          className={[
            "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-bold",
            positive
              ? "bg-emerald-500/10 text-emerald-700"
              : "bg-red-500/10 text-red-700",
          ].join(" ")}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className={`mr-1 h-3.5 w-3.5 ${positive ? "" : "rotate-180"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 15V5" />
            <path d="m6 9 4-4 4 4" />
          </svg>

          {formatPercent(percentage)}
        </span>
      </div>
    </button>
  );
}

function LoadingState() {
  return (
    <div
      className="space-y-5"
      aria-label="Carregando cotações"
      aria-busy="true"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-2xl border border-default bg-surface p-5"
          >
            <div className="h-6 w-14 rounded-full bg-surface-muted" />
            <div className="mt-4 h-4 w-32 rounded bg-surface-muted" />
            <div className="mt-5 h-9 w-32 rounded bg-surface-muted" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-default bg-surface-soft p-5">
        <div className="h-4 w-40 animate-pulse rounded bg-surface-muted" />
        <div className="mt-4 h-64 animate-pulse rounded-xl bg-surface-muted" />
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-600">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
          <path d="M10.3 3.8 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
        </svg>
      </div>

      <h4 className="mt-4 text-base font-bold text-default">
        Não foi possível carregar as cotações
      </h4>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted">
        Os dados de câmbio não estão disponíveis neste momento. Tente fechar
        este painel e abrir novamente em alguns instantes.
      </p>
    </div>
  );
}

export default function CurrencyButton({
  open,
  onClose,
  usd,
  eur,
  loading,
  error,
}: Props) {
  const [active, setActive] = useState<CurrencyType>("eur");

  const activeCurrency = active === "eur" ? eur : usd;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          <DialogPanel className="w-full max-w-3xl overflow-hidden rounded-3xl border border-default bg-surface shadow-2xl">
            <div className="border-b border-default px-5 py-5 sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2v20" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7" />
                      </svg>
                    </span>

                    <div>
                      <h2 className="text-lg font-extrabold tracking-tight text-default">
                        Cotação de moedas
                      </h2>

                      <p className="mt-0.5 text-xs font-medium text-muted">
                        Valores de referência em reais (BRL)
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fechar cotação de moedas"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-muted transition hover:bg-brand-soft hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M6 6l12 12" />
                    <path d="M18 6 6 18" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-5 py-5 sm:px-7 sm:py-7">
              {loading && <LoadingState />}

              {!loading && error && <ErrorState />}

              {!loading && !error && usd.current && eur.current && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <CurrencyCard
                      type="usd"
                      label="USD"
                      name="Dólar americano"
                      value={usd.current.bid}
                      percentage={usd.current.pctChange}
                      active={active === "usd"}
                      onClick={() => setActive("usd")}
                    />

                    <CurrencyCard
                      type="eur"
                      label="EUR"
                      name="Euro"
                      value={eur.current.bid}
                      percentage={eur.current.pctChange}
                      active={active === "eur"}
                      onClick={() => setActive("eur")}
                    />
                  </div>

                  <div className="mt-6 overflow-hidden rounded-2xl border border-default bg-surface-soft">
                    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-default px-5 py-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                          Histórico
                        </p>

                        <div className="mt-1 flex items-baseline gap-2">
                          <h3 className="text-base font-extrabold text-default">
                            {active === "eur" ? "Euro" : "Dólar americano"}
                          </h3>

                          <span className="text-xs font-semibold text-muted">
                            últimos 30 dias
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-medium text-muted">
                          Cotação atual
                        </p>

                        <p className="mt-0.5 text-lg font-extrabold text-default">
                          {formatCurrency(activeCurrency.current?.bid ?? "0")}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 sm:p-5">
                      {active === "usd" ? (
                        <CurrencyChart
                          data={usd.history}
                          color="var(--color-brand-dark)"
                          label="USD"
                        />
                      ) : (
                        <CurrencyChart
                          data={eur.history}
                          color="var(--color-brand)"
                          label="EUR"
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className="mt-0.5 h-4 w-4 shrink-0"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10A8 8 0 1 1 2 10a8 8 0 0 1 16 0ZM9 8.25A1 1 0 1 0 11 8a1 1 0 0 0-2 .25ZM9 10a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0v-3a1 1 0 0 0-1-1Z"
                        clipRule="evenodd"
                      />
                    </svg>

                    <p>
                      Valores informativos. A cotação pode variar conforme o
                      horário e as condições do mercado.
                    </p>
                  </div>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
