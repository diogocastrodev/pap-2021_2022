import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { product, collection, collections_product, product_images, user } from '.prisma/client';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addProductToCollection?: Maybe<Collection_Product>;
  createCollection?: Maybe<Collection>;
  createProduct?: Maybe<Scalars['ID']>;
  deleteCollection?: Maybe<Scalars['Boolean']>;
  login?: Maybe<Scalars['String']>;
  register?: Maybe<Scalars['String']>;
  removeProductFromCollection?: Maybe<Scalars['Boolean']>;
  updateCollection?: Maybe<Collection>;
  verifyEmail?: Maybe<Scalars['String']>;
};


export type MutationAddProductToCollectionArgs = {
  collectionId: Scalars['ID'];
  productId: Scalars['ID'];
};


export type MutationCreateCollectionArgs = {
  name: Scalars['String'];
};


export type MutationCreateProductArgs = {
  data: CreateProductInput;
};


export type MutationDeleteCollectionArgs = {
  id: Scalars['ID'];
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationRegisterArgs = {
  data: RegisterInput;
};


export type MutationRemoveProductFromCollectionArgs = {
  collectionId: Scalars['ID'];
  productId: Scalars['ID'];
};


export type MutationUpdateCollectionArgs = {
  id: Scalars['ID'];
  name: Scalars['String'];
};


export type MutationVerifyEmailArgs = {
  hash: Scalars['String'];
};

/** TODO: itemType */
export type Query = {
  __typename?: 'Query';
  checkToken: Scalars['Boolean'];
  me?: Maybe<User>;
  myCollection: Collection;
  myCollections: Array<Maybe<Collection>>;
  productByID?: Maybe<Product>;
  productByPage?: Maybe<Array<Maybe<Product>>>;
  profile?: Maybe<Profile>;
  userProducts?: Maybe<Array<Maybe<Product>>>;
};


/** TODO: itemType */
export type QueryMyCollectionArgs = {
  id: Scalars['ID'];
};


/** TODO: itemType */
export type QueryProductByIdArgs = {
  product_id: Scalars['ID'];
};


/** TODO: itemType */
export type QueryProductByPageArgs = {
  data: ProductByPageInput;
};


/** TODO: itemType */
export type QueryProfileArgs = {
  id: Scalars['ID'];
};

export type RegisterInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  phone_number?: InputMaybe<Scalars['String']>;
  surname: Scalars['String'];
};

export enum UserStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING'
}

export type Collection = {
  __typename?: 'collection';
  collection_id: Scalars['ID'];
  collections_product: Array<Maybe<Collection_Product>>;
  created_at: Scalars['DateTime'];
  name: Scalars['String'];
  user: User;
};

export type Collection_Product = {
  __typename?: 'collection_product';
  collection: Collection;
  collection_id: Scalars['ID'];
  collection_product_id: Scalars['ID'];
  created_at: Scalars['DateTime'];
  product: Product;
  product_id: Scalars['ID'];
};

export type CreateProductInput = {
  description: Scalars['String'];
  location: Scalars['String'];
  price?: InputMaybe<Scalars['Float']>;
  sellType: ProductSellType;
  title: Scalars['String'];
  titleExtraInfo?: InputMaybe<Scalars['String']>;
};

export type Product = {
  __typename?: 'product';
  created_at: Scalars['DateTime'];
  description: Scalars['String'];
  haveImages: Scalars['Boolean'];
  location: Scalars['String'];
  price?: Maybe<Scalars['Float']>;
  product_id: Scalars['ID'];
  product_images: Array<Maybe<ProductImage>>;
  product_status: ProductStatus;
  sellType: ProductSellType;
  title: Scalars['String'];
  titleExtraInfo?: Maybe<Scalars['String']>;
  updated_at: Scalars['DateTime'];
  user: User;
};

export type ProductByPageInput = {
  Location?: InputMaybe<Scalars['String']>;
  Maker?: InputMaybe<Scalars['String']>;
  MaxPrice?: InputMaybe<Scalars['Float']>;
  MinPrice?: InputMaybe<Scalars['Float']>;
  itemType?: InputMaybe<Scalars['String']>;
  lastProductID: Scalars['ID'];
  page: Scalars['Int'];
  search?: InputMaybe<Scalars['String']>;
  sellType?: InputMaybe<Scalars['String']>;
};

export type ProductImage = {
  __typename?: 'productImage';
  image_url?: Maybe<Scalars['String']>;
  product: Product;
  product_id: Scalars['ID'];
  product_image_id: Scalars['ID'];
};

export enum ProductSellType {
  Sell = 'SELL',
  Trade = 'TRADE'
}

export enum ProductStatus {
  Active = 'ACTIVE',
  Expired = 'EXPIRED',
  Inactive = 'INACTIVE'
}

export type Profile = {
  __typename?: 'profile';
  avatar?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  haveAvatar: Scalars['Boolean'];
  name: Scalars['String'];
  product?: Maybe<Array<Maybe<Product>>>;
  surname: Scalars['String'];
};

export type User = {
  __typename?: 'user';
  avatar?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  haveAvatar: Scalars['Boolean'];
  location: Scalars['String'];
  name: Scalars['String'];
  phone_number?: Maybe<Scalars['String']>;
  product?: Maybe<Array<Maybe<Product>>>;
  public_user_id?: Maybe<Scalars['String']>;
  surname: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  RegisterInput: RegisterInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  UserStatus: UserStatus;
  collection: ResolverTypeWrapper<collection>;
  collection_product: ResolverTypeWrapper<collections_product>;
  createProductInput: CreateProductInput;
  product: ResolverTypeWrapper<product>;
  productByPageInput: ProductByPageInput;
  productImage: ResolverTypeWrapper<product_images>;
  productSellType: ProductSellType;
  productStatus: ProductStatus;
  profile: ResolverTypeWrapper<Omit<Profile, 'product'> & { product?: Maybe<Array<Maybe<ResolversTypes['product']>>> }>;
  user: ResolverTypeWrapper<user>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  DateTime: Scalars['DateTime'];
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  LoginInput: LoginInput;
  Mutation: {};
  Query: {};
  RegisterInput: RegisterInput;
  String: Scalars['String'];
  collection: collection;
  collection_product: collections_product;
  createProductInput: CreateProductInput;
  product: product;
  productByPageInput: ProductByPageInput;
  productImage: product_images;
  profile: Omit<Profile, 'product'> & { product?: Maybe<Array<Maybe<ResolversParentTypes['product']>>> };
  user: user;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addProductToCollection?: Resolver<Maybe<ResolversTypes['collection_product']>, ParentType, ContextType, RequireFields<MutationAddProductToCollectionArgs, 'collectionId' | 'productId'>>;
  createCollection?: Resolver<Maybe<ResolversTypes['collection']>, ParentType, ContextType, RequireFields<MutationCreateCollectionArgs, 'name'>>;
  createProduct?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationCreateProductArgs, 'data'>>;
  deleteCollection?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteCollectionArgs, 'id'>>;
  login?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'data'>>;
  register?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationRegisterArgs, 'data'>>;
  removeProductFromCollection?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationRemoveProductFromCollectionArgs, 'collectionId' | 'productId'>>;
  updateCollection?: Resolver<Maybe<ResolversTypes['collection']>, ParentType, ContextType, RequireFields<MutationUpdateCollectionArgs, 'id' | 'name'>>;
  verifyEmail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationVerifyEmailArgs, 'hash'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  checkToken?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['user']>, ParentType, ContextType>;
  myCollection?: Resolver<ResolversTypes['collection'], ParentType, ContextType, RequireFields<QueryMyCollectionArgs, 'id'>>;
  myCollections?: Resolver<Array<Maybe<ResolversTypes['collection']>>, ParentType, ContextType>;
  productByID?: Resolver<Maybe<ResolversTypes['product']>, ParentType, ContextType, RequireFields<QueryProductByIdArgs, 'product_id'>>;
  productByPage?: Resolver<Maybe<Array<Maybe<ResolversTypes['product']>>>, ParentType, ContextType, RequireFields<QueryProductByPageArgs, 'data'>>;
  profile?: Resolver<Maybe<ResolversTypes['profile']>, ParentType, ContextType, RequireFields<QueryProfileArgs, 'id'>>;
  userProducts?: Resolver<Maybe<Array<Maybe<ResolversTypes['product']>>>, ParentType, ContextType>;
};

export type CollectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['collection'] = ResolversParentTypes['collection']> = {
  collection_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  collections_product?: Resolver<Array<Maybe<ResolversTypes['collection_product']>>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['user'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Collection_ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['collection_product'] = ResolversParentTypes['collection_product']> = {
  collection?: Resolver<ResolversTypes['collection'], ParentType, ContextType>;
  collection_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  collection_product_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  product?: Resolver<ResolversTypes['product'], ParentType, ContextType>;
  product_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['product'] = ResolversParentTypes['product']> = {
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  haveImages?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  product_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  product_images?: Resolver<Array<Maybe<ResolversTypes['productImage']>>, ParentType, ContextType>;
  product_status?: Resolver<ResolversTypes['productStatus'], ParentType, ContextType>;
  sellType?: Resolver<ResolversTypes['productSellType'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  titleExtraInfo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['user'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['productImage'] = ResolversParentTypes['productImage']> = {
  image_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  product?: Resolver<ResolversTypes['product'], ParentType, ContextType>;
  product_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  product_image_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['profile'] = ResolversParentTypes['profile']> = {
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  haveAvatar?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  product?: Resolver<Maybe<Array<Maybe<ResolversTypes['product']>>>, ParentType, ContextType>;
  surname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['user'] = ResolversParentTypes['user']> = {
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  haveAvatar?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone_number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  product?: Resolver<Maybe<Array<Maybe<ResolversTypes['product']>>>, ParentType, ContextType>;
  public_user_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  surname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  DateTime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  collection?: CollectionResolvers<ContextType>;
  collection_product?: Collection_ProductResolvers<ContextType>;
  product?: ProductResolvers<ContextType>;
  productImage?: ProductImageResolvers<ContextType>;
  profile?: ProfileResolvers<ContextType>;
  user?: UserResolvers<ContextType>;
};

