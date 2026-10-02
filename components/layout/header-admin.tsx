"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

import type { HeaderRole } from "./header";
import { DesktopNav } from "../header/DesktopNav";
import { HeaderShell } from "../header/HeaderShell";
import { MobileMenu } from "../header/MobileMenu";

type Props = {
  role: Exclude<HeaderRole, null>;
};

export default function HeaderAdmin({ role }: Props) {
  const isAdmin = role === "ADMIN";

  function logout() {
    void signOut({
      callbackUrl: "/admin/login",
    });
  }

  const siteLinks = [
    {
      label: "Sobre nós",
      href: "/sobre",
      className: "text-sm font-semibold text-muted text-brand-hover",
    },
    {
      label: "Pacotes",
      href: "/admin/pacotes",
      className: "text-sm font-semibold text-muted text-brand-hover",
    },
    {
      label: "Categorias",
      href: "/admin/categorias",
      className: "text-sm font-semibold text-muted text-brand-hover",
    },
    {
      label: "Contato",
      href: "/contato",
      className: "text-sm font-semibold text-muted text-brand-hover",
    },
  ];

  const administrationLinks = [
    {
      label: "Dashboard",
      href: "/admin",
      className: "text-sm font-semibold text-muted text-brand-hover",
    },
    ...(isAdmin
      ? [
          {
            label: "Usuários",
            href: "/admin/users",
            className: "text-sm font-semibold text-muted text-brand-hover",
          },
        ]
      : []),
    {
      label: "Logout",
      onClick: logout,
      className: "text-sm font-semibold text-danger text-danger-hover",
    },
  ];

  return (
    <HeaderShell
      bgClass="bg-admin"
      borderClass="border-admin"
      logo={
        <Link href="/" className="font-bold text-admin">
          Biarritz Turismo Sports
          <span className="ml-2 text-xs text-admin-muted">admin</span>
        </Link>
      }
      mobileMenu={
        <MobileMenu
          sections={[
            {
              title: "Site",
              items: [
                {
                  label: "Sobre nós",
                  href: "/sobre",
                  className: "block text-admin-hover",
                },
                {
                  label: "Pacotes",
                  href: "/admin/pacotes",
                  className: "block text-admin-hover",
                },
                {
                  label: "Categorias",
                  href: "/admin/categorias",
                  className: "block text-admin-hover",
                },
                {
                  label: "Contato",
                  href: "/contato",
                  className: "block text-admin-hover",
                },
              ],
            },
            {
              title: "Administração",
              items: [
                {
                  label: "Dashboard",
                  href: "/admin",
                  className: "block text-admin-hover",
                },

                ...(isAdmin
                  ? [
                      {
                        label: "Usuários",
                        href: "/admin/users",
                        className: "block text-admin-hover",
                      },
                    ]
                  : []),

                {
                  label: "Logout",
                  onClick: logout,
                  className:
                    "block w-full text-left text-danger text-danger-hover",
                },
              ],
            },
          ]}
        />
      }
    >
      <div className="hidden items-center gap-x-6 lg:flex">
        <DesktopNav links={[...siteLinks, ...administrationLinks]} />
      </div>
    </HeaderShell>
  );
}
