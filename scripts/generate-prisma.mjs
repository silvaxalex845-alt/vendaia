import { execFileSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://localhost:5432/vendaia?schema=public";
}

execFileSync("npx", ["prisma", "generate", "--schema=./prisma/schema.prisma"], {
  stdio: "inherit",
  env: process.env,
});
