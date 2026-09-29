import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

async function main() {
  const email = "gunther@biarritz.com.br";
  const name = "Gunther Masi Haas";
  const password = "Stampede2694!";

  console.log("Removendo usuários existentes...");

  await prisma.user.deleteMany();

  console.log("Usuários removidos.");

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      role: "ADMIN",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true,
    },
  });

  console.log("\nAdmin criado:");
  console.log(user);
}

main()
  .catch((error) => {
    console.error("Erro ao criar admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
