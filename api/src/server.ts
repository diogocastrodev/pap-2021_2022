import express from "express";
import { createServer } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { schema } from "./modules";
import { ApolloServer } from "apollo-server-express";
import { config, formatError } from "./utils";
import { context } from "./context";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import session from "express-session";
import { v4 as uuidv4 } from "uuid";
import bodyParser from "body-parser";
import { router } from "./router/routes";
import { consoleLogColors } from "./beauty";
import {
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";

export const app = express();

/* -------------------------------------------------------------------------- */
/*                                    Vars                                    */
/* -------------------------------------------------------------------------- */

const corsOptions: CorsOptions = {
  credentials: true,
  origin: [
    "http://localhost:3000",
    "https://castro.pap12m.pt",
    "http://51.68.197.137:3000",
    config.env === "development" && "https://studio.apollographql.com",
  ],
};

/* -------------------------------------------------------------------------- */
/*                                 Middleware                                 */
/* -------------------------------------------------------------------------- */

app.use(router);

// app.use(cors());

app.use(cookieParser());

app.use(bodyParser.json());

/* -------------------------------------------------------------------------- */
/*                                Session Type                                */
/* -------------------------------------------------------------------------- */

declare module "express-session" {
  interface SessionData {
    is_logged?: boolean;
    public_user_id?: string;
  }
}

/* --------------------------------- Session -------------------------------- */

var SQLiteStore = require("connect-sqlite3")(session);

app.use(
  session({
    store: new SQLiteStore(),
    secret: config.SESSION_SECRET,
    genid: (req) => uuidv4(),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV
        ? process.env.NODE_ENV.toString() == "production"
        : false,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    },
    resave: false,
    saveUninitialized: false,
    name: "session",
    unset: "destroy",
  })
);

/* -------------------------------------------------------------------------- */
/*                                Start Server                                */
/* -------------------------------------------------------------------------- */

async function start() {
  const httpServer = createServer(app);

  /* -------------------------------------------------------------------------- */
  /*                            GraphQL Subscription                            */
  /* -------------------------------------------------------------------------- */
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

  /* -------------------------------------------------------------------------- */
  /*                                   GraphQL                                  */
  /* -------------------------------------------------------------------------- */
  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => context({ req, res }),
    formatError: formatError,
    introspection: true,
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

      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault({
            graphRef: "my-graph-id@my-graph-variant",
            footer: false,
          })
        : ApolloServerPluginLandingPageGraphQLPlayground({
            settings: {
              "request.credentials": "include",
            },
          }),
    ],
  });

  await server.start();

  server.applyMiddleware({
    app,
    cors: corsOptions,
  });

  /* -------------------------------------------------------------------------- */
  /*                                   Listen                                   */
  /* -------------------------------------------------------------------------- */

  httpServer.listen(config.PORT, () => {
    console.log(`🚀 Express Server open at: http://localhost:${config.PORT}`);
    console.log(
      `\t${consoleLogColors.fg.green}[x]${consoleLogColors.reset} GraphQL Open at: http://localhost:${config.PORT}/graphql`
    );
  });
}

/* ------------------------------ Start Server ------------------------------ */

start();
