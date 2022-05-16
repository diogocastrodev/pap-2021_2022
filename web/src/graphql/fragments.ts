import { gql } from "@apollo/client";

export const folderFragment = gql`
  fragment folderData on Folders {
    folder_id
    color
    name
  }
`;

export const folderChildrenFragment = gql`
  fragment folderToData on exportedData {
    folder_id
    parent_id
    color
    name
    files {
      file_id
      fileType
      name
    }
  }

  fragment children on exportedData {
    ...folderToData
    children {
      ...folderToData
      children {
        ...folderToData
        children {
          ...folderToData
          children {
            ...folderToData
            children {
              ...folderToData
              children {
                ...folderToData
                children {
                  ...folderToData
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const todosFragment = gql`
  fragment todoData on Todo {
    todo_id
    text
    date
    status
    priority {
      priority_id
    }
  }
`;
