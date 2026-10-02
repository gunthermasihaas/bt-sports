"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

import { MobileMenu } from "../header/MobileMenu";

type Props = {
  role: "ADMIN" | "EDITOR";
};

export default function HeaderAdmin({ role }: Props) {
  const pathname = usePathname();
  const isAdmin = role === "ADMIN";

  function logout() {
    void signOut({
      callbackUrl: "/admin/login",
    });
  }

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const publicLinkClass =
    "rounded-full px-2.5 py-1.5 text-xs font-semibold text-admin transition-colors hover:bg-admin-muted hover:text-admin focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

  const adminLinkClass =
    "rounded-full px-2.5 py-1.5 text-xs font-semibold text-brand-dark transition-colors hover:bg-brand-soft hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

  const adminActiveClass = "bg-brand-soft text-brand-dark shadow-sm";

  return (
    <header className="sticky top-0 z-50 border-b border-admin bg-admin/95 shadow-sm backdrop-blur-xl">
      <nav
        className="site-container flex min-h-16 items-center gap-4"
        aria-label="Navegação administrativa"
      >
        <Link
          href="/admin"
          aria-label="Biarritz Turismo Sports — administração"
          className="group flex shrink-0 items-center gap-2 rounded-full px-2 py-1.5 transition-colors hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-black text-on-brand shadow-sm transition-transform duration-200 group-hover:scale-105">
            BT
          </span>

          <span className="hidden leading-none sm:block">
            <span className="block text-xs font-extrabold tracking-tight text-admin">
              BIARRITZ
            </span>

            <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.16em] text-admin-muted">
              Turismo Sports
            </span>
          </span>

          <span className="hidden rounded-full bg-brand-soft px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-brand-dark md:inline-flex">
            Admin
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center xl:flex">
          <div className="flex min-w-0 items-center">
            <Link href="/categorias" className={publicLinkClass}>
              Experiências
            </Link>

            <Link href="/pacotes" className={publicLinkClass}>
              Pacotes
            </Link>

            <Link href="/sobre" className={publicLinkClass}>
              Sobre
            </Link>

            <Link href="/contato" className={publicLinkClass}>
              Contato
            </Link>
          </div>

          <div aria-hidden="true" className="mx-2 h-6 w-px shrink-0 bg-admin" />

          <div className="flex min-w-0 items-center">
            <Link
              href="/admin"
              className={`${adminLinkClass} ${
                isActive("/admin") ? adminActiveClass : ""
              }`}
              aria-current={isActive("/admin") ? "page" : undefined}
            >
              Dashboard
            </Link>

            <Link
              href="/admin/pacotes"
              className={`${adminLinkClass} ${
                isActive("/admin/pacotes") ? adminActiveClass : ""
              }`}
              aria-current={isActive("/admin/pacotes") ? "page" : undefined}
            >
              Pacotes
            </Link>

            <Link
              href="/admin/categorias"
              className={`${adminLinkClass} ${
                isActive("/admin/categorias") ? adminActiveClass : ""
              }`}
              aria-current={isActive("/admin/categorias") ? "page" : undefined}
            >
              Categorias
            </Link>

            {isAdmin && (
              <Link
                href="/admin/users"
                className={`${adminLinkClass} ${
                  isActive("/admin/users") ? adminActiveClass : ""
                }`}
                aria-current={isActive("/admin/users") ? "page" : undefined}
              >
                Usuários
              </Link>
            )}
          </div>

          <div className="ml-auto shrink-0">
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-danger/30 bg-danger/10 px-3 py-1.5 text-xs font-semibold text-danger transition-all duration-200 hover:border-danger hover:bg-danger hover:text-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="ml-auto xl:hidden">
          <MobileMenu
            sections={[
              {
                title: "Site",
                items: [
                  {
                    label: "Experiências",
                    href: "/categorias",
                    className:
                      "block rounded-xl px-3 py-3 text-base font-semibold text-admin transition-colors hover:bg-admin-muted hover:text-admin",
                  },
                  {
                    label: "Pacotes",
                    href: "/pacotes",
                    className:
                      "block rounded-xl px-3 py-3 text-base font-semibold text-admin transition-colors hover:bg-admin-muted hover:text-admin",
                  },
                  {
                    label: "Sobre nós",
                    href: "/sobre",
                    className:
                      "block rounded-xl px-3 py-3 text-base font-semibold text-admin transition-colors hover:bg-admin-muted hover:text-admin",
                  },
                  {
                    label: "Contato",
                    href: "/contato",
                    className:
                      "block rounded-xl px-3 py-3 text-base font-semibold text-admin transition-colors hover:bg-admin-muted hover:text-admin",
                  },
                ],
              },
              {
                title: "Administração",
                items: [
                  {
                    label: "Dashboard",
                    href: "/admin",
                    className: `block rounded-xl px-3 py-3 text-base font-semibold text-brand-dark transition-colors hover:bg-brand-soft ${
                      isActive("/admin") ? "bg-brand-soft" : ""
                    }`,
                  },
                  {
                    label: "Pacotes",
                    href: "/admin/pacotes",
                    className: `block rounded-xl px-3 py-3 text-base font-semibold text-brand-dark transition-colors hover:bg-brand-soft ${
                      isActive("/admin/pacotes") ? "bg-brand-soft" : ""
                    }`,
                  },
                  {
                    label: "Categorias",
                    href: "/admin/categorias",
                    className: `block rounded-xl px-3 py-3 text-base font-semibold text-brand-dark transition-colors hover:bg-brand-soft ${
                      isActive("/admin/categorias") ? "bg-brand-soft" : ""
                    }`,
                  },
                  ...(isAdmin
                    ? [
                        {
                          label: "Usuários",
                          href: "/admin/users",
                          className: `block rounded-xl px-3 py-3 text-base font-semibold text-brand-dark transition-colors hover:bg-brand-soft ${
                            isActive("/admin/users") ? "bg-brand-soft" : ""
                          }`,
                        },
                      ]
                    : []),
                ],
              },
              {
                title: "Ações",
                items: [
                  {
                    label: "Sair",
                    onClick: logout,
                    className:
                      "block w-full rounded-xl px-3 py-3 text-left text-base font-semibold text-danger transition-colors hover:bg-danger/10",
                  },
                ],
              },
            ]}
          />
        </div>
      </nav>
    </header>
  );
}
