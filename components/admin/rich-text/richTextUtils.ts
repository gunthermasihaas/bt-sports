export const INLINE_IMAGE_MAX_SIZE = 10 * 1024 * 1024;

export const INLINE_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export function normalizeUrl(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function validateInlineImage(file: File): string | null {
  if (!file.type || !INLINE_IMAGE_TYPES.has(file.type.toLowerCase())) {
    return "Formato de imagem não permitido. Use JPG, PNG, WebP ou AVIF.";
  }

  if (file.size <= 0) {
    return "O arquivo de imagem está vazio.";
  }

  if (file.size > INLINE_IMAGE_MAX_SIZE) {
    return "A imagem deve ter no máximo 10 MB.";
  }

  return null;
}

export async function uploadInlineImage(file: File): Promise<string> {
  const validationError = validateInlineImage(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch("/api/admin/pacotes/conteudo-upload", {
    method: "POST",
    body: formData,
  });

  let data: {
    url?: string;
    error?: string;
  } = {};

  try {
    data = (await response.json()) as typeof data;
  } catch {
    // A resposta será tratada pelo status HTTP.
  }

  if (!response.ok) {
    throw new Error(data.error || "Não foi possível enviar a imagem.");
  }

  if (!data.url) {
    throw new Error("O servidor não retornou a URL da imagem.");
  }

  return data.url;
}
