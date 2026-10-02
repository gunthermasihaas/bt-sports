type Props = {
  estados: {
    id: number;
    sigla: string;
    nome: string;
  }[];
  value: string;
  onChange: (value: string) => void;
};

export function EstadoSelect({ estados, value, onChange }: Props) {
  return (
    <div>
      <label htmlFor="estado" className="block text-sm font-bold text-default">
        Estado
      </label>

      <select
        id="estado"
        name="estado"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 min-h-12 w-full rounded-xl border border-default bg-surface px-4 text-sm text-default shadow-sm outline-none transition hover:border-border-muted focus:border-brand focus-ring-brand"
      >
        <option value="">Selecione</option>

        <option value="FORA">Fora do Brasil</option>

        {estados.map((estado) => (
          <option key={estado.id} value={estado.sigla}>
            {estado.nome}
          </option>
        ))}
      </select>
    </div>
  );
}
