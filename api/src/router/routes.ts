import express, {
  NextFunction,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";
import { graphqlHTTP } from "express-graphql";

import { avatarUpload } from "./controllers/avatarUpload";
import { productUpload } from "./controllers/productUpload";

import { checkLogin } from "./libs/checkLogin";

import { uploadAvatar } from "./services/uploadAvatarService";
import { uploadProducts } from "./services/uploadProductsService";

import { context } from "../context";
import { schema } from "../modules";
import { formatError } from "../utils";

export const router = express.Router();

// Debug
router.get("/", (req: Request, res: Response) => {
  res.json({
    teste: "teste",
  });
});

/* GraphQL */
router.use("/graphql", async (req: Request, res: Response) =>
  graphqlHTTP({
    context: await context({ req, res }),
    schema,
    customFormatErrorFn: formatError,
    pretty: true,
  })(req, res)
);

/* Image Upload */
router.post(
  "/upload/avatar",
  checkLogin,
  uploadAvatar.single("avatar"),
  avatarUpload
);

router.post(
  "/upload/products",
  checkLogin,
  uploadProducts.array("products", 30),
  productUpload
);

/* 404 when page doesn't exist */
router.use("*", (req: Request, res: Response) => {
  res.status(404).end();
});
