import { join } from 'path'
import { merge } from 'lodash'
import { addResolversToSchema, mergeSchemas } from '@graphql-tools/schema'
import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'

/* Resolvers */
import { UserResolvers } from './modules/user';
import { FolderResolver } from './modules/folder_tree/resolvers'

/* Load all modules schemas and merge all them in one */
const baseSchema = loadSchemaSync(join(__dirname, `modules/**/*.graphql`), {
    loaders: [new GraphQLFileLoader()]
});

/* In case if I will have more than 1 schema */
const finalSchema = mergeSchemas({
    schemas: [
      baseSchema,
    ],
});

/* Merge Schema with Resolvers */
export const schema = addResolversToSchema({
    schema: finalSchema,
    resolvers: merge(UserResolvers, FolderResolver),
});