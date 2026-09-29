export function formatarDataCurta(data?: Date | null) {
  if (!data) {
    return undefined;
  }

  return data.toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
  });
}

export function formatarDataLonga(data?: Date | null) {
  if (!data) {
    return undefined;
  }

  return data.toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
