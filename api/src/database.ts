import { PrismaClient } from '@prisma/client';

/* Prisma Client */
export const db = new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
    ],
  });

db.$on("query", async (e) => {
    console.log(`Query: ${e.query} \n Params: ${e.params}`)
});