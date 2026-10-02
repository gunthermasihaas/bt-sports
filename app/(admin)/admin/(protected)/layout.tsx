import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import HeaderAdmin from "@/components/layout/header-admin";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const role = session?.user?.role;

  if (!session || (role !== "ADMIN" && role !== "EDITOR")) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-admin">
      <HeaderAdmin role={role} />

      <main className="min-h-[calc(100vh-4.5rem)]">{children}</main>
    </div>
  );
}
