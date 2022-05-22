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
  deleteFolder?: Maybe<Scalars['Boolean']>;
  deletePriority: Scalars['Boolean'];
  dumpTodo: Scalars['Boolean'];
  login?: Maybe<Scalars['Boolean']>;
  logout?: Maybe<Scalars['Boolean']>;
  moveFolder?: Maybe<Scalars['Boolean']>;
  register?: Maybe<Scalars['Boolean']>;
  updateDocument: Scalars['Boolean'];
  updateFile?: Maybe<Scalars['Boolean']>;
  updateFolder?: Maybe<Scalars['Boolean']>;
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


export type MutationDeleteFolderArgs = {
  folderId: Scalars['ID'];
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


export type MutationMoveFolderArgs = {
  folderId: Scalars['ID'];
  parent_id?: InputMaybe<Scalars['ID']>;
  remParent?: InputMaybe<Scalars['Boolean']>;
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


export type MutationUpdateFolderArgs = {
  color?: InputMaybe<Scalars['String']>;
  folderId: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
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
