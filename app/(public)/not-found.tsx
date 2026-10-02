import Link from "next/link";

export default function PublicNotFound() {
  return (
    <main className="min-h-[70vh] bg-background">
      <div className="site-container flex min-h-[70vh] items-center py-16 sm:py-20 lg:py-24">
        <div className="max-w-2xl">
          <span className="section-kicker">404</span>

          <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.04em] text-default sm:text-5xl lg:text-6xl">
            Essa experiência não está disponível.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
            O conteúdo que você tentou acessar pode ter sido removido, alterado
            ou não existir mais. Explore nossos pacotes e encontre outra
            experiência esportiva.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/pacotes" className="button-primary">
              Ver pacotes
              <span aria-hidden="true">→</span>
            </Link>

            <Link href="/categorias" className="button-secondary">
              Explorar categorias
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
