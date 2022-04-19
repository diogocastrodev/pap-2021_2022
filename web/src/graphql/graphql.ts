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
  createPriority: Priority;
  createTodo?: Maybe<Todo>;
  deletePriority: Scalars['Boolean'];
  login?: Maybe<Scalars['String']>;
  register?: Maybe<Scalars['String']>;
  updatePriority: Priority;
};


export type MutationCreateFileArgs = {
  data: CreateFileInput;
};


export type MutationCreateFolderArgs = {
  data: CreateFolderInput;
};


export type MutationCreatePriorityArgs = {
  data: CreatePriorityInput;
};


export type MutationCreateTodoArgs = {
  data: CreateTodoInput;
};


export type MutationDeletePriorityArgs = {
  data: DeletePriorityInput;
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationRegisterArgs = {
  data: RegisterInput;
};


export type MutationUpdatePriorityArgs = {
  data: UpdatePriorityInput;
};

export enum Permissions {
  Admin = 'ADMIN',
  User = 'USER'
}

export type Priority = {
  __typename?: 'Priority';
  color: Scalars['String'];
  created_at: Scalars['DateTime'];
  name: Scalars['String'];
  priority_id: Scalars['ID'];
  todos?: Maybe<Array<Maybe<Todo>>>;
  updated_at: Scalars['DateTime'];
  user?: Maybe<User>;
};

export type Query = {
  __typename?: 'Query';
  checkToken?: Maybe<Scalars['Boolean']>;
  getAllTodos?: Maybe<Array<Maybe<Todo>>>;
  getFileContent?: Maybe<Files>;
  getFilesByFolder?: Maybe<Array<Maybe<Files>>>;
  me?: Maybe<User>;
  priorities: Array<Maybe<Priority>>;
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
  fileType?: InputMaybe<FileType>;
  folder_id: Scalars['ID'];
  name: Scalars['String'];
};

export type CreateFolderInput = {
  color?: InputMaybe<Scalars['String']>;
  color_style?: InputMaybe<ColorStyle>;
  name: Scalars['String'];
  parent_id?: InputMaybe<Scalars['ID']>;
};

export type CreatePriorityInput = {
  color: Scalars['String'];
  name: Scalars['String'];
};

export type CreateTodoInput = {
  file_id?: InputMaybe<Scalars['ID']>;
  todoText: Scalars['String'];
};

export type DeletePriorityInput = {
  id: Scalars['ID'];
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

export type UpdatePriorityInput = {
  color?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
};
