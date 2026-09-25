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
    <section className="relative isolate bg-surface-muted px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-color-text sm:text-5xl">
          Fale com <span className="text-brand">a Biarritz Turismo Sports</span>
        </h1>

        <p className="mt-4 text-lg text-muted">
          Preencha o formulário abaixo e nossa equipe entrará em contato.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-16 max-w-xl space-y-6"
      >
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          rows={4}
          required
          defaultValue={mensagemInicial}
        />

        {sucesso && (
          <p role="status" className="text-center text-sm text-green-600">
            Mensagem enviada com sucesso!
          </p>
        )}

        {erroEnvio && (
          <p role="alert" className="text-center text-sm text-danger">
            {erroEnvio}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !!emailErro}
          className={`
            w-full rounded-md px-4 py-3 text-sm font-semibold
            ${
              loading || emailErro
                ? "cursor-not-allowed bg-brand-soft text-muted"
                : "bg-brand text-on-brand bg-brand-dark-hover focus-ring-brand"
            }
          `}
        >
          {loading ? "Enviando..." : "Enviar mensagem"}
        </button>
      </form>
    </section>
  );
}
