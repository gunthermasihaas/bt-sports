import { z } from "zod";

const moedaSchema = z.enum(["EUR", "USD", "BRL", "GBP"]);

export const pacoteSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "Nome muito curto")
    .max(255, "Nome muito longo"),

  categoria_id: z.number().int().positive("Categoria é obrigatória"),

  data_inicio: z.string().optional(),

  preco: z.coerce.number().nonnegative("Preço não pode ser negativo"),

  moeda: moedaSchema.default("EUR"),

  texto_destaque: z
    .string()
    .max(80, "Texto de destaque deve ter no máximo 80 caracteres")
    .optional()
    .nullable(),

  resumo: z
    .string()
    .max(160, "Resumo deve ter no máximo 160 caracteres")
    .optional()
    .nullable(),

  descricao: z.string().optional(),

  destaque: z.boolean().optional(),
});

export const pacotePatchSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "Nome muito curto")
    .max(255, "Nome muito longo"),

  categoria_id: z.number().int().positive("Categoria é obrigatória"),

  data_inicio: z.string().optional(),

  preco: z.coerce.number().nonnegative("Preço não pode ser negativo"),

  moeda: moedaSchema.default("EUR"),

  texto_destaque: z
    .string()
    .max(80, "Texto de destaque deve ter no máximo 80 caracteres")
    .optional()
    .nullable(),

  resumo: z
    .string()
    .max(160, "Resumo deve ter no máximo 160 caracteres")
    .optional()
    .nullable(),

  descricao: z.string().optional().nullable(),

  destaque: z.boolean().optional(),
});

export type PacoteFormData = z.infer<typeof pacoteSchema>;
