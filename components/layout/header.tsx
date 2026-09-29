"use client";

import { useSession } from "next-auth/react";

import HeaderAdmin from "./header-admin";
import HeaderPublic from "./header-public";

export default function Header() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  const role = session?.user?.role;

  if (role === "ADMIN" || role === "EDITOR") {
    return <HeaderAdmin />;
  }

  return <HeaderPublic />;
}
