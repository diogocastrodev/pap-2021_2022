import { ResolverContext } from "../../context";
import { db } from "../../database";
import { ProductSellType, Resolvers } from "../../graphql/types";
import { getUserIDByPublicID } from "../user/helpers";
import yup from "yup";

export const ProductResolvers: Resolvers<ResolverContext> = {
  Query: {
    productByID: async (_parent, args, _context) => {
      if (!args.product_id) throw new Error("ID undefined");

      const product = await db.product.findUnique({
        where: {
          product_id: args.product_id.toString(),
        },
        include: {
          user: true,
          product_images: true,
        },
      });

      if (!product) throw new Error("Product not found");

      return product;
    },
    userProducts: async (_parent, _args, context) => {
      if (!context.is_authed || !context.public_id)
        throw new Error("Unauthorized");

      const user_id = await getUserIDByPublicID(context.public_id);

      const products = await db.product.findMany({
        where: {
          user_id,
        },
        include: {
          product_images: true,
        },
      });

      if (!products) throw new Error("Products not found");

      return products;
    },
    productByPage: async (_parent, args, _context) => {
      if (!args.data.page) throw new Error("Page undefined");

      let queryArgs = {
        where: {},
      };

      if (args.data.search)
        queryArgs = {
          ...queryArgs,
          where: {
            ...queryArgs.where,
            title: {
              contains: args.data.search,
              mode: "insensitive",
            },
          },
        };

      if (args.data.MinPrice)
        queryArgs = {
          ...queryArgs,
          where: {
            ...queryArgs.where,
            price: {
              gte: args.data.MinPrice,
            },
          },
        };

      if (args.data.MaxPrice)
        queryArgs = {
          ...queryArgs,
          where: {
            ...queryArgs.where,
            price: {
              lte: args.data.MaxPrice,
            },
          },
        };

      if (
        args.data.sellType &&
        Object.values(ProductSellType).includes(
          args.data.sellType as ProductSellType
        )
      )
        queryArgs = {
          ...queryArgs,
          where: {
            ...queryArgs.where,
            sellType: args.data.sellType,
          },
        };

      if (args.data.Location)
        queryArgs = {
          ...queryArgs,
          where: {
            ...queryArgs.where,
            location: {
              contains: args.data.Location,
              mode: "insensitive",
            },
          },
        };

      let cursorArgs = {};

      if (args.data.lastProductID && args.data.lastProductID !== "")
        cursorArgs = {
          skip: 1,
          cursor: {
            product_id: args.data.lastProductID,
          },
        };

      const amountPerPageAmount = 5 as const;
      /* Page 1 - Page 2 - Page 3 ... */
      /* Starting on Page 1 */
      const skipAmount = amountPerPageAmount * (args.data.page - 1);

      console.log("Page: " + args.data.page);
      console.log("Take: " + amountPerPageAmount);
      console.log("Skip: " + skipAmount);

      const products = await db.product.findMany({
        take: amountPerPageAmount,
        /* skip: skipAmount, */
        /* cursor */
        ...cursorArgs,
        ...queryArgs,
        orderBy: {
          created_at: "desc",
        },
        include: {
          product_images: true,
        },
      });

      if (!products) throw new Error("Products not found");

      return products;
    },
  },
  Mutation: {
    createProduct: async (_parent, args, context) => {
      if (!context.public_id || typeof context.public_id === "undefined")
        throw new Error("Not authenticated");

      const userId: string = await getUserIDByPublicID(context.public_id);

      const product = await db.product.create({
        data: {
          title: args.data.title,
          titleExtraInfo: args.data.titleExtraInfo,
          description: args.data.description,
          location: args.data.location,
          sellType: args.data.sellType,
          price: args.data.price,

          user_id: userId,
        },
      });

      if (!product) throw new Error("Product not created");

      return product.product_id;
    },
  },
};
