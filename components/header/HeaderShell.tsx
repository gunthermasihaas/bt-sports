"use client";

import { ReactNode, useEffect, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
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
    if (currencyOpen && !usd.current) {
      fetchCurrency();
    }
  }, [currencyOpen, usd.current]);

  return (
    <>
      <header className={`${bgClass} border-b ${borderClass}`}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          {logo}

          <div className="hidden items-center gap-x-6 lg:flex">
            {children}

            <button
              onClick={() => setCurrencyOpen(true)}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted text-brand-hover transition hover-brand-soft focus-ring-brand"
            >
              Câmbio
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            className="text-muted lg:hidden"
          >
            ☰
          </button>
        </nav>

        <Dialog
          open={menuOpen}
          onClose={setMenuOpen}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div className="fixed inset-0 bg-black/30" />

          <DialogPanel
            className={`fixed inset-y-0 right-0 w-full p-6 sm:max-w-sm ${bgClass}`}
          >
            {mobileMenu}

            <div className="mt-6">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setCurrencyOpen(true);
                }}
                className="text-muted text-brand-hover"
              >
                Câmbio
              </button>
            </div>

            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Fechar menu"
              className="absolute right-6 top-6"
            >
              ✕
            </button>
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
