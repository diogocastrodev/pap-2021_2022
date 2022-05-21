import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { user, folders, document, todo, files, priority, cdnImages } from '.prisma/client';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type Document = {
  __typename?: 'Document';
  content: Scalars['String'];
  created_at?: Maybe<Scalars['DateTime']>;
  document_id: Scalars['ID'];
  files?: Maybe<Files>;
  updated_at?: Maybe<Scalars['DateTime']>;
};

export enum FileType {
  Document = 'Document',
  Todo = 'TODO'
}

export type Files = {
  __typename?: 'Files';
  created_at: Scalars['DateTime'];
  document?: Maybe<Document>;
  fileType: FileType;
  file_id: Scalars['ID'];
  folders?: Maybe<Folders>;
  name: Scalars['String'];
  todos?: Maybe<Array<Maybe<Todo>>>;
  updated_at: Scalars['DateTime'];
};

export type Folders = {
  __typename?: 'Folders';
  color: Scalars['String'];
  created_at: Scalars['DateTime'];
  files?: Maybe<Array<Maybe<Files>>>;
  folder_id: Scalars['ID'];
  folders?: Maybe<Array<Maybe<Folders>>>;
  name: Scalars['String'];
  parent_folder?: Maybe<Folders>;
  parent_id?: Maybe<Scalars['ID']>;
  updated_at: Scalars['DateTime'];
  user?: Maybe<User>;
};

export type Images = {
  __typename?: 'Images';
  created_at: Scalars['DateTime'];
  image_id: Scalars['ID'];
  name: Scalars['String'];
  path: Scalars['String'];
  pathWithName: Scalars['String'];
  type: Scalars['String'];
  user: User;
};

export type ImagesWithUrl = {
  __typename?: 'ImagesWithUrl';
  image_id: Scalars['String'];
  name: Scalars['String'];
  type: Scalars['String'];
  url: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createFile?: Maybe<Files>;
  createFolder?: Maybe<Folders>;
  createPriority: Priority;
  createTodo: Todo;
  deactivateUser?: Maybe<Scalars['Boolean']>;
  deleteFile?: Maybe<Scalars['Boolean']>;
  deletePriority: Scalars['Boolean'];
  dumpTodo: Scalars['Boolean'];
  login?: Maybe<Scalars['Boolean']>;
  logout?: Maybe<Scalars['Boolean']>;
  register?: Maybe<Scalars['Boolean']>;
  updateDocument: Scalars['Boolean'];
  updateFile?: Maybe<Scalars['Boolean']>;
  updatePassword?: Maybe<Scalars['Boolean']>;
  updatePriority: Priority;
  updateTodo?: Maybe<Scalars['Boolean']>;
  updateUser?: Maybe<Scalars['Boolean']>;
  verifyHash?: Maybe<Scalars['Boolean']>;
};


export type MutationCreateFileArgs = {
  fileType: FileType;
  folder_id: Scalars['ID'];
  name: Scalars['String'];
};


export type MutationCreateFolderArgs = {
  color?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  parent_id?: InputMaybe<Scalars['ID']>;
};


export type MutationCreatePriorityArgs = {
  color: Scalars['String'];
  name: Scalars['String'];
  order: Scalars['Int'];
};


export type MutationCreateTodoArgs = {
  date?: InputMaybe<Scalars['DateTime']>;
  file?: InputMaybe<Scalars['ID']>;
  priority?: InputMaybe<Scalars['ID']>;
  text: Scalars['String'];
};


export type MutationDeactivateUserArgs = {
  password: Scalars['String'];
};


export type MutationDeleteFileArgs = {
  fileId: Scalars['ID'];
};


export type MutationDeletePriorityArgs = {
  id: Scalars['ID'];
  removeTodos: Scalars['Boolean'];
};


export type MutationDumpTodoArgs = {
  id: Scalars['ID'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUpdateDocumentArgs = {
  content: Scalars['String'];
  id: Scalars['ID'];
};


export type MutationUpdateFileArgs = {
  fileId: Scalars['ID'];
  name: Scalars['String'];
};


export type MutationUpdatePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationUpdatePriorityArgs = {
  color?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateTodoArgs = {
  date?: InputMaybe<Scalars['DateTime']>;
  file?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  priority?: InputMaybe<Scalars['ID']>;
  remDate?: InputMaybe<Scalars['Boolean']>;
  remPriority?: InputMaybe<Scalars['Boolean']>;
  status?: InputMaybe<TodoStatus>;
  text?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateUserArgs = {
  email?: InputMaybe<Scalars['String']>;
};


export type MutationVerifyHashArgs = {
  hash: Scalars['String'];
};

export type Priority = {
  __typename?: 'Priority';
  color: Scalars['String'];
  created_at: Scalars['DateTime'];
  name: Scalars['String'];
  order: Scalars['Int'];
  priority_id: Scalars['ID'];
  todos?: Maybe<Array<Maybe<Todo>>>;
  updated_at: Scalars['DateTime'];
  user?: Maybe<User>;
};

export type Query = {
  __typename?: 'Query';
  allImages?: Maybe<Array<Maybe<ImagesWithUrl>>>;
  checkToken?: Maybe<Scalars['Boolean']>;
  getDatedTodos: Array<Maybe<Todo>>;
  getDocumentContent: Scalars['String'];
  getFileContent?: Maybe<Files>;
  getFilesByFolder?: Maybe<Array<Maybe<Files>>>;
  getFolderById?: Maybe<Folders>;
  getTodo?: Maybe<Todo>;
  getTodos: Array<Maybe<Todo>>;
  getTodosByFile: Array<Maybe<Todo>>;
  getTodosByFolder: Array<Maybe<Todo>>;
  getTodosByPriority: Array<Maybe<Todo>>;
  me?: Maybe<User>;
  priorities: Array<Maybe<Priority>>;
  userFolders: Array<Maybe<ExportedData>>;
};


export type QueryGetDocumentContentArgs = {
  id: Scalars['ID'];
};


export type QueryGetFileContentArgs = {
  fileId: Scalars['ID'];
};


export type QueryGetFilesByFolderArgs = {
  folderId: Scalars['ID'];
};


export type QueryGetFolderByIdArgs = {
  folderId: Scalars['ID'];
};


export type QueryGetTodoArgs = {
  id: Scalars['ID'];
};


export type QueryGetTodosByFileArgs = {
  file: Scalars['ID'];
};


export type QueryGetTodosByFolderArgs = {
  folder: Scalars['ID'];
};


export type QueryGetTodosByPriorityArgs = {
  priority: Scalars['ID'];
};

export enum Roles {
  Admin = 'ADMIN',
  User = 'USER'
}

export type Subscription = {
  __typename?: 'Subscription';
  updatedDocumentContent: Scalars['String'];
};


export type SubscriptionUpdatedDocumentContentArgs = {
  id: Scalars['ID'];
};

export type Todo = {
  __typename?: 'Todo';
  created_at?: Maybe<Scalars['DateTime']>;
  date?: Maybe<Scalars['DateTime']>;
  files?: Maybe<Array<Maybe<Files>>>;
  priority?: Maybe<Priority>;
  status: TodoStatus;
  text: Scalars['String'];
  todo_id: Scalars['ID'];
  updated_at?: Maybe<Scalars['DateTime']>;
  user?: Maybe<User>;
};

export enum TodoStatus {
  Active = 'ACTIVE',
  Deleted = 'DELETED',
  Done = 'DONE',
  Dumped = 'DUMPED'
}

export type User = {
  __typename?: 'User';
  created_at: Scalars['DateTime'];
  email: Scalars['String'];
  folders?: Maybe<Array<Maybe<Folders>>>;
  hash?: Maybe<Scalars['String']>;
  priority?: Maybe<Array<Maybe<Priority>>>;
  public_user_id: Scalars['ID'];
  roles: Roles;
  status: UserStatus;
  todo?: Maybe<Array<Maybe<Todo>>>;
  updated_at: Scalars['DateTime'];
};

export enum UserStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING'
}

export type ExportedData = {
  __typename?: 'exportedData';
  children?: Maybe<Array<Maybe<ExportedData>>>;
  color: Scalars['String'];
  files?: Maybe<Array<Maybe<Files>>>;
  folder_id: Scalars['ID'];
  name: Scalars['String'];
  parent_id?: Maybe<Scalars['ID']>;
};

export type ReturnFolders = {
  __typename?: 'returnFolders';
  folders: Array<Maybe<ExportedData>>;
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
  Document: ResolverTypeWrapper<document>;
  FileType: FileType;
  Files: ResolverTypeWrapper<files>;
  Folders: ResolverTypeWrapper<folders>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Images: ResolverTypeWrapper<cdnImages>;
  ImagesWithUrl: ResolverTypeWrapper<ImagesWithUrl>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Priority: ResolverTypeWrapper<priority>;
  Query: ResolverTypeWrapper<{}>;
  Roles: Roles;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  Todo: ResolverTypeWrapper<todo>;
  TodoStatus: TodoStatus;
  User: ResolverTypeWrapper<user>;
  UserStatus: UserStatus;
  exportedData: ResolverTypeWrapper<Omit<ExportedData, 'children' | 'files'> & { children?: Maybe<Array<Maybe<ResolversTypes['exportedData']>>>, files?: Maybe<Array<Maybe<ResolversTypes['Files']>>> }>;
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
  Images: cdnImages;
  ImagesWithUrl: ImagesWithUrl;
  Int: Scalars['Int'];
  Mutation: {};
  Priority: priority;
  Query: {};
  String: Scalars['String'];
  Subscription: {};
  Todo: todo;
  User: user;
  exportedData: Omit<ExportedData, 'children' | 'files'> & { children?: Maybe<Array<Maybe<ResolversParentTypes['exportedData']>>>, files?: Maybe<Array<Maybe<ResolversParentTypes['Files']>>> };
  returnFolders: Omit<ReturnFolders, 'folders'> & { folders: Array<Maybe<ResolversParentTypes['exportedData']>> };
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Document'] = ResolversParentTypes['Document']> = {
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  document_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  files?: Resolver<Maybe<ResolversTypes['Files']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FilesResolvers<ContextType = any, ParentType extends ResolversParentTypes['Files'] = ResolversParentTypes['Files']> = {
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  document?: Resolver<Maybe<ResolversTypes['Document']>, ParentType, ContextType>;
  fileType?: Resolver<ResolversTypes['FileType'], ParentType, ContextType>;
  file_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  folders?: Resolver<Maybe<ResolversTypes['Folders']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  todos?: Resolver<Maybe<Array<Maybe<ResolversTypes['Todo']>>>, ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FoldersResolvers<ContextType = any, ParentType extends ResolversParentTypes['Folders'] = ResolversParentTypes['Folders']> = {
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  files?: Resolver<Maybe<Array<Maybe<ResolversTypes['Files']>>>, ParentType, ContextType>;
  folder_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  folders?: Resolver<Maybe<Array<Maybe<ResolversTypes['Folders']>>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parent_folder?: Resolver<Maybe<ResolversTypes['Folders']>, ParentType, ContextType>;
  parent_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImagesResolvers<ContextType = any, ParentType extends ResolversParentTypes['Images'] = ResolversParentTypes['Images']> = {
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  image_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pathWithName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImagesWithUrlResolvers<ContextType = any, ParentType extends ResolversParentTypes['ImagesWithUrl'] = ResolversParentTypes['ImagesWithUrl']> = {
  image_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createFile?: Resolver<Maybe<ResolversTypes['Files']>, ParentType, ContextType, RequireFields<MutationCreateFileArgs, 'fileType' | 'folder_id' | 'name'>>;
  createFolder?: Resolver<Maybe<ResolversTypes['Folders']>, ParentType, ContextType, RequireFields<MutationCreateFolderArgs, 'name'>>;
  createPriority?: Resolver<ResolversTypes['Priority'], ParentType, ContextType, RequireFields<MutationCreatePriorityArgs, 'color' | 'name' | 'order'>>;
  createTodo?: Resolver<ResolversTypes['Todo'], ParentType, ContextType, RequireFields<MutationCreateTodoArgs, 'text'>>;
  deactivateUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeactivateUserArgs, 'password'>>;
  deleteFile?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteFileArgs, 'fileId'>>;
  deletePriority?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeletePriorityArgs, 'id' | 'removeTodos'>>;
  dumpTodo?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDumpTodoArgs, 'id'>>;
  login?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  logout?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  register?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationRegisterArgs, 'email' | 'password'>>;
  updateDocument?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateDocumentArgs, 'content' | 'id'>>;
  updateFile?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateFileArgs, 'fileId' | 'name'>>;
  updatePassword?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdatePasswordArgs, 'newPassword' | 'oldPassword'>>;
  updatePriority?: Resolver<ResolversTypes['Priority'], ParentType, ContextType, RequireFields<MutationUpdatePriorityArgs, 'id'>>;
  updateTodo?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateTodoArgs, 'id'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationUpdateUserArgs>>;
  verifyHash?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationVerifyHashArgs, 'hash'>>;
};

export type PriorityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Priority'] = ResolversParentTypes['Priority']> = {
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  priority_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  todos?: Resolver<Maybe<Array<Maybe<ResolversTypes['Todo']>>>, ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  allImages?: Resolver<Maybe<Array<Maybe<ResolversTypes['ImagesWithUrl']>>>, ParentType, ContextType>;
  checkToken?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  getDatedTodos?: Resolver<Array<Maybe<ResolversTypes['Todo']>>, ParentType, ContextType>;
  getDocumentContent?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryGetDocumentContentArgs, 'id'>>;
  getFileContent?: Resolver<Maybe<ResolversTypes['Files']>, ParentType, ContextType, RequireFields<QueryGetFileContentArgs, 'fileId'>>;
  getFilesByFolder?: Resolver<Maybe<Array<Maybe<ResolversTypes['Files']>>>, ParentType, ContextType, RequireFields<QueryGetFilesByFolderArgs, 'folderId'>>;
  getFolderById?: Resolver<Maybe<ResolversTypes['Folders']>, ParentType, ContextType, RequireFields<QueryGetFolderByIdArgs, 'folderId'>>;
  getTodo?: Resolver<Maybe<ResolversTypes['Todo']>, ParentType, ContextType, RequireFields<QueryGetTodoArgs, 'id'>>;
  getTodos?: Resolver<Array<Maybe<ResolversTypes['Todo']>>, ParentType, ContextType>;
  getTodosByFile?: Resolver<Array<Maybe<ResolversTypes['Todo']>>, ParentType, ContextType, RequireFields<QueryGetTodosByFileArgs, 'file'>>;
  getTodosByFolder?: Resolver<Array<Maybe<ResolversTypes['Todo']>>, ParentType, ContextType, RequireFields<QueryGetTodosByFolderArgs, 'folder'>>;
  getTodosByPriority?: Resolver<Array<Maybe<ResolversTypes['Todo']>>, ParentType, ContextType, RequireFields<QueryGetTodosByPriorityArgs, 'priority'>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  priorities?: Resolver<Array<Maybe<ResolversTypes['Priority']>>, ParentType, ContextType>;
  userFolders?: Resolver<Array<Maybe<ResolversTypes['exportedData']>>, ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  updatedDocumentContent?: SubscriptionResolver<ResolversTypes['String'], "updatedDocumentContent", ParentType, ContextType, RequireFields<SubscriptionUpdatedDocumentContentArgs, 'id'>>;
};

export type TodoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Todo'] = ResolversParentTypes['Todo']> = {
  created_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  date?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  files?: Resolver<Maybe<Array<Maybe<ResolversTypes['Files']>>>, ParentType, ContextType>;
  priority?: Resolver<Maybe<ResolversTypes['Priority']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TodoStatus'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  todo_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  folders?: Resolver<Maybe<Array<Maybe<ResolversTypes['Folders']>>>, ParentType, ContextType>;
  hash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  priority?: Resolver<Maybe<Array<Maybe<ResolversTypes['Priority']>>>, ParentType, ContextType>;
  public_user_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  roles?: Resolver<ResolversTypes['Roles'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['UserStatus'], ParentType, ContextType>;
  todo?: Resolver<Maybe<Array<Maybe<ResolversTypes['Todo']>>>, ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExportedDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['exportedData'] = ResolversParentTypes['exportedData']> = {
  children?: Resolver<Maybe<Array<Maybe<ResolversTypes['exportedData']>>>, ParentType, ContextType>;
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  files?: Resolver<Maybe<Array<Maybe<ResolversTypes['Files']>>>, ParentType, ContextType>;
  folder_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parent_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReturnFoldersResolvers<ContextType = any, ParentType extends ResolversParentTypes['returnFolders'] = ResolversParentTypes['returnFolders']> = {
  folders?: Resolver<Array<Maybe<ResolversTypes['exportedData']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  DateTime?: GraphQLScalarType;
  Document?: DocumentResolvers<ContextType>;
  Files?: FilesResolvers<ContextType>;
  Folders?: FoldersResolvers<ContextType>;
  Images?: ImagesResolvers<ContextType>;
  ImagesWithUrl?: ImagesWithUrlResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Priority?: PriorityResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Todo?: TodoResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  exportedData?: ExportedDataResolvers<ContextType>;
  returnFolders?: ReturnFoldersResolvers<ContextType>;
};

