import Link from "next/link";

import { DesktopNav } from "../header/DesktopNav";
import { HeaderShell } from "../header/HeaderShell";
import { MobileMenu } from "../header/MobileMenu";

type Props = {
  isAdmin?: boolean;
};

export default function HeaderPublic({ isAdmin = false }: Props) {
  return (
    <HeaderShell
      mode="public-overlay"
      bgClass="bg-surface/95"
      borderClass="border-default"
      logo={
        <Link
          href="/"
          aria-label="Biarritz Turismo Sports — início"
          className="group flex items-center gap-3 rounded-full px-2.5 py-1.5 text-(--header-nav-color) transition-colors duration-200"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-black text-on-brand shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:shadow-md">
            BT
          </span>

          <span className="hidden leading-none sm:block">
            <span className="block text-sm font-extrabold tracking-tight text-(--header-nav-color)">
              BIARRITZ
            </span>

            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-(--header-nav-color) opacity-80">
              Turismo Sports
            </span>
          </span>
        </Link>
      }
      mobileMenu={
        <MobileMenu
          sections={[
            {
              title: "Navegação",
              items: [
                {
                  label: "Experiências",
                  href: "/categorias",
                  className:
                    "block rounded-xl px-4 py-3 text-lg font-semibold text-default transition-colors duration-200 hover:bg-brand-soft hover:text-brand-dark",
                },
                {
                  label: "Pacotes",
                  href: "/pacotes",
                  className:
                    "block rounded-xl px-4 py-3 text-lg font-semibold text-default transition-colors duration-200 hover:bg-brand-soft hover:text-brand-dark",
                },
                {
                  label: "Sobre nós",
                  href: "/sobre",
                  className:
                    "block rounded-xl px-4 py-3 text-lg font-semibold text-default transition-colors duration-200 hover:bg-brand-soft hover:text-brand-dark",
                },
                {
                  label: "Contato",
                  href: "/contato",
                  className:
                    "block rounded-xl px-4 py-3 text-lg font-semibold text-default transition-colors duration-200 hover:bg-brand-soft hover:text-brand-dark",
                },
              ],
            },
            ...(isAdmin
              ? [
                  {
                    title: "Conta",
                    items: [
                      {
                        label: "Administração",
                        href: "/admin",
                        className:
                          "block rounded-xl border border-brand/20 bg-brand-soft px-4 py-3 text-lg font-bold text-brand-dark transition-colors duration-200 hover:border-brand hover:bg-brand hover:text-on-brand",
                      },
                    ],
                  },
                ]
              : []),
          ]}
        />
      }
    >
      <div className="flex items-center">
        <DesktopNav
          links={[
            {
              label: "Experiências",
              href: "/categorias",
              className:
                "text-[var(--header-nav-color)] hover:bg-[var(--header-nav-hover-bg)] hover:text-[var(--header-nav-hover-color)]",
            },
            {
              label: "Pacotes",
              href: "/pacotes",
              className:
                "text-[var(--header-nav-color)] hover:bg-[var(--header-nav-hover-bg)] hover:text-[var(--header-nav-hover-color)]",
            },
            {
              label: "Sobre nós",
              href: "/sobre",
              className:
                "text-[var(--header-nav-color)] hover:bg-[var(--header-nav-hover-bg)] hover:text-[var(--header-nav-hover-color)]",
            },
            {
              label: "Contato",
              href: "/contato",
              className:
                "text-[var(--header-nav-color)] hover:bg-[var(--header-nav-hover-bg)] hover:text-[var(--header-nav-hover-color)]",
            },
          ]}
        />

        {isAdmin && (
          <div className="ml-3 border-l border-[rgb(255_255_255_/_0.20)] pl-3">
            <Link
              href="/admin"
              className="inline-flex items-center rounded-full border border-transparent px-3.5 py-2 text-sm font-bold text-[var(--header-nav-color)] transition-colors duration-200 hover:border-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              Administração
            </Link>
          </div>
        )}
      </div>
    </HeaderShell>
  );
}
