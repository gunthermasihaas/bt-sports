CREATE UNIQUE INDEX "pacotes_unico_destaque_ativo_idx"
ON "pacotes" ("destaque")
WHERE "destaque" = true AND "deleted_at" IS NULL;