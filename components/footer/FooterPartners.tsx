import { prisma } from "@/lib/prisma";

import { PartnerCard } from "./PartnerCard";

export async function FooterPartners() {
  const parceiros = await prisma.parceiro.findMany({
    orderBy: [{ ordem: "asc" }, { id: "asc" }],
    select: {
      id: true,
      nome: true,
      href: true,
      logo_desktop_url: true,
      logo_mobile_url: true,
    },
  });

  if (parceiros.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
          Nossos parceiros
        </span>

        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Agência parceira oficial
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {parceiros.map((item) => (
          <PartnerCard
            key={item.id}
            name={item.nome}
            href={item.href}
            imgMobile={item.logo_mobile_url ?? undefined}
            imgDesktop={item.logo_desktop_url}
          />
        ))}
      </div>
    </div>
  );
}
