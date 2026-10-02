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

type HeaderMode = "default" | "public-overlay";

type Props = {
  logo: ReactNode;
  children: ReactNode;
  mobileMenu: ReactNode;
  bgClass: string;
  borderClass: string;
  mode?: HeaderMode;
};

export function HeaderShell({
  logo,
  children,
  mobileMenu,
  bgClass,
  borderClass,
  mode = "default",
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [usd, setUsd] = useState({
    current: null as CurrentApi | null,
    history: [] as DailyItem[],
  });

  const [eur, setEur] = useState({
    current: null as CurrentApi | null,
    history: [] as DailyItem[],
  });

  const currencyLoadedRef = useRef(false);

  const isOverlay = mode === "public-overlay";

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

  useEffect(() => {
    if (!isOverlay) {
      return;
    }

    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOverlay]);

  function handleOpenCurrency() {
    setCurrencyOpen(true);
  }

  function handleCloseMenu() {
    setMenuOpen(false);
  }

  const headerClassName = isOverlay
    ? [
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-default bg-surface/95 shadow-[var(--shadow-header)] backdrop-blur-xl"
          : "border-transparent bg-transparent",
      ].join(" ")
    : `sticky top-0 z-50 border-b backdrop-blur-xl ${bgClass} ${borderClass}`;

  const headerVariables = isOverlay
    ? scrolled
      ? {
          "--header-nav-color": "var(--color-text)",
          "--header-nav-hover-bg": "var(--color-brand-soft)",
          "--header-nav-hover-color": "var(--color-brand-dark)",
        }
      : {
          "--header-nav-color": "#ffffff",
          "--header-nav-hover-bg": "rgb(255 255 255 / 0.12)",
          "--header-nav-hover-color": "#ffffff",
        }
    : {
        "--header-nav-color": "var(--color-text)",
        "--header-nav-hover-bg": "var(--color-brand-soft)",
        "--header-nav-hover-color": "var(--color-brand-dark)",
      };

  const logoWrapperClassName = isOverlay
    ? scrolled
      ? "flex items-center rounded-full border border-default bg-surface px-1 py-1 text-default shadow-sm"
      : "flex items-center rounded-full border border-white/20 bg-[rgb(0_0_0_/_0.30)] px-1 py-1 text-white shadow-sm backdrop-blur-md"
    : "flex items-center text-default";

  const navigationWrapperClassName = isOverlay
    ? scrolled
      ? "flex items-center rounded-full border border-default bg-surface p-1 shadow-sm"
      : "flex items-center rounded-full border border-white/20 bg-[rgb(0_0_0_/_0.30)] p-1 shadow-sm backdrop-blur-md"
    : "flex items-center";

  const currencyButtonClassName = isOverlay
    ? scrolled
      ? "border-default bg-surface text-default shadow-sm hover:border-brand hover:bg-brand-soft hover:text-brand-dark"
      : "border-white/20 bg-[rgb(0_0_0_/_0.30)] text-white shadow-sm backdrop-blur-md hover:border-white/40 hover:bg-[rgb(0_0_0_/_0.45)]"
    : "border-default bg-surface text-default shadow-sm hover:border-brand hover:bg-brand-soft hover:text-brand-dark";

  const contactButtonClassName = isOverlay
    ? scrolled
      ? "button-primary min-h-10 px-5"
      : "inline-flex min-h-10 items-center justify-center rounded-full border border-white/20 bg-brand px-5 text-sm font-bold text-on-brand shadow-sm transition hover:bg-brand-dark focus-ring-brand"
    : "button-primary min-h-10 px-5";

  const mobileMenuButtonClassName = isOverlay
    ? scrolled
      ? "border-default bg-surface text-default shadow-sm hover:border-brand hover:bg-brand-soft hover:text-brand-dark"
      : "border-white/20 bg-[rgb(0_0_0_/_0.30)] text-white shadow-sm backdrop-blur-md hover:border-white/40 hover:bg-[rgb(0_0_0_/_0.45)]"
    : "bg-brand-soft text-brand-dark hover:bg-brand hover:text-on-brand";

  return (
    <>
      <header
        className={headerClassName}
        style={headerVariables as React.CSSProperties}
      >
        {isOverlay && !scrolled && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[rgb(0_0_0_/_0.60)] via-[rgb(0_0_0_/_0.30)] to-transparent"
          />
        )}

        <nav
          className="site-container relative flex h-18 items-center justify-between"
          aria-label="Navegação principal"
        >
          <div className={logoWrapperClassName}>{logo}</div>

          <div className="hidden items-center gap-3 lg:flex">
            <div className={navigationWrapperClassName}>{children}</div>

            <button
              type="button"
              onClick={handleOpenCurrency}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition focus-ring-brand ${currencyButtonClassName}`}
            >
              EUR / BRL
            </button>

            <Link href="/contato" className={contactButtonClassName}>
              Fale conosco
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={handleOpenCurrency}
              aria-label="Consultar câmbio"
              className={`rounded-full border px-3 py-2 text-xs font-bold transition focus-ring-brand ${currencyButtonClassName}`}
            >
              EUR
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition focus-ring-brand ${mobileMenuButtonClassName}`}
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
