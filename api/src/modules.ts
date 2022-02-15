import { join } from "path";
import { merge } from "lodash";
import { makeExecutableSchema, mergeSchemas } from "@graphql-tools/schema";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

/* Resolvers */
import { UserResolvers } from "./modules/user";
import { ProductResolvers } from "./modules/product/resolvers";
import { CollectionResolvers } from "./modules/collections";

/* Load all modules schemas and merge all them in one */
const baseSchema = loadSchemaSync(join(__dirname, `modules/**/*.graphql`), {
  loaders: [new GraphQLFileLoader()],
});

/* In case if I will have more than 1 schema */
const finalSchema = mergeSchemas({
  schemas: [baseSchema],
});

const resolvers = merge(UserResolvers, ProductResolvers, CollectionResolvers);

/* Merge Schema with Resolvers */
export const schema = makeExecutableSchema({
  typeDefs: [finalSchema],
  resolvers: {
    ...resolvers,
  },
});

/*   
  const schemaComposer = new SchemaComposer()

  const resolvers = merge(UserResolvers, ProductResolvers);
  export const schemaWithResolvers = addResolversToSchema({
    schema: baseSchema,
    resolvers: {
        Upload: GraphQLUpload,
        ...resolvers,
    },
  })
  
  schemaComposer.merge(schemaWithResolvers)
  
  schemaComposer.merge(schemaWithResolvers)
  
  export const schema = schemaComposer.buildSchema() */
