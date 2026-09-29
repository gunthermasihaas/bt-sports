"use client";

import Section from "./Section";
import Field from "./Field";
import Divider from "./Divider";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { PacoteFormState } from "@/types/pacoteForm";

const inputBase =
  "mt-2 w-full rounded-md border border-default bg-surface px-3.5 py-2 text-admin outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

const MAX_DESTAQUE = 80;
const MAX_RESUMO = 160;

type Props = {
  valores: Pick<PacoteFormState, "texto_destaque" | "resumo" | "descricao">;

  onChange: <K extends keyof PacoteFormState>(
    key: K,
    value: PacoteFormState[K]
  ) => void;
};

function CharacterCount({ value, max }: { value: string; max: number }) {
  const count = value.length;
  const nearLimit = count > max * 0.9;
  const atLimit = count >= max;

  return (
    <div className="mt-1.5 flex items-center justify-between text-xs">
      <span className="text-admin-muted">Limite de {max} caracteres</span>

      <span
        className={
          atLimit
            ? "font-semibold text-danger"
            : nearLimit
              ? "font-medium text-danger"
              : "text-admin-muted"
        }
      >
        {count}/{max}
      </span>
    </div>
  );
}

export default function ConteudoPacote({ valores, onChange }: Props) {
  return (
    <Section
      title="Conteúdo"
      description="Textos que serão exibidos na página pública do pacote."
    >
      <div className="space-y-6">
        <Field label="Texto de destaque">
          <textarea
            rows={2}
            maxLength={MAX_DESTAQUE}
            value={valores.texto_destaque}
            onChange={(event) => onChange("texto_destaque", event.target.value)}
            placeholder="Ex.: Uma experiência exclusiva no coração dos Pireneus."
            className={inputBase}
          />

          <CharacterCount value={valores.texto_destaque} max={MAX_DESTAQUE} />
        </Field>

        <Field label="Resumo">
          <textarea
            rows={3}
            maxLength={MAX_RESUMO}
            value={valores.resumo}
            onChange={(event) => onChange("resumo", event.target.value)}
            placeholder="Apresente rapidamente o que torna este pacote especial."
            className={inputBase}
          />

          <CharacterCount value={valores.resumo} max={MAX_RESUMO} />
        </Field>

        <Divider />

        <Field
          label="Descrição completa"
          description="Use títulos, listas, links e imagens para estruturar a apresentação da experiência."
        >
          <RichTextEditor
            value={valores.descricao}
            onChange={(value) => onChange("descricao", value)}
          />
        </Field>
      </div>
    </Section>
  );
}
