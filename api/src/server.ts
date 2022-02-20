import { ApolloServer } from "apollo-server-express";
import { formatError, config } from "./utils";
import { context, ResolverContext } from "./context";
import { schema } from "./modules";
import express, { Response, Request } from "express";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import cors from "cors";

/* Start Express Server */
export const app = express();

export const server = new ApolloServer({
  schema,
  context,
  formatError,
  plugins: [ApolloServerPluginLandingPageLocalDefault],
});

/* DEV: cors */
app.use(cors());

/* Server Function */
async function startApolloServer() {
  /* Start Apollo Server */
  await server.start();
  /* Add Express Server to Apollo Server */
  server.applyMiddleware({ app });
  /* Let express server listen in port set in .env file or default set in ./utils.ts */
  app.listen(config.PORT, () => {
    console.log(
      `🚀 Server started at http://127.0.0.1:${config.PORT}${server.graphqlPath}`
    );
    /* CronJobs */
    /* cronDeleteAccount.start(); */
  });
  /* Return Apollo Server and Express Server */
  return { server, app };
}

/* Start Server */
startApolloServer();
