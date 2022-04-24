import { ApolloServer } from "apollo-server-express";
import { formatError, config } from "./utils";
import { context, ResolverContext } from "./context";
import { schema } from "./modules";
import express, { Response, Request } from "express";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { PubSub } from "graphql-subscriptions";

/* Start Express Server */
export const app = express();

export const pubSub = new PubSub();

const httpServer = createServer(app);

// Creating the WebSocket server
const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if your ApolloServer serves at
  // a different path.
  path: "/graphql",
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer);

export const server = new ApolloServer({
  schema,
  context,
  formatError,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground,
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

/* DEV: cors */
app.use(cors());

/* TODO: Express GraphQL */

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
