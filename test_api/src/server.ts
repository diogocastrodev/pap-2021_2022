import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import { graphqlHTTP } from "express-graphql";

import { config, formatError } from "./utils";

import { router } from "./router/routes";
import { schema } from "./modules";
import { context } from "./context";

export const app = express();

export interface ContextInterfaceTest {
  req: Request;
  res: Response;
}

app.use(cors());

app.use(cookieParser());

app.use(
  session({
    secret: config.TOKEN_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());

app.use(passport.session());

app.use("/graphql", async (req: Request, res: Response) =>
  graphqlHTTP({
    context: await context({ req, res }),
    schema,
    graphiql: true,
    customFormatErrorFn: formatError,
    pretty: true,
  })(req, res)
);

app.use(router);

app.listen(config.PORT, () => {
  console.log(`🚀 Server is running on port ${config.PORT}`);
});
