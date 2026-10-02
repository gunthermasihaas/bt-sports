"use client";

import Link from "next/link";
import { Dialog, DialogPanel } from "@headlessui/react";
import { ReactNode, useEffect, useRef, useState } from "react";

import CurrencyButton from "./CurrencyButton";

type CurrentApi = {
  bid: string;
  pctChange: string;
};

type DailyItem = {
  bid: string;
  timestamp: string;
};

type Props = {
  logo: ReactNode;
  children: ReactNode;
  mobileMenu: ReactNode;
  bgClass: string;
  borderClass: string;
};

export function HeaderShell({
  logo,
  children,
  mobileMenu,
  bgClass,
  borderClass,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [usd, setUsd] = useState({
    current: null as CurrentApi | null,
    history: [] as DailyItem[],
  });

  const [eur, setEur] = useState({
    current: null as CurrentApi | null,
    history: [] as DailyItem[],
  });

  const currencyLoadedRef = useRef(false);

  async function fetchCurrency() {
    try {
      setLoading(true);
      setError(false);

      const [currentRes, usdHistRes, eurHistRes] = await Promise.all([
        fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL", {
          cache: "no-store",
        }),
        fetch("https://economia.awesomeapi.com.br/json/daily/USD-BRL/30"),
        fetch("https://economia.awesomeapi.com.br/json/daily/EUR-BRL/30"),
      ]);

      if (!currentRes.ok || !usdHistRes.ok || !eurHistRes.ok) {
        throw new Error("Falha ao carregar dados de câmbio.");
      }

      const currentData = await currentRes.json();
      const usdHist = await usdHistRes.json();
      const eurHist = await eurHistRes.json();

      setUsd({
        current: currentData.USDBRL,
        history: usdHist,
      });

      setEur({
        current: currentData.EURBRL,
        history: eurHist,
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!currencyOpen || currencyLoadedRef.current) {
      return;
    }

    currencyLoadedRef.current = true;
    void fetchCurrency();
  }, [currencyOpen]);

  function handleOpenCurrency() {
    setCurrencyOpen(true);
  }

  function handleCloseMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-xl ${bgClass} ${borderClass}`}
      >
        <nav
          className="site-container flex h-18 items-center justify-between"
          aria-label="Navegação principal"
        >
          {logo}

          <div className="hidden items-center gap-7 lg:flex">
            {children}

            <span
              aria-hidden="true"
              className="h-5 w-px bg-[var(--color-border)]"
            />

            <button
              type="button"
              onClick={handleOpenCurrency}
              className="rounded-full border border-default bg-surface px-4 py-2 text-xs font-bold text-muted transition hover:border-brand hover:text-brand-dark focus-ring-brand"
            >
              EUR / BRL
            </button>

            <Link href="/contato" className="button-primary min-h-10 px-5">
              Fale conosco
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={handleOpenCurrency}
              aria-label="Consultar câmbio"
              className="rounded-full border border-default px-3 py-2 text-xs font-bold text-muted transition hover:border-brand hover:text-brand-dark focus-ring-brand"
            >
              EUR
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand-dark transition hover:bg-brand hover:text-on-brand focus-ring-brand"
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
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>

        <Dialog
          open={menuOpen}
          onClose={setMenuOpen}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div className="fixed inset-0 bg-[rgb(4_15_10_/_0.45)] backdrop-blur-sm" />

          <DialogPanel className="fixed inset-y-0 right-0 w-full overflow-y-auto bg-surface p-6 shadow-2xl sm:max-w-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold tracking-tight text-default">
                MENU
              </span>

              <button
                type="button"
                onClick={handleCloseMenu}
                aria-label="Fechar menu"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-muted transition hover:bg-brand-soft hover:text-brand-dark focus-ring-brand"
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
                  <path d="M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div onClick={handleCloseMenu}>{mobileMenu}</div>

            <div className="mt-8 border-t border-default pt-6">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setCurrencyOpen(true);
                }}
                className="flex w-full items-center justify-between rounded-xl bg-surface-muted px-4 py-4 text-left font-semibold text-default transition hover:bg-brand-soft focus-ring-brand"
              >
                <span>Cotação de moedas</span>
                <span className="text-brand-dark">EUR / BRL</span>
              </button>
            </div>

            <div className="mt-8">
              <Link
                href="/contato"
                onClick={handleCloseMenu}
                className="button-primary w-full"
              >
                Fale conosco
              </Link>
            </div>
          </DialogPanel>
        </Dialog>

        <CurrencyButton
          open={currencyOpen}
          onClose={() => setCurrencyOpen(false)}
          usd={usd}
          eur={eur}
          loading={loading}
          error={error}
        />
      </header>
    </>
  );
}
