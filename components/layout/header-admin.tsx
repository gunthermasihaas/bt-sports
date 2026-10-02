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
    "rounded-full px-2.5 py-1.5 text-xs font-semibold text-admin transition-all duration-200 hover:bg-surface hover:text-brand-dark hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

  const adminLinkClass =
    "rounded-full px-2.5 py-1.5 text-xs font-semibold text-brand-dark transition-all duration-200 hover:bg-brand-soft hover:text-brand-deep hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

  const adminActiveClass =
    "bg-brand-soft text-brand-deep shadow-sm ring-1 ring-brand/15";

  const logoutButtonClass = [
    "rounded-full",
    "border border-danger/20",
    "bg-danger/5",
    "px-3 py-1.5",
    "text-xs font-semibold text-danger",
    "transition-colors duration-200",
    "hover:border-danger/30",
    "hover:bg-danger/10",
    "hover:text-danger",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-danger",
    "focus-visible:ring-offset-2",
  ].join(" ");

  return (
    <header className="sticky top-0 z-50 border-b border-admin bg-admin/95 shadow-sm backdrop-blur-xl">
      <nav
        className="site-container flex min-h-16 items-center gap-4"
        aria-label="Navegação administrativa"
      >
        <Link
          href="/admin"
          aria-label="Biarritz Turismo Sports — administração"
          className="group flex shrink-0 items-center gap-2 rounded-full px-2 py-1.5 transition-all duration-200 hover:bg-brand-soft hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-black text-on-brand shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:shadow-md">
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
              className={logoutButtonClass}
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
                      "block rounded-xl px-3 py-3 text-base font-semibold text-admin transition-all duration-200 hover:bg-admin-muted hover:text-brand-dark hover:shadow-sm",
                  },
                  {
                    label: "Pacotes",
                    href: "/pacotes",
                    className:
                      "block rounded-xl px-3 py-3 text-base font-semibold text-admin transition-all duration-200 hover:bg-admin-muted hover:text-brand-dark hover:shadow-sm",
                  },
                  {
                    label: "Sobre nós",
                    href: "/sobre",
                    className:
                      "block rounded-xl px-3 py-3 text-base font-semibold text-admin transition-all duration-200 hover:bg-admin-muted hover:text-brand-dark hover:shadow-sm",
                  },
                  {
                    label: "Contato",
                    href: "/contato",
                    className:
                      "block rounded-xl px-3 py-3 text-base font-semibold text-admin transition-all duration-200 hover:bg-admin-muted hover:text-brand-dark hover:shadow-sm",
                  },
                ],
              },
              {
                title: "Administração",
                items: [
                  {
                    label: "Dashboard",
                    href: "/admin",
                    className: `block rounded-xl px-3 py-3 text-base font-semibold text-brand-dark transition-all duration-200 hover:bg-brand-soft hover:text-brand-deep hover:shadow-sm ${
                      isActive("/admin") ? "bg-brand-soft shadow-sm" : ""
                    }`,
                  },
                  {
                    label: "Pacotes",
                    href: "/admin/pacotes",
                    className: `block rounded-xl px-3 py-3 text-base font-semibold text-brand-dark transition-all duration-200 hover:bg-brand-soft hover:text-brand-deep hover:shadow-sm ${
                      isActive("/admin/pacotes")
                        ? "bg-brand-soft shadow-sm"
                        : ""
                    }`,
                  },
                  {
                    label: "Categorias",
                    href: "/admin/categorias",
                    className: `block rounded-xl px-3 py-3 text-base font-semibold text-brand-dark transition-all duration-200 hover:bg-brand-soft hover:text-brand-deep hover:shadow-sm ${
                      isActive("/admin/categorias")
                        ? "bg-brand-soft shadow-sm"
                        : ""
                    }`,
                  },
                  ...(isAdmin
                    ? [
                        {
                          label: "Usuários",
                          href: "/admin/users",
                          className: `block rounded-xl px-3 py-3 text-base font-semibold text-brand-dark transition-all duration-200 hover:bg-brand-soft hover:text-brand-deep hover:shadow-sm ${
                            isActive("/admin/users")
                              ? "bg-brand-soft shadow-sm"
                              : ""
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
                      "block w-full rounded-xl border border-danger/10 bg-danger/5 px-3 py-3 text-left text-base font-bold text-danger transition-all duration-200 hover:border-danger/20 hover:bg-danger/10 hover:text-danger hover:shadow-sm",
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
