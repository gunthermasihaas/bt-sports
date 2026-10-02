import { parceiros } from "@/data/sobreBiarritz";

import { PartnerCard } from "./PartnerCard";

export function FooterPartners() {
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
            key={item.name}
            name={item.name}
            href={item.href}
            imgMobile={item.imgMobile}
            imgDesktop={item.imgDesktop}
          />
        ))}
      </div>
    </div>
  );
}
