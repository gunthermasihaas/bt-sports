import { ParceirosModal } from "@/components/dashboard/ParceirosModal";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const parceiros = await prisma.parceiro.findMany({
    orderBy: [{ ordem: "asc" }, { id: "asc" }],
    select: {
      id: true,
      nome: true,
      href: true,
      logo_desktop_url: true,
      logo_mobile_url: true,
      ordem: true,
    },
  });

  return (
    <div className="min-h-full bg-surface p-6 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-dark">
              Administração
            </p>

            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-admin sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Gerencie o conteúdo e acompanhe o estado geral do site.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-default bg-surface p-6 shadow-sm">
            <p className="text-sm font-semibold text-muted">Status</p>

            <p className="mt-2 font-semibold text-admin">Sistema operacional</p>
          </div>

          <div className="rounded-2xl border border-default bg-surface p-6 shadow-sm">
            <p className="text-sm font-semibold text-muted">Ambiente</p>

            <p className="mt-2 font-semibold text-admin">Produção</p>
          </div>

          <div className="rounded-2xl border border-default bg-surface p-6 shadow-sm">
            <p className="text-sm font-semibold text-muted">Parceiros</p>

            <p className="mt-2 font-semibold text-admin">
              {parceiros.length}{" "}
              {parceiros.length === 1 ? "agência" : "agências"} cadastrada
              {parceiros.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-default bg-surface p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-dark">
                Conteúdo do site
              </p>

              <h2 className="mt-1 text-lg font-extrabold tracking-tight text-admin">
                Agências parceiras oficiais
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                Os logos aparecem no rodapé do site e levam o visitante para o
                endereço cadastrado.
              </p>
            </div>

            <ParceirosModal initialParceiros={parceiros} />
          </div>
        </section>
      </div>
    </div>
  );
}
