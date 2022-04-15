import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { user, folders, document, todo, files } from '.prisma/client';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
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

export enum ColorStyle {
  Hex = 'HEX',
  Rgb = 'RGB',
  Rgba = 'RGBA'
}

export type Document = {
  __typename?: 'Document';
  content: Scalars['String'];
  created_at?: Maybe<Scalars['DateTime']>;
  document_id: Scalars['ID'];
  file_id: Scalars['ID'];
  updated_at?: Maybe<Scalars['DateTime']>;
};

export enum FileType {
  Document = 'Document',
  Todo = 'TODO'
}

export type Files = {
  __typename?: 'Files';
  created_at: Scalars['DateTime'];
  document?: Maybe<Array<Maybe<Document>>>;
  fileType: FileType;
  file_id: Scalars['ID'];
  folder_id: Scalars['ID'];
  name: Scalars['String'];
  todos?: Maybe<Array<Maybe<Todo>>>;
  updated_at: Scalars['DateTime'];
};

export type Folders = {
  __typename?: 'Folders';
  color: Scalars['String'];
  color_style: ColorStyle;
  created_at: Scalars['DateTime'];
  files?: Maybe<Array<Maybe<Files>>>;
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
  createFile?: Maybe<Files>;
  createFolder?: Maybe<Folders>;
  createTodo?: Maybe<Todo>;
  login?: Maybe<Scalars['String']>;
  register?: Maybe<Scalars['String']>;
};


export type MutationCreateFileArgs = {
  data: CreateFileInput;
};


export type MutationCreateFolderArgs = {
  data: CreateFolderInput;
};


export type MutationCreateTodoArgs = {
  data: CreateTodoInput;
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
  getAllTodos?: Maybe<Array<Maybe<Todo>>>;
  getFileContent?: Maybe<Files>;
  getFilesByFolder?: Maybe<Array<Maybe<Files>>>;
  me?: Maybe<User>;
  userFolders?: Maybe<ReturnFolders>;
};


export type QueryGetFileContentArgs = {
  data: GetFileContentInput;
};


export type QueryGetFilesByFolderArgs = {
  folderId: Scalars['ID'];
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Todo = {
  __typename?: 'Todo';
  created_at?: Maybe<Scalars['DateTime']>;
  file_id: Scalars['ID'];
  status?: Maybe<TodoStatus>;
  todoText: Scalars['String'];
  todo_id: Scalars['ID'];
  updated_at?: Maybe<Scalars['DateTime']>;
  user?: Maybe<User>;
};

export enum TodoStatus {
  Active = 'ACTIVE',
  Deleted = 'DELETED',
  Done = 'DONE'
}

export type User = {
  __typename?: 'User';
  created_at: Scalars['DateTime'];
  email: Scalars['String'];
  hash?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  permissions: Permissions;
  public_user_id: Scalars['ID'];
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

export type CreateFileInput = {
  fileType?: Maybe<FileType>;
  folder_id: Scalars['ID'];
  name: Scalars['String'];
};

export type CreateFolderInput = {
  color?: Maybe<Scalars['String']>;
  color_style?: Maybe<ColorStyle>;
  name: Scalars['String'];
  parent_id?: Maybe<Scalars['ID']>;
};

export type CreateTodoInput = {
  file_id?: Maybe<Scalars['ID']>;
  todoText: Scalars['String'];
};

export type ExportedData = {
  __typename?: 'exportedData';
  children?: Maybe<Array<Maybe<ExportedData>>>;
  color: Scalars['String'];
  color_style: ColorStyle;
  depth: Scalars['Int'];
  files: Array<Maybe<Files>>;
  folder_id: Scalars['ID'];
  name: Scalars['String'];
  parent_id: Scalars['ID'];
};

export type GetFileContentInput = {
  fileId: Scalars['ID'];
};

export type ReturnFolders = {
  __typename?: 'returnFolders';
  folders: Array<Maybe<ExportedData>>;
  folders_amount: Scalars['Int'];
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
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

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
  ColorStyle: ColorStyle;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Document: ResolverTypeWrapper<document>;
  FileType: FileType;
  Files: ResolverTypeWrapper<files>;
  Folders: ResolverTypeWrapper<folders>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<{}>;
  Permissions: Permissions;
  Query: ResolverTypeWrapper<{}>;
  RegisterInput: RegisterInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  Todo: ResolverTypeWrapper<todo>;
  TodoStatus: TodoStatus;
  User: ResolverTypeWrapper<user>;
  UserStatus: UserStatus;
  createFileInput: CreateFileInput;
  createFolderInput: CreateFolderInput;
  createTodoInput: CreateTodoInput;
  exportedData: ResolverTypeWrapper<Omit<ExportedData, 'children' | 'files'> & { children?: Maybe<Array<Maybe<ResolversTypes['exportedData']>>>, files: Array<Maybe<ResolversTypes['Files']>> }>;
  getFileContentInput: GetFileContentInput;
  returnFolders: ResolverTypeWrapper<Omit<ReturnFolders, 'folders'> & { folders: Array<Maybe<ResolversTypes['exportedData']>> }>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  DateTime: Scalars['DateTime'];
  Document: document;
  Files: files;
  Folders: folders;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  LoginInput: LoginInput;
  Mutation: {};
  Query: {};
  RegisterInput: RegisterInput;
  String: Scalars['String'];
  Todo: todo;
  User: user;
  createFileInput: CreateFileInput;
  createFolderInput: CreateFolderInput;
  createTodoInput: CreateTodoInput;
  exportedData: Omit<ExportedData, 'children' | 'files'> & { children?: Maybe<Array<Maybe<ResolversParentTypes['exportedData']>>>, files: Array<Maybe<ResolversParentTypes['Files']>> };
  getFileContentInput: GetFileContentInput;
  returnFolders: Omit<ReturnFolders, 'folders'> & { folders: Array<Maybe<ResolversParentTypes['exportedData']>> };
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Document'] = ResolversParentTypes['Document']> = {
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  document_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  file_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FilesResolvers<ContextType = any, ParentType extends ResolversParentTypes['Files'] = ResolversParentTypes['Files']> = {
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  document?: Resolver<Maybe<Array<Maybe<ResolversTypes['Document']>>>, ParentType, ContextType>;
  fileType?: Resolver<ResolversTypes['FileType'], ParentType, ContextType>;
  file_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  folder_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  todos?: Resolver<Maybe<Array<Maybe<ResolversTypes['Todo']>>>, ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FoldersResolvers<ContextType = any, ParentType extends ResolversParentTypes['Folders'] = ResolversParentTypes['Folders']> = {
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  color_style?: Resolver<ResolversTypes['ColorStyle'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  files?: Resolver<Maybe<Array<Maybe<ResolversTypes['Files']>>>, ParentType, ContextType>;
  folder_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  folders?: Resolver<Maybe<Array<Maybe<ResolversTypes['Folders']>>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parent_folder?: Resolver<Maybe<ResolversTypes['Folders']>, ParentType, ContextType>;
  parent_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  todos?: Resolver<Maybe<Array<Maybe<ResolversTypes['Todo']>>>, ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createFile?: Resolver<Maybe<ResolversTypes['Files']>, ParentType, ContextType, RequireFields<MutationCreateFileArgs, 'data'>>;
  createFolder?: Resolver<Maybe<ResolversTypes['Folders']>, ParentType, ContextType, RequireFields<MutationCreateFolderArgs, 'data'>>;
  createTodo?: Resolver<Maybe<ResolversTypes['Todo']>, ParentType, ContextType, RequireFields<MutationCreateTodoArgs, 'data'>>;
  login?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'data'>>;
  register?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationRegisterArgs, 'data'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  checkToken?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  getAllTodos?: Resolver<Maybe<Array<Maybe<ResolversTypes['Todo']>>>, ParentType, ContextType>;
  getFileContent?: Resolver<Maybe<ResolversTypes['Files']>, ParentType, ContextType, RequireFields<QueryGetFileContentArgs, 'data'>>;
  getFilesByFolder?: Resolver<Maybe<Array<Maybe<ResolversTypes['Files']>>>, ParentType, ContextType, RequireFields<QueryGetFilesByFolderArgs, 'folderId'>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userFolders?: Resolver<Maybe<ResolversTypes['returnFolders']>, ParentType, ContextType>;
};

export type TodoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Todo'] = ResolversParentTypes['Todo']> = {
  created_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  file_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['TodoStatus']>, ParentType, ContextType>;
  todoText?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  todo_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  permissions?: Resolver<ResolversTypes['Permissions'], ParentType, ContextType>;
  public_user_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['UserStatus'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExportedDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['exportedData'] = ResolversParentTypes['exportedData']> = {
  children?: Resolver<Maybe<Array<Maybe<ResolversTypes['exportedData']>>>, ParentType, ContextType>;
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  color_style?: Resolver<ResolversTypes['ColorStyle'], ParentType, ContextType>;
  depth?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  files?: Resolver<Array<Maybe<ResolversTypes['Files']>>, ParentType, ContextType>;
  folder_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parent_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReturnFoldersResolvers<ContextType = any, ParentType extends ResolversParentTypes['returnFolders'] = ResolversParentTypes['returnFolders']> = {
  folders?: Resolver<Array<Maybe<ResolversTypes['exportedData']>>, ParentType, ContextType>;
  folders_amount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  DateTime?: GraphQLScalarType;
  Document?: DocumentResolvers<ContextType>;
  Files?: FilesResolvers<ContextType>;
  Folders?: FoldersResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Todo?: TodoResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  exportedData?: ExportedDataResolvers<ContextType>;
  returnFolders?: ReturnFoldersResolvers<ContextType>;
};

