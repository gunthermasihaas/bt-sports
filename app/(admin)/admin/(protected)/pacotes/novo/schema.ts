import { z } from "zod";

const moedaSchema = z.enum(["EUR", "USD", "BRL", "GBP"]);

const dataInicioSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value),
    "Data de início inválida"
  )
  .refine((value) => {
    if (!value) {
      return true;
    }

    const date = new Date(`${value}T00:00:00`);

    return !Number.isNaN(date.getTime());
  }, "Data de início inválida");

const textoDestaqueSchema = z
  .string()
  .trim()
  .max(80, "Texto de destaque deve ter no máximo 80 caracteres");

const resumoSchema = z
  .string()
  .trim()
  .max(160, "Resumo deve ter no máximo 160 caracteres");

const descricaoSchema = z
  .string()
  .max(100_000, "A descrição excede o limite máximo permitido");

export const pacoteSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "Nome muito curto")
    .max(255, "Nome muito longo"),

  categoria_id: z.number().int().positive("Categoria é obrigatória"),

  data_inicio: dataInicioSchema.optional().default(""),

  preco: z.coerce
    .number()
    .finite("Preço inválido")
    .nonnegative("Preço não pode ser negativo"),

  moeda: moedaSchema.default("EUR"),

  texto_destaque: textoDestaqueSchema
    .optional()
    .nullable()
    .transform((value) => value ?? ""),

  resumo: resumoSchema
    .optional()
    .nullable()
    .transform((value) => value ?? ""),

  descricao: descricaoSchema
    .optional()
    .nullable()
    .transform((value) => value ?? ""),

  destaque: z.boolean().default(false),
});

export const pacotePatchSchema = z.object({
  nome: pacoteSchema.shape.nome.optional(),

  categoria_id: pacoteSchema.shape.categoria_id.optional(),

  data_inicio: dataInicioSchema.optional(),

  preco: pacoteSchema.shape.preco.optional(),

  moeda: moedaSchema.optional(),

  texto_destaque: textoDestaqueSchema.optional().nullable(),

  resumo: resumoSchema.optional().nullable(),

  descricao: descricaoSchema.optional().nullable(),

  destaque: z.boolean().optional(),
});

export type PacoteFormData = z.infer<typeof pacoteSchema>;
