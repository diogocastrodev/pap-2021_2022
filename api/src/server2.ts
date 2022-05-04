import express from "express";
import { createServer } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { schema } from "./modules";
import { ApolloServer } from "apollo-server-express";
import { config } from "./utils";
import { context } from "./context";

export const app = express();

async function start() {
  const httpServer = createServer(app);

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: "/graphql",
    }
  );

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => context({ req, res }),
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  await server.start();

  server.applyMiddleware({
    app,
  });

  httpServer.listen(config.PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${config.PORT}`);
    console.log(
      `     - GraphQL Open at: http://localhost:${config.PORT}/graphql`
    );
  });
}

start();
