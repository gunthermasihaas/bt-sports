import Link from "next/link";

import { DesktopNav } from "../header/DesktopNav";
import { HeaderShell } from "../header/HeaderShell";
import { MobileMenu } from "../header/MobileMenu";

export default function HeaderPublic() {
  return (
    <HeaderShell
      mode="public-overlay"
      bgClass="bg-surface/95"
      borderClass="border-default"
      logo={
        <Link
          href="/"
          aria-label="Biarritz Turismo Sports — início"
          className="group flex items-center gap-3 rounded-full px-2.5 py-1.5 text-current"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-black text-on-brand shadow-sm transition-transform duration-300 group-hover:scale-105">
            BT
          </span>

          <span className="hidden leading-none sm:block text-current">
            <span className="block text-sm font-extrabold tracking-tight text-current">
              BIARRITZ
            </span>

            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-current opacity-80">
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
          },
          {
            label: "Pacotes",
            href: "/pacotes",
          },
          {
            label: "Sobre nós",
            href: "/sobre",
          },
          {
            label: "Contato",
            href: "/contato",
          },
        ]}
      />
    </HeaderShell>
  );
}
