import type { Moeda } from "@/types/moedas";

export type { Moeda };

export type PacoteFormState = {
  nome: string;
  categoria_id: number | "";
  data_inicio: string;
  preco: number;
  moeda: Moeda;
  texto_destaque: string;
  resumo: string;
  descricao: string;
  destaque: boolean;
};
