import { ResolverContext } from "../../context";
import { db } from "../../database";
import { ImagesWithUrl, Resolvers } from "../../graphql/types";
import { config } from "../../utils";

export const ImagesResolver: Resolvers<ResolverContext> = {
  Query: {
    allImages: async (_, __, { is_authed, user_id }) => {
      if (!is_authed || !user_id) throw new Error("User not authenticated");

      try {
        const images = await db.cdnImages.findMany({
          where: {
            user: {
              public_user_id: user_id,
            },
          },
        });

        let images_array: ImagesWithUrl[] = [];

        const endsWithSlash = config.CDN.URL.endsWith("/");

        for (let i = 0; i < images.length; i++) {
          images_array.push({
            image_id: images[i].image_id,
            type: images[i].type,
            name: images[i].name,

            url: `${config.CDN.URL}${
              !endsWithSlash ? "/" : ""
            }images/upload/${user_id}/${images[i].name}`,
          });
        }

        console.log(images_array);

        return images_array;
      } catch (e) {
        throw new Error(e as string);
      }
    },
  },
};
