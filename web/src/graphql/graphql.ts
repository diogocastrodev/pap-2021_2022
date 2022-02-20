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

export enum ColorStyle {
  Hex = 'HEX',
  Rgb = 'RGB',
  Rgba = 'RGBA'
}

export type Folders = {
  __typename?: 'Folders';
  color: Scalars['String'];
  color_style: ColorStyle;
  created_at: Scalars['DateTime'];
  folder_id: Scalars['ID'];
  folders?: Maybe<Array<Maybe<Folders>>>;
  name: Scalars['String'];
  parent_folder?: Maybe<Folders>;
  parent_id?: Maybe<Scalars['ID']>;
  todos?: Maybe<Array<Maybe<Todo>>>;
  updated_at: Scalars['DateTime'];
  user?: Maybe<User>;
  user_id: Scalars['String'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createFolder?: Maybe<Folders>;
  login?: Maybe<Scalars['String']>;
  register?: Maybe<Scalars['String']>;
};


export type MutationCreateFolderArgs = {
  data: CreateFolderInput;
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationRegisterArgs = {
  data: RegisterInput;
};

export enum Permissions {
  Admin = 'ADMIN',
  User = 'USER'
}

export type Query = {
  __typename?: 'Query';
  checkToken?: Maybe<Scalars['Boolean']>;
  me?: Maybe<User>;
  userFolders?: Maybe<ReturnFolders>;
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Todo = {
  __typename?: 'Todo';
  todo_id: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  created_at: Scalars['DateTime'];
  email: Scalars['String'];
  hash?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  permissions: Permissions;
  public_user_id: Scalars['Int'];
  status: UserStatus;
  updated_at: Scalars['DateTime'];
  user_id: Scalars['ID'];
  username: Scalars['String'];
};

export enum UserStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING'
}

export type CreateFolderInput = {
  color?: InputMaybe<Scalars['String']>;
  color_style?: InputMaybe<ColorStyle>;
  name: Scalars['String'];
  parent_id?: InputMaybe<Scalars['ID']>;
};

export type ExportedData = {
  __typename?: 'exportedData';
  children?: Maybe<Array<Maybe<ExportedData>>>;
  color: Scalars['String'];
  color_style: ColorStyle;
  depth: Scalars['Int'];
  folder_id: Scalars['String'];
  name: Scalars['String'];
};

export type ReturnFolders = {
  __typename?: 'returnFolders';
  folders: Array<Maybe<ExportedData>>;
  folders_amount: Scalars['Int'];
};
