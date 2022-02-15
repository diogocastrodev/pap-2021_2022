import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
