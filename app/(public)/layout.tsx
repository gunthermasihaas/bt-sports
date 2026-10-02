import { getServerSession } from "next-auth";

import Footer from "@/components/layout/footer";
import HeaderPublic from "@/components/layout/header-public";
import { authOptions } from "@/lib/auth";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  const role = session?.user?.role;

  const isAdmin = role === "ADMIN" || role === "EDITOR";

  return (
    <>
      <HeaderPublic isAdmin={isAdmin} />

      {children}

      <Footer />
    </>
  );
}
