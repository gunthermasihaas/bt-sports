"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownWideShort,
  faArrowUpAZ,
  faArrowUpWideShort,
  faCalendarDays,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { Order } from "@/lib/getPacotesUi";

type Props = {
  order: Order;
  basePath: string;
  variant?: "admin" | "public";
};

export default function PacotesOrderMenu({
  order,
  basePath,
  variant = "public",
}: Props) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const isAdmin = variant === "admin";

  const triggerClass = isAdmin
    ? "border border-border-muted bg-surface text-admin hover:border-brand hover:bg-brand-soft"
    : "border border-default bg-surface text-default hover:border-brand hover:bg-brand-soft";

  const itemClass = (active: boolean) => {
    if (active) {
      return "flex items-center gap-3 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-on-brand transition-colors";
    }

    return isAdmin
      ? "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-admin-muted transition-colors hover:bg-brand-soft hover:text-brand-dark"
      : "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-brand-soft hover:text-brand-dark";
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (detailsRef.current && !detailsRef.current.contains(target)) {
        detailsRef.current.removeAttribute("open");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <details ref={detailsRef} className="relative shrink-0">
      <summary
        className={`details-trigger flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-ring-brand ${triggerClass}`}
      >
        <FontAwesomeIcon
          icon={faSliders}
          aria-hidden="true"
          className="h-3.5 w-3.5"
        />

        <span>Ordenar</span>

        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-4 w-4 opacity-60"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </summary>

      <div className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-2xl border border-default bg-surface p-2 shadow-[var(--shadow-elevated)]">
        <div className="px-3 pb-2 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
            Ordenação
          </span>
        </div>

        <div className="space-y-1">
          <Link
            href={`${basePath}?order=nome`}
            className={itemClass(order === "nome")}
          >
            <FontAwesomeIcon
              icon={faArrowUpAZ}
              aria-hidden="true"
              className="h-3.5 w-3.5"
            />

            <span>Alfabética</span>
          </Link>

          <Link
            href={`${basePath}?order=data`}
            className={itemClass(order === "data")}
          >
            <FontAwesomeIcon
              icon={faCalendarDays}
              aria-hidden="true"
              className="h-3.5 w-3.5"
            />

            <span>Data</span>
          </Link>

          <Link
            href={`${basePath}?order=preco-asc`}
            className={itemClass(order === "preco-asc")}
          >
            <FontAwesomeIcon
              icon={faArrowUpWideShort}
              aria-hidden="true"
              className="h-3.5 w-3.5"
            />

            <span>Menor preço</span>
          </Link>

          <Link
            href={`${basePath}?order=preco-desc`}
            className={itemClass(order === "preco-desc")}
          >
            <FontAwesomeIcon
              icon={faArrowDownWideShort}
              aria-hidden="true"
              className="h-3.5 w-3.5"
            />

            <span>Maior preço</span>
          </Link>
        </div>
      </div>
    </details>
  );
}
