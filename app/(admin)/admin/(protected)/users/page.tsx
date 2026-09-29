import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import UsersPageClient from "../../../../../components/users/UsersPageClient";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  return <UsersPageClient />;
}
