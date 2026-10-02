import Link from "next/link";

import { DesktopNav } from "../header/DesktopNav";
import { HeaderShell } from "../header/HeaderShell";
import { MobileMenu } from "../header/MobileMenu";

export default function HeaderPublic() {
  return (
    <HeaderShell
      bgClass="bg-surface/95"
      borderClass="border-default"
      logo={
        <Link
          href="/"
          aria-label="Biarritz Turismo Sports — início"
          className="group flex items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-black text-on-brand shadow-sm transition-transform duration-300 group-hover:scale-105">
            BT
          </span>

          <span className="hidden leading-none sm:block">
            <span className="block text-sm font-extrabold tracking-tight text-default">
              BIARRITZ
            </span>

            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
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
              ],
            },
          ]}
        />
      }
    >
      <DesktopNav
        links={[
          {
            label: "Experiências",
            href: "/categorias",
            className:
              "text-sm font-semibold text-muted transition-colors hover:text-brand-dark",
          },
          {
            label: "Pacotes",
            href: "/pacotes",
            className:
              "text-sm font-semibold text-muted transition-colors hover:text-brand-dark",
          },
          {
            label: "Sobre nós",
            href: "/sobre",
            className:
              "text-sm font-semibold text-muted transition-colors hover:text-brand-dark",
          },
          {
            label: "Contato",
            href: "/contato",
            className:
              "text-sm font-semibold text-muted transition-colors hover:text-brand-dark",
          },
        ]}
      />
    </HeaderShell>
  );
}
