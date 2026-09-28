CREATE UNIQUE INDEX "fotos_unica_imagem_principal_idx"
ON "fotos" ("pacote_id", "tipo")
WHERE "tipo" IN ('CAPA', 'CARD', 'BANNER');