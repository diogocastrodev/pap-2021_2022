import { PrismaClient } from "@prisma/client";

/* -------------------------------------------------------------------------- */
/*                                Prisma Client                               */
/* -------------------------------------------------------------------------- */
export const db = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
