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
          className="group flex items-center gap-3 rounded-full px-2.5 py-1.5 text-white"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-black text-on-brand shadow-sm transition-transform duration-300 group-hover:scale-105">
            BT
          </span>

          <span className="hidden leading-none sm:block">
            <span className="block text-sm font-extrabold tracking-tight text-white">
              BIARRITZ
            </span>

            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
              Turismo Sports
            </span>
          </span>
        </Link>
      }
      mobileMenu={
        <MobileMenu
          sections={[
            {
              items: [
                {
                  label: "Experiências",
                  href: "/categorias",
                  className:
                    "block py-2 text-lg font-semibold text-default transition-colors hover:text-brand-dark",
                },
                {
                  label: "Pacotes",
                  href: "/pacotes",
                  className:
                    "block py-2 text-lg font-semibold text-default transition-colors hover:text-brand-dark",
                },
                {
                  label: "Sobre nós",
                  href: "/sobre",
                  className:
                    "block py-2 text-lg font-semibold text-default transition-colors hover:text-brand-dark",
                },
                {
                  label: "Contato",
                  href: "/contato",
                  className:
                    "block py-2 text-lg font-semibold text-default transition-colors hover:text-brand-dark",
                },
                ...(isAdmin
                  ? [
                      {
                        label: "Administração",
                        href: "/admin",
                        className:
                          "mt-4 block rounded-full bg-brand px-4 py-3 text-lg font-bold text-on-brand transition-colors hover:bg-brand-dark hover:text-on-brand",
                      },
                    ]
                  : []),
              ],
            },
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
                "rounded-full px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 hover:text-white",
            },
            {
              label: "Pacotes",
              href: "/pacotes",
              className:
                "rounded-full px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 hover:text-white",
            },
            {
              label: "Sobre nós",
              href: "/sobre",
              className:
                "rounded-full px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 hover:text-white",
            },
            {
              label: "Contato",
              href: "/contato",
              className:
                "rounded-full px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 hover:text-white",
            },
          ]}
        />

        {isAdmin && (
          <div className="ml-3 flex items-center border-l border-white/20 pl-3">
            <Link
              href="/admin"
              className="rounded-full px-3.5 py-2 text-sm font-bold text-white transition-all duration-200 hover:bg-brand hover:text-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Administração
            </Link>
          </div>
        )}
      </div>
    </HeaderShell>
  );
}
