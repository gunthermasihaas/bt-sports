export type Categoria = {
  id: number;
  nome: string;
  slug: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  pacotes_count?: number;
};
