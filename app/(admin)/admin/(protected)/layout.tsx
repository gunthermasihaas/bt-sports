import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

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

  return <main className="min-h-screen">{children}</main>;
}
