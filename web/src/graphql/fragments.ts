import { gql } from "@apollo/client";

export const folderFragment = gql`
  fragment folderData on Folders {
    folder_id
    color
    color_style
    name
  }
`;

export const folderChildrenFragment = gql`
  fragment folderToData on exportedData {
    folder_id
    color
    color_style
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
