import Link from "next/link";

import { DesktopNav } from "../header/DesktopNav";
import { HeaderShell } from "../header/HeaderShell";
import { MobileMenu } from "../header/MobileMenu";
import { BrandLogo } from "../brand/BrandLogo";

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
          className="group rounded-full px-2.5 py-1.5 transition-colors hover:bg-[var(--header-nav-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
        >
          <BrandLogo size="md" />
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

      {isAdmin && (
        <div className="ml-2 border-l border-(--header-nav-color)/20 pl-2">
          <Link
            href="/admin"
            className="rounded-full bg-brand px-3.5 py-2 text-sm font-bold text-on-brand shadow-sm transition-[background-color,box-shadow,transform] duration-200 hover:bg-brand-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Administração
          </Link>
        </div>
      )}
    </HeaderShell>
  );
}
