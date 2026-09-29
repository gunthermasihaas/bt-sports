export type Moeda = "EUR" | "USD" | "BRL" | "GBP";

export const MOEDAS: readonly Moeda[] = ["EUR", "USD", "BRL", "GBP"] as const;

export const MOEDA_LOCALE: Record<Moeda, string> = {
  EUR: "pt-PT",
  USD: "en-US",
  BRL: "pt-BR",
  GBP: "en-GB",
};

export function formatarPreco(preco: number, moeda: Moeda): string {
  return new Intl.NumberFormat(MOEDA_LOCALE[moeda], {
    style: "currency",
    currency: moeda,
  }).format(preco);
}
