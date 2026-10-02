"use client";

import { useState } from "react";

import { useEstados } from "./hooks/useEstados";
import { useCidades } from "./hooks/useCidades";

import { EstadoSelect } from "./EstadoSelect";
import { CidadeSelect } from "./CidadeSelect";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";

type ContactFormProps = {
  mensagemInicial?: string;
};

type ContactErrorResponse = {
  error?: string;
};

export default function ContactForm({
  mensagemInicial = "",
}: ContactFormProps) {
  const estados = useEstados();

  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [emailErro, setEmailErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erroEnvio, setErroEnvio] = useState("");

  const { filtradas, busca, setBusca, setCidades } = useCidades(estado);

  function validarEmail(valor: string) {
    const email = valor.trim();

    if (!email) {
      setEmailErro("E-mail é obrigatório");
      return;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setEmailErro(regex.test(email) ? "" : "E-mail inválido");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) {
      return;
    }

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    const nome = String(formData.get("nome") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const telefone = String(formData.get("telefone") ?? "").trim();
    const mensagem = String(formData.get("mensagem") ?? "").trim();

    validarEmail(email);

    if (!nome) {
      setErroEnvio("Nome é obrigatório.");
      return;
    }

    if (!email) {
      setErroEnvio("E-mail é obrigatório.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErroEnvio("Informe um e-mail válido.");
      return;
    }

    if (mensagem.length < 10) {
      setErroEnvio("A mensagem deve ter pelo menos 10 caracteres.");
      return;
    }

    setLoading(true);
    setSucesso(false);
    setErroEnvio("");

    const data = {
      nome,
      email,
      telefone,
      estado,
      cidade,
      mensagem,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData: ContactErrorResponse | null = await res
        .json()
        .catch(() => null);

      if (!res.ok) {
        if (
          responseData &&
          typeof responseData.error === "string" &&
          responseData.error.trim()
        ) {
          setErroEnvio(responseData.error);
        } else {
          setErroEnvio(
            "Não foi possível enviar sua mensagem. Tente novamente."
          );
        }

        return;
      }

      setSucesso(true);
      setErroEnvio("");

      formElement.reset();

      setEstado("");
      setCidade("");
      setCidades([]);
      setBusca("");
      setEmailErro("");
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);

      setErroEnvio("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_50%_0%,rgb(97_198_129_/_0.15),transparent_65%)]" />

      <div className="site-container relative z-10">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:pt-6">
            <span className="section-kicker">Contato</span>

            <h1 className="mt-5 max-w-xl text-5xl font-extrabold tracking-[-0.055em] leading-[0.95] text-default sm:text-6xl">
              Vamos planejar sua próxima experiência.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Preencha o formulário e nossa equipe entrará em contato para
              entender o que você procura e apresentar as opções disponíveis.
            </p>

            <div className="mt-10 rounded-2xl bg-brand-deep p-6 text-white sm:p-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
                Biarritz Turismo Sports
              </span>

              <p className="mt-4 text-lg font-bold leading-7">
                Grandes eventos começam muito antes do dia da competição.
              </p>

              <p className="mt-3 text-sm leading-6 text-white/55">
                Conte para nós qual experiência você está procurando.
              </p>
            </div>
          </div>

          <div className="surface-card p-6 sm:p-8 lg:p-10">
            <div className="mb-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                Solicite informações
              </span>

              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-default">
                Fale com nossa equipe
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput name="nome" label="Nome completo" required />

              <FormInput
                name="email"
                type="email"
                label="E-mail"
                required
                onBlur={(e) => validarEmail(e.target.value)}
                error={emailErro}
              />

              <FormInput
                name="telefone"
                type="tel"
                label="Telefone"
                placeholder="+55 11 99999-9999"
              />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <EstadoSelect
                  estados={estados}
                  value={estado}
                  onChange={(novoEstado) => {
                    setEstado(novoEstado);
                    setCidade("");
                    setCidades([]);
                    setBusca("");
                  }}
                />

                <CidadeSelect
                  estado={estado}
                  cidade={cidade}
                  setCidade={setCidade}
                  cidades={filtradas}
                  busca={busca}
                  setBusca={setBusca}
                />
              </div>

              <FormTextarea
                name="mensagem"
                label="Mensagem"
                rows={6}
                required
                defaultValue={mensagemInicial}
              />

              {sucesso && (
                <div
                  role="status"
                  className="rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm font-semibold text-green-700"
                >
                  Mensagem enviada com sucesso. Nossa equipe entrará em contato.
                </div>
              )}

              {erroEnvio && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700"
                >
                  {erroEnvio}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !!emailErro}
                className={`inline-flex min-h-13 w-full items-center justify-center rounded-full px-6 text-sm font-bold transition ${
                  loading || emailErro
                    ? "cursor-not-allowed bg-brand-soft text-muted"
                    : "bg-brand text-on-brand shadow-sm hover:bg-brand-dark hover:shadow-md focus-ring-brand"
                }`}
              >
                {loading ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                    />
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar mensagem
                    <span className="ml-2" aria-hidden="true">
                      →
                    </span>
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-5 text-muted">
                Ao enviar, seus dados serão utilizados para responder à sua
                solicitação de contato.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
