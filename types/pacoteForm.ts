export type Moeda = "EUR" | "USD" | "BRL" | "GBP";

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
